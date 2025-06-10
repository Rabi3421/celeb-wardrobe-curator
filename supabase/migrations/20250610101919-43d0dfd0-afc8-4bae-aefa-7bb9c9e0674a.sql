
-- Create analytics tracking tables

-- Table to track page views and interactions
CREATE TABLE public.analytics_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL, -- 'page_view', 'product_click', 'buy_now_click', 'blog_read'
  page_url TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id TEXT,
  user_agent TEXT,
  ip_address TEXT,
  referrer TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Event-specific data stored as JSON
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Table to track product performance
CREATE TABLE public.product_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL, -- references outfit or affiliate product
  product_type TEXT NOT NULL, -- 'outfit' or 'affiliate_product'
  views_count INTEGER DEFAULT 0,
  clicks_count INTEGER DEFAULT 0,
  conversion_count INTEGER DEFAULT 0,
  revenue DECIMAL(10,2) DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table to track blog post performance
CREATE TABLE public.blog_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  blog_post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  views_count INTEGER DEFAULT 0,
  read_time_avg INTEGER DEFAULT 0, -- average read time in seconds
  shares_count INTEGER DEFAULT 0,
  clicks_count INTEGER DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table to track user sessions and engagement
CREATE TABLE public.user_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_address TEXT,
  user_agent TEXT,
  pages_visited INTEGER DEFAULT 0,
  session_duration INTEGER DEFAULT 0, -- in seconds
  referrer TEXT,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ended_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_analytics_events_event_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at);
CREATE INDEX idx_analytics_events_page_url ON analytics_events(page_url);
CREATE INDEX idx_product_analytics_product_id ON product_analytics(product_id);
CREATE INDEX idx_blog_analytics_blog_post_id ON blog_analytics(blog_post_id);
CREATE INDEX idx_user_sessions_session_id ON user_sessions(session_id);

-- Enable Row Level Security (RLS) - Admin only access
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access only
CREATE POLICY "Admin can view all analytics events" ON analytics_events FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admin can insert analytics events" ON analytics_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can view all product analytics" ON product_analytics FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admin can view all blog analytics" ON blog_analytics FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admin can view all user sessions" ON user_sessions FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Create function to update analytics counters
CREATE OR REPLACE FUNCTION update_product_analytics(
  p_product_id UUID,
  p_product_type TEXT,
  p_event_type TEXT,
  p_revenue DECIMAL DEFAULT 0
) RETURNS VOID AS $$
BEGIN
  INSERT INTO product_analytics (product_id, product_type, views_count, clicks_count, conversion_count, revenue)
  VALUES (p_product_id, p_product_type, 
    CASE WHEN p_event_type = 'view' THEN 1 ELSE 0 END,
    CASE WHEN p_event_type = 'click' THEN 1 ELSE 0 END,
    CASE WHEN p_event_type = 'conversion' THEN 1 ELSE 0 END,
    p_revenue
  )
  ON CONFLICT (product_id) 
  DO UPDATE SET
    views_count = product_analytics.views_count + (CASE WHEN p_event_type = 'view' THEN 1 ELSE 0 END),
    clicks_count = product_analytics.clicks_count + (CASE WHEN p_event_type = 'click' THEN 1 ELSE 0 END),
    conversion_count = product_analytics.conversion_count + (CASE WHEN p_event_type = 'conversion' THEN 1 ELSE 0 END),
    revenue = product_analytics.revenue + p_revenue,
    last_updated = now();
END;
$$ LANGUAGE plpgsql;

-- Create function to update blog analytics
CREATE OR REPLACE FUNCTION update_blog_analytics(
  p_blog_post_id UUID,
  p_event_type TEXT,
  p_read_time INTEGER DEFAULT 0
) RETURNS VOID AS $$
BEGIN
  INSERT INTO blog_analytics (blog_post_id, views_count, read_time_avg, shares_count, clicks_count)
  VALUES (p_blog_post_id,
    CASE WHEN p_event_type = 'view' THEN 1 ELSE 0 END,
    p_read_time,
    CASE WHEN p_event_type = 'share' THEN 1 ELSE 0 END,
    CASE WHEN p_event_type = 'click' THEN 1 ELSE 0 END
  )
  ON CONFLICT (blog_post_id)
  DO UPDATE SET
    views_count = blog_analytics.views_count + (CASE WHEN p_event_type = 'view' THEN 1 ELSE 0 END),
    read_time_avg = CASE 
      WHEN p_event_type = 'read_time' AND p_read_time > 0 THEN 
        (blog_analytics.read_time_avg * blog_analytics.views_count + p_read_time) / (blog_analytics.views_count + 1)
      ELSE blog_analytics.read_time_avg 
    END,
    shares_count = blog_analytics.shares_count + (CASE WHEN p_event_type = 'share' THEN 1 ELSE 0 END),
    clicks_count = blog_analytics.clicks_count + (CASE WHEN p_event_type = 'click' THEN 1 ELSE 0 END),
    last_updated = now();
END;
$$ LANGUAGE plpgsql;

-- Add unique constraints
ALTER TABLE product_analytics ADD CONSTRAINT unique_product_analytics UNIQUE (product_id, product_type);
ALTER TABLE blog_analytics ADD CONSTRAINT unique_blog_analytics UNIQUE (blog_post_id);
