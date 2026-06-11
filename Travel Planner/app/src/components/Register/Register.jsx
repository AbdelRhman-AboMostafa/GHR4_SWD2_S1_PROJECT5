import React, { useState } from "react";
import { useFormik } from 'formik';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../firebase"; 

import * as Yup from 'yup';
import { motion, AnimatePresence } from 'framer-motion';
import plane from '../../assets/Images/plane.png';
import bg from '../../assets/Images/background.jpg';
import { Plane, Mail, Lock, User, Phone, Loader2, ArrowLeft } from 'lucide-react';

import styles from "./Register.module.css";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Register() {
    const [apiError, setError] = useState('');
    const [isLoading, setLoading] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const navigate = useNavigate();

    async function handleRegister(formData) {
        setLoading(true);
        setError('');

        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );

            const user = userCredential.user;

            await updateProfile(user, {
                displayName: formData.name
            });

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

    // Simplified password requirements to match your request
    let validationSchema = Yup.object({
        name: Yup.string().required('Name is required').min(3, 'Name must be at least 3 characters'),
        email: Yup.string().email('Invalid email format').required('Email is required'),
        password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
        rePassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match').required('Confirm password is required'),
        phone: Yup.string().required('Phone Number is required')
    });

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
            rePassword: '',
            phone: ''
        },
        validationSchema: validationSchema,
        onSubmit: handleRegister
    });

    return (
        <div className={styles.splitScreenWrapper}>
            
            {/* LEFT COLUMN: HERO PANEL */}
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
                        START YOUR<br />
                        <span className={styles.highlightText}>JOURNEY</span>
                    </h2>
                    <p className={styles.heroSubtitle}>
                        Create your account and unlock AI-powered travel<br />
                        planning in seconds.
                    </p>

                    <div className={styles.stepsLayoutGrid}>
                        <div className={styles.stepItemCard}>
                            <div className={styles.stepBadgeCounter}>1</div>
                            <div>
                                <h4 className={styles.stepLabelHeader}>Create your account</h4>
                                <p className={styles.stepLabelBody}>Fill in your details — under a minute</p>
                            </div>
                        </div>
                        <div className={styles.stepItemCard}>
                            <div className={styles.stepBadgeCounter}>2</div>
                            <div>
                                <h4 className={styles.stepLabelHeader}>Search & save flights</h4>
                                <p className={styles.stepLabelBody}>Browse live results and bookmark the best ones</p>
                            </div>
                        </div>
                        <div className={styles.stepItemCard}>
                            <div className={styles.stepBadgeCounter}>3</div>
                            <div>
                                <h4 className={styles.stepLabelHeader}>Let AI plan your trip</h4>
                                <p className={styles.stepLabelBody}>Describe where you want to go, get a full itinerary</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT COLUMN: REGISTER FORM (PROPORTIONALLY BALANCED) */}
            <div className={styles.formColumn}>
                <div className={styles.formContainerWidth}>
                    
                    <h3 className={styles.formTitle}>Create account</h3>
                    <p className={styles.formSubtitle}>Join thousands of smart travellers</p>
                    
                    {apiError && <div className="alert alert-danger py-2 small mb-4">{apiError}</div>}
                    
                    <form onSubmit={formik.handleSubmit}>
                        
                        {/* FULL NAME */}
                        <div className="mb-3">
                            <label className={styles.inputLabel}>FULL NAME</label>
                            <div className="position-relative">
                                <User size={18} className={styles.innerFormIcon} />
                                <input 
                                    type="text" 
                                    name="name" 
                                    className={`form-control ${styles.formInputField}`}
                                    placeholder="Ahmed Hassan" 
                                    {...formik.getFieldProps('name')} 
                                />
                            </div>
                            {formik.touched.name && formik.errors.name && (
                                <div className="text-danger small mt-1">{formik.errors.name}</div>
                            )}
                        </div>

                        {/* EMAIL ADDRESS */}
                        <div className="mb-3">
                            <label className={styles.inputLabel}>EMAIL ADDRESS</label>
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

                        {/* PHONE NUMBER */}
                        <div className="mb-3">
                            <label className={styles.inputLabel}>PHONE NUMBER</label>
                            <div className="position-relative">
                                <Phone size={18} className={styles.innerFormIcon} />
                                <input 
                                    type="tel" 
                                    name="phone" 
                                    className={`form-control ${styles.formInputField}`}
                                    placeholder="01xxxxxxxxx" 
                                    {...formik.getFieldProps('phone')} 
                                />
                            </div>
                            {formik.touched.phone && formik.errors.phone && (
                                <div className="text-danger small mt-1">{formik.errors.phone}</div>
                            )}
                        </div>

                        {/* PASSWORD FIELDS GRID LAYER */}
                        <div className="row g-3 mb-4">
                            <div className="col-6">
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
                            <div className="col-6">
                                <label className={styles.inputLabel}>CONFIRM</label>
                                <div className="position-relative">
                                    <Lock size={18} className={styles.innerFormIcon} />
                                    <input 
                                        type="password" 
                                        name="rePassword" 
                                        className={`form-control ${styles.formInputField}`}
                                        placeholder="••••••••" 
                                        {...formik.getFieldProps('rePassword')} 
                                    />
                                </div>
                                {formik.touched.rePassword && formik.errors.rePassword && (
                                    <div className="text-danger small mt-1">{formik.errors.rePassword}</div>
                                )}
                            </div>
                        </div>

                        {/* SUBMIT */}
                        <button 
                            type="submit" 
                            disabled={isLoading} 
                            className={`btn ${styles.submitButton}`}
                        >
                            {isLoading ? (
                                <Loader2 className={styles.spinnerIcon} />
                            ) : (
                                "CREATE ACCOUNT"
                            )}
                        </button>
                    </form>

                    <p className={styles.termsAgreementFootnote}>
                        By signing up you agree to our <Link to="/terms" className={styles.inlineActionLink}>Terms</Link> and <Link to="/privacy" className={styles.inlineActionLink}>Privacy Policy</Link>
                    </p>

                    <p className={styles.switchScreenFootnote}>
                        Already have an account? <Link to="/login" className={styles.inlineActionLink}>Sign in</Link>
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
                                <h2 className={styles.boardingText}>BOARDING</h2>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}