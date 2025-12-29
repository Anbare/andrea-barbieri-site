// =========================
// Minimal JS: mobile nav + year
// =========================
const btn = document.getElementById("burgerBtn");
const links = document.getElementById("navLinks");

btn?.addEventListener("click", () => {
  const open = links?.classList.toggle("is-open");
  btn.setAttribute("aria-expanded", String(Boolean(open)));
});

// Close mobile nav on link click (UX)
links?.querySelectorAll("a")?.forEach((a) => {
  a.addEventListener("click", () => {
    links.classList.remove("is-open");
    btn?.setAttribute("aria-expanded", "false");
  });
});

// Year (NO optional chaining on assignment)
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

// =========================
// Google Consent Mode (default denied) — future-proof
// Note: with `defer` this runs after HTML parsing.
// For the earliest "ASAP" behavior, move ONLY the default-consent snippet inline in <head>.
// =========================
function setDefaultConsentDenied() {
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = window.gtag || gtag;

  // Default: deny before any choice
  window.gtag("consent", "default", {
    analytics_storage: "denied",
    wait_for_update: 500,

    // (Future-proof) Ads related signals — keep denied unless you actually use Ads
    // ad_storage: "denied",
    // ad_user_data: "denied",
    // ad_personalization: "denied",
  });
}
setDefaultConsentDenied();

// =========================
// GA4 loader (conditional)
// Loads only if analytics consent is granted
// =========================
const GA4_ID = "G-6M539YXSDQ";
let __ga4Loaded = false;

function loadGA4() {
  if (__ga4Loaded) return;
  if (!GA4_ID || GA4_ID === "G-XXXXXXXXXX") return;

  __ga4Loaded = true;

  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
  }

  window.gtag("js", new Date());

  window.gtag("config", GA4_ID, {
    anonymize_ip: true,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });
}

// =========================
// Cookie consent (minimal, future-proof)
// =========================
(function cookieConsent() {
  const STORAGE_KEY = "ab_cookie_consent_v1";

  const banner = document.getElementById("cookieBanner");
  const panel = document.getElementById("cookiePanel");

  const acceptBtn = document.getElementById("cookieAcceptBtn");
  const prefsBtn = document.getElementById("cookiePrefsBtn");

  const saveBtn = document.getElementById("cookieSaveBtn");
  const rejectBtn = document.getElementById("cookieRejectBtn");

  const analyticsToggle = document.getElementById("cookieAnalyticsToggle");

  // If page doesn't have banner/panel, do nothing (safe for all pages)
  if (!banner || !panel) return;

  let lastFocus = null;

  const read = () => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    } catch {
      return null;
    }
  };

  const write = (value) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  };

  const hideBanner = () => {
    banner.hidden = true;
  };
  const showBanner = () => {
    banner.hidden = false;
  };

  const openPanel = () => {
    // Hide banner while panel is open (better UX on mobile)
    hideBanner();

    // Focus management
    lastFocus = document.activeElement;

    panel.hidden = false;

    // Focus "Salva preferenze" (minimal but effective)
    saveBtn?.focus();
  };

  const closePanel = () => {
    panel.hidden = true;

    // If no consent saved, restore banner
    const current = read();
    if (!current) showBanner();

    // Restore focus to where the user was
    lastFocus?.focus?.();
    lastFocus = null;
  };

  const applyConsent = (consent) => {
    window.__cookieConsent = consent;

    // Always update consent mode (queued in dataLayer even if GA isn't loaded yet)
    window.gtag("consent", "update", {
      analytics_storage: consent?.analytics ? "granted" : "denied",
    });

    // Load GA4 only if analytics consent granted
    if (consent?.analytics === true) {
      loadGA4();
    }
  };

  // Initial state
  const existing = read();
  if (!existing) {
    showBanner();
  } else {
    hideBanner();
    applyConsent(existing);
  }

  // Actions
  acceptBtn?.addEventListener("click", () => {
    const consent = { necessary: true, analytics: true, ts: Date.now() };
    write(consent);
    hideBanner();
    applyConsent(consent);
  });

  prefsBtn?.addEventListener("click", () => {
    const current = read();
    if (analyticsToggle) {
      analyticsToggle.checked = Boolean(current?.analytics);
    }
    openPanel();
  });

  saveBtn?.addEventListener("click", () => {
    const consent = {
      necessary: true,
      analytics: Boolean(analyticsToggle?.checked),
      ts: Date.now(),
    };
    write(consent);
    closePanel();
    hideBanner();
    applyConsent(consent);
  });

  rejectBtn?.addEventListener("click", () => {
    const consent = { necessary: true, analytics: false, ts: Date.now() };
    write(consent);
    closePanel();
    hideBanner();
    applyConsent(consent);
  });

  // Close panel on click outside
  panel.addEventListener("click", (e) => {
    if (e.target === panel) closePanel();
  });

  // Close panel on ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !panel.hidden) closePanel();
  });
})();
