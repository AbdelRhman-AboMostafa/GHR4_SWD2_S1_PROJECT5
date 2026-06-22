import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import TripCard from "./TripCard";
import FlightCard from "./FlightCard";
import styles from "./TripsWorkspace.module.css";

export default function TripsWorkspace() {
  const navigate = useNavigate();
  const [plannedTrips, setPlannedTrips] = useState([]);
  const [bookedFlights, setBookedFlights] = useState([]);
  const [loadingPlanned, setLoadingPlanned] = useState(true);
  const [loadingBooked, setLoadingBooked] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setPlannedTrips([]);
        setBookedFlights([]);
        setLoadingPlanned(false);
        setLoadingBooked(false);
        return;
      }

      // Fetch planned trips (AI plans)
      try {
        const qPlanned = query(
          collection(db, "aiPlans"),
          where("userId", "==", user.uid)
        );
        const snapshotPlanned = await getDocs(qPlanned);
        const plannedData = snapshotPlanned.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPlannedTrips(plannedData);
      } catch (err) {
        console.log(err);
        toast.error("Failed to load planned trips");
      }
      setLoadingPlanned(false);

      // Fetch booked flights
      try {
        const qBooked = query(
          collection(db, "bookedTrips"),
          where("userId", "==", user.uid)
        );
        const snapshotBooked = await getDocs(qBooked);
        const bookedData = snapshotBooked.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBookedFlights(bookedData);
      } catch (err) {
        console.log(err);
        toast.error("Failed to load booked flights");
      }
      setLoadingBooked(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDeletePlan = async (planId) => {
    try {
      await deleteDoc(doc(db, "aiPlans", planId));
      setPlannedTrips((prev) => prev.filter((trip) => trip.id !== planId));
      toast.success("Plan deleted successfully");
    } catch (err) {
      console.log(err);
      toast.error("Failed to delete plan");
    }
  };

  const handleEditPlan = (trip) => {
    navigate("/tripPlanner", {
      state: { query: trip.input, planData: trip.result },
    });
  };

  const handleSearchFlights = (trip) => {
    navigate("/flights", {
      state: { queryTo: trip.result?.destination },
    });
  };

  const handleRemoveBooking = async (bookingId) => {
    try {
      await deleteDoc(doc(db, "bookedTrips", bookingId));
      setBookedFlights((prev) => prev.filter((flight) => flight.id !== bookingId));
      toast.success("Booking removed successfully");
    } catch (err) {
      console.log(err);
      toast.error("Failed to remove booking");
    }
  };

  const handleViewFlightDetails = (flight) => {
    // Details are handled inline in the FlightCard component
    // This callback is available for future enhancements
  };

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        {/* Header */}
        <div className={styles.headerSection}>
          <div>
            <h1 className={styles.title}>Trips Workspace</h1>
            <p className={styles.subHeader}>
              Your travel planning hub - manage planned trips and booked flights
            </p>
          </div>
        </div>

        {/* Planned Trips Section */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionIcon}>🤖</span>
              Planned Trips
            </h2>
            <span className={styles.sectionCount}>
              {plannedTrips.length} {plannedTrips.length === 1 ? "plan" : "plans"}
            </span>
          </div>

          {loadingPlanned ? (
            <div className={styles.centerState}>Loading planned trips...</div>
          ) : plannedTrips.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>🗺️</div>
              <h3 className={styles.emptyTitle}>No planned trips yet</h3>
              <p className={styles.emptyText}>
                Start planning your next adventure with AI-powered recommendations
              </p>
              <button
                onClick={() => navigate("/planner")}
                className={styles.actionButton}
              >
                Plan a New Trip
              </button>
            </div>
          ) : (
            <div className="row g-4">
              {plannedTrips.map((trip) => (
                <div key={trip.id} className="col-12 col-md-6 col-lg-4">
                  <TripCard
                    trip={trip}
                    onEdit={handleEditPlan}
                    onDelete={handleDeletePlan}
                    onSearchFlights={handleSearchFlights}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Booked Flights Section */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionIcon}>✈️</span>
              Booked Flights
            </h2>
            <span className={styles.sectionCount}>
              {bookedFlights.length} {bookedFlights.length === 1 ? "flight" : "flights"}
            </span>
          </div>

          {loadingBooked ? (
            <div className={styles.centerState}>Loading booked flights...</div>
          ) : bookedFlights.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>🎫</div>
              <h3 className={styles.emptyTitle}>No booked flights yet</h3>
              <p className={styles.emptyText}>
                Search and book flights for your upcoming trips
              </p>
              <button
                onClick={() => navigate("/flights")}
                className={styles.actionButton}
              >
                Search Flights
              </button>
            </div>
          ) : (
            <div className="row g-4">
              {bookedFlights.map((flight) => (
                <div key={flight.id} className="col-12">
                  <FlightCard
                    flight={flight}
                    onRemove={handleRemoveBooking}
                    onViewDetails={handleViewFlightDetails}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
