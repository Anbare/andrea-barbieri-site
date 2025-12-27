document.getElementById("year").textContent = new Date().getFullYear();

const btn = document.querySelector(".nav-toggle");
const list = document.querySelector("[data-nav]");

btn?.addEventListener("click", () => {
  const expanded = btn.getAttribute("aria-expanded") === "true";
  btn.setAttribute("aria-expanded", String(!expanded));
  list.classList.toggle("is-open");
});

// chiudi menu dopo click su link (mobile)
list?.addEventListener("click", (e) => {
  const target = e.target;
  if (
    target instanceof HTMLAnchorElement &&
    list.classList.contains("is-open")
  ) {
    list.classList.remove("is-open");
    btn?.setAttribute("aria-expanded", "false");
  }
});
