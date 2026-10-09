// Theme toggle: remembers the visitor's choice, otherwise follows the system.
(function () {
  var root = document.documentElement;
  var btn = document.getElementById("theme-toggle");
  if (!btn) return;
  function current() {
    if (root.dataset.theme) return root.dataset.theme;
    return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  function label() { btn.textContent = current() === "dark" ? "Light" : "Dark"; }
  btn.addEventListener("click", function () {
    var next = current() === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch (e) {}
    label();
  });
  label();
})();

// Project filters.
(function () {
  var buttons = document.querySelectorAll(".filters button");
  var items = document.querySelectorAll(".project[data-topics]");
  buttons.forEach(function (b) {
    b.addEventListener("click", function () {
      var f = b.dataset.filter;
      buttons.forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
      items.forEach(function (el) {
        el.hidden = !(f === "all" || el.dataset.topics.split(" ").indexOf(f) !== -1);
      });
    });
  });
})();

// Load the W&B report only when it's opened, since it's heavy.
document.querySelectorAll("details.report").forEach(function (d) {
  d.addEventListener("toggle", function () {
    var f = d.querySelector("iframe");
    if (d.open && !f.src) f.src = f.dataset.src;
  });
});

// Mark the nav link for the section on screen.
(function () {
  var links = {};
  document.querySelectorAll('.site-nav ul a[href^="#"]').forEach(function (a) {
    links[a.getAttribute("href").slice(1)] = a;
  });
  if (!Object.keys(links).length || !("IntersectionObserver" in window)) return;
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting && links[e.target.id]) {
        Object.values(links).forEach(function (a) { a.removeAttribute("aria-current"); });
        links[e.target.id].setAttribute("aria-current", "true");
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  document.querySelectorAll("main section[id]").forEach(function (s) { obs.observe(s); });
})();

// Click-to-enlarge images.
(function () {
  var modal = document.getElementById("image-modal");
  if (!modal) return;
  var img = modal.querySelector("img");
  var closeBtn = modal.querySelector("button");
  var opener = null;
  function close() {
    modal.classList.remove("open"); modal.hidden = true; img.src = "";
    if (opener) opener.focus();
  }
  document.querySelectorAll(".zoom").forEach(function (z) {
    z.addEventListener("click", function () {
      opener = z;
      img.src = z.dataset.full;
      img.alt = z.querySelector("img").alt;
      modal.hidden = false; modal.classList.add("open"); closeBtn.focus();
    });
  });
  modal.addEventListener("click", function (e) { if (e.target !== img) close(); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.classList.contains("open")) close();
  });
})();
