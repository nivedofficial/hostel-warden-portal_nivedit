// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCeiVp5XZiYS5QHukPPbEcjuqap1S35mck",
  authDomain: "hostelms-ee287.firebaseapp.com",
  projectId: "hostelms-ee287",
  storageBucket: "hostelms-ee287.appspot.com",
  messagingSenderId: "83097968269",
  appId: "1:83097968269:web:be0666dcfa0886bba94cc4",
  measurementId: "G-77W2JSNKYD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Export the Firebase configuration object
export { app };

// Export the Firestore instance
export const db = getFirestore(app);
