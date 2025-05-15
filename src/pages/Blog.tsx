import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import BlogPostCard from "@/components/ui/BlogPostCard";
import SectionHeader from "@/components/ui/SectionHeader";
import { fetchBlogPosts, subscribeToNewsletter } from "@/services/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, BookOpen, MessageSquare, ChevronDown, Loader2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { BlogPost } from "@/types/data";
import { useToast } from "@/hooks/use-toast";
import SampleBlogUploader from "@/components/admin/SampleBlogUploader";
import TopicCard from "@/components/ui/TopicCard";

const Blog: React.FC = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const loadBlogPosts = async () => {
      setIsLoading(true);
      const data = await fetchBlogPosts();
      setBlogPosts(data);
      setIsLoading(false);
    };
    
    loadBlogPosts();
  }, []);

  // Get unique categories
  const categories = Array.from(new Set(blogPosts.map(post => post.category)));
  
  // Filter featured posts (could be based on any criteria)
  const featuredPosts = blogPosts.filter((_, index) => index < 2);
  
  // Initial posts to show
  const initialPostsCount = 3;
  
  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubscribing(true);
    
    try {
      const result = await subscribeToNewsletter(email, "blog_page");
      
      toast({
        title: result.success ? "Success" : "Error",
        description: result.message,
        variant: result.success ? "default" : "destructive"
      });
      
      if (result.success) {
        setEmail("");
      }
    } catch (error) {
      console.error("Error during subscription:", error);
      toast({
        title: "Subscription Error",
        description: "An error occurred during subscription. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  if (isLoading) {
    return (
      <PageLayout>
        <div className="container-custom py-16 text-center">
          <p className="text-muted-foreground">Loading blog posts...</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="container-custom py-12">
        {/* Sample Blog Uploader (Only visible when no blog posts are available) */}
        {blogPosts.length === 0 && (
          <div className="mb-6">
            <SampleBlogUploader />
          </div>
        )}

        {/* Hero Section */}
        <div className="relative mb-12 overflow-hidden rounded-3xl bg-gradient-to-r from-pastel-blue to-pastel-lavender">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 md:p-12">
            <div className="flex flex-col justify-center">
              <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium mb-4">
                Celebrity Fashion Insights
              </h1>
              <p className="text-muted-foreground mb-6">
                Discover the latest trends, style tips, and fashion inspirations from your favorite celebrities.
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-primary-foreground" />
                  <span className="text-sm">Updated Weekly</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-primary-foreground" />
                  <span className="text-sm">{blogPosts.length} Articles</span>
                </div>
              </div>
            </div>
            <div className="hidden md:flex justify-end items-center">
              <img
                src="/placeholder.svg"
                alt="Fashion Blog"
                className="max-h-64 object-cover rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>

        {/* Featured Posts */}
        <div className="mb-12">
          <SectionHeader title="Featured Stories" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {featuredPosts.map((post) => (
              <div key={post.id} className="animate-fade-in">
                <div className="outfit-card h-full overflow-hidden group transition-all duration-300 hover:shadow-xl">
                  <div className="relative">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                      <div className="flex items-center justify-between text-xs text-white mb-2">
                        <span>{post.date}</span>
                        <span className="bg-primary/80 px-2 py-0.5 rounded-full">
                          {post.category}
                        </span>
                      </div>
                      <h2 className="font-serif font-medium text-2xl text-white mb-2">
                        {post.title}
                      </h2>
                      <p className="text-white/80 text-sm line-clamp-2">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Categories Tabs */}
        <div className="mb-12">
          <Tabs defaultValue="all" className="w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="section-title mb-0">Browse By Category</h2>
              <TabsList className="bg-transparent">
                <TabsTrigger 
                  value="all"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  All
                </TabsTrigger>
                {categories.map((category) => (
                  <TabsTrigger
                    key={category}
                    value={category}
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hidden sm:inline-flex"
                  >
                    {category}
                  </TabsTrigger>
                ))}
                <div className="relative inline-block sm:hidden">
                  <button
                    className="flex items-center px-3 py-1.5 text-sm font-medium bg-muted rounded-md"
                    onClick={() => setIsExpanded(!isExpanded)}
                  >
                    Categories <ChevronDown className="ml-1 h-4 w-4" />
                  </button>
                  {isExpanded && (
                    <div className="absolute z-10 mt-1 w-56 rounded-md bg-white shadow-lg">
                      {categories.map((category) => (
                        <TabsTrigger
                          key={category}
                          value={category}
                          className="block w-full text-left px-4 py-2 text-sm hover:bg-muted"
                        >
                          {category}
                        </TabsTrigger>
                      ))}
                    </div>
                  )}
                </div>
              </TabsList>
            </div>

            <TabsContent value="all" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {blogPosts.slice(0, isExpanded ? blogPosts.length : initialPostsCount).map((post) => (
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
              {!isExpanded && blogPosts.length > initialPostsCount && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={() => setIsExpanded(true)}
                    className="btn-primary flex items-center"
                  >
                    Load More <ChevronDown className="ml-2 h-4 w-4" />
                  </button>
                </div>
              )}
            </TabsContent>

            {categories.map((category) => (
              <TabsContent key={category} value={category} className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {blogPosts
                    .filter((post) => post.category === category)
                    .map((post) => (
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
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* Newsletter Subscribe */}
        <div className="mb-12">
          <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-r from-pastel-mint to-pastel-blue">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-6 md:p-8">
                <CardHeader className="p-0 pb-6">
                  <CardTitle className="text-2xl md:text-3xl">Stay Updated</CardTitle>
                  <CardDescription>
                    Subscribe to our newsletter for the latest celebrity fashion updates
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <form onSubmit={handleSubscribe} className="space-y-4">
                    <div className="flex max-w-md flex-col sm:flex-row gap-2">
                      <input
                        type="email"
                        placeholder="Your email address"
                        className="flex-1 rounded-lg border border-border bg-white/90 px-4 py-2"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isSubscribing}
                      />
                      <button 
                        type="submit" 
                        className="btn-primary whitespace-nowrap"
                        disabled={isSubscribing}
                      >
                        {isSubscribing ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Subscribing...
                          </>
                        ) : (
                          "Subscribe"
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      We respect your privacy. Unsubscribe at any time.
                    </p>
                  </form>
                </CardContent>
              </div>
              <div 
                className={cn(
                  "hidden md:block bg-cover bg-center",
                  "bg-[url('https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1050&q=80')]"
                )}
              />
            </div>
          </Card>
        </div>

        {/* Topic Exploration */}
        <div>
          <SectionHeader title="Popular Topics" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {["Red Carpet", "Street Style", "Met Gala", "Movie Premieres", "Fashion Week", "Award Shows"].map((topic, index) => (
              <Card 
                key={index} 
                className="group hover:shadow-lg transition-all overflow-hidden"
              >
                <div className="aspect-square w-full bg-secondary/50 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <h3 className="font-serif text-lg font-medium text-center px-2">
                    {topic}
                  </h3>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Blog;
