// Profile Dropdown Logic
const profileBtn = document.getElementById("profile-btn");
const profileDropdown = document.getElementById("profile-dropdown");
const profileName = document.getElementById("profile-name");
const profilePic = document.getElementById("profile-pic");
const logoutBtn = document.getElementById("logout-btn");

// Toggle dropdown
if (profileBtn) {
  profileBtn.addEventListener("click", () => {
    profileDropdown.classList.toggle("hidden");
  });
}

// Close dropdown when clicking outside
document.addEventListener("click", (e) => {
  if (!profileBtn.contains(e.target) && !profileDropdown.contains(e.target)) {
    profileDropdown.classList.add("hidden");
  }
});

// Display user info
const userName = localStorage.getItem("ourshow_username") || "Guest";
const loggedIn = localStorage.getItem("ourshow_logged_in") === "true";

profileName.textContent = userName;

// Set profile photo (if Google user)
const firebaseUserJSON = localStorage.getItem("firebase:authUser");
if (firebaseUserJSON) {
  try {
    const userData = JSON.parse(firebaseUserJSON);
    if (userData.photoURL) {
      profilePic.src = userData.photoURL;
    }
  } catch {}
}

// Logout
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("ourshow_username");
  localStorage.removeItem("ourshow_logged_in");
  localStorage.removeItem("firebase:authUser");
  window.location.href = "login.html";
});
