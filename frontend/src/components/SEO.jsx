import { Helmet } from '@dr.pogodin/react-helmet'

const SEO = ({ 
  title = "Fildex Solutions - Complete Digital Service Provider",
  description = "Fildex Solutions offers comprehensive digital services including website development, software solutions, IT training, and business process support in Cork, Ireland.",
  keywords = "digital services, website development, software solutions, IT training, business process, Cork, Ireland, cloud engineering, DevOps, AI/ML, recruitment",
  image = "/images/FILDEX_SOLUTIONS.png",
  url = "https://fildex.ie",
  type = "website",
  structuredData = null,
  canonical = null
}) => {
  const fullTitle = title.includes("Fildex Solutions") ? title : `${title} | Fildex Solutions`
  const fullUrl = canonical || url
  const fullImage = image.startsWith('http') ? image : `${url}${image}`

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Fildex Solutions" />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="en" />
      <meta name="revisit-after" content="7 days" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content="Fildex Solutions" />
      <meta property="og:locale" content="en_IE" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
      <meta name="twitter:site" content="@fildexsolutions" />
      <meta name="twitter:creator" content="@fildexsolutions" />
      
      {/* Additional SEO Meta Tags */}
      <meta name="theme-color" content="#3b82f6" />
      <meta name="msapplication-TileColor" content="#3b82f6" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Fildex Solutions" />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  )
}

export default SEO
