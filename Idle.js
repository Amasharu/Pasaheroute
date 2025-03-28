document.addEventListener("DOMContentLoaded", function () {
  if (window.location.pathname.includes("main.html")) {
    let idleTimer;

    function resetTimer() {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(showLogoutModal, 180000);
    }

    function showLogoutModal() {
      if (document.getElementById("idlePopup")) return; // Prevent duplicate modals

      let modal = document.createElement("div");
      modal.id = "idlePopup";
      modal.innerHTML = `
        <div class="idle-popup-overlay">
          <div class="idle-popup-content">
            <p>You have been inactive for 3 minutes. Logging out...</p>
            <button id="logoutButton">OK</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      document.body.style.overflow = "hidden"; // Prevent scrolling

      document
        .getElementById("logoutButton")
        .addEventListener("click", function () {
          window.location.href = "Login.html";
        });
    }

    // Reset timer on user interaction
    document.addEventListener("mousemove", resetTimer);
    document.addEventListener("keydown", resetTimer);
    document.addEventListener("click", resetTimer);
    document.addEventListener("scroll", resetTimer);

    resetTimer();
  }
});
