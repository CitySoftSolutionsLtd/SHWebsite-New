// Enhancement layer for pointer devices. The basic page is already interactive.
(function () {
  "use strict";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch = window.matchMedia("(pointer: coarse)").matches;
  const isMobile = window.matchMedia("(max-width: 1024px)").matches || isTouch;
  const hasGSAP = typeof window.gsap !== "undefined";

  /* ---------------- GSAP ScrollTrigger effects ---------------- */
  if (hasGSAP && window.ScrollTrigger && !reduce) {
    gsap.registerPlugin(ScrollTrigger);

    // (Hero entrance handled by CSS for reliability.)

    // Parallax bg layers + image inner-parallax — DESKTOP ONLY.
    // These scrub transforms run on large hero/section images every scroll
    // frame; on mobile that main-thread churn is what makes scrolling feel
    // rough, for little visual payoff — so they're skipped (images sit static).
    if (!isMobile) {
      const parallax = (sel, amt) => {
        document.querySelectorAll(sel).forEach((el) => {
          gsap.to(el, {
            yPercent: amt, ease: "none",
            scrollTrigger: { trigger: el.closest("section") || el, start: "top bottom", end: "bottom top", scrub: true },
          });
        });
      };
      parallax(".stats-bg", -12);
      parallax(".contact-bg", -10);

      // Image inner parallax (zoomy)
      document.querySelectorAll("[data-img-parallax]").forEach((el) => {
        gsap.fromTo(el, { yPercent: -8 }, {
          yPercent: 8, ease: "none",
          scrollTrigger: { trigger: el.closest("section, .frame, .why-media, .philo-media") || el, start: "top bottom", end: "bottom top", scrub: true },
        });
      });
    }

    // PROCESS pinned scrollytelling
    if (!isMobile && document.querySelector(".process-pin")) {
      const steps = gsap.utils.toArray(".p-step");
      const imgs = gsap.utils.toArray(".process-media img");
      const setActive = (i) => {
        steps.forEach((s, k) => s.classList.toggle("dim", k !== i));
        imgs.forEach((im, k) => im.classList.toggle("active", k === i));
      };
      setActive(0);
      ScrollTrigger.create({
        trigger: ".process-pin",
        start: "top top",
        end: "+=" + (steps.length * 60) + "%",
        pin: true,
        scrub: 0.5,
        onUpdate: (self) => {
          const i = Math.min(steps.length - 1, Math.floor(self.progress * steps.length));
          setActive(i);
        },
      });
    } else {
      const steps = gsap.utils.toArray(".p-step");
      const imgs = gsap.utils.toArray(".process-media img");
      steps.forEach((s) => s.classList.remove("dim"));
      if (imgs[0]) imgs[0].classList.add("active");
    }

    // Section heading lines subtle parallax fade handled by reveals

  } else {
    // No-GSAP fallback: ensure process visible
    document.querySelectorAll(".p-step").forEach((s) => s.classList.remove("dim"));
    const im = document.querySelector(".process-media img");
    if (im) im.classList.add("active");
  }

  // Refresh on full load (images)
  window.addEventListener("load", () => { if (window.ScrollTrigger) ScrollTrigger.refresh(); });
})();

/* =====================================================================
   SH Elevate Tax Inc. — Cinematic scroll layer (site-wide)
   Every page opens with a PINNED hero "scene": as you scroll, the hero
   image zooms in while the headline drifts up & fades, then it releases
   into the page. Plus layered drift + scrubbed zooms through the page so
   the whole scroll feels like film. Transform/opacity only — no reflow.
   Loaded on every page AFTER site.js.
   ===================================================================== */
(function () {
  "use strict";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);
  gsap.config({ force3D: true });

  // Phones, tablets and touch devices: skip the pinned hero zoom + every
  // scrubbed parallax/drift below. Pinning the hero makes the page feel
  // "stuck" while you try to scroll, and per-frame transforms on large images
  // add friction — so on these devices the hero and sections just scroll
  // naturally (the cheap IntersectionObserver reveals in site.js still play).
  // Desktop keeps the full cinematic treatment.
  if (window.matchMedia("(max-width: 1024px)").matches ||
      window.matchMedia("(pointer: coarse)").matches) return;

  const k = 1;

  /* ---------- 1) HERO — natural scroll, no pin ----------
     The header scrolls away like any normal section. The photo eases in a gentle
     scale as you scroll past it, for a whisper of depth — but the page is never
     "held", so the scroll stays completely natural. Scale-only never exposes the
     image edges, so it's safe on every hero/page-hero. */
  function cineHero(heroSel, imgSel) {
    const hero = document.querySelector(heroSel);
    if (!hero) return;
    const img = hero.querySelector(imgSel);
    if (!img) return;
    gsap.fromTo(img, { scale: 1.0 }, {
      scale: 1.12, ease: "none",
      scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true },
    });
  }
  cineHero(".hero", ".hero-bg img");
  cineHero(".page-hero", ".page-hero-bg img");

  /* ---------- 2) Scrubbed zoom on full-bleed mid-page image bands ---------- */
  gsap.utils.toArray(".stats-bg img, .contact-bg img").forEach((img) => {
    const sec = img.closest("section");
    gsap.fromTo(img, { scale: 1.04 }, {
      scale: 1.2, ease: "none",
      scrollTrigger: { trigger: sec, start: "top bottom", end: "bottom top", scrub: true },
    });
  });

  /* ---------- 3) Layered drift through every page ---------- */
  function drift(sel, from, to, scrub) {
    gsap.utils.toArray(sel).forEach((el) => {
      gsap.fromTo(el, { y: from * k }, {
        y: to * k, ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.4 },
      });
    });
  }
  drift(".section-head", 60, -40);
  drift(".split-media, .feat-card-panel", 70, -46);
  drift(".philo-media, .why-media", 64, -48);
  drift(".stat-badge", 26, -50);

  /* ---------- 4) Framed images inner-parallax ---------- */
  gsap.utils.toArray(".split-media img, .why-media img, .philo-media .frame img, .blog-feature .bf-media img").forEach((img) => {
    const box = img.parentElement;
    gsap.fromTo(img, { yPercent: -8 }, {
      yPercent: 8, ease: "none",
      scrollTrigger: { trigger: box, start: "top bottom", end: "bottom top", scrub: true },
    });
  });


})();
