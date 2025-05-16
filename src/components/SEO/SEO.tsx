
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { getKeywordString } from '@/data/seoKeywords';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogType?: 'website' | 'article' | 'profile' | 'product';
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  twitterCard?: 'summary' | 'summary_large_image';
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  jsonLd?: Record<string, any> | Array<Record<string, any>>;
  keywords?: string;
  author?: string;
  datePublished?: string;
  dateModified?: string;
  noIndex?: boolean;
  category?: string;
  breadcrumbs?: Array<{name: string, url: string}>;
  faqSchema?: Array<{question: string, answer: string}>;
}

const SEO: React.FC<SEOProps> = ({
  title = 'Celebrity Fashion & Style Inspiration | CelebrityPersona',
  description = 'Discover the latest celebrity fashion trends and shop affordable alternatives to recreate your favorite star looks at CelebrityPersona.',
  canonical,
  ogType = 'website',
  ogImage,
  ogTitle,
  ogDescription,
  twitterCard = 'summary_large_image',
  twitterTitle,
  twitterDescription,
  twitterImage,
  jsonLd,
  keywords,
  author = 'CelebrityPersona Team',
  datePublished,
  dateModified,
  noIndex = false,
  category,
  breadcrumbs,
  faqSchema,
}) => {
  const siteUrl = window.location.origin;
  const currentUrl = canonical || window.location.href;
  
  // Use our keyword generator if keywords not explicitly provided
  const keywordsContent = keywords || getKeywordString(category);
  
  // Generate breadcrumb schema if provided
  const breadcrumbSchema = breadcrumbs ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url.startsWith('http') ? item.url : `${siteUrl}${item.url}`
    }))
  } : null;
  
  // Generate FAQ schema if provided
  const faqSchemaData = faqSchema ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqSchema.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  } : null;
  
  // Combine all schema objects
  const allSchemas = [
    ...(jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : []),
    ...(breadcrumbSchema ? [breadcrumbSchema] : []),
    ...(faqSchemaData ? [faqSchemaData] : [])
  ];
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywordsContent} />
      <link rel="canonical" href={currentUrl} />
      <meta name="author" content={author} />
      
      {/* Open Graph Tags for better social sharing */}
      <meta property="og:url" content={currentUrl} />
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={ogTitle || title} />
      <meta property="og:description" content={ogDescription || description} />
      {ogImage && <meta property="og:image" content={ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`} />}
      <meta property="og:site_name" content="CelebrityPersona" />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:site" content="@celebritypersona" />
      <meta name="twitter:title" content={twitterTitle || ogTitle || title} />
      <meta name="twitter:description" content={twitterDescription || ogDescription || description} />
      {twitterImage && <meta name="twitter:image" content={twitterImage.startsWith('http') ? twitterImage : `${siteUrl}${twitterImage}`} />}
      
      {/* Article Specific Meta */}
      {datePublished && <meta property="article:published_time" content={datePublished} />}
      {dateModified && <meta property="article:modified_time" content={dateModified} />}
      {category && <meta property="article:section" content={category} />}
      {keywordsContent && keywordsContent.split(',').map((keyword, i) => (
        <meta key={i} property="article:tag" content={keyword.trim()} />
      ))}
      
      {/* No index directive if specified */}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      {!noIndex && <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />}
      
      {/* JSON-LD Structured Data */}
      {allSchemas.map((schema, index) => (
        <script key={`jsonld-${index}`} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};

export default SEO;
