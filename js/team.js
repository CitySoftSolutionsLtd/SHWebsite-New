/* Team cards from bookings-config.js. Book buttons open js/bookings.js. */
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
      const webp = r.photo.replace(/\.(jpe?g|png)$/i, ".webp");
      const webpTag = /\.webp$/i.test(r.photo) ? "" : `<source type="image/webp" srcset="${webp}" />`;
      return `<picture>${webpTag}<img src="${r.photo}" alt="${r.name}" loading="lazy" decoding="async" width="400" height="400" /></picture>`;
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
      <div class="rep-card" id="${r.slug}" data-reveal data-reveal-delay="${i % 3}" data-slug="${r.slug}">
        <div class="rep-photo">${photoHTML(r)}</div>
        <h3>${r.name}</h3>
        <div class="rep-title">${r.title || ""}</div>
        <div class="rep-loc">${r.location || ""}</div>
        <div class="rep-specs">${(r.specializations || []).slice(0, 3).map((s) => `<span>${s}</span>`).join("")}</div>
        ${years ? `<div class="rep-meta"><div class="rm"><div class="v">${years}+</div><div class="k">Years</div></div>
          <div class="rm"><div class="v">${(r.languages || []).length || "—"}</div><div class="k">Languages</div></div></div>` : ""}
        <div class="rep-actions">
          <a class="btn btn-gold rep-book" href="#book" data-book="${r.slug}">Book Appointment <span class="btn-arrow">→</span></a>
          ${r.bio ? `<a class="rep-profile-link" href="profile.html?who=${encodeURIComponent(r.slug)}">View full profile</a>` : ""}
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
  }

  const input = document.getElementById("team-search-input");
  if (input) input.addEventListener("input", (e) => { search = e.target.value; render(); });

  render();
})();
