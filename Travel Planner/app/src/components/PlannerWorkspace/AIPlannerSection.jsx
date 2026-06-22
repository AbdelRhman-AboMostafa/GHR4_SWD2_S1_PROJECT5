import React, { useState } from "react";
import axios from "axios";
import { Sparkles, Plus, X } from "lucide-react";
import { toast } from "react-toastify";
import styles from "./AIPlannerSection.module.css";

export default function AIPlannerSection({ onAddPlan }) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState(null);
  const [error, setError] = useState("");

  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please enter a travel preference");
      return;
    }

    setLoading(true);
    setError("");
    setRecommendation(null);

    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
        {
          contents: [
            {
              parts: [
                {
                  text: `You are a travel planning assistant. Based on the user's request: "${prompt}", provide a travel recommendation in JSON format with the following structure:
{
  "destination": "city name",
  "bestMonths": "best time to visit",
  "duration": "suggested trip duration",
  "reason": "why this destination is perfect",
  "hotels": ["hotel 1", "hotel 2", "hotel 3"],
  "landmarks": ["landmark 1", "landmark 2", "landmark 3"]
}

Return ONLY the JSON, no additional text.`,
                },
              ],
            },
          ],
        }
      );

      const content = response.data.candidates[0].content.parts[0].text;
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        const parsedData = JSON.parse(jsonMatch[0]);
        setRecommendation(parsedData);
        toast.success("Recommendation generated!");
      } else {
        setError("Failed to parse AI response");
      }
    } catch (err) {
      console.log(err);
      setError("Failed to generate recommendation. Please try again.");
      toast.error("API error occurred");
    }

    setLoading(false);
  };

  const handleAddPlan = () => {
    if (recommendation && onAddPlan) {
      onAddPlan({
        input: prompt,
        result: recommendation,
        source: "ai",
      });
      setPrompt("");
      setRecommendation(null);
      toast.success("Plan added successfully!");
    }
  };

  const handleClear = () => {
    setRecommendation(null);
    setPrompt("");
    setError("");
  };

  return (
    <div className={styles.section} style={{ marginTop: "20px" }}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>
          <Sparkles size={24} className={styles.icon} />
          AI Travel Planner
        </h2>
        <p className={styles.sectionDescription}>
          Describe your ideal trip and let AI suggest the perfect destination
        </p>
      </div>

      <div className={styles.inputContainer}>
        <textarea
          className={styles.textarea}
          placeholder="e.g., 'I want somewhere sunny in July with beaches and good nightlife'"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
        />
        <button
          onClick={handleGenerate}
          disabled={loading}
          className={styles.generateBtn}
        >
          {loading ? "Generating..." : "Generate Recommendation"}
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {loading && (
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <p>Analyzing your preferences...</p>
        </div>
      )}

      {recommendation && (
        <div className={styles.recommendationCard}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>{recommendation.destination}</h3>
            <button onClick={handleClear} className={styles.clearBtn}>
              <X size={16} />
            </button>
          </div>

          <div className={styles.cardContent}>
            <div className={styles.infoRow}>
              <span className={styles.label}>Best Time:</span>
              <span className={styles.value}>{recommendation.bestMonths}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>Duration:</span>
              <span className={styles.value}>{recommendation.duration}</span>
            </div>

            <div className={styles.section}>
              <span className={styles.subLabel}>Hotels:</span>
              <ul className={styles.list}>
                {recommendation.hotels.map((hotel, index) => (
                  <li key={index}>{hotel}</li>
                ))}
              </ul>
            </div>

            <div className={styles.section}>
              <span className={styles.subLabel}>Landmarks:</span>
              <ul className={styles.list}>
                {recommendation.landmarks.map((landmark, index) => (
                  <li key={index}>{landmark}</li>
                ))}
              </ul>
            </div>

            <div className={styles.explanation}>
              <span className={styles.subLabel}>Why this destination?</span>
              <p className={styles.explanationText}>{recommendation.reason}</p>
            </div>
          </div>

          <button onClick={handleAddPlan} className={styles.addPlanBtn}>
            <Plus size={16} />
            Add Plan
          </button>
        </div>
      )}
    </div>
  );
}
