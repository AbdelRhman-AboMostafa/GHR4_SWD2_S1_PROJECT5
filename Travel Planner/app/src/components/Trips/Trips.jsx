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
import { toast } from "react-toastify";
import { auth, db } from "../../firebase";
import styles from "./Trips.module.css";

export default function Trips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setTrips([]);
        setLoading(false);
        return;
      }

      try {
        const q = query(
          collection(db, "bookedTrips"),
          where("userId", "==", user.uid),
        );

        const snapshot = await getDocs(q);

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setTrips(data);
      } catch (err) {
        console.log(err);
        toast.error("Failed to load booked trips");
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const cancelTrip = async (id) => {
    try {
      await deleteDoc(doc(db, "bookedTrips", id));
      setTrips((prev) => prev.filter((t) => t.id !== id));
      toast.success("Trip cancelled");
    } catch (err) {
      toast.error("Error cancelling trip");
    }
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <div className={styles.headerSection}>
          <div>
            <h2 className={styles.title}>Booked Trips</h2>
            <p className={styles.subHeader}>
              {trips.length} trips found - Manage your bookings
            </p>
          </div>
        </div>

        <div className="row g-4">
          {trips.map((t) => {
            const flight = t.flightDetails;
            const leg = flight?.legs?.[0];

            return (
              <div key={t.id} className="col-12 col-md-6">
                <div className={styles.card}>
                  <div className={styles.cardTop}>
                    <div className={styles.airlineRow}>
                      <span className={styles.airline}>
                        {leg?.carriers?.marketing?.[0]?.name || "Airline"}
                      </span>

                      <span className={styles.confirmedBadge}>Confirmed</span>
                    </div>

                    <div className={styles.route}>
                      <div className={styles.city}>
                        <h3>{leg?.origin?.displayCode}</h3>
                        <p>{leg?.origin?.city}</p>
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

                      <div className={styles.city}>
                        <h3>{leg?.destination?.displayCode}</h3>
                        <p>{leg?.destination?.city}</p>
                      </div>
                    </div>

                    <div className={styles.badges}>
                      <span className={styles.badgeYellow}>
                        {leg?.stopCount === 0
                          ? "✦ Nonstop"
                          : `${leg?.stopCount} stop`}
                      </span>

                      <span className={styles.badgeBlue}>
                        📅{" "}
                        {leg?.departure
                          ? new Date(leg.departure).toLocaleDateString(
                              "en-GB",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )
                          : ""}
                      </span>

                      <span className={styles.badgeGray}>Booked Trip</span>
                    </div>
                  </div>

                  <div className={styles.cardBottom}>
                    <h3 className={styles.price}>
                      {flight?.price?.formatted || "$0"}
                    </h3>

                    <button
                      onClick={() => cancelTrip(t.id)}
                      className={styles.cancelBtn}
                    >
                      Cancel Reservation
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
