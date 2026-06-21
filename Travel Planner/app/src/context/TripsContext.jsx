import React, { createContext, useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

export const TripsContext = createContext();

export default function TripsContextProvider(props) {
  const [bookedTrips, setBookedTrips] = useState([]);
  const [loadingTrips, setLoadingTrips] = useState(true);

  useEffect(() => {
    let unsubscribeSnapshot = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoadingTrips(true);
        const q = query(
          collection(db, 'bookedTrips'),
          where('userId', '==', user.uid)
        );

        unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
          const tripsData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setBookedTrips(tripsData);
          setLoadingTrips(false);
        });
      } else {
        setBookedTrips([]);
        setLoadingTrips(false);
        if (unsubscribeSnapshot) unsubscribeSnapshot();
      }
    });

    return () => {
      if (unsubscribeAuth) unsubscribeAuth();
      if (unsubscribeSnapshot) unsubscribeSnapshot();
    };
  }, []);

  return (
    <TripsContext.Provider value={{ bookedTrips, loadingTrips }}>
      {props.children}
    </TripsContext.Provider>
  );
}
