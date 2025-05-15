
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import BlogPostCard from "@/components/ui/BlogPostCard";
import SectionHeader from "@/components/ui/SectionHeader";
import { fetchBlogPosts } from "@/services/api";
import { ArrowLeft } from "lucide-react";
import { BlogPost } from "@/types/data";

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
        
        <div className="mb-12">
          <SectionHeader title={`${topicName} Articles`} />
          
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
              <p className="mt-2">
                <Link to="/blog" className="text-primary hover:underline">
                  Browse all articles
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default BlogTopic;
