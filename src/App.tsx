
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";

import Index from "./pages/Index";
import Celebrities from "./pages/Celebrities";
import Outfits from "./pages/Outfits";
import Blog from "./pages/Blog";
import CelebrityProfile from "./pages/CelebrityProfile";
import OutfitDetail from "./pages/OutfitDetail";
import BlogPost from "./pages/BlogPost";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminCelebrities from "./pages/AdminCelebrities";
import AdminOutfits from "./pages/AdminOutfits";
import AdminBlog from "./pages/AdminBlog";
import AdminAnalytics from "./pages/AdminAnalytics";
import AdminTags from "./pages/AdminTags";
import AdminSettings from "./pages/AdminSettings";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import AffiliateDisclosure from "./pages/AffiliateDisclosure";
import NotFound from "./pages/NotFound";

// Scroll to top component
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }, [pathname]);

  return null;
};

// Create a new QueryClient instance outside of the component
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1
    }
  }
});

const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <AdminAuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/celebrities" element={<Celebrities />} />
              <Route path="/outfits" element={<Outfits />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/celebrity/:id" element={<CelebrityProfile />} />
              <Route path="/outfit/:id" element={<OutfitDetail />} />
              <Route path="/blog/:id" element={<BlogPost />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/celebrities" element={<AdminCelebrities />} />
              <Route path="/admin/outfits" element={<AdminOutfits />} />
              <Route path="/admin/blog" element={<AdminBlog />} />
              <Route path="/admin/analytics" element={<AdminAnalytics />} />
              <Route path="/admin/tags" element={<AdminTags />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/affiliate-disclosure" element={<AffiliateDisclosure />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AdminAuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;
