(function () {
    const btn = document.getElementById("reset-consent");
    if (!btn) return;
  
    btn.addEventListener("click", () => {
      localStorage.removeItem("cookie_consent_v1");
      location.reload();
    });
  })();
  