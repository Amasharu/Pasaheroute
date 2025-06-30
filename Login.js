document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".form");
  
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
  
      const email = document.querySelector("#email").value.trim();
      const password = document.querySelector("#password").value.trim();
  
      if (!email || !password) {
        document.getElementById("reply").innerText = "Please enter both email and password.";
        return;
      }
  
      const data = {
        action: "login",
        username: email,
        password: password
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
  
        if (response.ok && result.response === "success") {
          alert("Login successful!");
          // Redirect to dashboard or homepage
          window.location.href = "main.html";
        } else {
          alert("Login failed! Invalid email or password.");
          document.getElementById("reply").innerText = "Invalid email or password.";
        }
      } catch (error) {
        alert("An error occurred: " + error.message);
        document.getElementById("reply").innerText = "Error: " + error.message;
      }
    });
  });
  