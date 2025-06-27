// 📨 Suggestion Form Handler
document.getElementById("suggestForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const title = document.getElementById("suggestTitle").value.trim();
  const genre = document.getElementById("suggestGenre").value.trim();
  const suggestedBy = document.getElementById("suggestBy").value.trim() || "Anonymous";
  const timestamp = new Date().toISOString();

  const suggestion = { title, genre, suggestedBy, timestamp };

  const suggestions = JSON.parse(localStorage.getItem("suggestions") || "[]");
  suggestions.push(suggestion);
  localStorage.setItem("suggestions", JSON.stringify(suggestions));

  document.getElementById("suggestForm").reset();
  document.getElementById("suggestionSuccess").style.display = "block";
  setTimeout(() => document.getElementById("suggestionSuccess").style.display = "none", 3000);
  renderSuggestions();
});

// 📜 Render Suggestions
function renderSuggestions() {
  const list = document.getElementById("suggestionList");
  if (!list) return;
  const suggestions = JSON.parse(localStorage.getItem("suggestions") || "[]");

  if (!suggestions.length) {
    list.innerHTML = `<li style="color:#888;">No suggestions yet. Be the first to add one!</li>`;
    return;
  }

  list.innerHTML = suggestions.map(s => `
    <li>
      <strong>${s.title}</strong> (${s.genre}) — suggested by ${s.suggestedBy} <br>
      <small style="color:#888;">📅 ${new Date(s.timestamp).toLocaleString()}</small>
    </li>
  `).reverse().join("");
}

// 🔐 Admin Unlock
function checkAdmin() {
  const code = document.getElementById("adminCode").value;
  if (code === "krishmasterkey") {
    document.getElementById("creatorPanel").style.display = "block";
    renderSuggestions();
  } else {
    alert("Access denied 😶‍🌫️");
  }
}

// 💾 Export Functions
function exportSuggestions() {
  const data = localStorage.getItem("suggestions") || "[]";
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "suggestions.json";
  a.click();
  URL.revokeObjectURL(url);
}

function exportCSV() {
  const suggestions = JSON.parse(localStorage.getItem("suggestions") || "[]");
  if (!suggestions.length) {
    alert("No suggestions to export!");
    return;
  }

  const header = "Title,Genre,Suggested By,Timestamp\n";
  const rows = suggestions.map(s =>
    `"${s.title}","${s.genre}","${s.suggestedBy || "Anonymous"}","${s.timestamp}"`
  ).join("\n");

  const blob = new Blob([header + rows], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "suggestions.csv";
  a.click();
  URL.revokeObjectURL(url);
}