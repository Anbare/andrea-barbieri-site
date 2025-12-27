// Minimal JS: mobile nav + year
const btn = document.getElementById("burgerBtn");
const links = document.getElementById("navLinks");
btn?.addEventListener("click", () => {
  const open = links.classList.toggle("is-open");
  btn.setAttribute("aria-expanded", String(open));
});
// Close mobile nav on link click (UX)
links?.querySelectorAll("a")?.forEach((a) => {
  a.addEventListener("click", () => {
    links.classList.remove("is-open");
    btn?.setAttribute("aria-expanded", "false");
  });
});
document.getElementById("year").textContent = String(new Date().getFullYear());
