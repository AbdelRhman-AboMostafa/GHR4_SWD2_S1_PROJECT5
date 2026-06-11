import React from "react";
import { Link } from "react-router-dom";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footerContainer}>
      <div className="container py-5">
        <div className="row">
          
          {/* BRAND COLUMN */}
          <div className="col-md-4 mb-4">
            <h3 className={styles.brandTitle}>TRAVEL AI</h3>
            <p className={styles.brandDescription}>
              AI-powered travel planning for flights,
              <br />
              destinations, and smart trip
              <br />
              recommendations.
            </p>
          </div>

          {/* QUICK LINKS COLUMN */}
          <div className="col-md-4 mb-4">
            <h6 className={styles.columnHeading}>QUICK LINKS</h6>
            <div className="d-flex flex-column gap-2">
              <Link className={styles.footerLink} to="/flights">
                ✈ Flights
              </Link>
              <Link className={styles.footerLink} to="/destinations">
                🌍 Destinations
              </Link>
              <Link className={styles.footerLink} to="/ai">
                🤖 AI Planner
              </Link>
              <Link className={styles.footerLink} to="/dashboard">
                📊 Dashboard
              </Link>
            </div>
          </div>

          {/* FEATURES COLUMN */}
          <div className="col-md-4 mb-4">
            <h6 className={styles.columnHeading}>FEATURES</h6>
            <div className="d-flex flex-column gap-2">
              <span className={styles.featureText}>Flight Search APIs</span>
              <span className={styles.featureText}>Weather Insights</span>
              <span className={styles.featureText}>Destination Explorer</span>
              <span className={styles.featureText}>AI Recommendations</span>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div className={styles.bottomBar}>
          <p className={styles.copyrightText}>
            © 2026 Travel AI Planner — Built for educational purposes
          </p>

          <div className="d-flex gap-3 mt-2 mt-md-0">
            <Link className={styles.bottomLink} to="/privacy">Privacy</Link>
            <Link className={styles.bottomLink} to="/terms">Terms</Link>
            <Link className={styles.bottomLink} to="/support">Support</Link>
          </div>
        </div>
        
      </div>
    </footer>
  );
}