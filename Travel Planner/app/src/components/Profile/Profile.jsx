import React, { useEffect, useState, useContext } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase';
import { User, Mail, Calendar, Key, ShieldCheck, Clock } from 'lucide-react';
import { TripsContext } from '../../context/TripsContext';
import styles from './Profile.module.css';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { bookedTrips, loadingTrips } = useContext(TripsContext);

  const calculateTotalSpent = () => {
    if (!bookedTrips || bookedTrips.length === 0) return 0;
    return bookedTrips.reduce((acc, trip) => {
      const priceStr = trip.price ? trip.price.toString() : '0';
      const cleanPrice = parseFloat(priceStr.replace(/[^0-9.]/g, ''));
      return acc + (isNaN(cleanPrice) ? 0 : cleanPrice);
    }, 0);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.container}>
        <div className={styles.alert}>
          Please login to view your profile.
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.heroBanner}>
        <img src="/images/hero.png" alt="Travel Banner" className={styles.bannerImage} />
      </div>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.avatarGroup}>
            {user.photoURL ? (
              <img src={user.photoURL} alt="User Avatar" className={styles.avatar} />
            ) : (
              <div className={styles.avatarPlaceholder}>
                <User size={48} color="#1a7fd4" />
              </div>
            )}
            <div>
              <h2 className={styles.userName}>{user.displayName || 'Traveler'}</h2>
              <p className={styles.userRole}>Member since {new Date(user.metadata.creationTime).getFullYear()}</p>
            </div>
          </div>
        </div>

        <div className={styles.grid}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <Mail size={20} className={styles.icon} />
              <h3>Email & Contact</h3>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.infoRow}>
                <span className={styles.label}>Email Address</span>
                <span className={styles.value}>{user.email}</span>
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <Calendar size={20} className={styles.icon} />
              <h3>Travel Stats</h3>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.infoRow}>
                <span className={styles.label}>Total Trips Booked</span>
                <span className={styles.value}>{bookedTrips ? bookedTrips.length : 0}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>Total Spent on Flights</span>
                <span className={styles.value} style={{fontWeight: 800, color: '#16a34a'}}>
                  ${calculateTotalSpent().toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                </span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>Member Since</span>
                <span className={styles.value}>
                  {new Date(user.metadata.creationTime).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.tripsSection}>
          <h3 className={styles.sectionTitle}>Your Last Trips</h3>
          {loadingTrips ? (
            <p>Loading trips...</p>
          ) : bookedTrips && bookedTrips.length > 0 ? (
            <div className={styles.tripsGrid}>
              {bookedTrips.map((trip, idx) => {
                const destLower = (trip.destination || '').toLowerCase();
                let imgSrc = '/images/destinations.png'; // default fallback
                if (destLower.includes('paris')) imgSrc = '/images/paris.png';
                else if (destLower.includes('bali')) imgSrc = '/images/bali.png';
                else if (destLower.includes('new york')) imgSrc = '/images/hero.png';
                else if (destLower.includes('dubai')) imgSrc = '/images/dubai.png';

                return (
                  <div className={styles.tripCard} key={idx}>
                      <img 
                        src={imgSrc} 
                        alt={trip.destination || 'Trip'} 
                        className={styles.tripImage} 
                      />
                      <div className={styles.tripInfo}>
                        <h4>{trip.origin || "Origin"} to {trip.destination || "Destination"}</h4>
                        <p>Status: {trip.status || "Unknown"}</p>
                        <p>Date: {trip.tripDate || "N/A"}</p>
                      </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p>No booked trips found yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
