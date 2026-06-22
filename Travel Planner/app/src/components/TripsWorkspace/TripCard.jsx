import React from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2, Search } from "lucide-react";
import styles from "./TripCard.module.css";

export default function TripCard({ trip, onEdit, onDelete, onSearchFlights }) {
  const navigate = useNavigate();

  const handleEdit = () => {
    if (onEdit) {
      onEdit(trip);
    } else {
      // Default: navigate to TripPlanner with trip data
      navigate("/tripPlanner", { state: { query: trip.input, planData: trip.result } });
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(trip.id);
    }
  };

  const handleSearchFlights = () => {
    if (onSearchFlights) {
      onSearchFlights(trip);
    } else {
      // Default: navigate to Flights with destination
      navigate("/flights", { state: { queryTo: trip.result?.destination } });
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardTop}>
        <div className={styles.cardHeader}>
          <div className={styles.destinationSection}>
            <h3 className={styles.destination}>{trip.result?.destination || "Unknown Destination"}</h3>
            <span className={styles.plannedMonth}>
              📅 {trip.result?.bestMonths || "Flexible timing"}
            </span>
          </div>
          <span className={styles.durationBadge}>
            ⏱ {trip.result?.duration || "N/A"}
          </span>
        </div>

        <div className={styles.detailsSection}>
          <div className={styles.detailGroup}>
            <span className={styles.detailLabel}>Hotels:</span>
            <div className={styles.detailList}>
              {trip.result?.hotels?.length > 0 ? (
                trip.result.hotels.slice(0, 3).map((hotel, index) => (
                  <span key={index} className={styles.detailItem}>
                    {hotel}
                  </span>
                ))
              ) : (
                <span className={styles.detailItem}>No hotels listed</span>
              )}
              {trip.result?.hotels?.length > 3 && (
                <span className={styles.moreIndicator}>+{trip.result.hotels.length - 3} more</span>
              )}
            </div>
          </div>

          <div className={styles.detailGroup}>
            <span className={styles.detailLabel}>Landmarks:</span>
            <div className={styles.detailList}>
              {trip.result?.landmarks?.length > 0 ? (
                trip.result.landmarks.slice(0, 3).map((landmark, index) => (
                  <span key={index} className={styles.detailItem}>
                    {landmark}
                  </span>
                ))
              ) : (
                <span className={styles.detailItem}>No landmarks listed</span>
              )}
              {trip.result?.landmarks?.length > 3 && (
                <span className={styles.moreIndicator}>+{trip.result.landmarks.length - 3} more</span>
              )}
            </div>
          </div>

          {trip.result?.reason && (
            <div className={styles.aiExplanation}>
              <span className={styles.aiLabel}>🤖 AI Explanation:</span>
              <p className={styles.aiText}>{trip.result.reason}</p>
            </div>
          )}
        </div>
      </div>

      <div className={styles.cardActions}>
        <button onClick={handleEdit} className={styles.actionBtn}>
          <Edit size={14} />
          Edit Plan
        </button>
        <button onClick={handleSearchFlights} className={styles.actionBtn}>
          <Search size={14} />
          Search Flights
        </button>
        <button onClick={handleDelete} className={styles.deleteBtn}>
          <Trash2 size={14} />
          Delete
        </button>
      </div>
    </div>
  );
}
