// ================== FIREBASE CONFIG ==================
const firebaseConfig = {
  apiKey: "AIzaSyD8AkvBgMIX6071ZJz_pbG5pwv_MEzauSk",
  authDomain: "krishs-watchlist-vault.firebaseapp.com",
  databaseURL: "https://krishs-watchlist-vault-default-rtdb.firebaseio.com",
  projectId: "krishs-watchlist-vault",
  storageBucket: "krishs-watchlist-vault.appspot.com",
  messagingSenderId: "1085194969409",
  appId: "1:1085194969409:web:45becd2ef6afe86e0741c0"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// ================== GLOBAL CHAT ==================
const globalChat = document.getElementById("global-chat");
const globalInput = document.getElementById("global-input");

// Send message
globalInput.addEventListener("keypress", e=>{
  if(e.key==="Enter" && e.target.value.trim()!==""){
    const msg = { text: e.target.value.trim(), time: Date.now() };
    db.ref("global_chat").push(msg);
    e.target.value="";
  }
});

// Listen for messages
db.ref("global_chat").on("value", snapshot=>{
  const msgs = snapshot.val() || {};
  globalChat.innerHTML="";
  Object.values(msgs).forEach(m=>{
    const div=document.createElement("div");
    div.className="mb-1";
    div.textContent=m.text;
    globalChat.appendChild(div);
  });
  globalChat.scrollTop = globalChat.scrollHeight;
});

// ================== PER-MOVIE CHAT ==================
const movieChat = document.getElementById("movie-chat");
const movieInput = document.getElementById("movie-input");
const movieIdInput = document.getElementById("movie-id-input");

let currentMovieId = null;

movieIdInput.addEventListener("keypress", e=>{
  if(e.key==="Enter" && e.target.value.trim()!==""){
    currentMovieId = e.target.value.trim();
    loadMovieChat(currentMovieId);
  }
});

movieInput.addEventListener("keypress", e=>{
  if(e.key==="Enter" && e.target.value.trim()!=="" && currentMovieId){
    const msg = { text: e.target.value.trim(), time: Date.now() };
    db.ref(`movie_chat/${currentMovieId}`).push(msg);
    e.target.value="";
  }
});

function loadMovieChat(movieId){
  db.ref(`movie_chat/${movieId}`).on("value", snapshot=>{
    const msgs = snapshot.val() || {};
    movieChat.innerHTML="";
    Object.values(msgs).forEach(m=>{
      const div=document.createElement("div");
      div.className="mb-1";
      div.textContent=m.text;
      movieChat.appendChild(div);
    });
    movieChat.scrollTop = movieChat.scrollHeight;
  });
}
