import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./Home.module.css";

export default function Home() {
  const navigate = useNavigate();
  const [liveFlights, setLiveFlights] = useState([]);
  const API_KEY = import.meta.env.VITE_RAPIDAPI_KEY;

  useEffect(() => {
    const fetchLiveFlights = async () => {
      if (!API_KEY) {
        console.warn("No RapidAPI Key found! Using mock local live flights so UI is visible.");
        setLiveFlights([
          { price: { formatted: "$450" }, legs: [{ origin: { displayCode: "JFK", city: "New York" }, destination: { displayCode: "LHR", city: "London" }, durationInMinutes: 420, carriers: { marketing: [{ name: "British Airways" }] } }] },
          { price: { formatted: "$320" }, legs: [{ origin: { displayCode: "DXB", city: "Dubai" }, destination: { displayCode: "CDG", city: "Paris" }, durationInMinutes: 380, carriers: { marketing: [{ name: "Emirates" }] } }] },
          { price: { formatted: "$610" }, legs: [{ origin: { displayCode: "LAX", city: "Los Angeles" }, destination: { displayCode: "DPS", city: "Bali" }, durationInMinutes: 1100, carriers: { marketing: [{ name: "Singapore Airlines" }] } }] },
        ]);
        return;
      }
      try {
        const fromRes = await axios.get("https://flights-sky.p.rapidapi.com/flights/auto-complete", {
          params: { query: "NYC" },
          headers: { "x-rapidapi-host": "flights-sky.p.rapidapi.com", "x-rapidapi-key": API_KEY }
        });
        const fromId = fromRes.data?.data?.[0]?.presentation?.id;
        
        const toRes = await axios.get("https://flights-sky.p.rapidapi.com/flights/auto-complete", {
          params: { query: "LON" },
          headers: { "x-rapidapi-host": "flights-sky.p.rapidapi.com", "x-rapidapi-key": API_KEY }
        });
        const toId = toRes.data?.data?.[0]?.presentation?.id;

        const dDate = new Date();
        dDate.setDate(dDate.getDate() + 15);
        const isoDate = dDate.toISOString().split('T')[0];

        if (fromId && toId) {
          const flightsRes = await axios.get("https://flights-sky.p.rapidapi.com/flights/search-one-way", {
            params: {
              fromEntityId: fromId,
              toEntityId: toId,
              departDate: isoDate,
              adults: 1,
              cabinClass: "economy",
              currency: "USD",
              market: "US",
              locale: "en-US",
            },
            headers: { "x-rapidapi-host": "flights-sky.p.rapidapi.com", "x-rapidapi-key": API_KEY },
          });
          setLiveFlights(flightsRes.data?.data?.itineraries?.slice(0, 3) || []);
        }
      } catch (err) {
        console.error("Live flights fetch error", err);
      }
    };
    fetchLiveFlights();
  }, [API_KEY]);

  return (
    <div>
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <img className={styles.heroBgImage} src="/images/hero.png" alt="Beautiful landscape" />
        </div>
        <div className={styles.heroContent}>
          <div className={styles.heroEyebrow}>✦ AI-Powered Travel Planning</div>
          <h1 className={styles.heroTitle}>
            PLAN YOUR<br />
            <span className={styles.acc}>NEXT TRIP</span>
          </h1>
          <p className={styles.heroSub}>Flights · Destinations · AI Recommendations · Travel Insights</p>
          <div className={styles.searchStrip}>
            <input placeholder="Where do you want to go?" />
            <button onClick={() => navigate('/flights')}>Explore →</button>
          </div>
          <div className={styles.features}>
            <div className={styles.featCard} onClick={() => navigate('/flights')}>
              <img className={styles.featCardBgImg} src="/images/flights.png" alt="Flights" />
              <div className={styles.featContent}>
                <div className={styles.featIcon}>✈️</div>
                <div className={styles.featTitle}>FLIGHTS</div>
                <div className={styles.featDesc}>Search one-way & round-trip flights worldwide</div>
              </div>
            </div>
            <div className={styles.featCard} onClick={() => navigate('/destinations')}>
              <img className={styles.featCardBgImg} src="/images/destinations.png" alt="Destinations" />
              <div className={styles.featContent}>
                <div className={styles.featIcon}>🌍</div>
                <div className={styles.featTitle}>DESTINATIONS</div>
                <div className={styles.featDesc}>Discover top destinations curated for you</div>
              </div>
            </div>
            <div className={styles.featCard} onClick={() => navigate('/tripPlanner')}>
              <img className={styles.featCardBgImg} src="/images/paris.png" alt="AI Planner" />
              <div className={styles.featContent}>
                <div className={styles.featIcon}>🤖</div>
                <div className={styles.featTitle}>AI PLANNER</div>
                <div className={styles.featDesc}>Generate a full trip plan powered by Gemini AI</div>
              </div>
            </div>
            <div className={styles.featCard} onClick={() => navigate('/dashboard')}>
              <img className={styles.featCardBgImg} src="/images/bali.png" alt="Dashboard" />
              <div className={styles.featContent}>
                <div className={styles.featIcon}>📊</div>
                <div className={styles.featTitle}>DASHBOARD</div>
                <div className={styles.featDesc}>Track saved flights and past trips in one view</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className={styles.stats}>
        <div><div className={styles.statVal}>500+</div><div className={styles.statLbl}>Destinations</div></div>
        <div><div className={styles.statVal}>12K+</div><div className={styles.statLbl}>Flights tracked</div></div>
        <div><div className={styles.statVal}>98%</div><div className={styles.statLbl}>Satisfaction rate</div></div>
        <div><div className={styles.statVal}>24/7</div><div className={styles.statLbl}>AI support</div></div>
      </div>

      <section className={styles.section}>
        <div className={styles.sectionLabel}>Popular Right Now</div>
        <div className={styles.sectionTitle}>Trending Destinations</div>
        <div className={styles.sectionSub}>Handpicked places travellers are booking this season</div>
        <div className={styles.destGrid}>
          <div className={styles.destCard} onClick={() => navigate('/flights', { state: { queryTo: 'Dubai' } })}>
            <div className={styles.destImgContainer}>
              <img src="/images/dubai.png" className={styles.destRealImg} alt="Dubai" />
              <div className={`${styles.destBadge} ${styles.hot}`}>HOT</div>
            </div>
            <div className={styles.destInfo}>
              <div className={styles.destName}>Dubai, UAE</div>
              <div className={styles.destMeta}><span>☀️ 38°C</span><span>✈️ 4h avg</span></div>
              <div className={styles.destPrice}>from $340</div>
            </div>
          </div>
          <div className={styles.destCard} onClick={() => navigate('/flights', { state: { queryTo: 'Paris' } })}>
            <div className={styles.destImgContainer}>
              <img src="/images/paris.png" className={styles.destRealImg} alt="Paris" />
              <div className={`${styles.destBadge} ${styles.top}`}>TOP</div>
            </div>
            <div className={styles.destInfo}>
              <div className={styles.destName}>Paris, France</div>
              <div className={styles.destMeta}><span>🌤️ 22°C</span><span>✈️ 5h avg</span></div>
              <div className={styles.destPrice}>from $520</div>
            </div>
          </div>
          <div className={styles.destCard} onClick={() => navigate('/flights', { state: { queryTo: 'Bali' } })}>
            <div className={styles.destImgContainer}>
              <img src="/images/bali.png" className={styles.destRealImg} alt="Bali" />
            </div>
            <div className={styles.destInfo}>
              <div className={styles.destName}>Bali, Indonesia</div>
              <div className={styles.destMeta}><span>🌧️ 27°C</span><span>✈️ 10h avg</span></div>
              <div className={styles.destPrice}>from $610</div>
            </div>
          </div>
        </div>
      </section>

      {/* Live flights Section */}
      {liveFlights.length > 0 && (
        <section className={styles.section} style={{ background: '#fff' }}>
          <div className={styles.sectionLabel}>Live API Data</div>
          <div className={styles.sectionTitle}>Featured Flight Deals</div>
          <div className={styles.sectionSub}>Real-time flight data fetched from RapidAPI</div>
          
          <div className={styles.liveFlightsGrid}>
            {liveFlights.map((flight, idx) => {
              const leg = flight?.legs?.[0];
              const destCity = (leg?.destination?.city || "").toLowerCase();
              
              let imgSrc = '/images/flights.png';
              if (destCity.includes('paris')) imgSrc = '/images/paris.png';
              else if (destCity.includes('london')) imgSrc = '/images/hero.png';
              else if (destCity.includes('bali')) imgSrc = '/images/bali.png';
              else if (destCity.includes('dubai')) imgSrc = '/images/dubai.png';

              return (
                <div key={idx} className={styles.liveFlightCard} onClick={() => navigate('/flights')} style={{cursor: 'pointer'}}>
                  <div className={styles.lfImageContainer}>
                    <img 
                      src={imgSrc} 
                      alt={leg?.destination?.city || "Destination"} 
                      className={styles.lfImage} 
                    />
                  </div>
                  <div className={styles.lfContent}>
                    <div className={styles.lfHeader}>
                      <span className={styles.lfAirline}>{leg?.carriers?.marketing?.[0]?.name || "Airline"}</span>
                      <span className={styles.lfPrice}>{flight?.price?.formatted}</span>
                    </div>
                    <div className={styles.lfBody}>
                      <div className={styles.lfNode}>
                        <h4>{leg?.origin?.displayCode}</h4>
                        <p>{leg?.origin?.city}</p>
                      </div>
                      <div className={styles.lfTrack}>
                        <span>{leg?.durationInMinutes ? `${Math.floor(leg.durationInMinutes / 60)}h ${leg.durationInMinutes % 60}m` : "-"}</span>
                        <div className={styles.lfLine} />
                      </div>
                      <div className={styles.lfNode}>
                        <h4>{leg?.destination?.displayCode}</h4>
                        <p>{leg?.destination?.city}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

    </div>
  );
}