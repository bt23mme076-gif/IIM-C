import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { featuredBlogs } from '../src/data/featuredBlogs.js';

// Builds public/sitemap.xml from static routes, built-in articles and published Firestore blogs.
// Uses the public Firestore REST API (blogs are world-readable), so no service account is needed.
// Never fails the build: if Firestore is unreachable, the sitemap still lists everything else.

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = 'https://www.profnag.com';
const firestoreUrl =
  'https://firestore.googleapis.com/v1/projects/iim-c-a4d73/databases/(default)/documents/blogs?pageSize=300';

const today = new Date().toISOString().slice(0, 10);
const toDay = (d) => {
  const t = new Date(d);
  return Number.isNaN(t.getTime()) ? today : t.toISOString().slice(0, 10);
};

const staticRoutes = [
  { loc: '/', changefreq: 'weekly', priority: 1.0 },
  { loc: '/about', changefreq: 'monthly', priority: 0.9 },
  { loc: '/research', changefreq: 'monthly', priority: 0.9 },
  { loc: '/book', changefreq: 'monthly', priority: 0.8 },
  { loc: '/blog', changefreq: 'weekly', priority: 0.8 },
  { loc: '/courses', changefreq: 'monthly', priority: 0.7 },
  { loc: '/consulting', changefreq: 'monthly', priority: 0.7 },
  { loc: '/opinions', changefreq: 'monthly', priority: 0.6 }
].map((u) => ({ ...u, lastmod: today }));

async function fetchFirestoreBlogs() {
  try {
    const res = await fetch(firestoreUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return (json.documents || [])
      .map((d) => {
        const f = d.fields || {};
        const id = d.name.split('/').pop();
        return {
          slug: f.slug?.stringValue || id,
          published: f.published?.booleanValue === true,
          date: f.date?.stringValue || f.date?.timestampValue || d.updateTime
        };
      })
      .filter((b) => b.published);
  } catch (err) {
    console.warn('Sitemap: could not fetch Firestore blogs (' + (err.message || err) + '); continuing without them.');
    return [];
  }
}

async function buildSitemap() {
  const urls = [...staticRoutes];
  const seen = new Set(urls.map((u) => u.loc));
  const addBlog = (slug, date) => {
    const loc = `/blog/${encodeURIComponent(slug)}`;
    if (seen.has(loc)) return;
    seen.add(loc);
    urls.push({ loc, changefreq: 'monthly', priority: 0.7, lastmod: toDay(date) });
  };

  featuredBlogs.forEach((b) => addBlog(b.slug, b.date));
  (await fetchFirestoreBlogs()).forEach((b) => addBlog(b.slug, b.date));

  const body = urls
    .map(
      (u) =>
        `  <url>\n    <loc>${siteRoot}${u.loc}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority.toFixed(1)}</priority>\n  </url>`
    )
    .join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;

  const outPath = path.resolve(__dirname, '..', 'public', 'sitemap.xml');
  fs.writeFileSync(outPath, xml, 'utf8');
  console.log(`Wrote ${urls.length} URLs to ${outPath}`);
}

buildSitemap().catch((err) => {
  console.warn('Sitemap generation failed, keeping existing sitemap:', err);
});
