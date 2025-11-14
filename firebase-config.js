// firebase-config.js
// Robust Firebase initializer. Include this BEFORE `prototype.js` on every page.
// This file handles the case where the Firebase CDN fails (503) by creating
// a minimal safe stub so the rest of the app does not throw ReferenceErrors.

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

// Helper to create a lightweight stub of Firebase APIs used by the app.
function createFirebaseStub() {
  const noop = () => {};
  const asyncNoop = async () => {};

  const stubSnapshot = {
    exists: () => false,
    val: () => null,
  };

  const stubQuery = {
    get: async () => stubSnapshot,
    orderByChild: () => ({ limitToLast: () => ({ get: async () => stubSnapshot }) })
  };

  const stubRef = {
    set: asyncNoop,
    remove: asyncNoop,
    get: async () => stubSnapshot,
    push: () => ({ key: 'stub' })
  };

  const firebaseStub = {
    apps: [],
    initializeApp: noop,
    auth: () => ({
      onAuthStateChanged: (cb) => { /* no-op */ },
      signOut: async () => Promise.resolve()
    }),
    database: () => ({
      ref: () => stubRef,
      ServerValue: { TIMESTAMP: Date.now() }
    }),
  };

  return firebaseStub;
}

// Attempt to dynamically load Firebase SDKs (compat build). If loading fails
// within the timeout, fall back to a safe stub so the app doesn't crash.
// NOTE: Currently DISABLED due to Firebase CDN 503 errors.
// We will use the stub immediately to let the app load without waiting for Firebase.

// Skip Firebase CDN loading; create stub immediately
window.firebase = createFirebaseStub();
window.FIREBASE_AVAILABLE = false;
window.db = window.firebase.database ? window.firebase.database() : null;
window.auth = window.firebase.auth ? window.firebase.auth() : null;

console.warn('Firebase SDK unavailable (CDN disabled). Using safe stub. Auth/watchlist features disabled.');

// Stub callback registry for compatibility
window._onFirebaseReady = [];
window.onFirebaseReady = function(cb){
  try { cb(); } catch(e){}
};
