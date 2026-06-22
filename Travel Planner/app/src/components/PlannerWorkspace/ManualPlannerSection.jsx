import React, { useState, useEffect } from "react";
import { MapPin, Calendar, DollarSign, Heart, Plus } from "lucide-react";
import { plannerService } from "../../services/plannerService";
import { toast } from "react-toastify";
import styles from "./ManualPlannerSection.module.css";

export default function ManualPlannerSection({ onAddPlan }) {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    destination: "",
    duration: "",
    month: "",
    budget: "",
    interests: [],
  });
  const [errors, setErrors] = useState({});

  const interestOptions = [
    "Beaches",
    "Mountains",
    "City Life",
    "History",
    "Food",
    "Nightlife",
    "Adventure",
    "Relaxation",
    "Culture",
    "Nature",
  ];

  useEffect(() => {
    loadDestinations();
  }, []);

  const loadDestinations = async () => {
    try {
      const data = await plannerService.getDestinations();
      setDestinations(data);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load destinations");
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleInterestToggle = (interest) => {
    setFormData((prev) => {
      const newInterests = prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest];
      return { ...prev, interests: newInterests };
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.destination) newErrors.destination = "Please select a destination";
    if (!formData.duration) newErrors.duration = "Please select duration";
    if (!formData.month) newErrors.month = "Please select a month";
    if (!formData.budget) newErrors.budget = "Please enter budget";
    if (formData.interests.length === 0) newErrors.interests = "Select at least one interest";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const hotels = await plannerService.getHotels(formData.destination);
      const landmarks = await plannerService.getLandmarks(formData.destination);
      const destinationDetails = await plannerService.getDestinationDetails(formData.destination);

      const planData = {
        input: JSON.stringify(formData),
        result: {
          destination: formData.destination,
          bestMonths: destinationDetails?.bestMonths || formData.month,
          duration: formData.duration,
          reason: `Based on your interests in ${formData.interests.join(", ")} and budget of ${formData.budget}`,
          hotels: hotels.slice(0, 3),
          landmarks: landmarks.slice(0, 3),
        },
        source: "manual",
      };

      if (onAddPlan) {
        onAddPlan(planData);
        setFormData({
          destination: "",
          duration: "",
          month: "",
          budget: "",
          interests: [],
        });
        toast.success("Plan created successfully!");
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to create plan");
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading destinations...</div>;
  }

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>
          <MapPin size={24} className={styles.icon} />
          Manual Planner
        </h2>
        <p className={styles.sectionDescription}>
          Plan your trip manually by selecting your preferences
        </p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className="row g-4">
          {/* Destination */}
          <div className="col-12 col-md-6">
            <label className={styles.label}>
              <MapPin size={16} className={styles.labelIcon} />
              Destination
            </label>
            <select
              name="destination"
              value={formData.destination}
              onChange={handleInputChange}
              className={`form-select ${styles.input} ${errors.destination ? styles.inputError : ""}`}
            >
              <option value="">Select destination</option>
              {destinations.map((dest) => (
                <option key={dest.id} value={dest.name}>
                  {dest.name}, {dest.country}
                </option>
              ))}
            </select>
            {errors.destination && <span className={styles.errorText}>{errors.destination}</span>}
          </div>

          {/* Duration */}
          <div className="col-12 col-md-6">
            <label className={styles.label}>
              <Calendar size={16} className={styles.labelIcon} />
              Duration
            </label>
            <select
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              className={`form-select ${styles.input} ${errors.duration ? styles.inputError : ""}`}
            >
              <option value="">Select duration</option>
              <option value="3-5 days">3-5 days</option>
              <option value="1 week">1 week</option>
              <option value="2 weeks">2 weeks</option>
              <option value="3 weeks">3 weeks</option>
              <option value="1 month">1 month</option>
            </select>
            {errors.duration && <span className={styles.errorText}>{errors.duration}</span>}
          </div>

          {/* Month */}
          <div className="col-12 col-md-6">
            <label className={styles.label}>
              <Calendar size={16} className={styles.labelIcon} />
              Travel Month
            </label>
            <select
              name="month"
              value={formData.month}
              onChange={handleInputChange}
              className={`form-select ${styles.input} ${errors.month ? styles.inputError : ""}`}
            >
              <option value="">Select month</option>
              <option value="January">January</option>
              <option value="February">February</option>
              <option value="March">March</option>
              <option value="April">April</option>
              <option value="May">May</option>
              <option value="June">June</option>
              <option value="July">July</option>
              <option value="August">August</option>
              <option value="September">September</option>
              <option value="October">October</option>
              <option value="November">November</option>
              <option value="December">December</option>
            </select>
            {errors.month && <span className={styles.errorText}>{errors.month}</span>}
          </div>

          {/* Budget */}
          <div className="col-12 col-md-6">
            <label className={styles.label}>
              <DollarSign size={16} className={styles.labelIcon} />
              Budget
            </label>
            <select
              name="budget"
              value={formData.budget}
              onChange={handleInputChange}
              className={`form-select ${styles.input} ${errors.budget ? styles.inputError : ""}`}
            >
              <option value="">Select budget</option>
              <option value="Budget ($500-$1000)">Budget ($500-$1000)</option>
              <option value="Mid-range ($1000-$3000)">Mid-range ($1000-$3000)</option>
              <option value="Luxury ($3000-$5000)">Luxury ($3000-$5000)</option>
              <option value="Premium ($5000+)">Premium ($5000+)</option>
            </select>
            {errors.budget && <span className={styles.errorText}>{errors.budget}</span>}
          </div>

          {/* Interests */}
          <div className="col-12">
            <label className={styles.label}>
              <Heart size={16} className={styles.labelIcon} />
              Interests (select at least one)
            </label>
            <div className={styles.interestsGrid}>
              {interestOptions.map((interest) => (
                <label key={interest} className={styles.interestCheckbox}>
                  <input
                    type="checkbox"
                    checked={formData.interests.includes(interest)}
                    onChange={() => handleInterestToggle(interest)}
                    className={styles.checkbox}
                  />
                  <span>{interest}</span>
                </label>
              ))}
            </div>
            {errors.interests && <span className={styles.errorText}>{errors.interests}</span>}
          </div>
        </div>

        <button type="submit" className={styles.submitBtn}>
          <Plus size={16} />
          Create Plan
        </button>
      </form>
    </div>
  );
}
