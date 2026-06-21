import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { toast } from "react-toastify";
import { auth, db } from "../../firebase";

export default function PastTrips() {
  const [pastTrips, setPastTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setPastTrips([]);
        setLoading(false);
        return;
      }

      try {
        const q = query(
          collection(db, "bookedTrips"),
          where("userId", "==", user.uid),
        );

        const snapshot = await getDocs(q);

        const now = new Date();

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const past = data.filter((trip) => {
          const departure = trip.flightDetails?.legs?.[0]?.departure;
          return departure && new Date(departure) < now;
        });

        setPastTrips(past);
      } catch (err) {
        console.log("FETCH PAST TRIPS ERROR:", err);
        toast.error("Failed to load past trips.");
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <p style={{ padding: 20 }}>Loading past trips...</p>;

  if (!pastTrips.length)
    return <p style={{ padding: 20 }}>No past trips yet 🧳</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Past Trips</h2>

      {pastTrips.map((t) => {
        const flight = t.flightDetails;
        const leg = flight?.legs?.[0];

        return (
          <div
            key={t.id}
            style={{
              border: "1px solid #e2e8f0",
              padding: 16,
              marginBottom: 16,
              borderRadius: 12,
              backgroundColor: "#f8fafc",
              boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
              opacity: 0.85,
            }}
          >
            <h3 style={{ marginBottom: 8 }}>
              {t.origin || leg?.origin?.city || leg?.origin?.name} →{" "}
              {t.destination ||
                leg?.destination?.city ||
                leg?.destination?.name}
            </h3>

            <p style={{ margin: "6px 0" }}>
              <strong>Price Paid:</strong> {flight?.price?.formatted || "N/A"}
            </p>

            <p style={{ margin: "6px 0" }}>
              <strong>Airline:</strong>{" "}
              {leg?.carriers?.marketing?.[0]?.name || "N/A"}
            </p>

            <p style={{ margin: "6px 0" }}>
              <strong>Departure:</strong>{" "}
              {leg?.departure
                ? new Date(leg.departure).toLocaleString()
                : "N/A"}
            </p>

            <p style={{ margin: "6px 0" }}>
              <strong>Arrival:</strong>{" "}
              {leg?.arrival ? new Date(leg.arrival).toLocaleString() : "N/A"}
            </p>

            <p style={{ margin: "6px 0" }}>
              <strong>Stops:</strong>{" "}
              {leg?.stopCount === 0 ? "Nonstop" : `${leg?.stopCount} stops`}
            </p>

            <span
              style={{
                display: "inline-block",
                marginTop: 10,
                padding: "4px 10px",
                borderRadius: "20px",
                fontSize: "12px",
                background: "#fee2e2",
                color: "#991b1b",
                fontWeight: "600",
              }}
            >
              Completed Trip
            </span>
          </div>
        );
      })}
    </div>
  );
}
