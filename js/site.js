/* =====================================================================
   SH Elevate Tax Inc. — Animation engine
   Page interactions and lightweight entrance animations
   ===================================================================== */
(function () {
  "use strict";

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch = window.matchMedia("(pointer: coarse)").matches;
  // Treat phones, tablets and any touch device as "mobile": collapse the
  // heavier scroll-driven motion so touch scrolling stays native and smooth.
  const isMobile = window.matchMedia("(max-width: 1024px)").matches || isTouch;
  const desktopMotion = !isMobile && document.body.dataset.active !== "home";
  /* ---------------- NAV ---------------- */
  const nav = document.querySelector(".nav");
  const onScrollNav = () => {
    nav.classList.toggle("scrolled", Math.max(window.scrollY, document.body.scrollTop) > 40);
  };
  window.addEventListener("scroll", onScrollNav, { passive: true });
  document.body.addEventListener("scroll", onScrollNav, { passive: true });
  onScrollNav();

  // Service Areas mega-menu dropdown
  const areasWrap = document.querySelector(".nav-areas");
  if (areasWrap) {
    const btn = areasWrap.querySelector(".nav-areas-btn");
    let hoverTimer;
    const open = (v) => { areasWrap.classList.toggle("open", v); btn.setAttribute("aria-expanded", v); };
    btn.addEventListener("click", (e) => { e.preventDefault(); open(!areasWrap.classList.contains("open")); });
    areasWrap.addEventListener("mouseenter", () => { clearTimeout(hoverTimer); open(true); });
    areasWrap.addEventListener("mouseleave", () => { hoverTimer = setTimeout(() => open(false), 180); });
    document.addEventListener("click", (e) => { if (!areasWrap.contains(e.target)) open(false); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") open(false); });
  }

  // anchor smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reduce ? "instant" : "smooth" });
    });
  });

  /* ---------------- Reveals (IntersectionObserver — universal) ---------------- */
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );
  document.querySelectorAll("[data-reveal], .clip-line").forEach((el) => io.observe(el));

  /* ---------------- Premium heading reveal (word-by-word blur-rise) ----------------
     Splits display + section headings into masked words. Hero headings fire as the
     page opens; the rest reveal on scroll. Inline markup (e.g. .serif-em)
     is preserved as an atomic word so accent colours survive. */
  function splitHeading(el) {
    if (el.dataset.split) return;
    el.dataset.split = "1";
    const nodes = [...el.childNodes];
    el.textContent = "";
    let wi = 0;
    const wrap = (child) => {
      const w = document.createElement("span"); w.className = "rw";
      const i = document.createElement("span"); i.className = "rw-i";
      i.style.transitionDelay = (wi++ * 0.045).toFixed(3) + "s";
      i.appendChild(child); w.appendChild(i); el.appendChild(w);
    };
    nodes.forEach((node) => {
      if (node.nodeType === 3) {
        node.textContent.split(/(\s+)/).forEach((tok) => {
          if (tok === "") return;
          if (/^\s+$/.test(tok)) { el.appendChild(document.createTextNode(tok)); return; }
          wrap(document.createTextNode(tok));
        });
      } else {
        wrap(node);
      }
    });
  }
  const headings = [...document.querySelectorAll(".display, .h-section")]
    .filter((el) => !el.closest(".film"));
  headings.forEach(splitHeading);
  const scrollHeads = headings.filter((el) => !el.closest(".hero, .page-hero"));
  const headIO = new IntersectionObserver(
    (entries) => entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("in"); headIO.unobserve(en.target); }
    }),
    { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
  );
  scrollHeads.forEach((el) => headIO.observe(el));

  /* ---------------- Hero entrance ---------------- */
  const heroes = document.querySelectorAll(".hero, .page-hero");
  const revealHeroes = () => heroes.forEach((h) => {
    h.classList.add("sh-reveal");
    h.querySelectorAll(".display, .h-section").forEach((x) => x.classList.add("in"));
  });
  requestAnimationFrame(() => requestAnimationFrame(revealHeroes));

  /* ---------------- Counters ---------------- */
  function animateCount(el) {
    const target = parseFloat(el.dataset.count);
    const dec = (el.dataset.count.split(".")[1] || "").length;
    const dur = 1900;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = target * eased;
      el.textContent = dec ? val.toFixed(dec) : Math.round(val).toLocaleString();
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = dec ? target.toFixed(dec) : target.toLocaleString();
    };
    requestAnimationFrame(step);
  }
  const countIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { if (reduce) en.target.textContent = en.target.dataset.count; else animateCount(en.target); countIO.unobserve(en.target); }
      });
    },
    { threshold: 0.6 }
  );
  document.querySelectorAll("[data-count]").forEach((el) => countIO.observe(el));

  /* ---------------- FAQ accordion ---------------- */
  document.querySelectorAll(".faq-item").forEach((item) => {
    const q = item.querySelector(".faq-q");
    const a = item.querySelector(".faq-a");
    if (!q || !a) return;
    q.setAttribute("type", q.getAttribute("type") || "button");
    q.setAttribute("aria-expanded", "false");
    q.addEventListener("click", () => {
      const open = item.classList.contains("open");
      document.querySelectorAll(".faq-item.open").forEach((o) => {
        if (o !== item) {
          o.classList.remove("open");
          o.querySelector(".faq-a").style.maxHeight = null;
          const oq = o.querySelector(".faq-q");
          if (oq) oq.setAttribute("aria-expanded", "false");
        }
      });
      item.classList.toggle("open", !open);
      q.setAttribute("aria-expanded", open ? "false" : "true");
      a.style.maxHeight = open ? null : a.scrollHeight + "px";
      if (window.ScrollTrigger) setTimeout(() => ScrollTrigger.refresh(), 560);
    });
  });

  /* ---------------- Magnetic buttons ---------------- */
  if (desktopMotion && !reduce) {
    document.querySelectorAll("[data-magnetic]").forEach((btn) => {
      const strength = 0.32;
      btn.addEventListener("mousemove", (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
      });
      btn.addEventListener("mouseleave", () => { btn.style.transform = ""; });
    });

    /* ---------------- Premium card tilt + cursor spotlight ----------------
       Feeds CSS custom props; the visual treatment lives in site.css so it
       stays disabled on touch / reduced-motion automatically. */
    const bindCard = (card, tilt) => {
      let ticking = false, lastE = null;
      const apply = () => {
        ticking = false;
        const r = card.getBoundingClientRect();
        const px = (lastE.clientX - r.left) / r.width;
        const py = (lastE.clientY - r.top) / r.height;
        card.style.setProperty("--mx", (px * 100).toFixed(1) + "%");
        card.style.setProperty("--my", (py * 100).toFixed(1) + "%");
        if (tilt) {
          card.style.setProperty("--rx", ((0.5 - py) * 5).toFixed(2) + "deg");
          card.style.setProperty("--ry", ((px - 0.5) * 5).toFixed(2) + "deg");
        }
      };
      card.addEventListener("mousemove", (e) => {
        lastE = e;
        if (!ticking) { ticking = true; requestAnimationFrame(apply); }
      });
      if (tilt) card.addEventListener("mouseleave", () => {
        card.style.setProperty("--rx", "0deg");
        card.style.setProperty("--ry", "0deg");
      });
    };
    document.querySelectorAll(".svc-card").forEach((c) => bindCard(c, true));
    document.querySelectorAll(".tri-card, .rep-card, .blog-card, .related-card, .city-card").forEach((c) => bindCard(c, false));
  }

  // Load only the motion used on this device. Ordered classic scripts fetch in
  // parallel and also work in the downloadable file preview.
  if (!reduce) {
    const hasFilm = Boolean(document.querySelector(".film"));
    if (desktopMotion || hasFilm) {
      const nativeFilm = hasFilm && CSS.supports("overflow-x", "clip") && CSS.supports("height", "1svh");
      // Modern desktops can run parallax on the browser's scroll timeline.
      const nativeMotion = typeof ViewTimeline === "function" && CSS.supports("animation-range: exit 0% exit 100%") && !document.querySelector(".process-pin");
      const needsLibrary = (desktopMotion && !nativeMotion) || (hasFilm && !nativeFilm);
      const scripts = needsLibrary ? ["lib/gsap.min.js", "lib/ScrollTrigger.min.js"] : [];
      if (nativeFilm) document.body.classList.add("native-film-scroll");
      if (desktopMotion) scripts.push(nativeMotion ? "native-motion.js" : "cinematic.js");
      if (hasFilm) scripts.push("film.js");
      const base = new URL(".", document.currentScript.src);
      for (const file of scripts) {
        const script = document.createElement("script");
        script.async = false;
        script.src = new URL(file, base).href;
        document.head.appendChild(script);
      }
    }
  }
})();
