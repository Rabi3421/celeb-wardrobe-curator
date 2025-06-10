
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import SEO from "@/components/SEO/SEO";
import { fetchBlogPostById } from "@/services/api";
import { BlogPost as BlogPostType } from "@/types/data";
import { useAnalytics } from "@/hooks/useAnalytics";

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [blogPost, setBlogPost] = useState<BlogPostType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      
      setIsLoading(true);
      // For now, we'll treat slug as ID since we need to update the API function
      // to support fetching by slug. This maintains backward compatibility.
      const post = await fetchBlogPostById(slug);
      setBlogPost(post);
      setIsLoading(false);

      if (post) {
        trackPageView(`/blog/${slug}`, {
          blogPostId: post.id,
          title: post.title,
          category: post.category
        });
      }
    };

    fetchPost();
  }, [slug, trackPageView]);

  if (isLoading) {
    return (
      <PageLayout>
        <div className="container-custom py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-secondary rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-secondary rounded w-1/2 mb-8"></div>
            <div className="aspect-video bg-secondary rounded mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-secondary rounded"></div>
              <div className="h-4 bg-secondary rounded w-5/6"></div>
              <div className="h-4 bg-secondary rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!blogPost) {
    return (
      <PageLayout>
        <div className="container-custom py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Blog post not found</h1>
          <p className="text-muted-foreground">The blog post you're looking for doesn't exist.</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <SEO
        title={blogPost.title}
        description={blogPost.excerpt}
        ogImage={blogPost.image}
        keywords={`${blogPost.category}, celebrity fashion, style guide`}
      />
      
      <article className="container-custom py-12">
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm font-medium text-primary-foreground bg-secondary px-3 py-1 rounded-full">
              {blogPost.category}
            </span>
            <span className="text-sm text-muted-foreground">
              {new Date(blogPost.date).toLocaleDateString()}
            </span>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-medium mb-4">
            {blogPost.title}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            {blogPost.excerpt}
          </p>
        </header>

        <div className="aspect-video md:aspect-[2/1] overflow-hidden rounded-2xl mb-8">
          <img
            src={blogPost.image}
            alt={blogPost.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="prose prose-lg max-w-none">
          <div dangerouslySetInnerHTML={{ __html: blogPost.content }} />
        </div>
      </article>
    </PageLayout>
  );
};

export default BlogPost;
