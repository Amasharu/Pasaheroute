document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.getElementById("logoutBtn");
  
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        // Clear stored session data
        localStorage.removeItem("email");
        localStorage.removeItem("classification");
        localStorage.removeItem("passengerSeat");
  
        alert("You have been logged out.");
  
        // Redirect to login page
        window.location.href = "login.html";
      });
    }
  });
  