import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { toast } from "react-toastify";
import { auth, db } from "../../firebase";

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
        // Queries the "bookedTrips" collection matching the user's ID
        const q = query(
          collection(db, "bookedTrips"),
          where("userId", "==", user.uid)
        );

        const snapshot = await getDocs(q);

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setTrips(data);
      } catch (err) {
        console.log("FETCH TRIPS ERROR:", err);
        toast.error("Failed to load your booked trips.");
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const cancelTrip = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this flight reservation?")) return;

    try {
      await deleteDoc(doc(db, "bookedTrips", id));

      // Optimistically remove from UI state
      setTrips((prev) => prev.filter((trip) => trip.id !== id));
      toast.success("Trip booking canceled successfully.");
    } catch (err) {
      console.log("CANCEL TRIP ERROR:", err);
      toast.error("Could not cancel booking. Please try again.");
    }
  };

  if (loading) return <p style={{ padding: 20 }}>Loading your booked itineraries...</p>;

  if (!trips.length) return <p style={{ padding: 20 }}>No booked trips found yet 🌎</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>My Booked Trips</h2>

      {trips.map((t) => {
        // Safe drilling into the flightDetails block saved by the handleBook utility
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
              backgroundColor: "#ffffff",
              boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: "0 0 8px 0" }}>
                {t.origin || leg?.origin?.city || leg?.origin?.name} →{" "}
                {t.destination || leg?.destination?.city || leg?.destination?.name}
              </h3>
              
              {/* Dynamic reservation status pill */}
              <span
                style={{
                  background: "rgba(34, 197, 94, 0.12)",
                  color: "#16a34a",
                  padding: "4px 10px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "600",
                  textTransform: "uppercase",
                }}
              >
                {t.status || "confirmed"}
              </span>
            </div>

            <p style={{ margin: "6px 0" }}>
              <strong>Price Paid:</strong> {flight?.price?.formatted || "N/A"}
            </p>

            <p style={{ margin: "6px 0" }}>
              <strong>Airline Carrier:</strong> {leg?.carriers?.marketing?.[0]?.name || "N/A"}
            </p>

            <p style={{ margin: "6px 0" }}>
              <strong>Flight Duration:</strong>{" "}
              {leg?.durationInMinutes
                ? `${Math.floor(leg.durationInMinutes / 60)}h ${leg.durationInMinutes % 60}m`
                : "N/A"}
            </p>

            <p style={{ margin: "6px 0" }}>
              <strong>Departure Time:</strong>{" "}
              {leg?.departure ? new Date(leg.departure).toLocaleString() : "N/A"}
            </p>

            <p style={{ margin: "6px 0" }}>
              <strong>Estimated Arrival:</strong>{" "}
              {leg?.arrival ? new Date(leg.arrival).toLocaleString() : "N/A"}
            </p>

            <p style={{ margin: "6px 0" }}>
              <strong>Stops:</strong> {leg?.stopCount ?? 0 === 0 ? "Nonstop" : leg?.stopCount}
            </p>

            <button
              onClick={() => cancelTrip(t.id)}
              style={{
                marginTop: 12,
                padding: "8px 14px",
                background: "#ef4444",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontWeight: "500",
                fontSize: "13px",
                cursor: "pointer",
                transition: "background 0.2s",
              }}
              onMouseOver={(e) => (e.target.style.background = "#dc2626")}
              onMouseOut={(e) => (e.target.style.background = "#ef4444")}
            >
              Cancel Reservation
            </button>
          </div>
        );
      })}
    </div>
  );
}