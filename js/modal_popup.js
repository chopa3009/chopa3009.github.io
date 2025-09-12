document.addEventListener("DOMContentLoaded", function() {
      // Load modal popup
  fetch("modal_popup.html")
    .then(r => r.text())
    .then(data => document.getElementById("modal-popup").innerHTML = data)
    .catch(err => console.error("Modal popup load error:", err));
});