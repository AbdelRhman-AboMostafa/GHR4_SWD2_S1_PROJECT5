import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, ChevronDown, ChevronUp } from "lucide-react";
import styles from "./FlightCard.module.css";

export default function FlightCard({ flight, onRemove, onViewDetails }) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const leg = flight?.flightDetails?.legs?.[0] || flight?.legs?.[0];
  const price = flight?.flightDetails?.price || flight?.price;

  const formatDuration = (mins) => {
    if (!mins) return "-";
    return `${Math.floor(mins / 60)}h ${mins % 60}m`;
  };

  const formatTime = (iso) => {
    if (!iso) return "-";
    return new Date(iso).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const formatDate = (iso) => {
    if (!iso) return "-";
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const handleToggleDetails = () => {
    setIsExpanded(!isExpanded);
    if (onViewDetails) {
      onViewDetails(flight);
    }
  };

  const handleRemove = () => {
    if (onRemove) {
      onRemove(flight.id);
    }
  };

  const stopsCount = leg?.stopCount || 0;
  const stopLabel = stopsCount === 0 ? "Nonstop" : `${stopsCount} stop${stopsCount > 1 ? "s" : ""}`;

  return (
    <div className={styles.card}>
      <div className={styles.cardMain}>
        {/* Airline Badge */}
        <div className={styles.airlineBadge}>
          <span className={styles.badgeCode}>
            {leg?.carriers?.marketing?.[0]?.displayCode || "AIR"}
          </span>
        </div>

        {/* Flight Route */}
        <div className={styles.journeyContainer}>
          <div className={styles.routeNode}>
            <span className={styles.airportCode}>{leg?.origin?.displayCode || "---"}</span>
            <span className={styles.cityName}>{leg?.origin?.city || "Origin"}</span>
            <span className={styles.timeLabel}>{formatTime(leg?.departure)}</span>
          </div>

          <div className={styles.timelineTrack}>
            <span className={styles.timelineDuration}>
              {formatDuration(leg?.durationInMinutes)}
            </span>
            <div className={styles.lineWrapper}>
              <div className={styles.horizontalLine} />
              <span className={styles.planeIcon}>✈️</span>
              <div className={styles.horizontalLine} />
            </div>
            <span className={`${styles.timelineStops} ${stopsCount > 0 ? styles.hasStops : styles.nonstop}`}>
              {stopLabel}
            </span>
          </div>

          <div className={styles.routeNode}>
            <span className={styles.airportCode}>{leg?.destination?.displayCode || "---"}</span>
            <span className={styles.cityName}>{leg?.destination?.city || "Destination"}</span>
            <span className={styles.timeLabel}>{formatTime(leg?.arrival)}</span>
          </div>
        </div>

        {/* Pricing */}
        <div className={styles.pricingSection}>
          <span className={styles.priceAmount}>
            {price?.formatted || "$0"}
          </span>
          <span className={styles.pricePerAdult}>per adult</span>
        </div>
      </div>

      {/* Expandable Details Panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className={styles.detailPanel}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className={styles.metaDataGrid}>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>DURATION</span>
                <span className={styles.metaValue}>{formatDuration(leg?.durationInMinutes)}</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>AIRLINE</span>
                <span className={styles.metaValue}>{leg?.carriers?.marketing?.[0]?.name || "Unknown"}</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>DEPARTURE</span>
                <span className={styles.metaValue}>{formatDate(leg?.departure)}</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>ARRIVAL</span>
                <span className={styles.metaValue}>{formatDate(leg?.arrival)}</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>STOPS</span>
                <span className={styles.metaValue}>{stopLabel}</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>REFUNDABLE</span>
                <span className={styles.metaValue}>
                  {flight?.flightDetails?.farePolicy?.isCancellationAllowed || flight?.farePolicy?.isCancellationAllowed ? "Yes" : "No"}
                </span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>CABIN</span>
                <span className={styles.metaValue}>Economy</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>BOOKING STATUS</span>
                <span className={styles.metaValueConfirmed}>Confirmed</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actions */}
      <div className={styles.cardActions}>
        <button onClick={handleToggleDetails} className={styles.detailBtn}>
          {isExpanded ? (
            <>
              <ChevronUp size={14} />
              Hide Details
            </>
          ) : (
            <>
              <ChevronDown size={14} />
              View Details
            </>
          )}
        </button>

        <button onClick={handleRemove} className={styles.removeBtn}>
          <Trash2 size={14} />
          Remove Booking
        </button>
      </div>
    </div>
  );
}
