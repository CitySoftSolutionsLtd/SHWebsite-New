/* =====================================================================
   SH ELEVATE — Microsoft Bookings + staff (fill in with the client)
   Public values only. Never put an Azure client secret in this file.
   ===================================================================== */
window.SH_BOOKINGS = {
  /* Microsoft Bookings → Booking page → copy the public link.
     Typical shapes:
       https://outlook.office365.com/owa/calendar/NAME@shelevate.ca/bookings/
       https://outlook.office365.com/book/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/
       https://outlook.office.com/book/YourBusiness/ */
  pageUrl: "REPLACE_MICROSOFT_BOOKINGS_PAGE_URL",

  /* Bookings business GUID — Bookings admin / Graph (optional, future API). */
  businessId: "REPLACE_BOOKINGS_BUSINESS_ID",

  /* Azure AD app used only if a server-side Graph booking API is added later.
     Do not put AZURE_CLIENT_SECRET in the website. */
  azureTenantId: "REPLACE_AZURE_TENANT_ID",
  azureClientId: "REPLACE_AZURE_CLIENT_ID",

  /* Cloudflare Turnstile site key (Dashboard → Turnstile).
     Leave the REPLACE_ value until the client creates a widget. */
  turnstileSiteKey: "REPLACE_TURNSTILE_SITE_KEY",

  /* Cap how often one browser can open the calendar (stops scripted floods). */
  maxOpensPerHour: 6,

  /* Real people. published: true when the name is real (photos optional).
     Staff-specific URL: Bookings → Staff → booking link for that person.
     Until a Bookings URL is filled, Book falls back to the firm calendar
     (or the call/email message if that URL is still a placeholder).
     Drop headshots at images/team/<slug>.webp when the files are on disk. */
  staff: [
    {
      published: true,
      slug: "hanna-joice",
      name: "Hanna Joice",
      title: "Co-Founder & Chief Executive Officer",
      specializations: ["Personal Tax Services", "Corporate Tax Services", "Tax Planning"],
      photo: "",
      bio: "Hanna Joice is the Co-Founder and Chief Executive Officer of SH Elevate Financial Group, where she leads the firm's vision, growth strategy, and commitment to delivering exceptional financial solutions. With expertise in taxation, financial planning, and business advisory, she combines strategic insight with a client-centered approach. Under her leadership, the firm continues to grow as a trusted partner for individuals, families, and business owners seeking clarity and sustainable financial growth.",
      email: "info@shelevate.ca",
      phone: "+1 (437) 925-6546",
      experience: "",
      location: "Scarborough, ON",
      languages: ["English"],
      bookingsUrl: "REPLACE_HANNA_JOICE_BOOKINGS_URL",
      bookingsStaffId: "REPLACE_HANNA_JOICE_ID",
    },
    {
      published: true,
      slug: "stevens-sabu",
      name: "Stevens Sabu",
      title: "Co-Founder and Director",
      specializations: ["Corporate Tax Services", "Tax Planning"],
      photo: "",
      bio: "Stevens Sabu serves as Co-Founder and Director at SH Elevate Financial Group, where he is dedicated to shaping the firm's vision, driving growth, and delivering trusted financial guidance. He works with individuals, families, and business owners on financial planning, taxation, and long-term wealth strategies. Known for his professional approach and attention to detail, Stevens focuses on clear guidance and strategies aligned with each client's goals.",
      email: "info@shelevate.ca",
      phone: "+1 (437) 925-6546",
      experience: "",
      location: "Scarborough, ON",
      languages: ["English"],
      bookingsUrl: "REPLACE_STEVENS_SABU_BOOKINGS_URL",
      bookingsStaffId: "REPLACE_STEVENS_SABU_ID",
    },
    {
      published: true,
      slug: "mehakdeep-kaur",
      name: "Mehakdeep Kaur",
      title: "Senior Client Manager",
      specializations: ["Personal Tax Services", "Tax Planning"],
      photo: "",
      bio: "Mehakdeep Kaur is a Senior Client Manager at SH Elevate Financial Group, passionate about helping individuals, families, and business owners feel confident and supported with their taxes and financial matters. She takes the time to understand each client's situation and works to make the tax process simple and stress-free. Whether assisting with tax planning, compliance, or financial guidance, she is committed to delivering solutions that make a difference.",
      email: "info@shelevate.ca",
      phone: "+1 (437) 925-6546",
      experience: "",
      location: "Scarborough, ON",
      languages: ["English"],
      bookingsUrl: "REPLACE_MEHAKDEEP_KAUR_BOOKINGS_URL",
      bookingsStaffId: "REPLACE_MEHAKDEEP_KAUR_ID",
    },
    {
      published: true,
      slug: "ginil-jose",
      name: "Ginil Jose",
      title: "Client Manager",
      specializations: ["Personal Tax Services", "Tax Planning"],
      photo: "",
      bio: "Ginil Jose serves as Client Manager at SH Elevate Financial Group, where he is dedicated to building strong client relationships and ensuring every individual receives personalized financial guidance. He works closely with individuals, families, and business owners to navigate tax and financial matters with confidence. Known for his approachable nature and attention to detail, Ginil helps clients understand tax strategies, government benefits, and financial opportunities.",
      email: "info@shelevate.ca",
      phone: "+1 (437) 925-6546",
      experience: "",
      location: "Scarborough, ON",
      languages: ["English"],
      bookingsUrl: "REPLACE_GINIL_JOSE_BOOKINGS_URL",
      bookingsStaffId: "REPLACE_GINIL_JOSE_ID",
    },
  ],
};
