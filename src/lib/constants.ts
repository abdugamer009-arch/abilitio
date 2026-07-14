// Max AI-backed ABBI replies per user per day. Beyond this, the endpoint
// falls back to the free template engine, protecting the Anthropic budget
// from a single account looping the free chat.
export const ABBI_DAILY_AI_LIMIT = 40;

// Company / contact details — single source of truth used across legal,
// contact, and footer surfaces.
export const SITE_NAME = "Abilitio";
// Canonical production origin (no trailing slash). Used for absolute URLs in
// social meta tags, the sitemap, and structured data.
export const SITE_URL = "https://abilitio.app";
export const OG_IMAGE_URL = `${SITE_URL}/og-image.png`;
export const CONTACT_EMAIL = "ibodullayevabdurahmon95@gmail.com";
export const CONTACT_PHONE = "+998 88 048 18 81";
export const COMPANY_LOCATION = "Uzbekistan";
// Last review date for the legal documents. Update when policies change.
export const LEGAL_LAST_UPDATED = "June 29, 2026";
