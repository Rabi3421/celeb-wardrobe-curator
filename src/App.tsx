
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from 'react-redux';
import { store } from './store';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import "./App.css";

// Pages
import Index from "./pages/Index";
import Celebrities from "./pages/Celebrities";
import CelebrityProfile from "./pages/CelebrityProfile";
import Outfits from "./pages/Outfits";
import OutfitDetail from "./pages/OutfitDetail";
import Categories from "./pages/Categories";
import CategoryDetail from "./pages/CategoryDetail";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import BlogTopics from "./pages/BlogTopics";
import BlogTopic from "./pages/BlogTopic";
import NotFound from "./pages/NotFound";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import AffiliateDisclosure from "./pages/AffiliateDisclosure";

// Admin Pages
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminCelebrities from "./pages/AdminCelebrities";
import AdminOutfits from "./pages/AdminOutfits";
import AdminBlog from "./pages/AdminBlog";
import AdminAnalytics from "./pages/AdminAnalytics";
import AdminTags from "./pages/AdminTags";
import AdminSettings from "./pages/AdminSettings";
import AdminImportData from "./pages/AdminImportData";
import AdminNewsletterSubscribers from "./pages/AdminNewsletterSubscribers";

const queryClient = new QueryClient();

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <div className="App">
            <AdminAuthProvider>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Index />} />
                <Route path="/celebrities" element={<Celebrities />} />
                <Route path="/celebrities/:slug" element={<CelebrityProfile />} />
                <Route path="/outfits" element={<Outfits />} />
                <Route path="/outfits/:slug" element={<OutfitDetail />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/categories/:category" element={<CategoryDetail />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/blog/topics" element={<BlogTopics />} />
                <Route path="/blog/topics/:topic" element={<BlogTopic />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/affiliate-disclosure" element={<AffiliateDisclosure />} />

                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/celebrities" element={<AdminCelebrities />} />
                <Route path="/admin/outfits" element={<AdminOutfits />} />
                <Route path="/admin/blog" element={<AdminBlog />} />
                <Route path="/admin/analytics" element={<AdminAnalytics />} />
                <Route path="/admin/tags" element={<AdminTags />} />
                <Route path="/admin/settings" element={<AdminSettings />} />
                <Route path="/admin/import-data" element={<AdminImportData />} />
                <Route path="/admin/newsletter-subscribers" element={<AdminNewsletterSubscribers />} />

                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AdminAuthProvider>
            <Toaster />
          </div>
        </Router>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
