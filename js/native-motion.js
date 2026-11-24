// Drive desktop parallax from the browser's scroll position. Separate translate
// and scale keep the card's hover and reveal transforms independent of scrolling.
(function () {
  "use strict";
  const allowed = window.matchMedia("(min-width: 1025px) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
  let animations = [];
  const update = () => {
    for (const animation of animations) animation.cancel();
    animations = [];
    if (!allowed.matches) return;
    const timelines = new Map();
    function animate(selector, frames, subject, rangeStart = "entry 0%") {
      for (const element of document.querySelectorAll(selector)) {
        const trigger = element.closest(subject) || element;
        if (!timelines.has(trigger)) timelines.set(trigger, new ViewTimeline({ subject: trigger, axis: "block" }));
        animations.push(element.animate(frames, {
          timeline: timelines.get(trigger), rangeStart, rangeEnd: "exit 100%", fill: "both",
        }));
      }
    }
    animate(".hero-bg img, .page-hero-bg img", { scale: [1, 1.12] }, "section", "exit 0%");
    animate(".stats-bg", { translate: ["0 0%", "0 -12%"] }, "section");
    animate(".contact-bg", { translate: ["0 0%", "0 -10%"] }, "section");
    animate(".stats-bg img, .contact-bg img", { scale: [1.04, 1.2] }, "section");
    animate("[data-img-parallax], .split-media img, .why-media img, .philo-media .frame img, .blog-feature .bf-media img",
      { translate: ["0 -8%", "0 8%"] }, ".frame, .split-media, .why-media, .svc-card, .bf-media, section");
    animate(".section-head", { translate: ["0 60px", "0 -40px"] }, ".section-head");
    animate(".split-media, .feat-card-panel", { translate: ["0 70px", "0 -46px"] }, ".split-media, .feat-card-panel");
    animate(".philo-media, .why-media", { translate: ["0 64px", "0 -48px"] }, ".philo-media, .why-media");
    animate(".stat-badge", { translate: ["0 26px", "0 -50px"] }, ".stat-badge");
  };
  allowed.addEventListener("change", update);
  update();
})();
