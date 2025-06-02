
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { getEnhancedKeywordString, seoFaqData } from '@/data/enhancedSeoKeywords';

interface EnhancedSEOProps {
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
  celebrity?: string;
  breadcrumbs?: Array<{name: string, url: string}>;
  faqSchema?: Array<{question: string, answer: string}>;
  // Enhanced schema options
  itemListSchema?: {
    name: string;
    description: string;
    items: Array<{
      name: string;
      description: string;
      image?: string;
      url: string;
      author?: string;
    }>;
  };
  productSchema?: {
    name: string;
    description: string;
    image: string;
    price?: string;
    currency?: string;
    availability?: string;
    brand?: string;
    category?: string;
  };
  reviewSchema?: {
    itemName: string;
    rating: number;
    reviewCount: number;
    bestRating?: number;
    worstRating?: number;
  };
  howToSchema?: {
    name: string;
    description: string;
    steps: Array<{
      name: string;
      text: string;
      image?: string;
    }>;
  };
}

const EnhancedSEO: React.FC<EnhancedSEOProps> = ({
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
  celebrity,
  breadcrumbs,
  faqSchema,
  itemListSchema,
  productSchema,
  reviewSchema,
  howToSchema,
}) => {
  const siteUrl = window.location.origin;
  const currentUrl = canonical || window.location.href;
  
  // Use enhanced keyword generator if keywords not explicitly provided
  const keywordsContent = keywords || getEnhancedKeywordString(category, celebrity);
  
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
  
  // Generate FAQ schema - use provided or default
  const faqSchemaData = faqSchema || (category === 'outfits' ? seoFaqData.outfits : seoFaqData.general);
  const faqSchema_formatted = faqSchemaData ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqSchemaData.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  } : null;
  
  // Generate ItemList schema for listings
  const itemListSchemaData = itemListSchema ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": itemListSchema.name,
    "description": itemListSchema.description,
    "numberOfItems": itemListSchema.items.length,
    "itemListElement": itemListSchema.items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Article",
        "name": item.name,
        "description": item.description,
        "image": item.image,
        "url": item.url.startsWith('http') ? item.url : `${siteUrl}${item.url}`,
        ...(item.author && {
          "author": {
            "@type": "Person",
            "name": item.author
          }
        })
      }
    }))
  } : null;
  
  // Generate Product schema for shopping guides
  const productSchemaData = productSchema ? {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": productSchema.name,
    "description": productSchema.description,
    "image": productSchema.image.startsWith('http') ? productSchema.image : `${siteUrl}${productSchema.image}`,
    ...(productSchema.price && {
      "offers": {
        "@type": "Offer",
        "price": productSchema.price,
        "priceCurrency": productSchema.currency || "USD",
        "availability": productSchema.availability || "https://schema.org/InStock"
      }
    }),
    ...(productSchema.brand && { "brand": { "@type": "Brand", "name": productSchema.brand } }),
    ...(productSchema.category && { "category": productSchema.category })
  } : null;
  
  // Generate Review/Rating schema
  const reviewSchemaData = reviewSchema ? {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": reviewSchema.itemName,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": reviewSchema.rating,
      "reviewCount": reviewSchema.reviewCount,
      "bestRating": reviewSchema.bestRating || 5,
      "worstRating": reviewSchema.worstRating || 1
    }
  } : null;
  
  // Generate HowTo schema for tutorials
  const howToSchemaData = howToSchema ? {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": howToSchema.name,
    "description": howToSchema.description,
    "step": howToSchema.steps.map((step, index) => ({
      "@type": "HowToStep",
      "position": index + 1,
      "name": step.name,
      "text": step.text,
      ...(step.image && {
        "image": step.image.startsWith('http') ? step.image : `${siteUrl}${step.image}`
      })
    }))
  } : null;
  
  // Organization schema for brand identity
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "CelebrityPersona",
    "url": siteUrl,
    "logo": `${siteUrl}/logo.svg`,
    "description": "Your ultimate destination for celebrity fashion inspiration and affordable style alternatives.",
    "sameAs": [
      "https://twitter.com/celebritypersona",
      "https://instagram.com/celebritypersona",
      "https://facebook.com/celebritypersona"
    ]
  };
  
  // Website schema for homepage
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "CelebrityPersona",
    "url": siteUrl,
    "description": "Discover celebrity fashion trends and shop affordable alternatives",
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${siteUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };
  
  // Combine all schema objects
  const allSchemas = [
    organizationSchema,
    websiteSchema,
    ...(jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : []),
    ...(breadcrumbSchema ? [breadcrumbSchema] : []),
    ...(faqSchema_formatted ? [faqSchema_formatted] : []),
    ...(itemListSchemaData ? [itemListSchemaData] : []),
    ...(productSchemaData ? [productSchemaData] : []),
    ...(reviewSchemaData ? [reviewSchemaData] : []),
    ...(howToSchemaData ? [howToSchemaData] : [])
  ].filter(Boolean);
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywordsContent} />
      <link rel="canonical" href={currentUrl} />
      <meta name="author" content={author} />
      
      {/* Enhanced meta tags for better SEO */}
      <meta name="theme-color" content="#f8f9fa" />
      <meta name="application-name" content="CelebrityPersona" />
      
      {/* Open Graph Tags */}
      <meta property="og:url" content={currentUrl} />
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={ogTitle || title} />
      <meta property="og:description" content={ogDescription || description} />
      <meta property="og:site_name" content="CelebrityPersona" />
      {ogImage && <meta property="og:image" content={ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`} />}
      {ogImage && <meta property="og:image:alt" content={ogTitle || title} />}
      {ogImage && <meta property="og:image:width" content="1200" />}
      {ogImage && <meta property="og:image:height" content="630" />}
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:site" content="@celebritypersona" />
      <meta name="twitter:creator" content="@celebritypersona" />
      <meta name="twitter:title" content={twitterTitle || ogTitle || title} />
      <meta name="twitter:description" content={twitterDescription || ogDescription || description} />
      {twitterImage && <meta name="twitter:image" content={twitterImage.startsWith('http') ? twitterImage : `${siteUrl}${twitterImage}`} />}
      
      {/* Article Specific Meta */}
      {datePublished && <meta property="article:published_time" content={datePublished} />}
      {dateModified && <meta property="article:modified_time" content={dateModified} />}
      {category && <meta property="article:section" content={category} />}
      {author && <meta property="article:author" content={author} />}
      
      {/* Additional meta tags for SEO */}
      <meta name="language" content="en" />
      <meta name="revisit-after" content="7 days" />
      <meta name="rating" content="general" />
      
      {/* Robots meta tag */}
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}
      
      {/* JSON-LD Structured Data */}
      {allSchemas.map((schema, index) => (
        <script key={`jsonld-${index}`} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};

export default EnhancedSEO;
