// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: "safepath-8c307.firebaseapp.com",
  projectId: "safepath-8c307",
  storageBucket: "safepath-8c307.firebasestorage.app",
  messagingSenderId: "140924584814",
  appId: "1:140924584814:web:5b6b8c162f83b11bebf77f",
  measurementId: "G-X81N6J3WBM",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// const analytics = getAnalytics(app);
export { db, getDoc, doc, setDoc };