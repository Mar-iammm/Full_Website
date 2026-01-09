// Normalizes Webflow-exported HTML fragments so they behave inside Vite + React.
// - Fixes asset paths ("assets/..." -> "/assets/...")
// - Converts internal .html links to React Router paths
// - Drops script tags (Webflow runtime) to avoid duplicate / broken JS

export function normalizeHtml(html) {
  if (!html) return '';

  let out = html;

  // 1) Assets should be absolute from the Vite public root.
  out = out.replaceAll('src="assets/', 'src="/assets/');
  out = out.replaceAll('href="assets/', 'href="/assets/');
  out = out.replaceAll("url('assets/", "url('/assets/");
  out = out.replaceAll('url("assets/', 'url("/assets/');

  // 2) Internal links: /about.html -> /about, etc.
  out = out.replaceAll('/home.html', '/');
  out = out.replaceAll('/about.html', '/about');
  out = out.replaceAll('/contact.html', '/contact');
  out = out.replaceAll('/pricing.html', '/pricing');
  out = out.replaceAll('/waitlist.html', '/waitlist');

  // Some exports use relative "about.html" too.
  out = out.replaceAll('href="about.html"', 'href="/about"');
  out = out.replaceAll('href="contact.html"', 'href="/contact"');
  out = out.replaceAll('href="pricing.html"', 'href="/pricing"');
  out = out.replaceAll('href="waitlist.html"', 'href="/waitlist"');
  out = out.replaceAll('href="home.html"', 'href="/"');

  // 3) Remove scripts (Webflow / jQuery) because we use our own fallbacks.
  out = out.replace(/<script[\s\S]*?<\/script>/gi, '');

  return out;
}
