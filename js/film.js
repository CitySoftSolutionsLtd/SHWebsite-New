/* =====================================================================
   SH Elevate Tax Inc. — Cinematic scroll "film"
   Pinned chaptered scenes that crossfade with a slow
   Ken-Burns zoom as you scroll.
   Keeps the brand theme — this is motion/layout only.
   Uses native sticky positioning with a ScrollTrigger fallback.
   ===================================================================== */
(function () {
  "use strict";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- The film ---------------- */
  const film = document.querySelector(".film");
  if (!film) return;
  const imgs = Array.from(film.querySelectorAll(".chapter-img"));
  const texts = Array.from(film.querySelectorAll(".chapter-text"));
  const N = imgs.length;

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  const previousOpacity = new Array(N);
  function paint(progress) {
    const t = progress * N;                 // 0..N
    for (let i = 0; i < N; i++) {
      const fadeIn = i === 0 ? 1 : clamp((t - (i - 0.18)) / 0.36, 0, 1);
      const fadeOut = i === N - 1 ? 1 : clamp(((i + 1.18) - t) / 0.36, 0, 1);
      const vis = Math.min(fadeIn, fadeOut);
      // Only the visible scene and its crossfade neighbour need transforms.
      if (vis === 0 && previousOpacity[i] === 0) continue;
      previousOpacity[i] = vis;
      const within = clamp(t - i, 0, 1);     // 0..1 progress through chapter
      imgs[i].style.opacity = vis.toFixed(3);
      imgs[i].style.transform = `scale(${(1.14 - within * 0.14).toFixed(4)})`;
      if (texts[i]) {
        texts[i].style.opacity = vis.toFixed(3);
        texts[i].style.transform = `translateY(${((0.5 - within) * 46).toFixed(1)}px)`;
      }
    }
  }

  if (reduce) return; // CSS lays out all four scenes in reading order.
  const travelPercent = N * 60;
  if (document.body.classList.contains("native-film-scroll")) {
    const stage = film.querySelector(".film-stage");
    film.style.setProperty("--film-travel", travelPercent + "svh");
    let scheduled = false;
    let previous = -1;
    const update = () => {
      scheduled = false;
      const rect = film.getBoundingClientRect();
      const travel = Math.max(1, rect.height - stage.offsetHeight);
      const progress = clamp(-rect.top / travel, 0, 1);
      if (progress === previous) return;
      previous = progress;
      paint(progress);
    };
    const schedule = () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(update);
    };
    new IntersectionObserver(([entry]) => {
      for (const scroller of [window, document.body]) {
        if (entry.isIntersecting) scroller.addEventListener("scroll", schedule, { passive: true });
        else scroller.removeEventListener("scroll", schedule);
      }
      schedule();
    }).observe(film);
    window.addEventListener("resize", schedule);
    window.addEventListener("pageshow", schedule);
    update();
    return;
  }
  if (typeof ScrollTrigger === "undefined") {
    // static fallback — show first chapter
    paint(0);
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  paint(0);
  ScrollTrigger.create({
    trigger: ".film",
    start: "top top",
    end: "+=" + travelPercent + "%",
    pin: ".film-stage",
    scrub: 0.35,
    onUpdate: (self) => paint(self.progress),
    onRefresh: (self) => paint(self.progress),
  });

  setTimeout(() => ScrollTrigger.refresh(), 250);

  window.__film = { paint };
})();
