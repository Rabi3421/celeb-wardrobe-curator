
export interface DashboardAnalytics {
  totalOutfits: number;
  totalProducts: number;
  totalRevenue: number;
  totalClicks: number;
  totalUsers: number;
  totalSessions: number;
  topPosts: Array<{
    title: string;
    views: number;
    clicks: number;
    revenue: number;
  }>;
  retailerPerformance: Array<{
    retailer: string;
    clicks: number;
    revenue: number;
  }>;
  recentActivities: Array<{
    type: string;
    description: string;
    timestamp: string;
  }>;
  blogPerformance: Array<{
    id: string;
    title: string;
    views: number;
    readTime: number;
    shares: number;
  }>;
  productPerformance: Array<{
    id: string;
    title: string;
    type: 'outfit' | 'affiliate_product';
    views: number;
    clicks: number;
    revenue: number;
  }>;
}

// Mock analytics data - replace with your backend API calls
export const fetchDashboardAnalytics = async (): Promise<DashboardAnalytics> => {
  try {
    console.log('Fetching dashboard analytics...');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock analytics data
    return {
      totalOutfits: 25,
      totalProducts: 150,
      totalRevenue: 12500.50,
      totalClicks: 3420,
      totalUsers: 245,
      totalSessions: 1890,
      topPosts: [
        {
          title: "Zendaya's Met Gala Look",
          views: 1250,
          clicks: 85,
          revenue: 425.00
        },
        {
          title: "Harry Styles Concert Fashion",
          views: 980,
          clicks: 62,
          revenue: 310.00
        },
        {
          title: "Celebrity Red Carpet Trends",
          views: 750,
          clicks: 45,
          revenue: 225.00
        }
      ],
      retailerPerformance: [
        {
          retailer: "LuxeFashion",
          clicks: 145,
          revenue: 725.00
        },
        {
          retailer: "StyleHub",
          clicks: 98,
          revenue: 490.00
        },
        {
          retailer: "FashionForward",
          clicks: 67,
          revenue: 335.00
        }
      ],
      recentActivities: [
        {
          type: "outfit_view",
          description: "New outfit viewed: Zendaya Met Gala 2024",
          timestamp: new Date().toISOString()
        },
        {
          type: "product_click",
          description: "Product clicked: Designer Evening Gown",
          timestamp: new Date(Date.now() - 300000).toISOString()
        },
        {
          type: "blog_read",
          description: "Blog post read: Fashion Trends 2024",
          timestamp: new Date(Date.now() - 600000).toISOString()
        }
      ],
      blogPerformance: [
        {
          id: "1",
          title: "How Zendaya Revolutionized Red Carpet Fashion",
          views: 1250,
          readTime: 180,
          shares: 45
        },
        {
          id: "2",
          title: "The Rise of Gender-Fluid Fashion",
          views: 980,
          readTime: 220,
          shares: 32
        }
      ],
      productPerformance: [
        {
          id: "1",
          title: "Met Gala Statement Look",
          type: 'outfit',
          views: 1250,
          clicks: 85,
          revenue: 425.00
        },
        {
          id: "1",
          title: "Designer Evening Gown",
          type: 'affiliate_product',
          views: 650,
          clicks: 42,
          revenue: 210.00
        }
      ]
    };
  } catch (error) {
    console.error('Error fetching dashboard analytics:', error);
    // Return default values if there's an error
    return {
      totalOutfits: 0,
      totalProducts: 0,
      totalRevenue: 0,
      totalClicks: 0,
      totalUsers: 0,
      totalSessions: 0,
      topPosts: [],
      retailerPerformance: [],
      recentActivities: [],
      blogPerformance: [],
      productPerformance: []
    };
  }
};
