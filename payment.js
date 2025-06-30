document.addEventListener("DOMContentLoaded", function () {
    const confirmBtn = document.querySelector(".confirm-btn");

    if (confirmBtn) {
        confirmBtn.addEventListener("click", async function () {
            // Increment passengerSeat in localStorage
            let currentSeat = parseInt(localStorage.getItem("passengerSeat")) || 0;
            currentSeat += 1;
            localStorage.setItem("passengerSeat", currentSeat);
            console.log("Passenger Seat Count:", currentSeat);

            // Update the HTML element with the updated seat count
            const passengerCountElement = document.querySelector('.add_1');
            if (passengerCountElement) {
                passengerCountElement.textContent = `${currentSeat}/10`; // Set the seat count dynamically
            }

            // Continue with your existing code for booking and balance handling
            const email = localStorage.getItem("email");
            if (!email) {
                alert("You're not logged in.");
                window.location.href = "login.html";
                return;
            }

            // Get classification and determine deduction
            const classification = localStorage.getItem("classification");
            let deductAmount;

            // Ensure the classification is valid
            if (!classification) {
                console.error("Classification is missing. Applying default deduction.");
                deductAmount = -70;  // Fallback deduction for missing classification
            } else {
                switch (classification.toLowerCase()) {
                    case "regular":
                        deductAmount = -70;
                        break;
                    case "senior":
                    case "student":
                        deductAmount = -50;
                        break;
                    default:
                        deductAmount = -70; // Fallback if class is unrecognized
                        console.warn("Unknown classification, defaulting deduction to ₱70");
                }
            }

            console.log("Classification:", classification);
            console.log("Deducting:", Math.abs(deductAmount));

            const data = {
                query: "update_load_balance",
                username: email, // still use `username` as the backend expects it
                load_balance: deductAmount
            };

            try {
                const response = await fetch("http://localhost:8080/", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (result.response === "success") {
                    // Display the new balance in the console
                    console.log("Booking successful! New balance: ₱" + result.new_balance);
                    alert("Booking successful! New balance: ₱" + result.new_balance); // Also show it in alert
                } else {
                    console.log("Booking failed: " + (result.error || "Unknown error"));
                    alert("Booking failed: " + (result.error || "Unknown error"));
                }
            } catch (error) {
                console.log("Network error: " + error.message);
                alert("Network error: " + error.message);
            }
        });
    }
});
