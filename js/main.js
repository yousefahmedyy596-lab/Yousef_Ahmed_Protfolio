/* Yousef Ahmed — Portfolio
   Small, dependency-free enhancements. The page works fully without JavaScript,
   except for the optional items driven by site.config.js (CV, email, education). */
(function () {
  "use strict";

  var cfg = window.SITE_CONFIG || {};
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  /* ---------- Optional content from site.config.js ---------- */
  function show(key, on) {
    $$('[data-config="' + key + '"]').forEach(function (el) { el.hidden = !on; });
  }

  var hasCv = typeof cfg.cvFile === "string" && cfg.cvFile.trim() !== "";
  if (hasCv) {
    $$('[data-config="cv"]').forEach(function (a) { a.setAttribute("href", cfg.cvFile); });
  }
  show("cv", hasCv);

  var hasEmail = typeof cfg.email === "string" && /^\S+@\S+\.\S+$/.test(cfg.email.trim());
  if (hasEmail) {
    var link = $("#email-link");
    link.textContent = cfg.email.trim();
    link.setAttribute("href", "mailto:" + cfg.email.trim());
  }
  show("email", hasEmail);

  var edu = Array.isArray(cfg.education) ? cfg.education : [];
  var hasEdu = edu.length > 0;
  if (hasEdu) {
    var list = $("#education-list");
    edu.forEach(function (item) {
      var li = document.createElement("li");

      var period = document.createElement("p");
      period.className = "timeline__period";
      period.textContent = item.period || "";

      var box = document.createElement("div");
      var h3 = document.createElement("h3");
      h3.textContent = item.title || "";
      box.appendChild(h3);
      [item.place, item.note].forEach(function (text) {
        if (!text) return;
        var p = document.createElement("p");
        p.textContent = text;
        box.appendChild(p);
      });

      li.appendChild(period);
      li.appendChild(box);
      list.appendChild(li);
    });
  }
  show("education", hasEdu);
  var idx = $("#contact-index");
  if (idx) idx.textContent = hasEdu ? "05" : "04";

  /* ---------- Footer year ---------- */
  var year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Mobile menu ---------- */
  var toggle = $(".nav__toggle");
  var menu = $("#nav-menu");

  function setMenu(open) {
    toggle.setAttribute("aria-expanded", String(open));
    menu.classList.toggle("is-open", open);
  }
  toggle.addEventListener("click", function () {
    setMenu(toggle.getAttribute("aria-expanded") !== "true");
  });
  menu.addEventListener("click", function (e) {
    if (e.target.closest("a")) setMenu(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      setMenu(false);
      toggle.focus();
    }
  });

  /* ---------- Header border on scroll ---------- */
  var header = $(".site-header");
  function onScroll() { header.classList.toggle("is-scrolled", window.scrollY > 8); }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Active nav link ---------- */
  var links = $$(".nav__links a");
  var sections = links
    .map(function (a) { return $(a.getAttribute("href")); })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) {
          var active = a.getAttribute("href") === "#" + entry.target.id;
          a.classList.toggle("is-active", active);
          if (active) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Scroll reveal (progressive enhancement) ---------- */
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if ("IntersectionObserver" in window && !reduce) {
    var targets = $$(".hero__copy > *, .hero__visual, .section__head, .about__grid > *, .skill, .case, .project, .timeline li, .contact__panel");
    targets.forEach(function (el) { el.classList.add("reveal"); });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });

    targets.forEach(function (el, i) {
      // light stagger for the hero only
      if (el.closest(".hero")) el.style.transitionDelay = Math.min(i * 70, 350) + "ms";
      io.observe(el);
    });
  }
})();
