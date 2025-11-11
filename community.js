// ====== Firebase Config ======
const firebaseConfig = {
  apiKey: "AIzaSyD8AkvBgMIX6071ZJz_pbG5pwv_MEzauSk",
  authDomain: "krishs-watchlist-vault.firebaseapp.com",
  projectId: "krishs-watchlist-vault",
  storageBucket: "krishs-watchlist-vault.firebasestorage.app",
  messagingSenderId: "1085194969409",
  appId: "1:1085194969409:web:45becd2ef6afe86e0741c0",
  measurementId: "G-C8VJHYRDTQ",
  databaseURL: "https://krishs-watchlist-vault-default-rtdb.asia-southeast1.firebasedatabase.app"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// ====== DOM Elements ======
const chatBox = document.getElementById("chat-box");
const messageInput = document.getElementById("message-input");
const sendBtn = document.getElementById("send-btn");
const nameModal = document.getElementById("name-modal");
const nameInput = document.getElementById("name-input");
const saveNameBtn = document.getElementById("save-name");

let username = localStorage.getItem("ourshow_username");

// ====== Ask for Name ======
if (!username) {
  nameModal.classList.remove("hidden");
  saveNameBtn.addEventListener("click", () => {
    const name = nameInput.value.trim();
    username = name || "Anonymous";
    localStorage.setItem("ourshow_username", username);
    nameModal.classList.add("hidden");
  });
}

// ====== Send Message ======
sendBtn.addEventListener("click", sendMessage);
messageInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

function sendMessage() {
  const text = messageInput.value.trim();
  if (text === "") return;

  const message = {
    name: username || "Anonymous",
    text,
    timestamp: Date.now()
  };

  db.ref("globalChat").push(message); // ✅ Simpler path
  messageInput.value = "";
  stopTyping();
}

// ====== Display Messages ======
db.ref("globalChat").on("child_added", (snapshot) => {
  const msg = snapshot.val();
  displayMessage(msg);
});

function displayMessage(msg) {
  const time = new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const msgDiv = document.createElement("div");

  // Different color for your own messages
  const isOwn = msg.name === username;
  msgDiv.className = `p-3 rounded-md ${
    isOwn ? "bg-red-700 text-white self-end ml-auto" : "bg-gray-700 text-white"
  }`;

  msgDiv.innerHTML = `
    <p class="text-sm mb-1">
      <span class="font-semibold ${isOwn ? "text-white" : "text-red-400"}">${msg.name}</span>
      <span class="text-gray-400 text-xs ml-2">${time}</span>
    </p>
    <p class="text-sm">${msg.text}</p>
  `;
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// ====== Typing Indicator ======
const typingRef = db.ref("typing");
const typingIndicator = document.createElement("p");
typingIndicator.className = "text-gray-400 text-sm mt-2 italic hidden";
typingIndicator.id = "typing-indicator";
chatBox.parentElement.appendChild(typingIndicator);

let typingTimeout;

messageInput.addEventListener("input", () => {
  setTypingStatus(true);
  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => setTypingStatus(false), 3000);
});

function setTypingStatus(isTyping) {
  if (!username) return;
  const userTypingRef = typingRef.child(username);
  if (isTyping) {
    userTypingRef.set(true);
    userTypingRef.onDisconnect().remove();
  } else {
    userTypingRef.remove();
  }
}

function stopTyping() {
  setTypingStatus(false);
}

typingRef.on("value", (snapshot) => {
  const typingUsers = snapshot.val();
  if (typingUsers) {
    const activeUsers = Object.keys(typingUsers).filter(u => u !== username);
    if (activeUsers.length > 0) {
      typingIndicator.textContent = `💬 ${activeUsers.join(", ")} ${activeUsers.length === 1 ? "is" : "are"} typing...`;
      typingIndicator.classList.remove("hidden");
    } else {
      typingIndicator.classList.add("hidden");
    }
  } else {
    typingIndicator.classList.add("hidden");
  }
});
