
import React from "react";
import PageLayout from "@/components/layout/PageLayout";
import SectionHeader from "@/components/ui/SectionHeader";
import { Link } from "react-router-dom";
import TopicCard from "@/components/ui/TopicCard";
import { ArrowLeft } from "lucide-react";

const BlogTopics: React.FC = () => {
  // Extended list of topics for the dedicated page
  const allTopics = [
    { name: "Red Carpet", count: 12, slug: "red-carpet", image: "https://images.unsplash.com/photo-1612539342151-6ce47c936370" },
    { name: "Street Style", count: 18, slug: "street-style", image: "https://images.unsplash.com/photo-1516763296043-f676c1105999" },
    { name: "Met Gala", count: 8, slug: "met-gala", image: "https://images.unsplash.com/photo-1561989954-c1ff94667d80" },
    { name: "Movie Premieres", count: 15, slug: "movie-premieres", image: "https://images.unsplash.com/photo-1518929458113-28f7aefd3627" },
    { name: "Fashion Week", count: 24, slug: "fashion-week", image: "https://images.unsplash.com/photo-1588117305388-c2631a279f82" },
    { name: "Award Shows", count: 10, slug: "award-shows", image: "https://images.unsplash.com/photo-1555895423-09d2a58db62e" },
    { name: "Summer Looks", count: 14, slug: "summer-looks", image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c" },
    { name: "Winter Fashion", count: 9, slug: "winter-fashion", image: "https://images.unsplash.com/photo-1610286304239-9138fd6deebd" },
    { name: "Accessories", count: 16, slug: "accessories", image: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d" },
    { name: "Makeup", count: 11, slug: "makeup", image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796" },
    { name: "Hairstyles", count: 7, slug: "hairstyles", image: "https://images.unsplash.com/photo-1605497788044-5a32c7078486" },
    { name: "Designer Brands", count: 19, slug: "designer-brands", image: "https://images.unsplash.com/photo-1541643600914-78b084683601" },
  ];

  return (
    <PageLayout>
      <div className="container-custom py-12">
        <div className="mb-6">
          <Link
            to="/blog"
            className="text-sm font-medium text-primary-foreground hover:underline inline-flex items-center"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Blog
          </Link>
        </div>
        
        <SectionHeader title="Browse All Topics" />
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
          {allTopics.map((topic, index) => (
            <TopicCard 
              key={index} 
              name={topic.name}
              count={topic.count}
              slug={topic.slug}
              image={topic.image}
            />
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default BlogTopics;
