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

function App() {
  return (
    <BrowserRouter>
      <Routes>
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
        <Route path="/categories/:category" element={<Categories />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
