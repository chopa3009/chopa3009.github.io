// src/firebase.js
// Сучасний (modular) SDK
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// ===== Firebase config =====
const firebaseConfig = {
  apiKey: "AIzaSyD2rkpPXqqwYQ4JctT8Gu6E6mIytoJqPGo",
  authDomain: "bove-948cf.firebaseapp.com",
  projectId: "bove-948cf",
  storageBucket: "bove-948cf.appspot.com",
  messagingSenderId: "36414468939",
  appId: "1:36414468939:web:2907567ba0986373482ece",
  measurementId: "G-QH31QNJXWF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firestore db
export const db = getFirestore(app);
