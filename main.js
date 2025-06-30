document.addEventListener("DOMContentLoaded", async () => {
    const email = localStorage.getItem('email');

    if (!email) {
        alert("No email found. Please log in first.");
        window.location.href = "login.html";
        return;
    }

    const data = {
        query: "classification_balance",
        username: email
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

        if (response.ok && result.classification && result.balance !== undefined && result.balance !== null) {
            // Log classification and balance for debugging
            console.log("Fetched Classification: ", result.classification);
            console.log("Fetched Balance: ", result.balance);

            // Replace the values dynamically in the HTML
            document.querySelector(".balance-info h2").innerText = `₱${result.balance}`;
            document.querySelector(".balance-class").innerText = result.classification;
        
            // Store classification and balance in localStorage
            localStorage.setItem("classification", result.classification);  // Store classification
            localStorage.setItem("balance", result.balance);  // Store balance
        } else {
            document.querySelector(".reply").innerText = "Error fetching data. User not found.";
        }
        
    } catch (error) {
        alert("An error occurred: " + error.message);
        document.querySelector(".reply").innerText = "Error: " + error.message;
    }
});
