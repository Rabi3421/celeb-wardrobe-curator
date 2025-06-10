
import { supabase } from '@/integrations/supabase/client';

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

export const fetchDashboardAnalytics = async (): Promise<DashboardAnalytics> => {
  try {
    // Get basic counts
    const [outfitsResult, productsResult, usersResult, sessionsResult] = await Promise.all([
      supabase.from('outfits').select('id', { count: 'exact' }),
      supabase.from('affiliate_products').select('id', { count: 'exact' }),
      supabase.from('user_sessions').select('user_id', { count: 'exact' }),
      supabase.from('user_sessions').select('id', { count: 'exact' })
    ]);

    // Get analytics data
    const [productAnalytics, blogAnalytics, recentEvents] = await Promise.all([
      supabase.from('product_analytics').select('*').order('views_count', { ascending: false }),
      supabase.from('blog_analytics').select('*, blog_posts(title)').order('views_count', { ascending: false }),
      supabase.from('analytics_events').select('*').order('created_at', { ascending: false }).limit(10)
    ]);

    // Calculate total revenue and clicks
    const totalRevenue = productAnalytics.data?.reduce((sum, item) => sum + (parseFloat(item.revenue?.toString() || '0')), 0) || 0;
    const totalClicks = productAnalytics.data?.reduce((sum, item) => sum + (item.clicks_count || 0), 0) || 0;

    // Get top performing posts (blog + outfits)
    const topPosts = blogAnalytics.data?.slice(0, 5).map(blog => ({
      title: blog.blog_posts?.title || 'Unknown',
      views: blog.views_count || 0,
      clicks: blog.clicks_count || 0,
      revenue: 0 // Blog posts don't directly generate revenue
    })) || [];

    // Get retailer performance from product analytics
    const retailerPerformance = await getRetailerPerformance();

    // Format recent activities
    const recentActivities = recentEvents.data?.map(event => ({
      type: event.event_type,
      description: formatActivityDescription(event),
      timestamp: event.created_at
    })) || [];

    // Format blog performance
    const blogPerformance = blogAnalytics.data?.map(blog => ({
      id: blog.blog_post_id,
      title: blog.blog_posts?.title || 'Unknown',
      views: blog.views_count || 0,
      readTime: blog.read_time_avg || 0,
      shares: blog.shares_count || 0
    })) || [];

    // Format product performance
    const productPerformance = await getProductPerformanceWithTitles();

    return {
      totalOutfits: outfitsResult.count || 0,
      totalProducts: productsResult.count || 0,
      totalRevenue,
      totalClicks,
      totalUsers: new Set(usersResult.data?.map(s => s.user_id).filter(Boolean)).size,
      totalSessions: sessionsResult.count || 0,
      topPosts,
      retailerPerformance,
      recentActivities,
      blogPerformance,
      productPerformance
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

const getRetailerPerformance = async () => {
  try {
    const { data: affiliateProducts } = await supabase.from('affiliate_products').select('retailer, id');
    const { data: productAnalytics } = await supabase.from('product_analytics').select('*');

    const retailerMap = new Map();
    
    affiliateProducts?.forEach(product => {
      const analytics = productAnalytics?.find(a => a.product_id === product.id && a.product_type === 'affiliate_product');
      if (analytics) {
        const current = retailerMap.get(product.retailer) || { clicks: 0, revenue: 0 };
        retailerMap.set(product.retailer, {
          clicks: current.clicks + (analytics.clicks_count || 0),
          revenue: current.revenue + (parseFloat(analytics.revenue?.toString() || '0'))
        });
      }
    });

    return Array.from(retailerMap.entries()).map(([retailer, stats]) => ({
      retailer,
      clicks: stats.clicks,
      revenue: stats.revenue
    }));
  } catch (error) {
    console.error('Error fetching retailer performance:', error);
    return [];
  }
};

const getProductPerformanceWithTitles = async () => {
  try {
    const { data: productAnalytics } = await supabase.from('product_analytics').select('*');
    
    const performance = [];
    
    for (const analytics of productAnalytics || []) {
      let title = 'Unknown';
      
      if (analytics.product_type === 'outfit') {
        const { data: outfit } = await supabase.from('outfits').select('title').eq('id', analytics.product_id).single();
        title = outfit?.title || 'Unknown Outfit';
      } else if (analytics.product_type === 'affiliate_product') {
        const { data: product } = await supabase.from('affiliate_products').select('title').eq('id', analytics.product_id).single();
        title = product?.title || 'Unknown Product';
      }
      
      performance.push({
        id: analytics.product_id,
        title,
        type: analytics.product_type as 'outfit' | 'affiliate_product',
        views: analytics.views_count || 0,
        clicks: analytics.clicks_count || 0,
        revenue: parseFloat(analytics.revenue?.toString() || '0')
      });
    }
    
    return performance.sort((a, b) => b.views - a.views);
  } catch (error) {
    console.error('Error fetching product performance:', error);
    return [];
  }
};

const formatActivityDescription = (event: any): string => {
  switch (event.event_type) {
    case 'page_view':
      return `Page viewed: ${event.page_url}`;
    case 'product_click':
      return `Product clicked on ${event.page_url}`;
    case 'buy_now_click':
      return `Buy now button clicked`;
    case 'blog_read':
      return `Blog post read: ${event.metadata?.title || 'Unknown'}`;
    case 'outfit_view':
      return `Outfit viewed: ${event.metadata?.title || 'Unknown'}`;
    case 'affiliate_click':
      return `Affiliate link clicked: ${event.metadata?.title || 'Unknown'}`;
    default:
      return `${event.event_type} event occurred`;
  }
};
