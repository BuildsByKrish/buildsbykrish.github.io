// firebase-config.js
// Single Firebase initializer (regional DB URL). Include this BEFORE prototype.js on every page.

if (!window.firebase) {
  console.error("Firebase SDK not loaded. Make sure firebase-app-compat.js is included first.");
}

// Replace these values only if your Firebase project values differ.
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyD8AkvBgMIX6071ZJz_pbG5pwv_MEzauSk",
  authDomain: "krishs-watchlist-vault.firebaseapp.com",
  databaseURL: "https://krishs-watchlist-vault-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "krishs-watchlist-vault",
  storageBucket: "krishs-watchlist-vault.appspot.com",
  messagingSenderId: "1085194969409",
  appId: "1:1085194969409:web:45becd2ef6afe86e0741c0"
};

if (!firebase.apps.length) {
  firebase.initializeApp(FIREBASE_CONFIG);
}
const db = firebase.database();
const auth = firebase.auth();
