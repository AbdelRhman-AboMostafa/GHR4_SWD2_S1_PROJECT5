import React, { useState, useContext } from "react";
import { useFormik } from 'formik';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";

import * as Yup from 'yup';
import { motion, AnimatePresence } from 'framer-motion';
import plane from '../../assets/Images/plane.png';
import bg from '../../assets/Images/background.jpg';
import { Plane, Mail, Lock, Loader2, ArrowLeft } from 'lucide-react'; 
import { userContext } from '../../context/userContext';

import styles from "./Login.module.css";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Login() {
    const [apiError, setError] = useState('');
    const [isLoading, setLoading] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const navigate = useNavigate();

    const { setLogin } = useContext(userContext);

    async function handleLogin(formData) {
        setLoading(true);
        setError('');

        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );

            const user = userCredential.user;
            const token = await user.getIdToken();
            localStorage.setItem("userToken", token);

            setLogin(token); 
            setLoading(false);
            setIsTransitioning(true);

            setTimeout(() => {
                navigate('/'); 
            }, 3000);

        } catch (error) {
            setLoading(false);
            setError(error.message);
        }
    }

    const validationSchema = Yup.object({
        email: Yup.string()
            .required('Email is required')
            .email('Enter a valid email'),
        password: Yup.string()
            .required('Password is required')
    });

    const formik = useFormik({
        initialValues: { email: '', password: '' },
        validationSchema: validationSchema,
        onSubmit: handleLogin
    });

    return (
        <div className={styles.splitScreenWrapper}>
            
            {/* LEFT COLUMN: HERO PANEL WITH BACKGROUND IMAGE (WIDER) */}
            <div className={styles.heroColumn}>
                <img src={bg} alt="Travel Background" className={styles.bgImage} />
                <div className={styles.darkOverlay} />
                
                {/* FLOATING HOME ACTION LINK */}
                <Link to="/" className={styles.backHomeLink}>
                    <ArrowLeft size={16} />
                    <span>Back to Home</span>
                </Link>
                
                <div className={styles.heroContent}>
                    <div className="d-flex align-items-center gap-3 mb-4">
                        <div className={styles.brandIconBox}>
                            <Plane size={24} className="text-white" style={{ transform: 'rotate(45deg)' }} />
                        </div>
                        <h1 className={styles.brandText}>TRAVEL</h1>
                    </div>
                    <h2 className={styles.mainDisplayTitle}>
                        EXPLORE<br />
                        <span className={styles.highlightText}>HORIZONS</span>
                    </h2>
                    <p className={styles.heroSubtitle}>
                        Your AI-powered travel companion for flights,<br />
                        destinations, and smart itineraries.
                    </p>

                    <ul className={styles.featuresList}>
                        <li><span className={styles.checkMark}>✓</span> Live flight search across global airlines</li>
                        <li><span className={styles.checkMark}>✓</span> Gemini AI-powered trip planning</li>
                        <li><span className={styles.checkMark}>✓</span> Save flights & manage past trips</li>
                        <li><span className={styles.checkMark}>✓</span> Weather insights for every destination</li>
                    </ul>
                </div>
            </div>

            {/* RIGHT COLUMN: SECURE FORM PANEL (SLIMMER & CRISP) */}
            <div className={styles.formColumn}>
                <div className={styles.formContainerWidth}>
                    
                    <h3 className={styles.formTitle}>Welcome back</h3>
                    <p className={styles.formSubtitle}>Sign in to continue your journey</p>
                    
                    {apiError && <div className="alert alert-danger py-2 small mb-4">{apiError}</div>}
                    
                    <form onSubmit={formik.handleSubmit}>
                        
                        {/* EMAIL LAYER */}
                        <div className="mb-4">
                            <label className={styles.inputLabel}>EMAIL</label>
                            <div className="position-relative">
                                <Mail size={18} className={styles.innerFormIcon} />
                                <input 
                                    type="email" 
                                    name="email" 
                                    className={`form-control ${styles.formInputField}`}
                                    placeholder="you@example.com" 
                                    {...formik.getFieldProps('email')} 
                                />
                            </div>
                            {formik.touched.email && formik.errors.email && (
                                <div className="text-danger small mt-1">{formik.errors.email}</div>
                            )}
                        </div>

                        {/* PASSWORD LAYER */}
                        <div className="mb-2">
                            <label className={styles.inputLabel}>PASSWORD</label>
                            <div className="position-relative">
                                <Lock size={18} className={styles.innerFormIcon} />
                                <input 
                                    type="password" 
                                    name="password" 
                                    className={`form-control ${styles.formInputField}`}
                                    placeholder="••••••••" 
                                    {...formik.getFieldProps('password')} 
                                />
                            </div>
                            {formik.touched.password && formik.errors.password && (
                                <div className="text-danger small mt-1">{formik.errors.password}</div>
                            )}
                        </div>

                        {/* FORGOT PASSWORD */}
                        <div className="text-end mb-4">
                            <Link to="/forgot-password" className={styles.forgotPasswordLink}>
                                Forgot password?
                            </Link>
                        </div>

                        {/* SUBMIT BUTTON */}
                        <button 
                            type="submit" 
                            disabled={isLoading} 
                            className={`btn ${styles.submitButton}`}
                        >
                            {isLoading ? (
                                <Loader2 className={styles.spinnerIcon} />
                            ) : (
                                "SIGN IN"
                            )}
                        </button>
                    </form>

                    {/* REDIRECT ANCHOR FOOTNOTE */}
                    <p className={styles.switchScreenFootnote}>
                        Don't have an account? <Link to="/register" className={styles.inlineActionLink}>Create one</Link>
                    </p>
                    
                </div>
            </div>

            {/* TAKEOFF TRANSITION OVERLAY SCREEN */}
            <AnimatePresence>
                {isTransitioning && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={styles.transitionOverlayContainer}
                    >
                        {[
                            { top: '20%', delay: 0, scale: 1 },
                            { top: '40%', delay: 0.5, scale: 1.5 },
                            { top: '60%', delay: 1, scale: 0.8 },
                            { top: '80%', delay: 1.5, scale: 1.2 },
                            { top: '30%', delay: 2, scale: 0.9 },
                            { top: '70%', delay: 2.5, scale: 1.1 }
                        ].map((cloud, i) => (
                            <motion.div
                                key={i}
                                animate={{ x: ['110vw', '-20vw'], y: ['20vh', '-20vh'] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: cloud.delay }}
                                className={styles.animatedCloud}
                                style={{ width: 250 * cloud.scale, top: cloud.top }}
                            />
                        ))}

                        <motion.div
                            initial={{ x: '-30vw', y: '90vh', scale: 0.5, rotate: -20 }}
                            animate={{ x: '130vw', y: '-30vh', scale: 1.5, rotate: -10 }}
                            transition={{ duration: 3, ease: [0.42, 0, 0.58, 1] }}
                            className={styles.animatedPlaneWrapper}
                        >
                            <img src={plane} alt="Takeoff" className="w-100" style={{ filter: 'drop-shadow(-30px 60px 30px rgba(0,0,0,0.3))' }} />
                        </motion.div>

                        <div className="position-absolute w-100 h-100 d-flex align-items-center justify-content-center">
                            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: [0, 1, 0] }} transition={{ duration: 3 }} className="text-white text-center">
                                <h2 className={styles.boardingText}>DEPARTING</h2>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}