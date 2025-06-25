
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import EnhancedSEO from "@/components/SEO/EnhancedSEO";
import SEOBlogLayout from "@/components/blog/SEOBlogLayout";
import { fetchBlogPostBySlug } from "@/services/api";
import { BlogPost as BlogPostType } from "@/types/data";
import { useAnalytics } from "@/hooks/useAnalytics";
import { getIndianKeywordString } from "@/data/indianSeoKeywords";

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [blogPost, setBlogPost] = useState<BlogPostType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      
      setIsLoading(true);
      // Use slug-based fetching
      const post = await fetchBlogPostBySlug(slug);
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
          <div className="animate-pulse max-w-4xl mx-auto">
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

  // Generate Indian-focused keywords
  const keywords = getIndianKeywordString(blogPost.category.toLowerCase(), blogPost.title);

  // Sample related products (in real app, fetch based on blog content)
  const relatedProducts = [
    {
      image: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      title: "Designer Saree Similar to Alia's Look",
      price: "₹2,499",
      retailer: "Myntra",
      affiliateLink: "https://myntra.com/sarees"
    },
    {
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      title: "Gold Temple Jewelry Set",
      price: "₹1,299",
      retailer: "Nykaa Fashion",
      affiliateLink: "https://nykaa.com/jewelry"
    },
    {
      image: "https://images.unsplash.com/photo-1590736969955-71cc94901144?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      title: "Ethnic Clutch Bag",
      price: "₹899",
      retailer: "Ajio",
      affiliateLink: "https://ajio.com/bags"
    },
    {
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      title: "Statement Earrings",
      price: "₹599",
      retailer: "Amazon Fashion",
      affiliateLink: "https://amazon.in/jewelry"
    }
  ];

  // Sample related posts
  const relatedPosts = [
    {
      id: "deepika-style-guide",
      title: "Deepika Padukone's 5 Most Iconic Looks You Can Recreate",
      image: "https://images.unsplash.com/photo-1583341612074-ccea5cd64ea7?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      slug: "deepika-padukone-iconic-looks"
    },
    {
      id: "kiara-airport-fashion",
      title: "Kiara Advani's Airport Fashion: 7 Comfortable Yet Stylish Looks",
      image: "https://images.unsplash.com/photo-1590736969955-71cc94901144?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      slug: "kiara-advani-airport-fashion"
    },
    {
      id: "bollywood-wedding-fashion",
      title: "Bollywood Wedding Fashion: 10 Celebrity Looks Under ₹5,000",
      image: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      slug: "bollywood-wedding-fashion-affordable"
    }
  ];

  // Generate breadcrumbs
  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Blog", url: "/blog" },
    { name: blogPost.category, url: `/category/${blogPost.category.toLowerCase()}` },
    { name: blogPost.title, url: `/blog/${slug}` }
  ];

  // Generate FAQ schema for the blog post
  const faqSchema = [
    {
      question: `How can I recreate ${blogPost.title.split(':')[0]}'s look?`,
      answer: "You can recreate this celebrity look using affordable alternatives from Indian fashion retailers like Myntra, Ajio, Nykaa Fashion, and Amazon Fashion. Focus on similar colors, silhouettes, and styling elements rather than exact designer pieces."
    },
    {
      question: "Where can I buy similar outfits in India?",
      answer: "Popular Indian fashion websites like Myntra, Ajio, Flipkart Fashion, Nykaa Fashion, and Amazon Fashion offer affordable celebrity-inspired clothing. You can also check local boutiques and fashion stores for similar styles."
    },
    {
      question: "What is the budget for recreating celebrity looks?",
      answer: "Most celebrity looks can be recreated for ₹2,000 to ₹5,000 using alternatives from Indian brands. This includes the main outfit, accessories, and styling elements. Premium recreations may cost up to ₹10,000."
    }
  ];

  // Product schema for affiliate products
  const productSchema = {
    name: blogPost.title,
    description: blogPost.excerpt,
    image: blogPost.image,
    category: "Fashion & Style Guide"
  };

  return (
    <PageLayout>
      <EnhancedSEO
        title={`${blogPost.title} | CelebrityPersona - Indian Celebrity Fashion`}
        description={`${blogPost.meta_description || blogPost.excerpt} Shop affordable alternatives on Myntra, Ajio, Nykaa Fashion. Get the celebrity look for less in India.`}
        canonical={`${window.location.origin}/blog/${slug}`}
        ogType="article"
        ogImage={blogPost.image}
        ogTitle={`${blogPost.title} - Affordable Celebrity Fashion India`}
        ogDescription={`${blogPost.excerpt} Find similar outfits on Indian fashion websites.`}
        twitterCard="summary_large_image"
        twitterTitle={blogPost.title}
        twitterDescription={blogPost.excerpt}
        twitterImage={blogPost.image}
        keywords={keywords}
        author={blogPost.author}
        datePublished={blogPost.created_at}
        dateModified={blogPost.updated_at}
        category={blogPost.category}
        breadcrumbs={breadcrumbs}
        faqSchema={faqSchema}
        productSchema={productSchema}
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": blogPost.title,
            "description": blogPost.excerpt,
            "image": blogPost.image,
            "datePublished": blogPost.created_at,
            "dateModified": blogPost.updated_at,
            "author": {
              "@type": "Person",
              "name": blogPost.author
            },
            "publisher": {
              "@type": "Organization",
              "name": "CelebrityPersona",
              "logo": {
                "@type": "ImageObject",
                "url": `${window.location.origin}/logo.svg`
              }
            }
          }
        ]}
      />
      
      <div className="container-custom py-12">
        <SEOBlogLayout
          title={blogPost.title}
          category={blogPost.category}
          author={blogPost.author}
          date={blogPost.date}
          readTime="5 min read"
          image={blogPost.image}
          content={blogPost.content}
          tags={blogPost.keywords?.split(', ') || []}
          relatedProducts={relatedProducts}
          relatedPosts={relatedPosts}
        />
      </div>
    </PageLayout>
  );
};

export default BlogPost;
