import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

export default function TripPlanner() {
  const location = useLocation();
  const [userInput, setUserInput] = useState("");
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (location.state?.query) {
      setUserInput(location.state.query);
      handleRecommend(location.state.query);
    }
  }, [location.state]);

  const handleRecommend = async (overrideInput = "") => {
    const queryStr = typeof overrideInput === "string" ? overrideInput : userInput;
    if (!queryStr.trim()) return;

    setLoading(true);
    setError("");
    setRecommendation(null);

    try {
      const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
        {
          contents: [
            {
              parts: [
                {
                  text: `
You are a travel planner assistant.

Return ONLY valid JSON. No markdown, no explanations, no extra text.

User request:
${queryStr}

JSON format:
{
  "destination": "string",
  "bestMonths": "string",
  "duration": "string",
  "reason": "string",
  "hotels": ["string"],
  "landmarks": ["string"]
}
                  `,
                },
              ],
            },
          ],
        }
      );

      let text =
        response.data.candidates?.[0]?.content?.parts?.[0]?.text || "";

      // IMPORTANT: clean possible markdown or extra text
      text = text.replace(/```json/g, "").replace(/```/g, "").trim();

      // parse JSON safely
      const parsed = JSON.parse(text);

      setRecommendation(parsed);
    } catch (err) {
      console.log(err);
      setError("Failed to generate trip. Try again.");
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h2>AI Trip Planner</h2>

      <textarea
        placeholder="Example: I want a cheap beach vacation in July"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        rows={4}
        style={{ width: "100%", padding: "10px" }}
      />

      <button onClick={handleRecommend} style={{ marginTop: 10 }}>
        {loading ? "Thinking..." : "Recommend"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {recommendation && (
        <div style={{ marginTop: 20 }}>
          <h3>AI Recommendation</h3>

          <div style={{ background: "#f5f5f5", padding: 15 }}>
            <p><b>Destination:</b> {recommendation.destination}</p>
            <p><b>Best Months:</b> {recommendation.bestMonths}</p>
            <p><b>Duration:</b> {recommendation.duration}</p>
            <p><b>Reason:</b> {recommendation.reason}</p>

            <p><b>Hotels:</b></p>
            <ul>
              {recommendation.hotels?.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>

            <p><b>Landmarks:</b></p>
            <ul>
              {recommendation.landmarks?.map((l, i) => (
                <li key={i}>{l}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}