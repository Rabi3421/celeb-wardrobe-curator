
// SEO URL and Canonical Management
export interface CanonicalConfig {
  baseUrl: string;
  preferredDomain?: string;
  forceHttps?: boolean;
  removeTrailingSlash?: boolean;
}

export interface HreflangLink {
  hreflang: string;
  href: string;
}

const defaultCanonicalConfig: CanonicalConfig = {
  baseUrl: 'https://www.celebritypersona.com',
  forceHttps: true,
  removeTrailingSlash: true
};

// Generate canonical URL
export const generateCanonicalUrl = (
  path: string,
  config: CanonicalConfig = defaultCanonicalConfig
): string => {
  const { baseUrl, forceHttps, removeTrailingSlash } = config;
  
  // Ensure path starts with /
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  // Remove trailing slash if configured
  const finalPath = removeTrailingSlash && cleanPath.length > 1 && cleanPath.endsWith('/')
    ? cleanPath.slice(0, -1)
    : cleanPath;
  
  // Ensure HTTPS if configured
  const protocol = forceHttps ? 'https://' : baseUrl.includes('https://') ? 'https://' : 'http://';
  const domain = baseUrl.replace(/^https?:\/\//, '');
  
  return `${protocol}${domain}${finalPath}`;
};

// Generate hreflang links for international SEO
export const generateHreflangLinks = (
  currentPath: string,
  supportedLanguages: string[] = ['en'],
  config: CanonicalConfig = defaultCanonicalConfig
): HreflangLink[] => {
  const links: HreflangLink[] = [];
  
  supportedLanguages.forEach(lang => {
    const href = lang === 'en' 
      ? generateCanonicalUrl(currentPath, config)
      : generateCanonicalUrl(`/${lang}${currentPath}`, config);
    
    links.push({
      hreflang: lang,
      href
    });
  });
  
  // Add x-default for international targeting
  links.push({
    hreflang: 'x-default',
    href: generateCanonicalUrl(currentPath, config)
  });
  
  return links;
};

// Generate structured URLs for better SEO
export const generateSEOFriendlyUrl = (title: string, category?: string): string => {
  // Convert to lowercase and replace spaces/special chars with hyphens
  let slug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
  
  // Remove leading/trailing hyphens
  slug = slug.replace(/^-+|-+$/g, '');
  
  // Add category prefix if provided
  if (category && category !== 'all') {
    const categorySlug = category.toLowerCase().replace(/\s+/g, '-');
    return `/${categorySlug}/${slug}`;
  }
  
  return `/${slug}`;
};

// URL optimization for pagination and filters
export const generatePaginationUrls = (
  basePath: string,
  currentPage: number,
  totalPages: number,
  config: CanonicalConfig = defaultCanonicalConfig
): {
  canonical: string;
  prev?: string;
  next?: string;
} => {
  const baseUrl = generateCanonicalUrl(basePath, config);
  
  const result: {canonical: string; prev?: string; next?: string} = {
    canonical: currentPage === 1 ? baseUrl : `${baseUrl}?page=${currentPage}`
  };
  
  if (currentPage > 1) {
    result.prev = currentPage === 2 ? baseUrl : `${baseUrl}?page=${currentPage - 1}`;
  }
  
  if (currentPage < totalPages) {
    result.next = `${baseUrl}?page=${currentPage + 1}`;
  }
  
  return result;
};
