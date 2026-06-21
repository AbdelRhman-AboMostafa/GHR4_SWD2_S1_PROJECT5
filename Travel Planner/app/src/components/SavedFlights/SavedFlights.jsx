import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../firebase";
import styles from "./SavedFlights.module.css";
import { addDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function SavedFlights() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setFlights([]);
        setLoading(false);
        return;
      }

      try {
        const q = query(
          collection(db, "savedFlights"),
          where("userId", "==", user.uid),
        );

        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setFlights(data);
      } catch (err) {
        console.log("FETCH ERROR:", err);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const deleteTrip = async (id) => {
    try {
      await deleteDoc(doc(db, "savedFlights", id));
      setFlights((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.log("DELETE ERROR:", err);
    }
  };

  const getProcessedFlights = () => {
    let result = [...flights];

    if (activeFilter === "nonstop") {
      result = result.filter((t) => t.flight?.legs?.[0]?.stopCount === 0);
    } else if (activeFilter === "upcoming") {
      const now = new Date();
      result = result.filter((t) => {
        const departure = t.flight?.legs?.[0]?.departure;
        return departure ? new Date(departure) > now : false;
      });
    }

    if (activeFilter === "cheapest") {
      result.sort((a, b) => {
        const priceA =
          parseFloat(a.flight?.price?.formatted?.replace(/[^0-9.]/g, "")) || 0;
        const priceB =
          parseFloat(b.flight?.price?.formatted?.replace(/[^0-9.]/g, "")) || 0;
        return priceA - priceB;
      });
    }

    return result;
  };

  const processedFlights = getProcessedFlights();

  if (loading) {
    return <div className={styles.centerState}>Loading saved Flights...</div>;
  }

  const bookFlight = async (flight, savedFlightId) => {
    const user = auth.currentUser;

    if (!user) {
      toast.error("Please login first");
      return;
    }

    try {
      await addDoc(collection(db, "bookedTrips"), {
        userId: user.uid,
        flightDetails: flight,
        status: "confirmed",
        bookingDate: serverTimestamp(),
      });
      //delete trip after booking
      await deleteDoc(doc(db, "savedFlights", savedFlightId));

      setFlights((prev) => prev.filter((item) => item.id !== savedFlightId));

      toast.success("Trip booked ✈️");
    } catch (err) {
      console.log(err);
      toast.error("Booking failed");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <div className={styles.headerSection}>
          <h2 className={styles.title}> Saved Flights</h2>
          <button
            className={styles.searchBtn}
            onClick={() => navigate("/flights")}
          >
            <span>🔍</span> Search new flights
          </button>
        </div>
        <p className={styles.subHeader}>
          {processedFlights.length} flights found - Last updated today
        </p>

        {/* Filters Row */}
        <div className={styles.filterRow}>
          <span className={styles.filterLabel}>Sort & filter:</span>
          <button
            className={`${styles.filterBtn} ${activeFilter === "all" ? styles.activeFilter : ""}`}
            onClick={() => setActiveFilter("all")}
          >
            All flights
          </button>
          <button
            className={`${styles.filterBtn} ${activeFilter === "nonstop" ? styles.activeFilter : ""}`}
            onClick={() => setActiveFilter("nonstop")}
          >
            Nonstop only
          </button>
          <button
            className={`${styles.filterBtn} ${activeFilter === "cheapest" ? styles.activeFilter : ""}`}
            onClick={() => setActiveFilter("cheapest")}
          >
            Cheapest first
          </button>
          <button
            className={`${styles.filterBtn} ${activeFilter === "upcoming" ? styles.activeFilter : ""}`}
            onClick={() => setActiveFilter("upcoming")}
          >
            Upcoming
          </button>
          <button
            className={`${styles.filterBtn} ${activeFilter === "refundable" ? styles.activeFilter : ""}`}
            onClick={() => setActiveFilter("refundable")}
          >
            Refundable
          </button>
        </div>

        {processedFlights.length === 0 ? (
          <div className={styles.centerState}>
            No flights match this filter ✈️
          </div>
        ) : (
          <div className="row g-4">
            {processedFlights.map((t) => {
              const flight = t.flight;
              const leg = flight?.legs?.[0];
              const savedDate = t.createdAt?.toDate?.()
                ? t.createdAt.toDate().toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                : "Recently";

              const departureDate = leg?.departure
                ? new Date(leg.departure)
                : null;
              const formattedTimeDep = departureDate
                ? departureDate.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })
                : "--:--";
              const formattedDateDep = departureDate
                ? departureDate.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                : "Flexible";

              const arrivalDate = leg?.arrival ? new Date(leg.arrival) : null;
              const formattedTimeArr = arrivalDate
                ? arrivalDate.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })
                : "--:--";

              return (
                <div key={t.id} className="col-12 col-md-6">
                  <div className={styles.flightCard}>
                    <div className={styles.cardTop}>
                      <div className={styles.cardHeader}>
                        <div className={styles.airlineInfo}>
                          <span className={styles.airlineCode}>
                            {leg?.carriers?.marketing?.[0]?.displayCode ||
                              "Airlines"}
                          </span>
                          <span className={styles.airlineName}>
                            {leg?.carriers?.marketing?.[0]?.name || "N/A"}
                          </span>
                        </div>
                        <span className={styles.savedDate}>
                          Saved {savedDate}
                        </span>
                      </div>

                      <div className={styles.routeRow}>
                        <div className={styles.station}>
                          <span className={styles.airportCode}>
                            {leg?.origin?.displayCode || leg?.origin?.city}
                          </span>
                          <span className={styles.cityName}>
                            {leg?.origin?.city}
                          </span>
                          <span className={styles.time}>
                            {formattedTimeDep}
                          </span>
                        </div>

                        <div className={styles.timelineContainer}>
                          <span className={styles.duration}>
                            {leg?.durationInMinutes
                              ? `${Math.floor(leg.durationInMinutes / 60)}h ${leg.durationInMinutes % 60}m`
                              : "N/A"}
                          </span>
                          <div className={styles.line}>
                            <span className={styles.planeIcon}>✈️</span>
                          </div>
                        </div>

                        <div
                          className={`${styles.station} ${styles.stationDest}`}
                        >
                          <span className={styles.airportCode}>
                            {leg?.destination?.displayCode ||
                              leg?.destination?.city}
                          </span>
                          <span className={styles.cityName}>
                            {leg?.destination?.city}
                          </span>
                          <span className={styles.time}>
                            {formattedTimeArr}
                          </span>
                        </div>
                      </div>

                      <div className={styles.badgeContainer}>
                        {leg?.stopCount === 0 ? (
                          <span className={`${styles.badge} ${styles.nonstop}`}>
                            ✦ Nonstop
                          </span>
                        ) : (
                          <span className={`${styles.badge} ${styles.stops}`}>
                            {leg?.stopCount} stop
                          </span>
                        )}
                        <span className={`${styles.badge} ${styles.dateBadge}`}>
                          📅 {formattedDateDep}
                        </span>
                        <span
                          className={`${styles.badge} ${styles.refundable}`}
                        >
                          ↩ Refundable
                        </span>
                      </div>
                    </div>

                    <div className={styles.cardFooter}>
                      <div className={styles.price}>
                        {flight?.price?.formatted || "N/A"}
                      </div>
                      <div className={styles.actionBtns}>
                        <button
                          className={styles.bookBtn}
                          onClick={() => bookFlight(t.flight, t.id)}
                        >
                          Book now
                        </button>
                        <button
                          onClick={() => deleteTrip(t.id)}
                          className={styles.deleteBtn}
                          title="Delete Trip"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
