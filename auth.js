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

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

const emailField = document.getElementById("email");
const passwordField = document.getElementById("password");
const loginBtn = document.getElementById("login-btn");
const signupBtn = document.getElementById("signup-btn");
const googleBtn = document.getElementById("google-btn");
const errorMsg = document.getElementById("error-msg");

// ====== Email/Password Login ======
loginBtn.addEventListener("click", async () => {
  const email = emailField.value.trim();
  const pw = passwordField.value.trim();
  if (!email || !pw) return showError("Please enter email and password.");
  try {
    await auth.signInWithEmailAndPassword(email, pw);
    redirectToCommunity();
  } catch (err) {
    showError(err.message);
  }
});

// ====== Sign Up ======
signupBtn.addEventListener("click", async () => {
  const email = emailField.value.trim();
  const pw = passwordField.value.trim();
  if (!email || !pw) return showError("Please enter email and password.");
  try {
    await auth.createUserWithEmailAndPassword(email, pw);
    redirectToCommunity();
  } catch (err) {
    showError(err.message);
  }
});

// ====== Google Sign In ======
googleBtn.addEventListener("click", async () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  try {
    await auth.signInWithPopup(provider);
    redirectToCommunity();
  } catch (err) {
    showError(err.message);
  }
});

// ====== Helper Functions ======
function showError(msg) {
  errorMsg.textContent = msg;
  errorMsg.classList.remove("hidden");
  setTimeout(() => errorMsg.classList.add("hidden"), 4000);
}

function redirectToCommunity() {
  const user = auth.currentUser;
  if (user) {
    localStorage.setItem("ourshow_username", user.displayName || user.email);
    window.location.href = "community.html";
  }
}
