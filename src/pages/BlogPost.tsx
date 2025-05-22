
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare, Clock, Calendar, User, ArrowLeft, Share } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import SEO from "@/components/SEO/SEO";
import { supabase } from "@/integrations/supabase/client";
import { BlogPost as BlogPostType } from "@/types/data";

const BlogPost: React.FC = () => {
  const { id, slug } = useParams<{ id?: string; slug?: string }>();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<Array<{author: string, text: string, date: string}>>([]);
  const [relatedPosts, setRelatedPosts] = useState<BlogPostType[]>([]);

  useEffect(() => {
    const fetchBlogPost = async () => {
      setIsLoading(true);
      try {
        let query = supabase.from('blog_posts').select('*');
        
        // Fetch by slug if available, otherwise try by ID
        if (slug) {
          query = query.eq('slug', slug);
        } else if (id) {
          query = query.eq('id', id);
        }

        const { data, error } = await query.single();
        
        if (error) {
          console.error("Error fetching blog post:", error);
          setPost(null);
        } else {
          console.log("Fetched blog post:", data);
          setPost(data);
          
          // Fetch related posts based on category
          if (data) {
            const { data: relatedData, error: relatedError } = await supabase
              .from('blog_posts')
              .select('*')
              .eq('category', data.category)
              .neq('id', data.id)
              .limit(3);
              
            if (!relatedError && relatedData) {
              setRelatedPosts(relatedData);
            }
          }
        }
      } catch (error) {
        console.error("Error in blog post fetch:", error);
        setPost(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBlogPost();
  }, [id, slug]);

  // Function to handle post like
  const handleLike = () => {
    if (!hasLiked) {
      setLikes(likes + 1);
      setHasLiked(true);
      toast({
        description: "Thanks for liking this article!",
        duration: 2000,
      });
    } else {
      setLikes(likes - 1);
      setHasLiked(false);
    }
  };

  // Function to handle comment submission
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      const newComment = {
        author: "You",
        text: comment,
        date: new Date().toLocaleDateString()
      };
      setComments([...comments, newComment]);
      setComment("");
      toast({
        description: "Comment posted successfully!",
        duration: 2000,
      });
    }
  };

  // Function to handle share
  const handleShare = () => {
    // In a real app, this would use the Web Share API
    toast({
      description: "Share link copied to clipboard!",
      duration: 2000,
    });
  };

  if (isLoading) {
    return (
      <PageLayout>
        <div className="container-custom py-16 text-center">
          <p className="text-muted-foreground">Loading blog post...</p>
        </div>
      </PageLayout>
    );
  }

  if (!post) {
    return (
      <PageLayout>
        <SEO 
          title="Blog Post Not Found | CelebrityPersona" 
          description="The blog post you're looking for could not be found."
        />
        <div className="container-custom py-16 text-center">
          <h2 className="font-serif text-2xl mb-4">Blog post not found</h2>
          <p className="text-muted-foreground">
            The blog post you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/blog" className="btn-primary mt-4 inline-block">
            Return to Blog
          </Link>
        </div>
      </PageLayout>
    );
  }

  // Create JSON-LD structured data for the blog post
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "image": post.image,
    "datePublished": post.date,
    "dateModified": post.date,
    "author": {
      "@type": "Person",
      "name": post.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "CelebrityPersona",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.celebritypersona.com/logo.png"
      }
    },
    "description": post.excerpt,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": window.location.href
    }
  };

  // Related topics based on the post category
  const relatedTopics = [
    { name: post?.category || "Fashion", slug: (post?.category || "fashion").toLowerCase().replace(/ /g, "-") },
    { name: "Red Carpet", slug: "red-carpet" },
    { name: "Celebrity Style", slug: "celebrity-style" }
  ];

  // Keywords for the blog post based on title and category
  const keywords = post.keywords || `${post.title}, ${post.category}, celebrity fashion, ${post.author}, fashion blog`;

  return (
    <PageLayout>
      <SEO 
        title={`${post.title} | CelebrityPersona`}
        description={post.excerpt}
        ogTitle={post.title}
        ogDescription={post.excerpt}
        ogImage={post.image}
        ogType="article"
        twitterCard="summary_large_image"
        twitterImage={post.image}
        keywords={keywords}
        jsonLd={jsonLd}
      />
      <div className="container-custom py-8 md:py-16">
        <div className="mb-6">
          <Link
            to="/blog"
            className="text-sm font-medium text-primary-foreground hover:underline inline-flex items-center"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Blog
          </Link>
        </div>

        <article className="max-w-3xl mx-auto">
          <header className="mb-8 text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <span className="text-sm text-muted-foreground">{post.date}</span>
              <span className="text-muted-foreground">•</span>
              <span className="bg-pastel-blue px-2 py-0.5 rounded-full text-xs">
                {post.category}
              </span>
            </div>
            <h1 className="font-serif text-3xl md:text-4xl font-medium mb-6">
              {post.title}
            </h1>
            <div className="flex items-center justify-center">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center mr-3">
                  <User className="h-5 w-5 text-primary-foreground" />
                </div>
                <div className="text-left">
                  <span className="font-medium text-sm block">{post.author}</span>
                  <span className="text-xs text-muted-foreground">Fashion Editor</span>
                </div>
              </div>
            </div>
          </header>

          <figure className="mb-8 rounded-2xl overflow-hidden">
            <img
              src={post.image}
              alt={`${post.title} - Fashion inspiration from ${post.category}`}
              className="w-full h-auto object-cover"
            />
          </figure>

          <div className="prose prose-lg max-w-none">
            {post.content.split('\n\n').map((paragraph, idx) => (
              <p key={idx} className="mb-6 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Article Engagement */}
          <div className="flex items-center justify-between my-8 border-t border-b border-border py-4">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLike}
                className="flex items-center space-x-1"
              >
                <Heart className={`h-5 w-5 ${hasLiked ? 'text-red-500 fill-red-500' : ''}`} />
                <span>{likes}</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className="flex items-center space-x-1"
                onClick={() => document.getElementById('comments-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <MessageSquare className="h-5 w-5" />
                <span>{comments.length}</span>
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">5 min read</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleShare}
              className="flex items-center space-x-1"
            >
              <Share className="h-5 w-5" />
              <span>Share</span>
            </Button>
          </div>

          {/* Author Bio */}
          <div className="my-12 bg-secondary/50 rounded-xl p-6">
            <div className="flex items-center">
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mr-4">
                <User className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-medium">About {post.author}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Fashion editor with over 10 years of experience in celebrity styling and trend analysis.
                </p>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div id="comments-section" className="my-12">
            <h3 className="font-serif text-xl font-medium mb-6">Comments ({comments.length})</h3>
            
            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} className="mb-8">
              <div className="mb-4">
                <textarea
                  placeholder="Leave a comment..."
                  className="w-full p-4 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                ></textarea>
              </div>
              <Button type="submit" className="btn-primary">
                Post Comment
              </Button>
            </form>
            
            {/* Comments List */}
            {comments.length > 0 ? (
              <div className="space-y-6">
                {comments.map((comment, index) => (
                  <div key={index} className="bg-secondary/30 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center mr-2">
                        <span className="text-xs font-medium">{comment.author[0]}</span>
                      </div>
                      <div>
                        <span className="font-medium text-sm">{comment.author}</span>
                        <span className="text-xs text-muted-foreground ml-2">{comment.date}</span>
                      </div>
                    </div>
                    <p className="text-sm">{comment.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">
                Be the first to comment on this article
              </p>
            )}
          </div>

          {/* Add this section before the Related Articles section */}
          <div className="my-10">
            <h3 className="font-serif text-lg font-medium mb-4">Related Topics</h3>
            <div className="flex flex-wrap gap-2">
              {relatedTopics.map((topic, index) => (
                <Link
                  key={index}
                  to={`/blog/topic/${topic.slug}`}
                  className="bg-secondary px-3 py-1 rounded-full text-sm hover:bg-primary hover:text-white transition-colors"
                >
                  {topic.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Related Articles */}
          {relatedPosts.length > 0 && (
            <div className="mt-16">
              <h3 className="font-serif text-2xl font-medium mb-6 text-center">Related Articles</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map(relatedPost => (
                  <Card key={relatedPost.id} className="overflow-hidden">
                    <Link to={`/blog/s/${relatedPost.slug}`} className="block">
                      <div className="aspect-video overflow-hidden">
                        <img 
                          src={relatedPost.image} 
                          alt={`${relatedPost.title} - Related fashion article`}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                      <div className="p-4">
                        <h4 className="font-serif font-medium text-lg line-clamp-2">{relatedPost.title}</h4>
                        <div className="flex items-center mt-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{relatedPost.date}</span>
                        </div>
                      </div>
                    </Link>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </article>
      </div>
    </PageLayout>
  );
};

export default BlogPost;
