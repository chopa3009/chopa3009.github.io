import React from 'react';
import styles from "../css/AdminHeader.module.css";
import { db } from "../js/firebase";
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
  query,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";

const AdminHeader = ({ search, setSearch }) => {
    const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
      const handleLogout = () => signOut(auth);
  return (

<div className={styles.header}>
  <span className={styles.greeting}>Вітаю, Адміне!</span>
 <input
        type="text"
        placeholder="Пошук..."
        className={styles.searchInput}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
  <button className={styles.logoutButton} onClick={handleLogout}>Вийти</button>
</div>

);
};

export default AdminHeader;