import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plane, Globe, Bot, BarChart3, MapPinSearch } from "lucide-react";
import bg from "../../assets/Images/background.jpg";

export default function Home() {
    const navigate = useNavigate();

    const styles = {

        bg: {
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.6
        },
        overlay: {
            position: "absolute",
            inset: 0,
            background: "linear-gradient(rgba(0,0,0,0.9), rgba(2,6,23,0.9))"
        },
        content: {
            position: "relative",
            zIndex: 2,
            padding: "60px 20px"
        },
        hero: {
            textAlign: "center",
            marginBottom: "50px"
        },
        searchBox: {
            marginTop: "20px",
            padding: "14px 18px",
            width: "55%",
            borderRadius: "14px",
            border: "none",
            outline: "none"
        },
        card: {
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "18px",
            padding: "22px",
            cursor: "pointer",
            transition: "0.3s",
            backdropFilter: "blur(10px)"
        }
    };

 

    return (
        <div style={styles.container}>
            <img src={bg} style={styles.bg} />
            <div style={styles.overlay}></div>

            <div style={styles.content}>

                <motion.div
                    style={styles.hero}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="display-3 fw-bold text-white">
                        PLAN YOUR <span className="text-info">NEXT TRIP</span>
                    </h1>

                    <p className="text-secondary mt-2">
                        Flights • Destinations • AI Recommendations • Travel Insights
                    </p>


                </motion.div>
                            </div>
                    </div>

    );
}