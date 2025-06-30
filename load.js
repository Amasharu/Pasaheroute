document.addEventListener("DOMContentLoaded", async () => {
    const email = localStorage.getItem('email');

    if (!email) {
        alert("No email found. Please log in first.");
        window.location.href = "login.html";
        return;
    }

    const submitBtn = document.querySelector('.submit-btn');
    const amountInput = document.getElementById('amount');

    if (submitBtn && amountInput) {
        submitBtn.addEventListener('click', async () => {
            const amount = amountInput.value;

            if (!amount || isNaN(amount) || amount <= 0) {
                alert("Please enter a valid amount.");
                return;
            }

            const data = {
                query: "update_load_balance",
                username: email,
                load_balance: amount
            };

            try {
                console.log("Updating load balance for email:", email);
                const response = await fetch("http://localhost:8080/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();
                console.log("Result:", result);

                if (response.ok && result.response === "success") {
                    alert("Load balance updated successfully.");
                    amountInput.value = '';
                } else {
                    alert("Failed to update load balance.");
                }
            } catch (error) {
                console.error("Error:", error);
                alert("An error occurred: " + error.message);
            }
        });
    } else {
        console.error("Submit button or amount input element not found.");
    }
});
