
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from 'react-redux';
import { store } from './store';
import Index from "./pages/Index";
import Celebrities from "./pages/Celebrities";
import CelebrityProfile from "./pages/CelebrityProfile";
import OutfitDetail from "./pages/OutfitDetail";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import BlogTopics from "./pages/BlogTopics";
import BlogTopic from "./pages/BlogTopic";
import Outfits from "./pages/Outfits";
import NotFound from "./pages/NotFound";
import CategoryDetail from "./pages/CategoryDetail";
import Categories from "./pages/Categories";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import AffiliateDisclosure from "./pages/AffiliateDisclosure";
import { HelmetProvider } from 'react-helmet-async';
import { AdminAuthProvider } from './contexts/AdminAuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Admin pages
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminOutfits from "./pages/AdminOutfits";
import AdminTags from "./pages/AdminTags";
import AdminSettings from "./pages/AdminSettings";
import AdminImportData from "./pages/AdminImportData";
import AdminNewsletterSubscribers from "./pages/AdminNewsletterSubscribers";
import AdminCelebrities from "./pages/AdminCelebrities";
import AdminBlog from "./pages/AdminBlog";
import AdminAnalytics from "./pages/AdminAnalytics";

// Create a new QueryClient instance
const queryClient = new QueryClient();

function App() {
  return (
    <Provider store={store}>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <AdminAuthProvider>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Index />} />
                <Route path="/celebrities" element={<Celebrities />} />
                
                {/* Celebrity routes - slug-based as primary */}
                <Route path="/celebrity/:slug" element={<CelebrityProfile />} />
                <Route path="/celebrity/id/:id" element={<CelebrityProfile />} />
                
                <Route path="/outfits" element={<Outfits />} />
                
                {/* Outfit routes - slug-based as primary */}
                <Route path="/outfit/:slug" element={<OutfitDetail />} />
                <Route path="/outfit/id/:id" element={<OutfitDetail />} />
                
                {/* Blog routes */}
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:id" element={<BlogPost />} />
                <Route path="/blog/s/:slug" element={<BlogPost />} />
                <Route path="/blog/topics" element={<BlogTopics />} />
                <Route path="/blog/topic/:topic" element={<BlogTopic />} />
                
                <Route path="/category/:category" element={<CategoryDetail />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/categories/:category" element={<Categories />} />
                <Route path="/privacy-policy" element={<Privacy />} />
                <Route path="/terms-of-service" element={<Terms />} />
                <Route path="/affiliate-disclosure" element={<AffiliateDisclosure />} />
                
                {/* Admin routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/analytics" element={<AdminAnalytics />} />
                <Route path="/admin/outfits" element={<AdminOutfits />} />
                <Route path="/admin/tags" element={<AdminTags />} />
                <Route path="/admin/settings" element={<AdminSettings />} />
                <Route path="/admin/import-data" element={<AdminImportData />} />
                <Route path="/admin/newsletter" element={<AdminNewsletterSubscribers />} />
                <Route path="/admin/celebrities" element={<AdminCelebrities />} />
                <Route path="/admin/blog" element={<AdminBlog />} />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AdminAuthProvider>
          </BrowserRouter>
        </QueryClientProvider>
      </HelmetProvider>
    </Provider>
  );
}

export default App;
