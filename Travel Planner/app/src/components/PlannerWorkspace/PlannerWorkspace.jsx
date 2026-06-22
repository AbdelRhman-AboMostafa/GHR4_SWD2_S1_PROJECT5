import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { toast } from "react-toastify";
import { auth, db } from "../../firebase";
import AIPlannerSection from "./AIPlannerSection";
import ManualPlannerSection from "./ManualPlannerSection";
import styles from "./PlannerWorkspace.module.css";

export default function PlannerWorkspace() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleAddPlan = async (planData) => {
    if (!user) {
      toast.error("Please log in to create a plan");
      navigate("/login");
      return;
    }

    try {
      await addDoc(collection(db, "aiPlans"), {
        userId: user.uid,
        input: planData.input,
        result: planData.result,
        source: planData.source || "manual",
        createdAt: serverTimestamp(),
      });
      toast.success("Plan added successfully!");
      navigate("/tripsWorkspace");
    } catch (err) {
      console.log(err);
      toast.error("Failed to add plan");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        {/* Header */}
        <div className={styles.headerSection}>
          <h1 className={styles.title}>Travel Planner</h1>
          <p className={styles.subHeader}>
            Plan your perfect trip - use AI recommendations or plan manually
          </p>
        </div>


        {/* Manual Planner Section */}
        <ManualPlannerSection onAddPlan={handleAddPlan} />

        {/* AI Planner Section */}
        <AIPlannerSection onAddPlan={handleAddPlan}  />

      </div>
    </div>
  );
}
