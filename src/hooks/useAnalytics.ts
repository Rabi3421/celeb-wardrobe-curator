
import { useEffect, useRef } from 'react';

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
      // TODO: Replace with your backend API call
      console.log('Session initialized:', {
        sessionId: this.sessionId,
        startTime: this.sessionStart.toISOString(),
        userAgent: navigator.userAgent,
        referrer: document.referrer || null
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
      // TODO: Replace with your backend API call
      const analyticsData = {
        event_type: event.eventType,
        page_url: event.pageUrl,
        session_id: this.sessionId,
        user_agent: navigator.userAgent,
        ip_address: await this.getIPAddress(),
        referrer: document.referrer || null,
        metadata: event.metadata || {},
        timestamp: new Date().toISOString()
      };
      
      console.log('Analytics event tracked:', analyticsData);
      
      // Store in localStorage for now - replace with API call
      const existingEvents = JSON.parse(localStorage.getItem('analyticsEvents') || '[]');
      existingEvents.push(analyticsData);
      localStorage.setItem('analyticsEvents', JSON.stringify(existingEvents.slice(-100))); // Keep last 100 events
      
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
        // TODO: Replace with your backend API call
        console.log('Page view ended:', {
          blogPostId: metadata.blogPostId,
          readTime,
          pageUrl
        });
      }
    }
  }

  async updateSessionDuration() {
    const duration = Math.floor((Date.now() - this.sessionStart.getTime()) / 1000);
    try {
      // TODO: Replace with your backend API call
      console.log('Session duration updated:', {
        sessionId: this.sessionId,
        duration,
        endTime: new Date().toISOString()
      });
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
