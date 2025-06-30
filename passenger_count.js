document.addEventListener("DOMContentLoaded", () => {
    const seatCount = localStorage.getItem("passengerSeat") || 0;
  
    const passengerDisplay = document.querySelector(".add_1");
  
    if (passengerDisplay) {
      passengerDisplay.textContent = `${seatCount}/10`;
    }
  
    console.log("Live Location Passenger Count (.add_1 only):", seatCount);
  });
  