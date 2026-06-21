import React, { useState, useRef, useEffect } from "react"; 
import { useLocation } from "react-router-dom";
import axios from "axios";
import { doc, addDoc, collection, setDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "react-toastify";
import { auth, db } from "../../firebase";
import { getAuth } from "firebase/auth";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plane,
  MapPin,
  Calendar,
  Search,
  Clock,
  Loader2,
  AlertCircle,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  ArrowLeftRight,
  BookmarkCheck,
} from "lucide-react";

import bg from "../../assets/Images/background.jpg";
import styles from "./Flights.module.css";

export default function Flights() {
  const API_KEY = import.meta.env.VITE_RAPIDAPI_KEY; 
  //.meta.env is a special object provided by vite that holds all the environment variables it can access
  //vite_rapidapi_key :tells vite to look inside your .env file and find the variable   
  const location = useLocation();

  const [fromText, setFromText] = useState(""); //variable for from input
  const [toText, setToText] = useState(""); //variable for to input
  const [fromId, setFromId] = useState(""); 
  const [toId, setToId] = useState(""); // those store hidden IDs from api, as internal airport/entity IDS
  const [fromResults, setFromResults] = useState([]);
  const [toResults, setToResults] = useState([]); //those are autocomplete dropdown results
  const [date, setDate] = useState(""); // travel date
  const [results, setResults] = useState([]); // stores all flights from api
  const [loading, setLoading] = useState(false);// if true show loading spinner
  const [error, setError] = useState(""); // stores error message
  const [expandedFlight, setExpandedFlight] = useState(null); // which flight card is expanded
  const [hasSearched, setHasSearched] = useState(false); //tells UI: “user already searched or not”

  // Filter States // each one controls filtering results 
  const [filterNonstop, setFilterNonstop] = useState(false);
  const [filter1Stop, setFilter1Stop] = useState(false);
  const [filterMorning, setFilterMorning] = useState(false);
  const [filterUnder500, setFilterUnder500] = useState(false);
  const [filterRefundable, setFilterRefundable] = useState(false);
  const [filterEconomy, setFilterEconomy] = useState(false);
  const [sortBy, setSortBy] = useState("low-to-high"); //default sorting = cheapest first

  const timeoutRef = useRef(null); //stores debounce(waiting until the user stops writing) timer

  useEffect(() => {
    if (location.state?.queryTo) {
      setToText(location.state.queryTo);
      // Automatically attempt to fetch autocomplete data so they can click it instantly
      searchPlaces(location.state.queryTo, setToResults);
    }
  }, [location.state]);

  const searchPlaces = (query, setter) => { // query -> what the user typed, setter -> a function used to store results in state
    if (timeoutRef.current) clearTimeout(timeoutRef.current); //If there is already a waiting timer, cancel it,, Because the user is still typing.
     //Example:
    // user types "p"
    // timer starts
    // user types "pa" before 250ms
    // we cancel old timer 
    // we start a new one
      // This is debounce logic

    timeoutRef.current = setTimeout(async () => { // instead of calling API immediately, we delay it. by 250ms
      if (!query || query.length < 2) return;  //If input is empty or too short, do nothing

      try {
        const res = await axios.get(
          "https://flights-sky.p.rapidapi.com/flights/auto-complete",
          {
            params: { query }, //Sends user input to API
            headers: {
              "x-rapidapi-host": "flights-sky.p.rapidapi.com", //tells RapidAPI which service you’re using
              "x-rapidapi-key": API_KEY,
            },
          }
        );
        // console.log(res.data);

        setter(res.data?.data?.slice(0, 6) || []);  // updates React state
        // res.data is full api response , .data is the actual lists of places, and .slice to take only first 6 results
        // and empty array if api fails or returns nothing
      } catch (err) {
        console.log(err); // if api falis
      }
    }, 250); //wait 250ms before calling API
  }

  const handleSearch = async () => {
    if (!fromId || !toId || !date) { //Checks if any required field is missing
      setError("Please select a departure city, destination, and date.");
      return;
    }

    setLoading(true);
    setError("");//clear old errors
    setResults([]); //remove previous search results
    setHasSearched(true); //marks that user already searched once
    setExpandedFlight(null); //closes any opened flight details panel

    try {
      const res = await axios.get(
        "https://flights-sky.p.rapidapi.com/flights/search-one-way",
        {
          params: {
            fromEntityId: fromId,
            toEntityId: toId,
            departDate: date,
            adults: 1,
            cabinClass: "economy",
            currency: "USD",
            market: "US",
            locale: "en-US", //english results
          },
          headers: {
            "x-rapidapi-host": "flights-sky.p.rapidapi.com",
            "x-rapidapi-key": API_KEY,
          },
        }
      );

    //   console.log(res.data);

      setResults(res.data?.data?.itineraries || []);
      //res.data.data.itineraries: list of flights,  as itineraries are flight options
    } catch (err) {
      console.log(err);
      setError("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  const handleDetail = (flight) => {
    const flightKey =
      flight?.id ||
      flight?.legs?.[0]?.id || //legs is like stops , we just check the first as we only need an id so it represent part of the journey
      flight?.price?.pricingOptionId; //the specific price offer/version of the flight,ex economy

    if (!flightKey) return; //cannot identify the flight

    if (expandedFlight === flightKey) { //Is this flight already expanded?
      setExpandedFlight(null); //if yes collapse it 
      return;
    }

    setExpandedFlight(flightKey); //open the flight details
  };

  const saveFlight = async (flight) => { //store flight in database
    const user = getAuth().currentUser;
    if (!user) {
      toast.error("You must be logged in");
      return;
    }

    try {
      await addDoc(collection(db, "savedFlights"), { //creates a new document in Firestore called savedflights
        userId: user.uid, //who saved it
        flight, //full flight data
        createdAt: serverTimestamp(), //time of saving
      });
      toast.success("Flight saved ✈️");
    } catch (err) {
      toast.error(err.message || "Save failed");
    }
  };

  // NEW: Book trip behavior to target storage matching your Trips pipeline
  const bookTrip = async (flight) => {
    const user = getAuth().currentUser;
    if (!user) {
      toast.error("You must be logged in to book a trip");
      return;
    }

    //check if trip booked before
    const q = query(
      collection(db, "bookedTrips"),
      where("userId", "==", user.uid),
    );

    const snapshot = await getDocs(q);
    const alreadyBooked = snapshot.docs.some((doc) => {
      const bookedFlight = doc.data().flightDetails;

      return bookedFlight?.id === flight?.id;
    });
    if (alreadyBooked) {
      toast.warning("Trip already booked!");
      return;
    }


    try {
      await addDoc(collection(db, "bookedTrips"), { //creates new document in "bookedTrips" collection
        userId: user.uid,
        flightDetails: flight,
        status: "confirmed",
        bookingDate: serverTimestamp(),
        tripDate: date,
        origin: fromText,
        destination: toText,
      });
      toast.success("Trip booked successfully! Added to your Trips page 🌎");
    } catch (err) {
      console.log("BOOKING ERROR:", err);
      toast.error(err.message || "Booking failed");
    }
  };

  const formatDuration = (mins) => {//takes flight duration in minutes
    if (!mins) return "-"; //if no duration found
    return `${Math.floor(mins / 60)}h ${mins % 60}m`;
  };

  const formatTime = (iso) => { //Takes an ISO date string (from API)
    if (!iso) return "-"; //If no time, return dash
    return new Date(iso).toLocaleTimeString([], { //js method
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }); //"2026-06-12T14:30:00Z" -> 14:30
  };

  const swapLocations = () => {
    setFromText(toText);
    setToText(fromText);
    setFromId(toId);
    setToId(fromId);
    setFromResults([]);
    setToResults([]); //clear autocomplete suggestions
  };

  const filteredResults = results.filter((flight) => {
    const leg = flight?.legs?.[0]; //first segment
    const priceRaw = flight?.price?.raw; //600 not 600$
    const isRefundable = flight?.farePolicy?.isCancellationAllowed;
    
    if (filterNonstop && leg?.stopCount !== 0) return false;
    if (filter1Stop && leg?.stopCount !== 1) return false;
    
    if (filterMorning && leg?.departure) {
      const depHour = new Date(leg.departure).getHours(); //extract hour (0–23)
      if (depHour < 5 || depHour >= 12) return false; //reject flights before 5 AM OR after 12 PM
    }
    
    if (filterUnder500 && priceRaw && priceRaw > 500) return false;
    if (filterRefundable && !isRefundable) return false;

    return true;
  }).sort((a, b) => { //sort works as a comes before b if a-b <0
    if (sortBy === "low-to-high") {
      return (a?.price?.raw || 0) - (b?.price?.raw || 0);
    } else if (sortBy === "high-to-low") {
      return (b?.price?.raw || 0) - (a?.price?.raw || 0);
    }
    return 0;
  });

  return (
    <div className={styles.page}>
      <div className={styles.cosmicBackground} />

      <div className={styles.content}>

        {/* Hero */}
        <motion.div
          className={styles.hero}
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className={styles.heroTitle}>
            FIND YOUR <span className={styles.accent}>FLIGHT</span>
          </h1>
          <p className={styles.heroSub}>Search one-way flights worldwide</p>
        </motion.div>

        {/* SEARCH CARD */}
        <motion.div
          className={styles.searchCard}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className={styles.searchRow}>

            <div className={styles.fieldWrap}>
              <label className={styles.fieldLabel}>
                <MapPin size={12} /> From
              </label>

              <input
                placeholder="City or airport"
                value={fromText}
                onChange={(e) => { 
                  setFromText(e.target.value); //the current text inside the input
                  setFromId(""); //reset old id
                  searchPlaces(e.target.value, setFromResults); 
                }}
                className={styles.input}
              />

              {fromResults.length > 0 && (
                <div className={styles.dropdown}>
                  {fromResults.map((item, i) => ( //loop through suggestions
                    <div
                      key={i}
                      className={styles.dropdownItem}
                      onClick={() => {
                        setFromId(item.presentation.id);
                        setFromText(item.presentation.title);
                        setFromResults([]);
                      }}
                    >
                      <MapPin size={11} />
                      {item.presentation.suggestionTitle}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button className={styles.swapBtn} onClick={swapLocations}>
              <ArrowLeftRight size={14} />
            </button>

            <div className={styles.fieldWrap}>
              <label className={styles.fieldLabel}>
                <MapPin size={12} /> To
              </label>

              <input
                placeholder="City or airport"
                className={styles.input}
                value={toText}
                onChange={(e) => {
                  setToText(e.target.value);
                  setToId("");
                  searchPlaces(e.target.value, setToResults);
                }}
              />

              {toResults.length > 0 && (
                <div className={styles.dropdown}>
                  {toResults.map((item, i) => (
                    <div
                      key={i}
                      className={styles.dropdownItem}
                      onClick={() => {
                        setToId(item.presentation.id);
                        setToText(item.presentation.title);
                        setToResults([]);
                      }}
                    >
                      <MapPin size={11} />
                      {item.presentation.suggestionTitle}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className={styles.fieldWrap} style={{ flex: "0 0 160px" }}>
              <label className={styles.fieldLabel}>
                <Calendar size={12} /> Depart
              </label>

              <input
                type="date"
                className={styles.input}
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <button
              className={styles.searchBtn}
              onClick={handleSearch}
              disabled={loading} //disable the btn while loading
            >
              {loading ? (
                <Loader2 size={16} className={styles.spin} />
              ) : (
                <Search size={16} />
              )}
              {loading ? "Searching…" : "Search"}
            </button>

          </div>
        </motion.div>

        {/* FILTERS TOOLBAR ROW */}
        {hasSearched && !loading && (
          <div className={styles.filterToolbar}>
            <div className={styles.filterGroup}>
              <span className={styles.filterPaneLabel}>Filter:</span>
              <button 
                className={`${styles.filterChip} ${filterNonstop ? styles.activeFilter : ""}`}
                onClick={() => setFilterNonstop(!filterNonstop)}
              >
                Nonstop
              </button>
              <button 
                className={`${styles.filterChip} ${filter1Stop ? styles.activeFilter : ""}`}
                onClick={() => setFilter1Stop(!filter1Stop)}
              >
                1 stop
              </button>
              <button 
                className={`${styles.filterChip} ${filterMorning ? styles.activeFilter : ""}`}
                onClick={() => setFilterMorning(!filterMorning)}
              >
                Morning departures
              </button>
              <button 
                className={`${styles.filterChip} ${filterUnder500 ? styles.activeFilter : ""}`}
                onClick={() => setFilterUnder500(!filterUnder500)}
              >
                Under $500
              </button>
              <button 
                className={`${styles.filterChip} ${filterRefundable ? styles.activeFilter : ""}`}
                onClick={() => setFilterRefundable(!filterRefundable)}
              >
                Refundable
              </button>
              <button 
                className={`${styles.filterChip} ${filterEconomy ? styles.activeFilter : ""}`}
                onClick={() => setFilterEconomy(!filterEconomy)}
              >
                Economy
              </button>
            </div>

            <div className={styles.sortingGroup}>
              <select 
                className={styles.sortSelect} 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="low-to-high">Price (low to high)</option>
                <option value="high-to-low">Price (high to low)</option>
              </select>
            </div>
          </div>
        )}

        {/* METRICS HEADER BANNER */}
        {hasSearched && !loading && (
          <div className={styles.resultsMetricHeader}>
            {filteredResults.length} results found • sorted by price
          </div>
        )}

        {/* RESULTS */}
        {!loading && filteredResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.resultsList}>
              {filteredResults.map((flight, i) => {
                const leg = flight?.legs?.[0];
                const flightKey = flight?.id || leg?.id || flight?.token;
                const isOpen = expandedFlight === flightKey;
                
                const stopsCount = leg?.stopCount || 0;
                const stopLabel = stopsCount === 0 ? "Nonstop" : `${stopsCount} stop${stopsCount > 1 ? "s" : ""}`;

                return (
                  <motion.div
                    key={i}
                    className={styles.flightCard}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: i * 0.04 }}
                  >
                    <div className={styles.cardMainRow}>
                      
                      {/* Airline Badge */}
                      <div className={styles.airlineBadge}>
                        <span className={styles.badgeCode}>
                          { "N/A"}
                        </span>
                      </div>

                      {/* Flight Track Summary */}
                      <div className={styles.journeyContainer}>
                        <div className={styles.routeNode}>
                          <span className={styles.airportCode}>{leg?.origin?.displayCode}</span>
                          <span className={styles.cityName}>{leg?.origin?.city || leg?.origin?.name}</span>
                          <span className={styles.timeLabel}>{formatTime(leg?.departure)}</span>
                        </div>

                        <div className={styles.timelineTrack}>
                          <span className={styles.timelineDuration}>
                            {formatDuration(leg?.durationInMinutes)}
                          </span>
                          <div className={styles.lineWrapper}>
                            <div className={styles.horizontalLine} />
                            <Plane size={12} className={styles.planeIcon} />
                            <div className={styles.horizontalLine} />
                          </div>
                          <span className={`${styles.timelineStops} ${stopsCount > 0 ? styles.hasStops : styles.nonstop}`}>
                            {stopLabel}
                          </span>
                        </div>

                        <div className={styles.routeNode}>
                          <span className={styles.airportCode}>{leg?.destination?.displayCode}</span>
                          <span className={styles.cityName}>{leg?.destination?.city || leg?.destination?.name}</span>
                          <span className={styles.timeLabel}>{formatTime(leg?.arrival)}</span>
                        </div>
                      </div>

                      {/* Pricing block */}
                      <div className={styles.pricingSection}>
                        <span className={styles.priceAmount}>
                          {flight?.price?.formatted}
                        </span>
                        <span className={styles.pricePerAdult}>per adult</span>
                        {flight?.tags?.slice(0, 1).map((tag, idx) => (
                          <span key={idx} className={styles.cheapestLabel}>
                            {tag}
                          </span>
                        ))}
                      </div>

                    </div>

                    {/* Expandable Panel container */}
                    <AnimatePresence>
                      {isOpen && (
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
                              <span className={styles.metaLabel}>REFUNDABLE</span>
                              <span className={styles.metaValue}>{flight?.farePolicy?.isCancellationAllowed ? "Yes" : "No"}</span>
                            </div>
                            <div className={styles.metaItem}>
                              <span className={styles.metaLabel}>ECO SCORE</span>
                              <span className={styles.metaValue}>
                                {flight?.eco?.ecoContenderDelta != null ? flight.eco.ecoContenderDelta.toFixed(1) : "-"} 
                                {/* Show this number with exactly 1 digit after the decimal point. */}
                              </span>
                            </div>
                            <div className={styles.metaItem}>
                              <span className={styles.metaLabel}>STOPS</span>
                              <span className={styles.metaValue}>{stopLabel}</span>
                            </div>
                            <div className={styles.metaItem}>
                              <span className={styles.metaLabel}>CHANGES ALLOWED</span>
                              <span className={styles.metaValue}>{flight?.farePolicy?.isChangeAllowed ? "Yes" : "No"}</span>
                            </div>
                            <div className={styles.metaItem}>
                              <span className={styles.metaLabel}>CABIN</span>
                              <span className={styles.metaValue}>Economy</span>
                            </div>
                            <div className={styles.metaItem}>
                              <span className={styles.metaLabel}>TAGS</span>
                              <span className={styles.metaValue}>
                                {flight?.tags?.length > 0 ? flight.tags.join(", ") : "-"}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Actions tray with added Book Trip option */}
                    <div className={styles.cardActionsTray}>
                      <button
                        className={styles.detailBtn}
                        onClick={() => handleDetail(flight)}
                      >
                        {isOpen ? <>Hide details ▲</> : <>View details ▼</>}
                      </button>

                      <button
                        className={styles.saveBtn}
                        onClick={() => saveFlight(flight)}
                      >
                        ✦ Save Flight
                      </button>

                      <button
                        className={styles.bookBtn}
                        onClick={() => bookTrip(flight)}
                      >
                        ✈ Book Trip
                      </button>
                    </div>

                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}
