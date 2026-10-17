/* =====================================================================
   SH Elevate Tax Inc. — Insights/Blog: listing (articles live in their own HTML pages)
   ===================================================================== */
(function () {
  "use strict";
  const grid = document.getElementById("blog-grid");
  if (!grid) return;

  const A = [
    {
      slug: "how-to-file-t1-personal-tax-return-canada",
      title: "How to File Your T1 Tax Return in Canada (2026): A Step-by-Step Guide",
      category: "Personal Tax", readTime: "6 min read", date: "2026-02-09",
      excerpt: "A clear, step-by-step guide to filing your 2025 T1 return in 2026: slips to gather, NETFILE vs paper, the April 30 deadline, late-filing penalties, and refund timing.",
    },
    {
      slug: "corporate-tax-t2-guide-small-business",
      title: "T2 Corporate Tax Return Guide for Small Business (2026)",
      category: "Corporate Tax", readTime: "6 min read", date: "2026-02-04",
      excerpt: "Your 2026 T2 corporate tax return guide: who must file, the 6-month deadline, when to pay, the small business deduction (~11.2% in Ontario), deductions and instalments.",
    },
    {
      slug: "gst-hst-registration-filing-guide",
      title: "GST/HST Registration and Filing Guide (2026)",
      category: "GST/HST", readTime: "6 min read", date: "2026-01-27",
      excerpt: "Your 2026 GST/HST guide: the $30,000 small-supplier threshold, the 29-day window to register, how to get a BN and RT account, filing frequencies, and ITCs.",
    },
    {
      slug: "top-tax-deductions-self-employed-canada",
      title: "Self-Employed Tax Deductions in Canada: Your 2026 Checklist",
      category: "Deductions", readTime: "4 min read", date: "2026-01-19",
      excerpt: "A plain-English 2026 checklist of self-employed tax deductions in Canada: T2125, home office (detailed method), vehicle, meals, CPP, and the six-year records rule.",
    },
    {
      slug: "northern-residents-deduction-guide",
      title: "Northern Residents Deduction (2026): Who Qualifies and How to Claim It",
      category: "Deductions", readTime: "2 min read", date: "2026-01-14",
      excerpt: "Northern Residents Deduction 2026: who qualifies, the two zones, the residency and travel amounts, and how to claim on Form T2222 and Line 25500 of your T1.",
    },
    {
      slug: "incorporating-business-ontario-guide",
      title: "How to Incorporate a Business in Ontario: A 2026 Step-by-Step Guide",
      category: "Incorporation", readTime: "4 min read", date: "2026-01-07",
      excerpt: "Federal vs. Ontario incorporation: official filing fees, name requirements, CRA accounts and ongoing obligations.",
    },
  ];

  const fmtDate = (d) => new Date(d).toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
  const arrow = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><path d="M9 5l7 7-7 7"/></svg>`;

  // Feature (first article)
  const feat = A[0];
  const featWrap = document.getElementById("blog-feature");
  if (featWrap) {
    featWrap.innerHTML = `
      <a class="blog-feature" href="blog-${feat.slug}.html">
        <div class="bf-media"><picture>
          <source type="image/webp" srcset="images/blog-t1-640.webp 640w, images/blog-t1-1024.webp 1024w, images/blog-t1.webp 1680w" sizes="(max-width: 900px) 100vw, 50vw" />
          <img src="images/blog-t1-1024.jpg" alt="${feat.title}" decoding="async" loading="lazy" srcset="images/blog-t1-640.jpg 640w, images/blog-t1-1024.jpg 1024w, images/blog-t1.jpg 1680w" sizes="(max-width: 900px) 100vw, 50vw" width="1680" height="938" />
        </picture></div>
        <div class="bf-body">
          <div class="cat">${feat.category} · ${feat.readTime}</div>
          <h2>${feat.title}</h2>
          <p>${feat.excerpt}</p>
          <span class="read">Read the guide ${arrow}</span>
        </div>
      </a>`;
  }

  // Grid (rest)
  grid.innerHTML = A.slice(1).map((a, i) => `
    <a class="blog-card" href="blog-${a.slug}.html" data-reveal data-reveal-delay="${i % 3}">
      <div class="blog-cat"><span class="cat">${a.category}</span><span class="rt">${a.readTime}</span></div>
      <div class="blog-body">
        <h2>${a.title}</h2>
        <p>${a.excerpt}</p>
        <div class="blog-foot"><time>${fmtDate(a.date)}</time><span class="read">Read ${arrow}</span></div>
      </div>
      <div class="blog-accent"></div>
    </a>`).join("");

  // Articles now open as their own pages (blog-<slug>.html) via standard links.
})();
