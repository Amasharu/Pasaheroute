async function logoutUser() {
  try {
    const response = await fetch("/logout", {
      method: "POST",
      credentials: "include",
    });

    if (response.ok) {
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = "/Login.html";
    }
  } catch (error) {
    console.error("Logout error:", error);
  }
}

let idleTime = 0;
const idleLimit = 60; // 1 minute

function resetIdleTime() {
  idleTime = 0;
}

// Detect user activity
window.onload = resetIdleTime;
document.onmousemove = resetIdleTime;
document.onkeypress = resetIdleTime;
document.ontouchstart = resetIdleTime;
document.onclick = resetIdleTime;

// Auto-logout after idle time
setInterval(() => {
  idleTime++;
  if (idleTime >= idleLimit) {
    logoutUser(); // Call backend logout function
  }
}, 1000);
