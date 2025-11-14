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

// If the real firebase object is not present (CDN failed), create a stub so
// the rest of the code can run without throwing ReferenceError.
if (typeof window.firebase === 'undefined') {
  console.warn('Firebase SDK not loaded (CDN failed). Creating safe stub for development.');
  window.firebase = createFirebaseStub();
  window.FIREBASE_AVAILABLE = false;
} else {
  window.FIREBASE_AVAILABLE = true;
}

// Initialize real Firebase if available; otherwise the stub will no-op.
try {
  if (window.FIREBASE_AVAILABLE && (!firebase.apps || firebase.apps.length === 0)) {
    firebase.initializeApp(FIREBASE_CONFIG);
  }
} catch (e) {
  console.error('Error initializing Firebase (this may be expected in offline/dev):', e);
  // Ensure we still have a stub to avoid runtime errors
  if (!window.firebase) window.firebase = createFirebaseStub();
  window.FIREBASE_AVAILABLE = false;
}

// Expose convenient aliases used by the app
try {
  window.db = firebase.database ? firebase.database() : null;
  window.auth = firebase.auth ? firebase.auth() : null;
} catch (e) {
  window.db = null;
  window.auth = null;
}
