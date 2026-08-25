/* Shareable team profile: read, book, and rate. Roster comes from bookings-config.js. */
(function () {
  "use strict";
  const root = document.getElementById("profile-root");
  if (!root || !window.SHBook) return;

  const cfg = window.SH_BOOKINGS || {};
  const reps = window.SHBook.publishedStaff();
  const apiBase = typeof cfg.ratingsApi === "string" ? cfg.ratingsApi.trim().replace(/\/+$/, "") : "";

  const params = new URLSearchParams(window.location.search);
  const slug = (params.get("who") || window.location.hash.replace(/^#/, "") || "").trim().toLowerCase();

  const escapeHtml = (value) =>
    String(value ?? "").replace(/[&<>"']/g, (c) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[c]));

  const initials = (name) =>
    name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");

  const photoHTML = (r, size) => {
    if (r.photo && !/^https:\/\/images\.unsplash\.com/i.test(r.photo) && !/^REPLACE_/i.test(r.photo)) {
      const webp = r.photo.replace(/\.(jpe?g|png)$/i, ".webp");
      const webpTag = /\.webp$/i.test(r.photo) ? "" : `<source type="image/webp" srcset="${webp}" />`;
      return `<picture>${webpTag}<img src="${r.photo}" alt="${escapeHtml(r.name)}" width="${size}" height="${size}" decoding="async" /></picture>`;
    }
    return `<span class="rep-initials" aria-hidden="true">${escapeHtml(initials(r.name))}</span>`;
  };

  const profileHref = (person) => "profile.html?who=" + encodeURIComponent(person.slug);

  const setMeta = (name, content) => {
    let el = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
    if (el) el.setAttribute("content", content);
  };

  const setCanonical = (href) => {
    let el = document.querySelector('link[rel="canonical"]');
    if (el) el.setAttribute("href", href);
  };

  function directoryHTML() {
    const cards = reps.map((r) => `
      <a class="profile-dir-card" href="${profileHref(r)}">
        <div class="rep-photo">${photoHTML(r, 104)}</div>
        <h3>${escapeHtml(r.name)}</h3>
        <div class="rep-title">${escapeHtml(r.title || "")}</div>
      </a>`).join("");
    return `
      <div class="profile-dir">
        <p class="lede">Choose someone to read their profile, book a time, or leave a rating.</p>
        <div class="profile-dir-grid">${cards}</div>
      </div>`;
  }

  function missingHTML() {
    return `
      <div class="profile-missing">
        <h2 class="h-section">We couldn’t find that profile</h2>
        <p class="lede">That page may have moved. Meet the team, or pick someone below.</p>
        <p><a class="btn btn-gold" href="team.html">See the team <span class="btn-arrow">→</span></a></p>
        ${directoryHTML()}
      </div>`;
  }

  function personHTML(r) {
    const first = (r.name || "").split(/\s+/)[0] || r.name;
    const tel = r.phone || "+1 (437) 925-6546";
    const email = r.email || "info@shelevate.ca";
    const langs = (r.languages || []).join(" · ");
    const specs = (r.specializations || []).map((s) => `<span>${escapeHtml(s)}</span>`).join("");
    const exp = (r.experience || "").trim();
    return `
      <article class="profile-card" data-reveal>
        <div class="profile-top">
          <div class="profile-photo">${photoHTML(r, 160)}</div>
          <div>
            <h1 class="profile-name">${escapeHtml(r.name)}</h1>
            <div class="rm-title">${escapeHtml(r.title || "")}</div>
            <div class="rm-loc">${escapeHtml(r.location || "")}</div>
            <div class="profile-rating-summary" id="profile-rating-summary" hidden></div>
          </div>
        </div>
        <div class="rm-specs">${specs}</div>
        <p class="rm-bio">${escapeHtml(r.bio || "")}</p>
        <div class="rm-info">
          ${exp ? `<div class="ri"><div class="k">Experience</div><div class="v">${escapeHtml(exp)}</div></div>` : ""}
          ${langs ? `<div class="ri"><div class="k">Languages</div><div class="v">${escapeHtml(langs)}</div></div>` : ""}
          <div class="ri"><div class="k">Email</div><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></div>
          <div class="ri"><div class="k">Office</div><a href="tel:${tel.replace(/[^+\d]/g, "")}">${escapeHtml(tel)}</a></div>
        </div>
        <div class="profile-cta">
          <a class="btn btn-gold" href="#book" data-book="${escapeHtml(r.slug)}">Book with ${escapeHtml(first)} <span class="btn-arrow">→</span></a>
          <a class="btn btn-ghost" href="team.html">See the team</a>
        </div>
      </article>
      <section class="rate-card" id="rate" data-reveal>
        <div class="eyebrow">Your feedback</div>
        <h2 class="h-section">Rate ${escapeHtml(first)}</h2>
        <p class="lede" id="rate-lede">After you meet, leave a rating. It helps other clients choose who to book.</p>
        <div id="rate-form-wrap"></div>
        <div class="rate-reviews" id="rate-reviews" hidden>
          <h3>What clients said</h3>
          <div id="rate-review-list"></div>
        </div>
      </section>`;
  }

  function starButtons(selected) {
    return [1, 2, 3, 4, 5].map((n) =>
      `<button type="button" class="rate-star${n <= selected ? " is-on" : ""}" data-stars="${n}" aria-label="${n} star${n === 1 ? "" : "s"}" aria-pressed="${n === selected ? "true" : "false"}">★</button>`
    ).join("");
  }

  function renderForm(person) {
    const wrap = document.getElementById("rate-form-wrap");
    if (!wrap) return;
    if (!apiBase) {
      wrap.innerHTML = `<p class="rate-note">After you meet, call <a href="tel:+14379256546">(437) 925-6546</a> or email <a href="mailto:info@shelevate.ca">info@shelevate.ca</a> to share how it went.</p>`;
      return;
    }
    wrap.innerHTML = `
      <form class="rate-form" id="rate-form" novalidate>
        <label class="book-hp" aria-hidden="true">
          <span>Company website</span>
          <input id="rate-hp" type="text" name="website" tabindex="-1" autocomplete="off" />
        </label>
        <div class="rate-field">
          <span class="rate-label" id="rate-stars-label">Stars</span>
          <div class="rate-stars" id="rate-stars" role="group" aria-labelledby="rate-stars-label">${starButtons(0)}</div>
          <input type="hidden" id="rate-stars-value" name="stars" value="" />
        </div>
        <label class="rate-field">
          <span class="rate-label">Your name</span>
          <input id="rate-name" type="text" name="name" maxlength="120" autocomplete="name" required />
        </label>
        <label class="rate-field">
          <span class="rate-label">Email <span class="rate-optional">(optional)</span></span>
          <input id="rate-email" type="email" name="email" maxlength="256" autocomplete="email" />
        </label>
        <label class="rate-field">
          <span class="rate-label">Comment <span class="rate-optional">(optional)</span></span>
          <textarea id="rate-comment" name="comment" maxlength="600" rows="4"></textarea>
        </label>
        <button type="submit" class="btn btn-gold" id="rate-submit">Submit rating <span class="btn-arrow">→</span></button>
      </form>
      <p class="rate-status" id="rate-status" role="status"></p>`;

    let selected = 0;
    const stars = wrap.querySelector("#rate-stars");
    const hidden = wrap.querySelector("#rate-stars-value");
    stars.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-stars]");
      if (!btn) return;
      selected = Number(btn.getAttribute("data-stars"));
      hidden.value = String(selected);
      stars.innerHTML = starButtons(selected);
    });

    wrap.querySelector("#rate-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const status = wrap.querySelector("#rate-status");
      const submit = wrap.querySelector("#rate-submit");
      const honeypot = wrap.querySelector("#rate-hp");
      const name = wrap.querySelector("#rate-name").value.trim();
      const email = wrap.querySelector("#rate-email").value.trim();
      const comment = wrap.querySelector("#rate-comment").value.trim();
      status.textContent = "";
      if (!selected) {
        status.textContent = "Please choose a star rating.";
        return;
      }
      if (!name) {
        status.textContent = "Please tell us your name.";
        return;
      }
      submit.disabled = true;
      try {
        const res = await fetch(`${apiBase}/${encodeURIComponent(person.slug)}/ratings`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            stars: selected,
            reviewerName: name,
            comment: comment || null,
            reviewerEmail: email || null,
            website: honeypot && honeypot.value ? honeypot.value : null,
          }),
        });
        if (res.status === 204 || res.ok) {
          status.textContent = "Thank you. Your rating has been received.";
          wrap.querySelector("#rate-form").hidden = true;
          await loadRatings(person.slug);
          return;
        }
        let detail = "We couldn’t save that just now. Please try again, or call (437) 925-6546.";
        try {
          const problem = await res.json();
          if (problem && problem.detail) detail = problem.detail;
        } catch (err) { /* keep fallback */ }
        status.textContent = detail;
      } catch (err) {
        status.textContent = "We couldn’t reach the rating service. Please try again, or call (437) 925-6546.";
      } finally {
        submit.disabled = false;
      }
    });
  }

  function renderSummary(summary) {
    const box = document.getElementById("profile-rating-summary");
    const listWrap = document.getElementById("rate-reviews");
    const list = document.getElementById("rate-review-list");
    if (!box) return;
    if (!summary || !summary.count) {
      box.hidden = true;
      box.textContent = "";
      if (listWrap) listWrap.hidden = true;
      return;
    }
    const avg = Number(summary.average);
    const shown = Number.isFinite(avg) ? avg.toFixed(1) : "";
    box.hidden = false;
    box.textContent = shown
      ? `${shown} out of 5 · ${summary.count} rating${summary.count === 1 ? "" : "s"}`
      : `${summary.count} rating${summary.count === 1 ? "" : "s"}`;

    const reviews = Array.isArray(summary.reviews) ? summary.reviews : [];
    if (listWrap && list && reviews.length) {
      listWrap.hidden = false;
      list.innerHTML = reviews.map((rev) => `
        <blockquote class="rate-review">
          <div class="rate-review-stars" aria-label="${escapeHtml(rev.stars)} out of 5">${"★".repeat(rev.stars)}${"☆".repeat(5 - rev.stars)}</div>
          <p>${escapeHtml(rev.comment)}</p>
          <footer>${escapeHtml(rev.reviewerName)}</footer>
        </blockquote>`).join("");
    } else if (listWrap) {
      listWrap.hidden = true;
    }
  }

  async function loadRatings(personSlug) {
    if (!apiBase) return;
    try {
      const res = await fetch(`${apiBase}/${encodeURIComponent(personSlug)}/ratings`, {
        headers: { Accept: "application/json" },
      });
      if (!res.ok) return;
      renderSummary(await res.json());
    } catch (err) {
      /* ratings stay hidden until a real response arrives */
    }
  }

  function applyPersonSeo(r) {
    const title = `${r.name} | SH Elevate`;
    const desc = r.bio
      ? r.bio.slice(0, 150).replace(/\s+\S*$/, "") + "…"
      : `Read ${r.name}’s profile and book a free tax consultation with SH Elevate in Scarborough.`;
    const url = `https://shelevate.ca/${profileHref(r)}`;
    document.title = title;
    setMeta("description", desc);
    setMeta("og:title", title);
    setMeta("og:description", desc);
    setMeta("og:url", url);
    setMeta("twitter:title", title);
    setMeta("twitter:description", desc);
    setCanonical(url);
    if (r.photo && !/^https?:/i.test(r.photo)) {
      const abs = "https://shelevate.ca/" + r.photo.replace(/^\//, "");
      setMeta("og:image", abs);
      setMeta("twitter:image", abs);
    }
    const schema = document.createElement("script");
    schema.type = "application/ld+json";
    schema.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Person",
      name: r.name,
      jobTitle: r.title || undefined,
      url,
      image: r.photo && !/^https?:/i.test(r.photo) ? "https://shelevate.ca/" + r.photo.replace(/^\//, "") : undefined,
      worksFor: { "@id": "https://shelevate.ca/#organization" },
      email: r.email || "info@shelevate.ca",
      telephone: (r.phone || "+1-437-925-6546").replace(/[^\d+]/g, (ch) => (ch === "+" ? "+" : "")),
    });
    document.head.appendChild(schema);
  }

  if (!slug) {
    document.title = "Team profiles | SH Elevate";
    root.innerHTML = directoryHTML();
    return;
  }

  const person = reps.find((r) => r.slug === slug);
  if (!person) {
    document.title = "Profile not found | SH Elevate";
    root.innerHTML = missingHTML();
    return;
  }

  applyPersonSeo(person);
  const crumb = document.getElementById("profile-crumb");
  if (crumb) crumb.textContent = person.name;
  const lede = document.getElementById("profile-hero-lede");
  if (lede) lede.textContent = `Read ${person.name}’s profile, book a time, or leave a rating after you meet.`;
  root.innerHTML = personHTML(person);
  renderForm(person);
  loadRatings(person.slug);
})();
