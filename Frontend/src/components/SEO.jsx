import React from 'react'
import { Helmet } from 'react-helmet-async'

export default function SEO({ title, description, url, image, keywords, breadcrumbs }) {
  const siteUrl = url || 'https://www.profnag.com/'
  const img = image || '/SkillsedgeNew3.jpg'

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

  return (
    <Helmet>
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={siteUrl} />

      {/* Open Graph */}
      {title && <meta property="og:title" content={title} />}
      {description && <meta property="og:description" content={description} />}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:image" content={img} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      {title && <meta name="twitter:title" content={title} />}
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={img} />

      {breadcrumbJson && (
        <script type="application/ld+json">{JSON.stringify(breadcrumbJson)}</script>
      )}
    </Helmet>
  )
}
