import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../firebase";

export default function SavedFlights() {
  const [Flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);

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
          where("userId", "==", user.uid)
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

    // remove from UI instantly
    setFlights((prev) => prev.filter((t) => t.id !== id));
  } catch (err) {
    console.log("DELETE ERROR:", err);
  }
};

  if (loading) return <p>Loading saved Flights...</p>;

  if (!Flights.length) return <p>No saved Flights yet ✈️</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Saved Flights</h2>

      {Flights.map((t) => {
  const flight = t.flight;
  const leg = flight?.legs?.[0];

  return (
    <div
      key={t.id}
      style={{
        border: "1px solid #ddd",
        padding: 14,
        marginBottom: 12,
        borderRadius: 10,
      }}
    >
      <h3>
        {leg?.origin?.city || leg?.origin?.name} →{" "}
        {leg?.destination?.city || leg?.destination?.name}
      </h3>

      <p> Price: {flight?.price?.formatted}</p>

      <p>
         Airline: {leg?.carriers?.marketing?.[0]?.name || "N/A"}
      </p>

      <p>
         Duration:{" "}
        {leg?.durationInMinutes
          ? `${Math.floor(leg.durationInMinutes / 60)}h ${
              leg.durationInMinutes % 60
            }m`
          : "N/A"}
      </p>

      <p>
         Departure:{" "}
        {leg?.departure
          ? new Date(leg.departure).toLocaleString()
          : "N/A"}
      </p>

      <p>
         Arrival:{" "}
        {leg?.arrival
          ? new Date(leg.arrival).toLocaleString()
          : "N/A"}
      </p>

      <p> Stops: {leg?.stopCount ?? 0}</p>

      <button
        onClick={() => deleteTrip(t.id)}
        style={{
          marginTop: 10,
          padding: "6px 10px",
          background: "#ef4444",
          color: "white",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
        }}
      >
        Delete Trip 
      </button>
    </div>
  );
})}
    </div>
  );
}