/* =====================================================================
   SH ELEVATE — Microsoft Bookings embed + bot gate
   Calendar iframe is injected only after a human pass. Appointments are
   created inside Microsoft Bookings, so they land on the client's account.
   ===================================================================== */
(function () {
  "use strict";

  const cfg = window.SH_BOOKINGS || {};
  const ALLOWED = [
    "outlook.office365.com",
    "outlook.office.com",
    "outlook.cloud.microsoft",
    "bookings.microsoft.com",
  ];
  const STORE = "sh-book-opens";
  const MIN_DWELL_MS = 1400;

  const isFilled = (v) => typeof v === "string" && v.trim() && !/^REPLACE_/i.test(v.trim());
  const turnstileReady = isFilled(cfg.turnstileSiteKey);

  function isAllowedBookingsUrl(raw) {
    if (!isFilled(raw)) return false;
    try {
      const u = new URL(raw);
      if (u.protocol !== "https:") return false;
      return ALLOWED.some((h) => u.hostname === h || u.hostname.endsWith("." + h));
    } catch (e) {
      return false;
    }
  }

  function companyUrl() {
    return isAllowedBookingsUrl(cfg.pageUrl) ? cfg.pageUrl.trim() : "";
  }

  function staffUrl(person) {
    if (!person) return companyUrl();
    if (isAllowedBookingsUrl(person.bookingsUrl)) return person.bookingsUrl.trim();
    return companyUrl();
  }

  function opensThisHour() {
    const now = Date.now();
    let list = [];
    try { list = JSON.parse(sessionStorage.getItem(STORE) || "[]"); } catch (e) { list = []; }
    list = list.filter((t) => now - t < 60 * 60 * 1000);
    sessionStorage.setItem(STORE, JSON.stringify(list));
    return list;
  }

  function recordOpen() {
    const list = opensThisHour();
    list.push(Date.now());
    sessionStorage.setItem(STORE, JSON.stringify(list));
  }

  function underCap() {
    const max = Number(cfg.maxOpensPerHour) > 0 ? Number(cfg.maxOpensPerHour) : 6;
    return opensThisHour().length < max;
  }

  let turnstileWidgetId = null;
  let turnstileToken = "";
  let openedAt = 0;
  let pendingUrl = "";
  let scriptLoading = false;

  function loadTurnstile(cb) {
    if (!turnstileReady) { cb(); return; }
    if (window.turnstile) { cb(); return; }
    if (scriptLoading) return;
    scriptLoading = true;
    const s = document.createElement("script");
    s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    s.async = true;
    s.onload = cb;
    s.onerror = cb;
    document.head.appendChild(s);
  }

  function resetTurnstile(host) {
    turnstileToken = "";
    if (!host) return;
    host.innerHTML = "";
    if (turnstileReady && window.turnstile) {
      turnstileWidgetId = window.turnstile.render(host, {
        sitekey: cfg.turnstileSiteKey.trim(),
        theme: "light",
        callback: (t) => { turnstileToken = t || ""; },
        "expired-callback": () => { turnstileToken = ""; },
      });
    }
  }

  function modal() {
    return document.getElementById("book-modal");
  }

  function showMsg(text) {
    const el = document.getElementById("book-gate-msg");
    if (el) el.textContent = text || "";
  }

  function setStage(stage) {
    const gate = document.getElementById("book-gate");
    const frameWrap = document.getElementById("book-frame-wrap");
    const pending = document.getElementById("book-pending");
    if (gate) gate.hidden = stage !== "gate";
    if (frameWrap) frameWrap.hidden = stage !== "frame";
    if (pending) pending.hidden = stage !== "pending";
  }

  function openBookings(url, title) {
    const profile = document.getElementById("rep-modal");
    if (profile) profile.classList.remove("open");
    const m = modal();
    if (!m) return;
    pendingUrl = url || "";
    openedAt = Date.now();
    turnstileToken = "";
    const human = document.getElementById("book-human");
    if (human) human.checked = false;
    showMsg("");
    const heading = document.getElementById("book-modal-title");
    if (heading) heading.textContent = title || "Book a free consultation";

    if (!isAllowedBookingsUrl(pendingUrl)) {
      setStage("pending");
      m.classList.add("open");
      document.body.style.overflow = "hidden";
      if (window.__lenis) window.__lenis.stop();
      return;
    }

    setStage("gate");
    m.classList.add("open");
    document.body.style.overflow = "hidden";
    if (window.__lenis) window.__lenis.stop();
    loadTurnstile(() => resetTurnstile(document.getElementById("book-turnstile")));
    const go = document.getElementById("book-continue");
    if (go) go.focus();
  }

  function closeBookings() {
    const m = modal();
    if (!m) return;
    m.classList.remove("open");
    document.body.style.overflow = "";
    if (window.__lenis) window.__lenis.start();
    const frame = document.getElementById("book-frame");
    if (frame) frame.removeAttribute("src");
    pendingUrl = "";
    turnstileToken = "";
    showMsg("");
  }

  function honeypotFilled() {
    const hp = document.getElementById("book-hp");
    return !!(hp && hp.value && hp.value.trim());
  }

  function continueToCalendar() {
    if (honeypotFilled()) return; // bots that fill hidden fields
    if (Date.now() - openedAt < MIN_DWELL_MS) {
      showMsg("Please wait a moment, then try again.");
      return;
    }
    if (!underCap()) {
      showMsg("Too many booking attempts from this browser. Call +1 (437) 925-6546 or try again later.");
      return;
    }
    if (turnstileReady && window.turnstile && !turnstileToken) {
      showMsg("Please confirm you are not a robot.");
      return;
    }
    const human = document.getElementById("book-human");
    if (human && !human.checked) {
      showMsg("Please confirm you are booking this appointment.");
      return;
    }
    if (!isAllowedBookingsUrl(pendingUrl)) {
      setStage("pending");
      return;
    }
    recordOpen();
    const frame = document.getElementById("book-frame");
    if (frame) frame.src = pendingUrl;
    setStage("frame");
  }

  window.SHBook = {
    open: openBookings,
    close: closeBookings,
    companyUrl,
    staffUrl,
    isConfigured: () => !!companyUrl() || (cfg.staff || []).some((s) => s && s.published && isAllowedBookingsUrl(s.bookingsUrl)),
    isFilled,
    publishedStaff() {
      return (cfg.staff || []).filter((s) =>
        s && s.published && isFilled(s.name) && !/^REPLACE_/i.test(s.name)
      );
    },
  };

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-book]");
    if (!btn) return;
    e.preventDefault();
    const slug = btn.getAttribute("data-book");
    const person = (cfg.staff || []).find((s) => s.slug === slug);
    const url = staffUrl(person);
    const title = person && isFilled(person.name) && !/^REPLACE_/i.test(person.name)
      ? "Book with " + person.name
      : "Book a free consultation";
    openBookings(url, title);
  });

  const m = modal();
  if (!m) return;
  m.querySelectorAll("[data-book-close]").forEach((el) => el.addEventListener("click", closeBookings));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && m.classList.contains("open")) closeBookings(); });
  const go = document.getElementById("book-continue");
  if (go) go.addEventListener("click", continueToCalendar);
})();
