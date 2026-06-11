// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "",
  authDomain: "travel-planner-d0050.firebaseapp.com",
  projectId: "travel-planner-d0050",
  storageBucket: "travel-planner-d0050.firebasestorage.app",
  messagingSenderId: "176133657772",
  appId: "1:176133657772:web:8aa78130d3fc75ac0e7b09"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
