document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("bookNowBtn");
  
    if (!button) return;
  
    const popover = document.createElement("div");
    popover.className = "popover-box";
    popover.innerHTML = `
      <p>Are you sure you want to confirm this trip?</p>
      <p id="balanceDisplay">Load Balance: ₱</p> <!-- Add this line for the load balance -->
      <p>Price: ₱70</p> <!-- Add this line for the price -->
      <button class="confirm-btn">Confirm</button>
      <div class="img_qr" style="display: none;">
        <img alt='Barcode Generator TEC-IT'
             src='https://barcode.tec-it.com/barcode.ashx?data=6394699922144&code=DataMatrix&translate-esc=on'/>
      </div>
    `;
  
    const modalContent = button.closest(".modal-content");
    modalContent.style.position = "relative";
    modalContent.appendChild(popover);
  
    const confirmBtn = popover.querySelector(".confirm-btn");
    const qrDiv = popover.querySelector(".img_qr");
  
    button.addEventListener("click", () => {
      const popoverWidth = 220;
      const left = button.offsetLeft + button.offsetWidth / 2 - popoverWidth / 2;
  
      popover.style.position = "absolute";
      popover.style.top = `${button.offsetTop + button.offsetHeight + 10}px`;
      popover.style.left = `${Math.max(0, Math.min(left, modalContent.offsetWidth - popoverWidth))}px`;
      popover.style.display = "block";
  
      // Reset on reopen
      qrDiv.style.display = "none";
      confirmBtn.style.display = "inline-block";
    });
  
    confirmBtn.addEventListener("click", () => {
      qrDiv.style.display = "block";
      confirmBtn.style.display = "none";
    });
  
    window.addEventListener("click", (e) => {
      if (!button.contains(e.target) && !popover.contains(e.target)) {
        popover.style.display = "none";
        qrDiv.style.display = "none";
        confirmBtn.style.display = "inline-block"; // restore confirm button on outside click
      }
    });
  });
  