
// SEO Content Optimization Utilities
export interface SEOContentConfig {
  maxMetaDescLength?: number;
  maxTitleLength?: number;
  keywordDensity?: number;
}

const defaultConfig: SEOContentConfig = {
  maxMetaDescLength: 160,
  maxTitleLength: 60,
  keywordDensity: 0.02 // 2% keyword density
};

// Generate optimized meta description with keywords
export const generateOptimizedMetaDescription = (
  content: string,
  primaryKeyword: string,
  config: SEOContentConfig = defaultConfig
): string => {
  const { maxMetaDescLength = 160 } = config;
  
  // Ensure primary keyword is included
  if (!content.toLowerCase().includes(primaryKeyword.toLowerCase())) {
    content = `${primaryKeyword} - ${content}`;
  }
  
  // Truncate if too long, but try to end at a word boundary
  if (content.length > maxMetaDescLength) {
    const truncated = content.substring(0, maxMetaDescLength - 3);
    const lastSpace = truncated.lastIndexOf(' ');
    return lastSpace > maxMetaDescLength * 0.8 
      ? `${truncated.substring(0, lastSpace)}...`
      : `${truncated}...`;
  }
  
  return content;
};

// Generate SEO-optimized alt text for images
export const generateOptimizedAltText = (
  celebrity: string,
  outfit: string,
  occasion?: string,
  brand?: string
): string => {
  let altText = `${celebrity} wearing ${outfit}`;
  
  if (occasion) {
    altText += ` at ${occasion}`;
  }
  
  if (brand) {
    altText += ` by ${brand}`;
  }
  
  altText += ' - Celebrity fashion inspiration';
  
  return altText;
};

// Generate optimized page title
export const generateOptimizedTitle = (
  baseTitle: string,
  keywords: string[],
  config: SEOContentConfig = defaultConfig
): string => {
  const { maxTitleLength = 60 } = config;
  
  // Add primary keyword if not present
  const primaryKeyword = keywords[0];
  let title = baseTitle;
  
  if (primaryKeyword && !title.toLowerCase().includes(primaryKeyword.toLowerCase())) {
    title = `${primaryKeyword} | ${title}`;
  }
  
  // Add brand name if there's space
  const brandName = "CelebrityPersona";
  if (title.length + brandName.length + 3 <= maxTitleLength) {
    title += ` | ${brandName}`;
  }
  
  return title.length > maxTitleLength 
    ? title.substring(0, maxTitleLength - 3) + '...'
    : title;
};

// Generate internal linking suggestions
export const generateInternalLinks = (
  currentCategory: string,
  celebrity?: string,
  occasion?: string
): Array<{url: string, anchor: string, title: string}> => {
  const links: Array<{url: string, anchor: string, title: string}> = [];
  
  // Category-based links
  if (currentCategory !== 'all') {
    links.push({
      url: '/outfits',
      anchor: 'Browse all celebrity outfits',
      title: 'Explore more celebrity fashion inspiration'
    });
  }
  
  // Celebrity-specific links
  if (celebrity) {
    const celebritySlug = celebrity.toLowerCase().replace(/\s+/g, '-');
    links.push({
      url: `/celebrity/${celebritySlug}`,
      anchor: `More ${celebrity} outfits`,
      title: `Discover more ${celebrity} fashion looks and style inspiration`
    });
  }
  
  // Occasion-based links
  if (occasion && occasion !== 'casual') {
    links.push({
      url: `/category/${occasion}`,
      anchor: `${occasion} fashion inspiration`,
      title: `Browse more ${occasion} celebrity outfits and style guides`
    });
  }
  
  // Related content links
  links.push(
    {
      url: '/blog',
      anchor: 'Fashion trend articles',
      title: 'Read the latest celebrity fashion trends and style tips'
    },
    {
      url: '/categories',
      anchor: 'Shop by category',
      title: 'Browse celebrity fashion by categories - dresses, shoes, accessories and more'
    }
  );
  
  return links;
};

// SEO-optimized content snippets for different sections
export const seoContentSnippets = {
  outfitGrid: {
    heading: "Celebrity Outfit Inspiration Gallery",
    description: "Discover the latest celebrity fashion trends and recreate iconic looks from your favorite stars. From red carpet glamour to everyday street style, find affordable alternatives to high-end designer pieces."
  },
  
  featuredOutfit: {
    description: "Today's featured celebrity look showcases the perfect blend of style and accessibility. Learn how to recreate this stunning outfit with budget-friendly alternatives and styling tips."
  },
  
  categoryFilter: {
    description: "Filter celebrity outfits by occasion to find the perfect inspiration for your event. Whether you need red carpet elegance, casual street style, or professional workwear, discover looks that fit your lifestyle and budget."
  },
  
  shoppingGuides: {
    heading: "Celebrity Style Shopping Guides",
    description: "Shop celebrity-inspired fashion with our curated guides featuring affordable alternatives to designer pieces. Find dupes, similar styles, and budget-friendly options to recreate your favorite star's look."
  }
};
