/* Cookie Consent (minimal, GDPR-friendly)
   - No analytics loaded until user accepts
   - Consent stored in localStorage
*/

(function () {
  const KEY = "cookie_consent_v1"; // bump version if you change logic

  const banner = document.querySelector("[data-cookie-banner]");
  const btnAccept = document.querySelector("[data-cookie-accept]");
  const btnReject = document.querySelector("[data-cookie-reject]");

  function getConsent() {
    try {
      return JSON.parse(localStorage.getItem(KEY));
    } catch {
      return null;
    }
  }

  function setConsent(value) {
    localStorage.setItem(KEY, JSON.stringify(value));
  }

  // ---- Analytics loader (GA4 example) ----
  // Replace GA_MEASUREMENT_ID with your real ID, or keep null to disable.
  const GA_MEASUREMENT_ID = "G-XXXXXXXXXX"; // <-- TODO

  function loadGA4() {
    if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID === "G-XXXXXXXXXX") return;

    // Prevent double load
    if (window.__ga_loaded) return;
    window.__ga_loaded = true;

    const s1 = document.createElement("script");
    s1.async = true;
    s1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(s1);

    const s2 = document.createElement("script");
    s2.text = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GA_MEASUREMENT_ID}', { anonymize_ip: true });
    `;
    document.head.appendChild(s2);
  }

  function applyConsent(consent) {
    // consent = { analytics: true/false, ts: number }
    if (consent?.analytics === true) {
      loadGA4();
    }
  }

  function showBanner() {
    if (!banner) return;
    banner.hidden = false;
  }

  function hideBanner() {
    if (!banner) return;
    banner.hidden = true;
  }

  // Init
  const consent = getConsent();
  if (!consent) {
    showBanner();
  } else {
    applyConsent(consent);
    hideBanner();
  }

  btnAccept?.addEventListener("click", () => {
    const c = { analytics: true, ts: Date.now() };
    setConsent(c);
    applyConsent(c);
    hideBanner();
  });

  btnReject?.addEventListener("click", () => {
    const c = { analytics: false, ts: Date.now() };
    setConsent(c);
    hideBanner();
  });
})();
