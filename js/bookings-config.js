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

  /* Real people. Set published: true only when name + bookingsUrl are real.
     Until then the page uses the company Bookings calendar above.
     Staff-specific URL: Bookings → Staff → booking link for that person. */
  staff: [
    {
      published: false,
      slug: "staff-1",
      name: "REPLACE_STAFF_1_NAME",
      title: "REPLACE_STAFF_1_TITLE",
      specializations: ["Personal Tax Services", "Corporate Tax Services"],
      photo: "",
      bio: "",
      email: "info@shelevate.ca",
      phone: "+1 (437) 925-6546",
      experience: "",
      location: "Scarborough, ON",
      languages: ["English"],
      bookingsUrl: "REPLACE_STAFF_1_BOOKINGS_URL",
      bookingsStaffId: "REPLACE_STAFF_1_ID",
    },
    {
      published: false,
      slug: "staff-2",
      name: "REPLACE_STAFF_2_NAME",
      title: "REPLACE_STAFF_2_TITLE",
      specializations: ["GST/HST Filing", "Bookkeeping"],
      photo: "",
      bio: "",
      email: "info@shelevate.ca",
      phone: "+1 (437) 925-6546",
      experience: "",
      location: "Scarborough, ON",
      languages: ["English"],
      bookingsUrl: "REPLACE_STAFF_2_BOOKINGS_URL",
      bookingsStaffId: "REPLACE_STAFF_2_ID",
    },
  ],
};
