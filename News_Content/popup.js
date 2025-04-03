document.addEventListener("DOMContentLoaded", function () {
  const buttons = document.querySelectorAll(".card-button");

  buttons.forEach((button) => {
    button.addEventListener("click", function () {
      const modalId = this.getAttribute("data-modal"); // Get the modal ID from the button
      moveModalToBody(modalId);
      openModal(modalId);
    });
  });
});

function moveModalToBody(id) {
  const modal = document.getElementById(id);
  if (modal && !document.body.contains(modal)) {
    document.body.appendChild(modal); // Move modal to body
  }
}

function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;

  document.body.appendChild(modal); // Ensure modal is inside <body>
  modal.classList.add("active");
  document.body.style.overflow = "hidden"; // Disable scrolling

  // Ensure close button works
  const closeButton = modal.querySelector(".modal-close");
  if (closeButton) {
    closeButton.onclick = function () {
      closeModal(id);
    };
  }

  // Close when clicking outside the modal
  modal.addEventListener("click", function (event) {
    if (event.target.classList.contains("modal-overlay")) {
      closeModal(id);
    }
  });
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;

  modal.classList.remove("active");
  document.body.style.overflow = ""; // Restore scrolling
}
