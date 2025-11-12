// ===== Firebase Config =====
const firebaseConfig = {
  apiKey: "AIzaSyD8AkvBgMIX6071ZJz_pbG5pwv_MEzauSk",
  authDomain: "krishs-watchlist-vault.firebaseapp.com",
  projectId: "krishs-watchlist-vault",
  storageBucket: "krishs-watchlist-vault.firebasestorage.app",
  messagingSenderId: "1085194969409",
  appId: "1:1085194969409:web:45becd2ef6afe86e0741c0",
  measurementId: "G-C8VJHYRDTQ"
};

// ===== Initialize Firebase =====
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// ===== DOM =====
const emailField = document.getElementById("email");
const passwordField = document.getElementById("password");
const loginBtn = document.getElementById("login-btn");
const signupBtn = document.getElementById("signup-btn");
const googleBtn = document.getElementById("google-btn");
const guestBtn = document.getElementById("guest-btn");
const errorMsg = document.getElementById("error-msg");

// ===== Email/Password Login =====
loginBtn.addEventListener("click", async () => {
  const email = emailField.value.trim();
  const pw = passwordField.value.trim();
  if (!email || !pw) return showError("Please enter email and password.");
  try {
    await auth.signInWithEmailAndPassword(email, pw);
    saveUser(auth.currentUser);
  } catch (err) {
    showError(err.message);
  }
});

// ===== Sign Up =====
signupBtn.addEventListener("click", async () => {
  const email = emailField.value.trim();
  const pw = passwordField.value.trim();
  if (!email || !pw) return showError("Please enter email and password.");
  try {
    await auth.createUserWithEmailAndPassword(email, pw);
    saveUser(auth.currentUser);
  } catch (err) {
    showError(err.message);
  }
});

// ===== Google Sign In =====
googleBtn.addEventListener("click", async () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  try {
    await auth.signInWithPopup(provider);
    saveUser(auth.currentUser);
  } catch (err) {
    showError(err.message);
  }
});

// ===== Continue as Guest =====
guestBtn.addEventListener("click", () => {
  localStorage.setItem("ourshow_username", "Guest");
  localStorage.setItem("ourshow_logged_in", "false");
  window.location.href = "index.html";
});

// ===== Helper =====
function showError(msg) {
  errorMsg.textContent = msg;
  errorMsg.classList.remove("hidden");
  setTimeout(() => errorMsg.classList.add("hidden"), 4000);
}

function saveUser(user) {
  if (user) {
    localStorage.setItem("ourshow_username", user.displayName || user.email || "User");
    localStorage.setItem("ourshow_logged_in", "true");
    window.location.href = "index.html";
  }
}
