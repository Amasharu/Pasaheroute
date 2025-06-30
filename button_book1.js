document.addEventListener("DOMContentLoaded", function () {
    const bookNowBtn = document.getElementById("bookNowBtn");

    if (bookNowBtn) {
        bookNowBtn.addEventListener("click", async function () {
            const email = localStorage.getItem("email"); // Make sure email is stored as "email"

            if (!email) {
                alert("You're not logged in.");
                window.location.href = "login.html";
                return;
            }

            console.log("Email used for balance check:", email);

            const data = {
                query: "get_balance",
                username: email // still using 'username' as key for compatibility
            };

            try {
                const response = await fetch("http://localhost:8080/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();
                console.log("Server response:", result);

                if (result.response === "success") {
                    console.log("Current Balance: ₱" + result.current_balance);

                    // Update the <p> tag with the balance
                    const balanceElement = document.querySelector("#balanceDisplay"); // Make sure the p tag has this ID
                    if (balanceElement) {
                        balanceElement.textContent = "Load Balance: ₱" + result.current_balance;
                    }
                } else {
                    console.log("Failed to retrieve balance: " + (result.error || "Unknown error"));
                }

            } catch (error) {
                console.error("Network error:", error);
            }
        });
    }
});
