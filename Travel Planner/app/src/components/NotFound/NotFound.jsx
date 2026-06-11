import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plane, AlertTriangle, ArrowLeft } from 'lucide-react';
import bg from '../../assets/Images/background.jpg';

export default function NotFound() {
    const [isHoveredHome, setIsHoveredHome] = useState(false);
    const [isHoveredBack, setIsHoveredBack] = useState(false);
    const navigate = useNavigate();

    const styles = {
        mainContainer: { 
            minHeight: '90vh', 
            width: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            overflow: 'hidden', 
            backgroundColor: '#0f172a', 
            position: 'relative' 
        },
        bgImage: { 
            position: 'absolute', 
            inset: 0, 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover', 
            opacity: 0.7, 
            zIndex: 0 
        },
        overlay: { 
            position: 'absolute', 
            inset: 0, 
            background: 'linear-gradient(to bottom right, rgba(2, 6, 23, 0.8), rgba(15, 23, 42, 0.4), transparent)', 
            zIndex: 0 
        },
        glassCard: { 
            background: 'rgba(255, 255, 255, 0.05)', 
            backdropFilter: 'blur(16px)', 
            border: '1px solid rgba(255, 255, 255, 0.1)', 
            borderRadius: '2.5rem', 
            padding: '4rem 2rem', 
            color: 'white',
            textAlign: 'center',
            maxWidth: '550px',
            width: '90%',
            position: 'relative',
            zIndex: 1,
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        },
        btnPrimary: {
            background: 'linear-gradient(135deg, #0ea5e9, #075985)',
            color: 'white',
            textDecoration: 'none',
            padding: '12px 30px',
            border: '1px solid rgba(14, 165, 233, 0.3)',
            borderRadius: '12px',
            transition: 'all 0.35s ease',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            fontWeight: '600',
            boxShadow: isHoveredHome ? '0 15px 30px rgba(14, 165, 233, 0.35)' : 'none',
            transform: isHoveredHome ? 'translateY(-4px)' : 'none'
        },
        btnSecondary: {
            background: 'rgba(255, 255, 255, 0.05)',
            color: 'white',
            textDecoration: 'none',
            padding: '12px 30px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            transition: 'all 0.35s ease',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: isHoveredBack ? '0 10px 25px rgba(0, 0, 0, 0.2)' : 'none',
            transform: isHoveredBack ? 'translateY(-4px)' : 'none'
        }
    };

    return (
        <div style={styles.mainContainer}>
            <img src={bg} alt="Travel Background" style={styles.bgImage} />
            <div style={styles.overlay} />

            <motion.div 
                initial={{ opacity: 0, y: 50 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.6, ease: "easeOut" }}
                style={styles.glassCard}
            >
                <div className="d-flex justify-content-center mb-4">
                    <motion.div
                        initial={{ scale: 0.8, rotate: -15 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
                    >
                        <AlertTriangle size={70} className="text-info" />
                    </motion.div>
                </div>
                
                <motion.h1 
                    className="fw-bold mb-4" 
                    style={{ fontSize: '3.5rem', textShadow: '0 4px 20px rgba(14, 165, 233, 0.4)' }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    404 Error
                </motion.h1>
                <div style={{ height: '2px', width: '60px', background: '#0ea5e9', margin: '0 auto 1.5rem auto', borderRadius: '2px' }}></div>
                
                <p className="text-light mb-3" style={{ fontSize: '1.05rem', lineHeight: '1.6' }}>
                    Oops! The page you’re trying to access doesn’t exist, may have been moved, or the URL might be incorrect.
                </p>
                <p className="text-light opacity-50 mb-4" style={{ fontSize: '0.95rem' }}>
                    Check the URL or go back to continue browsing.
                </p>
                
                <div className="d-flex flex-column flex-sm-row justify-content-center align-items-center gap-3 mt-4">
                    <button 
                        onClick={() => navigate(-1)}
                        style={styles.btnSecondary}
                        onMouseEnter={() => setIsHoveredBack(true)}
                        onMouseLeave={() => setIsHoveredBack(false)}
                    >
                        <ArrowLeft size={18} />
                        Go Back
                    </button>
                    <Link 
                        to="/" 
                        style={styles.btnPrimary}
                        onMouseEnter={() => setIsHoveredHome(true)}
                        onMouseLeave={() => setIsHoveredHome(false)}
                    >
                        <Plane size={18} style={{ transform: 'rotate(-45deg)' }} />
                        Back to Home
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
