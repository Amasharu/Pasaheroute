document.addEventListener("DOMContentLoaded", function () {
  const eyeButton = document.querySelector(".eye-button");
  const balanceInfo = document.querySelector(".balance-info h2");

  let originalBalance = balanceInfo.innerText;
  let isHidden = true;

  // Initially hide the balance
  balanceInfo.innerText = "••••••";

  eyeButton.addEventListener("click", function () {
    if (isHidden) {
      balanceInfo.innerText = originalBalance; // Show balance
      eyeButton.innerText = "👁"; // Change icon
    } else {
      balanceInfo.innerText = "••••••"; // Hide balance
      eyeButton.innerText = "👁‍🗨"; // Change icon
    }
    isHidden = !isHidden;
  });
});
