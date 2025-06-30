document.addEventListener("DOMContentLoaded", async () => {
    // Get the email from localStorage
    const email = localStorage.getItem('email');
    
    if (!email) {
        alert("No email found. Please log in first.");
        window.location.href = "login.html"; // Redirect to login page if no email is found
        return;
    }

    const data = {
        query: "account_info",
        username: email
    };

    try {
        // Fetch data from the server
        console.log("Fetching account info for email:", email);
        const response = await fetch("http://localhost:8080/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        // Handle response
        const result = await response.json();
        console.log("Result:", result);

        // Check if response is successful
        if (response.ok && result.classification) {
            console.log("Populating form fields...");

            // Log and populate form fields
            console.log("First Name:", result.firstname);
            console.log("Last Name:", result.lastname);
            console.log("Email:", result.email);
            console.log("Birthday:", result.birthday);
            console.log("Contact Number:", result.phone);
            console.log("Classification:", result.classification);

            // Format the birthday into yyyy-MM-dd format
            const formattedBirthday = formatDate(result.birthday);

            // Populate the form fields with fetched data
            document.querySelector('input[placeholder="First Name"]').value = result.firstname;
            document.querySelector('input[placeholder="Last Name"]').value = result.lastname;
            document.querySelector('input[placeholder="Email"]').value = result.email;
            document.querySelector('input[placeholder="Birthday"]').value = formattedBirthday;
            document.querySelector('input[placeholder="Contact number"]').value = result.phone;
            document.querySelector('input[placeholder="Classification"]').value = result.classification;
        } else {
            alert("Error fetching account info.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred: " + error.message);
    }
});

// Function to format the date into yyyy-MM-dd format
function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
