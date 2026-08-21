/* =====================================================================
   SH ELEVATE — Team page: render reps, search, filter, book + profile
   ===================================================================== */
(function () {
  "use strict";
  const grid = document.getElementById("team-grid");
  if (!grid) return;

  /* ───────────────────────────────────────────────────────────────────
     ⬇⬇⬇  PASTE EACH SPECIALIST'S MICROSOFT BOOKINGS LINK HERE  ⬇⬇⬇
     Get the link from Microsoft Bookings → "Booking page" → copy URL.
     Paste it between the quotes for each person. Leave "" if not ready
     yet — the button will then fall back to the contact section.
     Example: "https://outlook.office365.com/owa/calendar/SHElevate@.../bookings/"
     ─────────────────────────────────────────────────────────────────── */
  const BOOKING_LINKS = {
    "arjun-kapoor":   "",
    "priya-sharma":   "",
    "michael-chen":   "",
    "sarah-williams": "",
  };
  const FALLBACK_BOOK = "index.html#contact"; // used when a link above is empty

  const reps = [
    {
      slug: "arjun-kapoor", name: "Arjun Kapoor", title: "Senior Tax Consultant",
      specializations: ["Personal Tax Services", "Corporate Tax Services", "Tax Optimization", "CRA Audit Support"],
      photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80&auto=format&fit=crop&crop=face",
      bio: "With over 8 years of dedicated experience in Canadian tax law, Arjun brings a meticulous and client-first approach to every engagement. He specializes in navigating complex personal and corporate tax scenarios, ensuring his clients retain more of what they earn. Known for his deep understanding of CRA regulations and his ability to translate intricate tax code into actionable strategies, Arjun has helped hundreds of individuals and businesses optimize their tax positions with confidence and clarity.",
      email: "arjun@shelevate.ca", phone: "+1 (416) 555-0101", experience: "8+ years",
      location: "Toronto, ON", languages: ["English", "Hindi", "Punjabi"],
    },
    {
      slug: "priya-sharma", name: "Priya Sharma", title: "Tax & Compliance Advisor",
      specializations: ["GST/HST Services", "Bookkeeping & Payroll", "Strategic Financial Advisory", "Tax Compliance"],
      photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80&auto=format&fit=crop&crop=face",
      bio: "Priya is a dedicated tax and compliance advisor with 6+ years of experience helping individuals and businesses stay on top of their financial obligations. Her thorough approach encompasses GST/HST filings, bookkeeping, payroll management, and strategic financial advisory. Priya believes that timely compliance is the foundation of financial confidence, and she works tirelessly to ensure each client's records are accurate, organized, and audit-ready.",
      email: "priya@shelevate.ca", phone: "+1 (905) 555-0202", experience: "6+ years",
      location: "Mississauga, ON", languages: ["English", "Hindi", "Gujarati"],
    },
    {
      slug: "michael-chen", name: "Michael Chen", title: "Corporate Tax Specialist",
      specializations: ["Corporate Tax Services", "Business Registration", "Strategic Financial Advisory", "T2 Returns"],
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80&auto=format&fit=crop&crop=face",
      bio: "Michael is a seasoned corporate tax specialist with over a decade of experience advising small to medium-sized businesses on T2 returns, corporate structuring, and business registration. His expertise spans federal and provincial incorporations, extra-provincial registrations, and strategic financial advisory. Michael's analytical rigor and forward-thinking approach have made him a trusted partner for entrepreneurs seeking to launch and grow their businesses with full compliance and confidence.",
      email: "michael@shelevate.ca", phone: "+1 (604) 555-0303", experience: "10+ years",
      location: "Vancouver, BC", languages: ["English", "Mandarin", "Cantonese"],
    },
    {
      slug: "sarah-williams", name: "Sarah Williams", title: "Personal Tax Specialist",
      specializations: ["Personal Tax Services", "GST/HST Services", "Newcomer Tax Filing", "Self-Employed Returns"],
      photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80&auto=format&fit=crop&crop=face",
      bio: "Sarah brings 12+ years of specialized expertise in personal tax services, helping individuals, newcomers, students, and families navigate their tax obligations with confidence. Her meticulous attention to detail and deep knowledge of Canadian tax regulations ensure that every return is accurate, compliant, and optimized for maximum benefits. Sarah is deeply committed to making tax filing accessible and stress-free, combining technical precision with genuine care for each client she serves.",
      email: "sarah@shelevate.ca", phone: "+1 (613) 555-0404", experience: "12+ years",
      location: "Ottawa, ON", languages: ["English", "French"],
    },
  ];

  // Booking link helpers
  const bookHref = (slug) => BOOKING_LINKS[slug] || FALLBACK_BOOK;
  const bookAttrs = (slug) => (BOOKING_LINKS[slug] ? ' target="_blank" rel="noopener"' : "");

  const allSpecs = [...new Set(reps.flatMap((r) => r.specializations))].sort();
  let search = "", filter = null;

  // filter chips
  const chipWrap = document.getElementById("team-filters");
  const mkChip = (label, val) => {
    const b = document.createElement("button");
    b.className = "team-chip" + (val === filter ? " active" : "");
    b.textContent = label;
    b.addEventListener("click", () => { filter = (filter === val ? null : val); render(); });
    return b;
  };
  function renderChips() {
    chipWrap.innerHTML = "";
    chipWrap.appendChild(mkChip("All", null));
    allSpecs.forEach((s) => chipWrap.appendChild(mkChip(s, s)));
  }

  function cardHTML(r, i) {
    return `
      <div class="rep-card" data-reveal data-reveal-delay="${i % 3}" data-slug="${r.slug}">
        <div class="rep-photo"><img src="${r.photo}" alt="${r.name}" loading="lazy" decoding="async" width="400" height="400" /></div>
        <h3>${r.name}</h3>
        <div class="rep-title">${r.title}</div>
        <div class="rep-loc">${r.location}</div>
        <div class="rep-specs">${r.specializations.slice(0, 3).map((s) => `<span>${s}</span>`).join("")}</div>
        <div class="rep-meta">
          <div class="rm"><div class="v">${r.experience.replace(/\D.*$/, "")}+</div><div class="k">Years</div></div>
          <div class="rm"><div class="v">${r.languages.length}</div><div class="k">Languages</div></div>
        </div>
        <div class="rep-actions">
          <a class="btn btn-gold rep-book" href="${bookHref(r.slug)}"${bookAttrs(r.slug)}>Book Appointment <span class="btn-arrow">→</span></a>
          <button class="rep-profile-link" data-profile="${r.slug}">View full profile</button>
        </div>
      </div>`;
  }

  function render() {
    renderChips();
    const list = reps.filter((r) => {
      const q = search.toLowerCase();
      const mS = !q || r.name.toLowerCase().includes(q) || r.title.toLowerCase().includes(q) || r.specializations.some((s) => s.toLowerCase().includes(q));
      const mF = !filter || r.specializations.includes(filter);
      return mS && mF;
    });
    grid.innerHTML = list.length ? list.map(cardHTML).join("") : `<div class="rep-empty">No representatives match your search criteria.</div>`;
    // re-observe reveals
    grid.querySelectorAll("[data-reveal]").forEach((el) => el.classList.add("in"));
    grid.querySelectorAll("[data-profile]").forEach((b) =>
      b.addEventListener("click", (e) => { e.preventDefault(); openModal(b.getAttribute("data-profile")); })
    );
  }

  // search
  const input = document.getElementById("team-search-input");
  if (input) input.addEventListener("input", (e) => { search = e.target.value; render(); });

  // modal
  const modal = document.getElementById("rep-modal");
  function openModal(slug) {
    const r = reps.find((x) => x.slug === slug);
    if (!r) return;
    modal.querySelector(".rm-photo img").src = r.photo;
    modal.querySelector(".rm-name").textContent = r.name;
    modal.querySelector(".rm-title").textContent = r.title;
    modal.querySelector(".rm-loc").textContent = r.location;
    modal.querySelector(".rm-bio").textContent = r.bio;
    modal.querySelector(".rm-specs").innerHTML = r.specializations.map((s) => `<span>${s}</span>`).join("");
    modal.querySelector(".rm-langs").textContent = r.languages.join(" · ");
    modal.querySelector(".rm-exp").textContent = r.experience;
    modal.querySelector(".rm-email").href = "mailto:" + r.email;
    modal.querySelector(".rm-email").textContent = r.email;
    modal.querySelector(".rm-phone").href = "tel:" + r.phone.replace(/[^+\d]/g, "");
    modal.querySelector(".rm-phone").textContent = r.phone;
    const bookBtn = modal.querySelector(".rm-cta a");
    bookBtn.setAttribute("href", bookHref(r.slug));
    if (BOOKING_LINKS[r.slug]) { bookBtn.setAttribute("target", "_blank"); bookBtn.setAttribute("rel", "noopener"); }
    else { bookBtn.removeAttribute("target"); bookBtn.removeAttribute("rel"); }
    bookBtn.innerHTML = `Book with ${r.name.split(" ")[0]} <span class="btn-arrow">→</span>`;
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
    if (window.__lenis) window.__lenis.stop();
  }
  function closeModal() {
    modal.classList.remove("open");
    document.body.style.overflow = "";
    if (window.__lenis) window.__lenis.start();
  }
  modal.querySelector(".rm-close").addEventListener("click", closeModal);
  modal.querySelector(".rm-backdrop").addEventListener("click", closeModal);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

  render();
})();
