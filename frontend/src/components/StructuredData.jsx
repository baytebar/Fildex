// Structured Data Components for SEO

export const OrganizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Fildex Solutions",
  "url": "https://fildex.ie",
  "logo": "https://fildex.ie/images/FILDEX_SOLUTIONS.png",
  "description": "Complete Digital Service Provider offering website development, software solutions, IT training, and business process support in Cork, Ireland.",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Cork",
    "addressCountry": "IE"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+353-XX-XXXXXXX",
    "contactType": "customer service",
    "availableLanguage": "English"
  },
  "sameAs": [
    "https://www.linkedin.com/company/fildex-solutions",
    "https://twitter.com/fildexsolutions"
  ],
  "foundingDate": "2024",
  "numberOfEmployees": "10-50",
  "industry": "Information Technology"
}

export const JobPostingSchema = (job) => ({
  "@context": "https://schema.org",
  "@type": "JobPosting",
  "title": job.job_title || job.title,
  "description": job.description,
  "datePosted": job.createdAt,
  "validThrough": job.deadline,
  "employmentType": job.employment_type || "FULL_TIME",
  "hiringOrganization": {
    "@type": "Organization",
    "name": "Fildex Solutions",
    "sameAs": "https://fildex.ie"
  },
  "jobLocation": {
    "@type": "Place",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": job.location || "Cork",
      "addressCountry": "IE"
    }
  },
  "baseSalary": job.salary_range ? {
    "@type": "MonetaryAmount",
    "currency": "EUR",
    "value": job.salary_range
  } : undefined,
  "workHours": job.work_hours || "40 hours per week",
  "qualifications": job.qualifications || "Relevant experience in the field",
  "responsibilities": job.responsibilities || "Various responsibilities as assigned"
})

export const WebSiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Fildex Solutions",
  "url": "https://fildex.ie",
  "description": "Complete Digital Service Provider offering website development, software solutions, IT training, and business process support in Cork, Ireland.",
  "publisher": {
    "@type": "Organization",
    "name": "Fildex Solutions",
    "logo": {
      "@type": "ImageObject",
      "url": "https://fildex.ie/images/FILDEX_SOLUTIONS.png"
    }
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://fildex.ie/jobs?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}

export const ServiceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Digital Services",
  "description": "Complete digital services including website development, software solutions, IT training, and business process support",
  "provider": {
    "@type": "Organization",
    "name": "Fildex Solutions",
    "url": "https://fildex.ie"
  },
  "areaServed": {
    "@type": "Country",
    "name": "Ireland"
  },
  "serviceType": "Digital Services",
  "offers": {
    "@type": "Offer",
    "description": "Professional digital services and IT training",
    "priceCurrency": "EUR"
  }
}

export const TrainingCourseSchema = (course) => ({
  "@context": "https://schema.org",
  "@type": "Course",
  "name": course.name || "IT Training Course",
  "description": course.description || "Professional IT training course",
  "provider": {
    "@type": "Organization",
    "name": "Fildex Solutions",
    "url": "https://fildex.ie"
  },
  "courseMode": "online",
  "educationalLevel": "beginner",
  "inLanguage": "en",
  "offers": {
    "@type": "Offer",
    "price": course.price || "Contact for pricing",
    "priceCurrency": "EUR"
  }
})

export const BreadcrumbSchema = (breadcrumbs) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": breadcrumbs.map((crumb, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": crumb.name,
    "item": crumb.url
  }))
})
