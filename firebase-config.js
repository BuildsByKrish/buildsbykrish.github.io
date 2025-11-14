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
async function loadScript(url, timeout = 8000) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = url;
    s.async = true;
    const t = setTimeout(() => {
      s.onerror = s.onload = null;
      reject(new Error('Timeout loading ' + url));
    }, timeout);
    s.onload = () => { clearTimeout(t); resolve(); };
    s.onerror = (e) => { clearTimeout(t); reject(e || new Error('Failed to load ' + url)); };
    document.head.appendChild(s);
  });
}

async function initFirebaseWithDynamicLoad() {
  if (typeof window.firebase !== 'undefined' && window.firebase && window.firebase.initializeApp) {
    // already available
    try { firebase.initializeApp(FIREBASE_CONFIG); } catch (e) {}
    window.FIREBASE_AVAILABLE = true;
    window.db = firebase.database ? firebase.database() : null;
    window.auth = firebase.auth ? firebase.auth() : null;
    return;
  }

  const urls = [
    'https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js',
    'https://www.gstatic.com/firebasejs/9.23.0/firebase-auth-compat.js',
    'https://www.gstatic.com/firebasejs/9.23.0/firebase-database-compat.js'
  ];

  try {
    for (const u of urls) await loadScript(u, 7000);
    // initialize
    if (firebase && (!firebase.apps || firebase.apps.length === 0)) {
      firebase.initializeApp(FIREBASE_CONFIG);
    }
    window.FIREBASE_AVAILABLE = true;
    window.db = firebase.database ? firebase.database() : null;
    window.auth = firebase.auth ? firebase.auth() : null;
    console.log('Firebase SDK loaded and initialized');
    // notify any listeners waiting for firebase
    try { (window._onFirebaseReady || []).forEach(cb => { try { cb(); } catch(e){} }); } catch(e){}
  } catch (e) {
    console.warn('Firebase SDK failed to load from CDN. Falling back to safe stub.', e);
    window.firebase = createFirebaseStub();
    window.FIREBASE_AVAILABLE = false;
    window.db = firebase.database ? firebase.database() : null;
    window.auth = firebase.auth ? firebase.auth() : null;
  }
}

// Start initialization immediately
initFirebaseWithDynamicLoad();

// Simple callback registry for code that needs to run after Firebase is ready.
window._onFirebaseReady = window._onFirebaseReady || [];
window.onFirebaseReady = function(cb){
  if (window.FIREBASE_AVAILABLE) {
    try { cb(); } catch(e){}
  } else {
    window._onFirebaseReady.push(cb);
  }
};
