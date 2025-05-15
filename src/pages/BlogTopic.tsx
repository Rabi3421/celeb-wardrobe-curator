
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import BlogPostCard from "@/components/ui/BlogPostCard";
import SectionHeader from "@/components/ui/SectionHeader";
import { fetchBlogPosts } from "@/services/api";
import { ArrowLeft } from "lucide-react";
import { BlogPost } from "@/types/data";
import SEO from "@/components/SEO/SEO";

const BlogTopic: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Format the topic slug for display (convert "red-carpet" to "Red Carpet")
  const formatTopicName = (slug: string) => {
    return slug
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };
  
  const topicName = slug ? formatTopicName(slug) : "";
  
  // Get topic description for SEO
  const getTopicDescription = (name: string): string => {
    const topicDescriptions: {[key: string]: string} = {
      "red-carpet": "Discover glamorous red carpet looks and outfit inspirations from your favorite celebrities at prestigious events.",
      "street-style": "Explore casual and trendy everyday outfits spotted on celebrities in their day-to-day lives.",
      "met-gala": "View the most stunning and avant-garde looks from fashion's biggest night, the Met Gala.",
      "movie-premieres": "Check out celebrity fashion moments from film and TV premieres around the world.",
      "fashion-week": "Get inspired by runway looks and front-row celebrity styles from fashion weeks globally.",
      "award-shows": "See elegant ensembles from the Oscars, Grammys, Golden Globes and more prestigious ceremonies.",
      "summer-looks": "Find hot weather fashion inspiration from celebrity summer styles and vacation outfits.",
      "winter-fashion": "Discover celebrity cold-weather style tips and seasonal fashion trends for winter.",
      "accessories": "Browse statement jewelry, bags, shoes, and accessories worn by celebrities.",
      "makeup": "Learn about celebrity makeup looks, techniques and beauty inspirations from the stars.",
      "hairstyles": "Explore trendsetting haircuts, colors, and styling inspiration from celebrities.",
      "designer-brands": "See how celebrities showcase luxury designer fashion brands and signature styles."
    };
    
    return topicDescriptions[name?.toLowerCase()] || 
      `Explore the latest ${topicName} fashion trends and style inspirations from your favorite celebrities.`;
  };
  
  const topicDescription = slug ? getTopicDescription(slug) : "";
  
  useEffect(() => {
    const loadPosts = async () => {
      setIsLoading(true);
      try {
        // In a real app, you would fetch posts filtered by topic
        // For now, we'll just simulate filtering by topic
        const allPosts = await fetchBlogPosts();
        
        // Simulate filtered posts (in a real app, this would be done server-side)
        // This is just for demonstration purposes
        const filteredPosts = allPosts.filter(post => 
          post.title.toLowerCase().includes(slug?.toLowerCase() || "") || 
          post.category.toLowerCase() === slug?.toLowerCase()
        );
        
        setPosts(filteredPosts);
      } catch (error) {
        console.error("Error loading topic posts:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPosts();
  }, [slug]);

  // Generate related topics suggestions
  const getRelatedTopics = (currentTopic: string): {name: string, slug: string}[] => {
    const allTopics = [
      { name: "Red Carpet", slug: "red-carpet" },
      { name: "Street Style", slug: "street-style" },
      { name: "Met Gala", slug: "met-gala" },
      { name: "Fashion Week", slug: "fashion-week" },
      { name: "Award Shows", slug: "award-shows" },
      { name: "Summer Looks", slug: "summer-looks" },
    ];
    
    return allTopics.filter(topic => topic.slug !== currentTopic).slice(0, 3);
  };
  
  const relatedTopics = slug ? getRelatedTopics(slug) : [];

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
        
        <div className="mb-12">
          <SectionHeader title={`${topicName} Articles`} />
          
          {/* Topic description for SEO and user context */}
          <div className="mb-8">
            <p className="text-muted-foreground max-w-3xl">{topicDescription}</p>
          </div>
          
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading articles...</p>
            </div>
          ) : posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {posts.map((post) => (
                <BlogPostCard
                  key={post.id}
                  id={post.id}
                  title={post.title}
                  excerpt={post.excerpt}
                  image={post.image}
                  date={post.date}
                  category={post.category}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No articles found for this topic.</p>
              
              {/* Related topics suggestions */}
              {relatedTopics.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4">You might be interested in:</h3>
                  <div className="flex flex-wrap justify-center gap-3">
                    {relatedTopics.map((topic, index) => (
                      <Link 
                        key={index} 
                        to={`/blog/topic/${topic.slug}`}
                        className="px-4 py-2 bg-secondary rounded-full text-sm hover:bg-primary hover:text-white transition-colors"
                      >
                        {topic.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              
              <p className="mt-4">
                <Link to="/blog" className="text-primary hover:underline">
                  Browse all articles
                </Link>
              </p>
            </div>
          )}
        </div>

        {/* Add SEO metadata */}
        <SEO
          title={`${topicName} Fashion & Style | Celebrity Inspirations`}
          description={topicDescription}
          keywords={`${topicName.toLowerCase()}, celebrity fashion, style trends, ${topicName.toLowerCase()} inspiration`}
          jsonLd={{
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": `${topicName} Fashion & Style`,
            "description": topicDescription,
            "url": window.location.href,
            "publisher": {
              "@type": "Organization",
              "name": "CelebrityPersona",
              "logo": {
                "@type": "ImageObject",
                "url": `${window.location.origin}/logo.png`
              }
            },
            "mainEntity": posts.map(post => ({
              "@type": "BlogPosting",
              "headline": post.title,
              "description": post.excerpt,
              "datePublished": post.date,
              "image": post.image,
              "url": `${window.location.origin}/blog/${post.id}`
            }))
          }}
        />
      </div>
    </PageLayout>
  );
};

export default BlogTopic;
