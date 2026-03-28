const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');

// Path to service account in repo (Backend/serviceAccountKey.json)
const serviceAccountPath = path.resolve(__dirname, '..', '..', 'Backend', 'serviceAccountKey.json');
if (!fs.existsSync(serviceAccountPath)) {
  console.error('serviceAccountKey.json not found at', serviceAccountPath);
  console.error('Please place your Firebase service account JSON at Backend/serviceAccountKey.json');
  process.exit(1);
}

const serviceAccount = require(serviceAccountPath);

try {
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
} catch (e) {
  // If already initialized in this process, ignore
}

const db = admin.firestore();

async function buildSitemap() {
  const siteRoot = 'https://www.profnag.com';
  const urls = [
    { loc: `${siteRoot}/`, changefreq: 'weekly', priority: 1.0 },
    { loc: `${siteRoot}/about`, changefreq: 'monthly', priority: 0.8 },
    { loc: `${siteRoot}/blog`, changefreq: 'weekly', priority: 0.7 },
    { loc: `${siteRoot}/book`, changefreq: 'monthly', priority: 0.6 }
  ];

  try {
    const snap = await db.collection('blogs').where('published', '==', true).get();
    snap.forEach(doc => {
      const data = doc.data();
      const slug = data.slug || doc.id;
      urls.push({ loc: `${siteRoot}/blog/${slug}`, changefreq: 'monthly', priority: 0.6 });
    });
  } catch (err) {
    console.warn('Could not fetch blogs from Firestore:', err.message || err);
    console.warn('Sitemap will include static pages only. Run this script with valid Backend/serviceAccountKey.json for full sitemap.');
  }

  const urlset = urls.map(u => `  <url>\n    <loc>${u.loc}</loc>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`).join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlset}\n</urlset>\n`;

  const outDir = path.resolve(__dirname, '..', 'public');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, 'sitemap.xml');
  fs.writeFileSync(outPath, xml, 'utf8');
  console.log('Wrote sitemap to', outPath);
}

buildSitemap().then(() => process.exit(0)).catch(err => { console.error(err); process.exit(1); });
