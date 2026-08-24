/* =====================================================================
   SH ELEVATE — Team / booking page
   Renders only published real staff from bookings-config.js.
   Book buttons open the Microsoft Bookings gate (js/bookings.js).
   ===================================================================== */
(function () {
  "use strict";
  const grid = document.getElementById("team-grid");
  if (!grid || !window.SHBook) return;

  const reps = window.SHBook.publishedStaff();
  const tools = document.getElementById("team-tools");
  const staffSection = document.getElementById("team-staff-section");

  if (!reps.length) {
    if (tools) tools.hidden = true;
    if (staffSection) staffSection.hidden = true;
    return;
  }
  if (tools) tools.hidden = false;
  if (staffSection) staffSection.hidden = false;

  const initials = (name) =>
    name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");

  const photoHTML = (r) => {
    if (r.photo && !/^https:\/\/images\.unsplash\.com/i.test(r.photo) && !/^REPLACE_/i.test(r.photo)) {
      return `<img src="${r.photo}" alt="${r.name}" loading="lazy" decoding="async" width="400" height="400" />`;
    }
    return `<span class="rep-initials" aria-hidden="true">${initials(r.name)}</span>`;
  };

  const allSpecs = [...new Set(reps.flatMap((r) => r.specializations || []))].sort();
  let search = "", filter = null;

  const chipWrap = document.getElementById("team-filters");
  const mkChip = (label, val) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "team-chip" + (val === filter ? " active" : "");
    b.textContent = label;
    b.addEventListener("click", () => { filter = (filter === val ? null : val); render(); });
    return b;
  };
  function renderChips() {
    if (!chipWrap) return;
    chipWrap.innerHTML = "";
    chipWrap.appendChild(mkChip("All", null));
    allSpecs.forEach((s) => chipWrap.appendChild(mkChip(s, s)));
  }

  function cardHTML(r, i) {
    const years = (r.experience || "").replace(/\D.*$/, "");
    return `
      <div class="rep-card" data-reveal data-reveal-delay="${i % 3}" data-slug="${r.slug}">
        <div class="rep-photo">${photoHTML(r)}</div>
        <h3>${r.name}</h3>
        <div class="rep-title">${r.title || ""}</div>
        <div class="rep-loc">${r.location || ""}</div>
        <div class="rep-specs">${(r.specializations || []).slice(0, 3).map((s) => `<span>${s}</span>`).join("")}</div>
        ${years ? `<div class="rep-meta"><div class="rm"><div class="v">${years}+</div><div class="k">Years</div></div>
          <div class="rm"><div class="v">${(r.languages || []).length || "—"}</div><div class="k">Languages</div></div></div>` : ""}
        <div class="rep-actions">
          <a class="btn btn-gold rep-book" href="#book" data-book="${r.slug}">Book Appointment <span class="btn-arrow">→</span></a>
          ${r.bio ? `<button type="button" class="rep-profile-link" data-profile="${r.slug}">View full profile</button>` : ""}
        </div>
      </div>`;
  }

  function render() {
    renderChips();
    const list = reps.filter((r) => {
      const q = search.toLowerCase();
      const mS = !q || r.name.toLowerCase().includes(q) || (r.title || "").toLowerCase().includes(q) || (r.specializations || []).some((s) => s.toLowerCase().includes(q));
      const mF = !filter || (r.specializations || []).includes(filter);
      return mS && mF;
    });
    grid.innerHTML = list.length ? list.map(cardHTML).join("") : `<div class="rep-empty">No team members match your search.</div>`;
    grid.querySelectorAll("[data-reveal]").forEach((el) => el.classList.add("in"));
    grid.querySelectorAll("[data-profile]").forEach((b) =>
      b.addEventListener("click", (e) => { e.preventDefault(); openModal(b.getAttribute("data-profile")); })
    );
  }

  const input = document.getElementById("team-search-input");
  if (input) input.addEventListener("input", (e) => { search = e.target.value; render(); });

  const modal = document.getElementById("rep-modal");
  function openModal(slug) {
    if (!modal) return;
    const r = reps.find((x) => x.slug === slug);
    if (!r) return;
    const img = modal.querySelector(".rm-photo img");
    const ini = modal.querySelector(".rm-photo .rep-initials");
    if (r.photo && img) {
      img.hidden = false;
      img.src = r.photo;
      img.alt = r.name;
      if (ini) ini.hidden = true;
    } else if (img) {
      img.hidden = true;
      if (ini) { ini.hidden = false; ini.textContent = initials(r.name); }
    }
    modal.querySelector(".rm-name").textContent = r.name;
    modal.querySelector(".rm-title").textContent = r.title || "";
    modal.querySelector(".rm-loc").textContent = r.location || "";
    modal.querySelector(".rm-bio").textContent = r.bio || "";
    modal.querySelector(".rm-specs").innerHTML = (r.specializations || []).map((s) => `<span>${s}</span>`).join("");
    modal.querySelector(".rm-langs").textContent = (r.languages || []).join(" · ");
    modal.querySelector(".rm-exp").textContent = r.experience || "—";
    const em = modal.querySelector(".rm-email");
    em.href = "mailto:" + (r.email || "info@shelevate.ca");
    em.textContent = r.email || "info@shelevate.ca";
    const ph = modal.querySelector(".rm-phone");
    const tel = (r.phone || "+1 (437) 925-6546");
    ph.href = "tel:" + tel.replace(/[^+\d]/g, "");
    ph.textContent = tel;
    const bookBtn = modal.querySelector(".rm-cta a");
    bookBtn.setAttribute("href", "#book");
    bookBtn.setAttribute("data-book", r.slug);
    bookBtn.removeAttribute("target");
    bookBtn.innerHTML = `Book with ${r.name.split(" ")[0]} <span class="btn-arrow">→</span>`;
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
    if (window.__lenis) window.__lenis.stop();
  }
  function closeModal() {
    if (!modal) return;
    modal.classList.remove("open");
    document.body.style.overflow = "";
    if (window.__lenis) window.__lenis.start();
  }
  if (modal) {
    modal.querySelector(".rm-close").addEventListener("click", closeModal);
    modal.querySelector(".rm-backdrop").addEventListener("click", closeModal);
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });
  }

  render();
})();
