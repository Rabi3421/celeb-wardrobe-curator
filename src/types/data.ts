
// Celebrity type
export interface Celebrity {
  id: string;
  name: string;
  image: string;
  outfitCount: number;
  bio: string;
  category: string;
  styleType: string;
}

// Outfit type
export interface Outfit {
  id: string;
  image: string;
  celebrityId: string;
  celebrity: string;
  title: string;
  description: string;
  fullDescription?: string;
  occasion?: string;
  date?: string;
  tags?: string[];
}

// Affiliate product type
export interface AffiliateProduct {
  id: string;
  outfitId: string;
  image: string;
  title: string;
  price: string;
  retailer: string;
  affiliateLink: string;
  description: string;
}

// Blog post type
export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  category: string;
  author: string;
}

// User type
export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: string;
}

// Analytics data type
export interface AnalyticsData {
  topPosts: Array<{
    id: string;
    title: string;
    views: number;
    clicks: number;
    revenue: number;
  }>;
  monthlyStats: Array<{
    month: string;
    views: number;
    clicks: number;
    revenue: number;
  }>;
  retailerPerformance: Array<{
    retailer: string;
    clicks: number;
    revenue: number;
  }>;
}
