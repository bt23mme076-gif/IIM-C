import React from 'react'
import { Helmet } from 'react-helmet-async'

const SITE_URL = 'https://www.profnag.com'
const SITE_NAME = 'Prof. Bodhibrata Nag'
export const DEFAULT_IMAGE =
  'https://cdn.jsdelivr.net/gh/bt23mme076-gif/prof-bnag-assets@main/images/home/iimc-sir-1773581302737.webp'

const absolute = (u) => (!u ? u : /^https?:\/\//.test(u) ? u : `${SITE_URL}${u.startsWith('/') ? '' : '/'}${u}`)

export default function SEO({ title, description, url, image, keywords, breadcrumbs, type = 'website', jsonLd, noindex }) {
  const siteUrl = absolute(url) || `${SITE_URL}/`
  // Relative images in Firestore content often 404 on the live host, so fall back to a known-good absolute URL.
  const img = image && /^https?:\/\//.test(image) ? image : DEFAULT_IMAGE
  const desc = description ? description.replace(/\s+/g, ' ').trim().slice(0, 300) : undefined

  const breadcrumbJson = breadcrumbs && Array.isArray(breadcrumbs) && breadcrumbs.length
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbs.map((b, i) => ({
          "@type": "ListItem",
          "position": i + 1,
          "name": b.name,
          "item": b.item
        }))
      }
    : null;

  const extraJson = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : []

  return (
    <Helmet>
      {title && <title>{title}</title>}
      {desc && <meta name="description" content={desc} />}
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'} />
      <link rel="canonical" href={siteUrl} />

      {/* Open Graph */}
      <meta property="og:site_name" content={SITE_NAME} />
      {title && <meta property="og:title" content={title} />}
      {desc && <meta property="og:description" content={desc} />}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:image" content={img} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      {title && <meta name="twitter:title" content={title} />}
      {desc && <meta name="twitter:description" content={desc} />}
      <meta name="twitter:image" content={img} />

      {breadcrumbJson && (
        <script type="application/ld+json">{JSON.stringify(breadcrumbJson)}</script>
      )}
      {extraJson.map((j, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify(j)}</script>
      ))}
    </Helmet>
  )
}
