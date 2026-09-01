// Canonical public origin. Override with NEXT_PUBLIC_SITE_URL once a custom
// domain is attached; falls back to the workers.dev URL.
export const SITE_URL = (
    process.env.NEXT_PUBLIC_SITE_URL || 'https://august-patisserie.hoyanwe.workers.dev'
).replace(/\/$/, '');
