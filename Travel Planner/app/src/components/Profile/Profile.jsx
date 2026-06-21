import React, { useEffect, useState, useContext } from 'react';
import { onAuthStateChanged, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebase';
import { User, Mail, Calendar, Key, ShieldCheck, Clock } from 'lucide-react';
import { TripsContext } from '../../context/TripsContext';
import { toast } from 'react-toastify';
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

  const handleResetPassword = async () => {
    if (!user?.email) {
      toast.error('No email associated with this account.');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, user.email);
      toast.success(`Password reset email successfully dispatched to ${user.email}!`);
    } catch (error) {
      console.error(error);
      toast.error('Failed to send password reset email. Please try again.');
    }
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
        <img src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=2600&auto=format&fit=crop" alt="Travel Banner" className={styles.bannerImage} />
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
            <div 
              className={styles.cardHeader}
              style={{
                backgroundImage: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url("https://images.unsplash.com/photo-1596524430615-b46475ddff6e?q=80&w=800&auto=format&fit=crop")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderBottom: 'none',
                padding: '24px 20px'
              }}
            >
              <Mail size={20} color="#fff" />
              <h3 style={{ color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>Email & Contact</h3>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.infoRow}>
                <span className={styles.label}>Email Address</span>
                <span className={styles.value}>{user.email}</span>
                <button
                  onClick={handleResetPassword}
                  style={{ marginTop: '12px', padding: '8px 12px', background: '#eef4fb', color: '#1a7fd4', border: '1px solid #d0e3f5', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', alignSelf: 'flex-start' }}
                >
                  Send Password Reset Link
                </button>
              </div>
            </div>
          </div>


          <div className={styles.card}>
            <div 
              className={styles.cardHeader}
              style={{
                backgroundImage: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url("https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=800&auto=format&fit=crop")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderBottom: 'none',
                padding: '24px 20px'
              }}
            >
              <Calendar size={20} color="#fff" />
              <h3 style={{ color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>Travel Stats</h3>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.infoRow}>
                <span className={styles.label}>Total Trips Booked</span>
                <span className={styles.value}>{bookedTrips ? bookedTrips.length : 0}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>Total Spent on Flights</span>
                <span className={styles.value} style={{ fontWeight: 800, color: '#16a34a' }}>
                  ${calculateTotalSpent().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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

          <div className={styles.card}>
            <div 
              className={styles.cardHeader}
              style={{
                backgroundImage: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url("https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?q=80&w=800&auto=format&fit=crop")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderBottom: 'none',
                padding: '24px 20px'
              }}
            >
              <ShieldCheck size={20} color="#fff" />
              <h3 style={{ color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>Preferences</h3>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.infoRow}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input type="checkbox" defaultChecked />
                  <span className={styles.value}>Email me when a new trip is booked</span>
                </label>
              </div>
              <div className={styles.infoRow}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input type="checkbox" defaultChecked />
                  <span className={styles.value}>Receive weekly travel insights</span>
                </label>
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
