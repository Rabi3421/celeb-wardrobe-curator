
import React from "react";
import PageLayout from "@/components/layout/PageLayout";
import SectionHeader from "@/components/ui/SectionHeader";
import { Link } from "react-router-dom";
import TopicCard from "@/components/ui/TopicCard";
import { ArrowLeft } from "lucide-react";
import SEO from "@/components/SEO/SEO";

const BlogTopics: React.FC = () => {
  // Extended list of topics for the dedicated page with descriptions for SEO
  const allTopics = [
    { name: "Red Carpet", count: 12, slug: "red-carpet", image: "https://images.unsplash.com/photo-1612539342151-6ce47c936370", description: "Explore glamorous red carpet looks from your favorite celebrities" },
    { name: "Street Style", count: 18, slug: "street-style", image: "https://images.unsplash.com/photo-1516763296043-f676c1105999", description: "Casual and trendy everyday outfits spotted on celebrities" },
    { name: "Met Gala", count: 8, slug: "met-gala", image: "https://images.unsplash.com/photo-1561989954-c1ff94667d80", description: "Stunning and avant-garde looks from fashion's biggest night" },
    { name: "Movie Premieres", count: 15, slug: "movie-premieres", image: "https://images.unsplash.com/photo-1518929458113-28f7aefd3627", description: "Celebrity fashion moments from film and TV premieres worldwide" },
    { name: "Fashion Week", count: 24, slug: "fashion-week", image: "https://images.unsplash.com/photo-1588117305388-c2631a279f82", description: "Runway inspirations and front-row celebrity styles" },
    { name: "Award Shows", count: 10, slug: "award-shows", image: "https://images.unsplash.com/photo-1555895423-09d2a58db62e", description: "Elegant ensembles from Oscars, Grammys, and more" },
    { name: "Summer Looks", count: 14, slug: "summer-looks", image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c", description: "Hot weather fashion inspiration from the stars" },
    { name: "Winter Fashion", count: 9, slug: "winter-fashion", image: "https://images.unsplash.com/photo-1610286304239-9138fd6deebd", description: "Celebrity cold-weather style and seasonal trends" },
    { name: "Accessories", count: 16, slug: "accessories", image: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d", description: "Statement jewelry, bags, and accessories worn by celebrities" },
    { name: "Makeup", count: 11, slug: "makeup", image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796", description: "Celebrity makeup looks and beauty inspirations" },
    { name: "Hairstyles", count: 7, slug: "hairstyles", image: "https://images.unsplash.com/photo-1605497788044-5a32c7078486", description: "Trendsetting haircuts, colors, and styling from celebrities" },
    { name: "Designer Brands", count: 19, slug: "designer-brands", image: "https://images.unsplash.com/photo-1541643600914-78b084683601", description: "How celebrities showcase luxury designer fashion brands" },
  ];

  return (
    <PageLayout>
      <div className="container-custom py-12">
        <div className="mb-6">
          <Link
            to="/blog"
            className="text-sm font-medium text-primary-foreground hover:underline inline-flex items-center"
            aria-label="Return to blog home page"
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
              description={topic.description}
            />
          ))}
        </div>

        {/* Add SEO metadata */}
        <SEO
          title="Celebrity Fashion Topics | Explore Style Categories"
          description="Browse our collection of celebrity fashion topics including red carpet looks, street style, seasonal trends, and more. Find style inspiration by category."
          keywords="celebrity fashion topics, style categories, fashion trends, celebrity style guides"
          jsonLd={{
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Celebrity Fashion Topics",
            "description": "Browse our collection of celebrity fashion topics and style categories",
            "url": window.location.href,
            "publisher": {
              "@type": "Organization",
              "name": "CelebrityPersona",
              "logo": {
                "@type": "ImageObject",
                "url": `${window.location.origin}/logo.png`
              }
            },
            "hasPart": allTopics.map(topic => ({
              "@type": "CreativeWork",
              "name": topic.name,
              "description": topic.description,
              "url": `${window.location.origin}/blog/topic/${topic.slug}`
            }))
          }}
        />
      </div>
    </PageLayout>
  );
};

export default BlogTopics;
