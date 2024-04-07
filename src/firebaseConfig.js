// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCeiVp5XZiYS5QHukPPbEcjuqap1S35mck",
  authDomain: "hostelms-ee287.firebaseapp.com",
  projectId: "hostelms-ee287",
  storageBucket: "hostelms-ee287.appspot.com",
  messagingSenderId: "83097968269",
  appId: "1:83097968269:web:4ee8a83b89dcbba4a94cc4",
  measurementId: "G-JBYS6TD46W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const firestore = getFirestore(app);