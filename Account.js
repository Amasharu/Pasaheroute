document.addEventListener("DOMContentLoaded", function () {
  // Handle Sign-Up Form
  if (document.title.includes("Sign Up")) {
    const signUpForm = document.querySelector(".form");

    signUpForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const firstName = signUpForm
        .querySelector("input[placeholder='First Name']")
        .value.trim();
      const lastName = signUpForm
        .querySelector("input[placeholder='Last Name']")
        .value.trim();
      const email = signUpForm
        .querySelector("input[placeholder='Email']")
        .value.trim();
      const password = signUpForm
        .querySelector("input[placeholder='Password']")
        .value.trim();
      const confirmPassword = signUpForm
        .querySelector("input[placeholder='Confirm Password']")
        .value.trim();

      if (!firstName || !lastName || !email || !password || !confirmPassword) {
        alert("All fields are required.");
        return;
      }

      if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
      }

      const userData = {
        firstName,
        lastName,
        email,
        password,
      };

      localStorage.setItem("userData", JSON.stringify(userData));
      alert("Account created successfully! You can now log in.");
      window.location.href = "Login.html";
    });
  }

  // Handle Login Form
  if (document.title.includes("Login")) {
    const loginForm = document.querySelector(".form");

    if (loginForm) {
      loginForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const email = loginForm
          .querySelector("input[placeholder='Email']")
          .value.trim();
        const password = loginForm
          .querySelector("input[placeholder='Password']")
          .value.trim();

        const storedUserData = JSON.parse(localStorage.getItem("userData"));

        if (!email || !password) {
          alert("Please fill in all fields.");
          return;
        }

        if (
          storedUserData &&
          email === storedUserData.email &&
          password === storedUserData.password
        ) {
          alert("Login successful! Redirecting...");
          window.location.href = "main.html"; // Redirect after successful login
        } else {
          alert("Invalid email or password.");
        }
      });
    }
  }
});
