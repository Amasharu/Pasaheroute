document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".form");
  
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
  
      const data = {
        classification: document.querySelector("#classification").value,
        firstName: document.querySelector("#firstName").value.trim(),
        lastName: document.querySelector("#lastName").value.trim(),
        birthday: form.querySelector("input[type='date']").value,
        email: document.querySelector("#email").value.trim(),
        phone: document.querySelector("#phone").value.trim(),
        password: document.querySelector("#password").value.trim(),
        load_balance: 0
      };
  
      try {
        const response = await fetch("/save-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });
  
        if (response.ok) {
          const message = await response.text();
          alert(message);
          window.location.href = "Login.html";
          console.log("Classification:", result.classification);
          console.log("Firstname:", result.firstname);
          console.log("Lastname:", result.lastname);
          console.log("Birthday:", result.birthday);
          console.log("Email:", result.email);
          console.log("Phone:", result.phone);
        } else {
          const error = await response.text();
          alert("Error: " + error);
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Something went wrong. Please try again.");
      }
    });
  });
  