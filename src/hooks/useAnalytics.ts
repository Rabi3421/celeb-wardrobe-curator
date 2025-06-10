
import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AnalyticsEvent {
  eventType: 'page_view' | 'product_click' | 'buy_now_click' | 'blog_read' | 'blog_view' | 'outfit_view' | 'affiliate_click';
  pageUrl: string;
  metadata?: Record<string, any>;
}

class AnalyticsService {
  private sessionId: string;
  private sessionStart: Date;
  private pageViewStart: Date | null = null;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.sessionStart = new Date();
    this.initializeSession();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async initializeSession() {
    try {
      await supabase.from('user_sessions').insert({
        session_id: this.sessionId,
        ip_address: await this.getIPAddress(),
        user_agent: navigator.userAgent,
        referrer: document.referrer || null,
        started_at: this.sessionStart.toISOString()
      });
    } catch (error) {
      console.warn('Failed to initialize session:', error);
    }
  }

  private async getIPAddress(): Promise<string> {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch {
      return 'unknown';
    }
  }

  async trackEvent(event: AnalyticsEvent) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      await supabase.from('analytics_events').insert({
        event_type: event.eventType,
        page_url: event.pageUrl,
        user_id: user?.id || null,
        session_id: this.sessionId,
        user_agent: navigator.userAgent,
        ip_address: await this.getIPAddress(),
        referrer: document.referrer || null,
        metadata: event.metadata || {}
      });

      // Update specific analytics based on event type
      if (event.eventType === 'outfit_view' && event.metadata?.outfitId) {
        await supabase.rpc('update_product_analytics', {
          p_product_id: event.metadata.outfitId,
          p_product_type: 'outfit',
          p_event_type: 'view'
        });
      } else if (event.eventType === 'affiliate_click' && event.metadata?.productId) {
        await supabase.rpc('update_product_analytics', {
          p_product_id: event.metadata.productId,
          p_product_type: 'affiliate_product',
          p_event_type: 'click'
        });
      } else if (event.eventType === 'blog_view' && event.metadata?.blogPostId) {
        await supabase.rpc('update_blog_analytics', {
          p_blog_post_id: event.metadata.blogPostId,
          p_event_type: 'view'
        });
      }
    } catch (error) {
      console.warn('Failed to track event:', error);
    }
  }

  startPageView() {
    this.pageViewStart = new Date();
  }

  async endPageView(pageUrl: string, metadata?: Record<string, any>) {
    if (this.pageViewStart && metadata?.blogPostId) {
      const readTime = Math.floor((Date.now() - this.pageViewStart.getTime()) / 1000);
      if (readTime > 10) { // Only track if user spent more than 10 seconds
        await supabase.rpc('update_blog_analytics', {
          p_blog_post_id: metadata.blogPostId,
          p_event_type: 'read_time',
          p_read_time: readTime
        });
      }
    }
  }

  async updateSessionDuration() {
    const duration = Math.floor((Date.now() - this.sessionStart.getTime()) / 1000);
    try {
      await supabase
        .from('user_sessions')
        .update({ 
          session_duration: duration,
          ended_at: new Date().toISOString()
        })
        .eq('session_id', this.sessionId);
    } catch (error) {
      console.warn('Failed to update session duration:', error);
    }
  }
}

const analyticsService = new AnalyticsService();

export const useAnalytics = () => {
  const isTracked = useRef(false);

  const trackPageView = (pageUrl: string, metadata?: Record<string, any>) => {
    if (!isTracked.current) {
      analyticsService.trackEvent({
        eventType: 'page_view',
        pageUrl,
        metadata
      });
      analyticsService.startPageView();
      isTracked.current = true;
    }
  };

  const trackEvent = (event: Omit<AnalyticsEvent, 'pageUrl'>) => {
    analyticsService.trackEvent({
      ...event,
      pageUrl: window.location.pathname
    });
  };

  useEffect(() => {
    const handleBeforeUnload = () => {
      analyticsService.updateSessionDuration();
      if (isTracked.current) {
        analyticsService.endPageView(window.location.pathname);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      handleBeforeUnload();
    };
  }, []);

  return { trackPageView, trackEvent };
};
