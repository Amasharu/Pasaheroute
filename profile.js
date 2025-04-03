document.addEventListener("DOMContentLoaded", function () {
  let profilePic = document.getElementById("profile-pic");
  let inputFile = document.getElementById("input-file");

  if (profilePic && inputFile) {
    inputFile.onchange = function () {
      profilePic.src = URL.createObjectURL(inputFile.files[0]);
    };
  } else {
    console.error("Profile picture or file input not found.");
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const storedUserData = JSON.parse(localStorage.getItem("userData"));

  if (storedUserData && storedUserData.firstName && storedUserData.lastName) {
    const profileName = document.querySelector(".profile h2");
    if (profileName) {
      profileName.textContent = `${storedUserData.firstName} ${storedUserData.lastName}`;
    }
  }
});
