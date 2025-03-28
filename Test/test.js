const profileImage = document.getElementById("profileImage");
const fileInput = document.getElementById("fileInput");

// Load saved image from localStorage
window.addEventListener("load", () => {
  const savedImage = localStorage.getItem("profileImage");
  if (savedImage) {
    profileImage.src = savedImage;
  }
});

fileInput.addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      profileImage.src = e.target.result;
      localStorage.setItem("profileImage", e.target.result); // Save image to localStorage
    };
    reader.readAsDataURL(file);
  }
});
