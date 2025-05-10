
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
import AdminNewsletterSubscribers from "./pages/AdminNewsletterSubscribers";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import AffiliateDisclosure from "./pages/AffiliateDisclosure";
import NotFound from "./pages/NotFound";
import Categories from "./pages/Categories";

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

const App = () => {
  // Create the React element explicitly
  return React.createElement(
    QueryClientProvider, 
    { client: queryClient },
    React.createElement(
      TooltipProvider, 
      null,
      React.createElement(Toaster, null),
      React.createElement(Sonner, null),
      React.createElement(
        BrowserRouter, 
        null,
        React.createElement(ScrollToTop, null),
        React.createElement(
          AdminAuthProvider, 
          null,
          React.createElement(
            Routes, 
            null,
            React.createElement(Route, { path: "/", element: React.createElement(Index, null) }),
            React.createElement(Route, { path: "/celebrities", element: React.createElement(Celebrities, null) }),
            React.createElement(Route, { path: "/outfits", element: React.createElement(Outfits, null) }),
            React.createElement(Route, { path: "/blog", element: React.createElement(Blog, null) }),
            React.createElement(Route, { path: "/celebrity/:id", element: React.createElement(CelebrityProfile, null) }),
            React.createElement(Route, { path: "/outfit/:id", element: React.createElement(OutfitDetail, null) }),
            React.createElement(Route, { path: "/blog/:id", element: React.createElement(BlogPost, null) }),
            React.createElement(Route, { path: "/category/:category", element: React.createElement(Categories, null) }),
            React.createElement(Route, { path: "/admin/login", element: React.createElement(AdminLogin, null) }),
            React.createElement(Route, { path: "/admin/dashboard", element: React.createElement(AdminDashboard, null) }),
            React.createElement(Route, { path: "/admin/celebrities", element: React.createElement(AdminCelebrities, null) }),
            React.createElement(Route, { path: "/admin/outfits", element: React.createElement(AdminOutfits, null) }),
            React.createElement(Route, { path: "/admin/blog", element: React.createElement(AdminBlog, null) }),
            React.createElement(Route, { path: "/admin/analytics", element: React.createElement(AdminAnalytics, null) }),
            React.createElement(Route, { path: "/admin/tags", element: React.createElement(AdminTags, null) }),
            React.createElement(Route, { path: "/admin/settings", element: React.createElement(AdminSettings, null) }),
            React.createElement(Route, { path: "/admin/newsletter", element: React.createElement(AdminNewsletterSubscribers, null) }),
            React.createElement(Route, { path: "/privacy", element: React.createElement(Privacy, null) }),
            React.createElement(Route, { path: "/terms", element: React.createElement(Terms, null) }),
            React.createElement(Route, { path: "/affiliate-disclosure", element: React.createElement(AffiliateDisclosure, null) }),
            React.createElement(Route, { path: "*", element: React.createElement(NotFound, null) })
          )
        )
      )
    )
  );
};

export default App;
