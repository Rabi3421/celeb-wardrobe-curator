
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

// Admin pages
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminOutfits from "./pages/AdminOutfits";
import AdminTags from "./pages/AdminTags";
import AdminSettings from "./pages/AdminSettings";
import AdminImportData from "./pages/AdminImportData";
import AdminNewsletterSubscribers from "./pages/AdminNewsletterSubscribers";

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Index />} />
          <Route path="/celebrities" element={<Celebrities />} />
          <Route path="/celebrity/:id" element={<CelebrityProfile />} />
          <Route path="/outfits" element={<Outfits />} />
          <Route path="/outfit/:id" element={<OutfitDetail />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route path="/blog-topics" element={<BlogTopics />} />
          <Route path="/blog-topic/:topic" element={<BlogTopic />} />
          <Route path="/category/:category" element={<CategoryDetail />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/categories/:category" element={<Categories />} />
          <Route path="/privacy-policy" element={<Privacy />} />
          <Route path="/terms-of-service" element={<Terms />} />
          <Route path="/affiliate-disclosure" element={<AffiliateDisclosure />} />
          
          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/outfits" element={<AdminOutfits />} />
          <Route path="/admin/tags" element={<AdminTags />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/admin/import-data" element={<AdminImportData />} />
          <Route path="/admin/newsletter" element={<AdminNewsletterSubscribers />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
