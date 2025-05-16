import React, { useState, useEffect } from "react";
import PageLayout from "@/components/layout/PageLayout";
import SEO from "@/components/SEO/SEO";
import OutfitCard from "@/components/ui/OutfitCard";
import CelebrityCard from "@/components/ui/CelebrityCard";
import BlogPostCard from "@/components/ui/BlogPostCard";
import SectionHeader from "@/components/ui/SectionHeader";
import TestimonialCard from "@/components/ui/TestimonialCard";
import CategoryCard from "@/components/ui/CategoryCard";
import CelebritySpotlight from "@/components/ui/CelebritySpotlight";
import SocialFeedCard from "@/components/ui/SocialFeedCard";
import AffiliateProductCard from "@/components/ui/AffiliateProductCard";
import { fetchCelebrities, fetchOutfits, fetchBlogPosts, fetchAffiliateProducts } from "@/services/api";
import { Celebrity, Outfit, BlogPost, AffiliateProduct } from "@/types/data";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index: React.FC = () => {
  const [celebrities, setCelebrities] = useState<Celebrity[]>([]);
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [affiliateProducts, setAffiliateProducts] = useState<AffiliateProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const [celebritiesData, outfitsData, blogPostsData, productsData] = await Promise.all([
        fetchCelebrities(),
        fetchOutfits(),
        fetchBlogPosts(),
        fetchAffiliateProducts()
      ]);

      setCelebrities(celebritiesData);
      setOutfits(outfitsData);
      setBlogPosts(blogPostsData);
      setAffiliateProducts(productsData);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  // Get featured data to display
  const featuredOutfits = outfits.slice(0, 6);
  const featuredCelebrities = celebrities.slice(0, 4);
  const recentBlogPosts = blogPosts.slice(0, 3);

  // Keep the hardcoded testimonials for now, as they're not part of the core data model
  const testimonials = [
    {
      id: 1,
      name: "Emma Thompson",
      role: "Fashion Enthusiast",
      avatar: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      quote: "CelebrityPersona completely transformed how I approach my personal style. Now I can easily find affordable alternatives to my favorite celebrity outfits!"
    },
    {
      id: 2,
      name: "Michael Rodriguez",
      role: "Style Blogger",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      quote: "As a style blogger, this platform has become my go-to resource for researching celebrity fashion trends and finding budget-friendly options for my readers."
    },
    {
      id: 3,
      name: "Sophia Chen",
      role: "Personal Shopper",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      quote: "The detailed breakdown of each outfit and similar alternatives at different price points makes this an invaluable tool for my clients who want celebrity-inspired looks."
    }
  ];

  const categories = [
    { title: "Dresses", icon: "dress", link: "/category/dresses" },
    { title: "Shoes", icon: "shoe", link: "/category/shoes" },
    { title: "Makeup", icon: "makeup", link: "/category/makeup" },
    { title: "Handbags", icon: "handbag", link: "/category/handbags" },
    { title: "Cars", icon: "car", link: "/category/cars" },
    { title: "Bikes", icon: "bike", link: "/category/bikes" }
  ];

  // Spotlight celebrity with sample products
  const spotlightCelebrity = celebrities.length > 0 ? {
    id: celebrities[0].id,
    name: celebrities[0].name,
    image: celebrities[0].image,
    outfit: "Latest Fashion Statement",
    event: "Recent Appearance",
    description: celebrities[0].bio || "Stunning look from one of our favorite celebrities.",
    products: affiliateProducts.slice(0, 4).map(product => ({
      image: product.image,
      title: product.title,
      price: product.price,
      retailer: product.retailer, 
      affiliateLink: product.affiliateLink
    }))
  } : null;

  const socialPosts = [
    {
      platform: "instagram" as const,
      username: "@celebritypersona",
      content: "Check out Emma Stone's stunning Oscar gown and affordable alternatives on our website! #OscarFashion",
      image: "https://images.unsplash.com/photo-1546536133-d1b07a9c768e?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      date: "2 hours ago",
      link: "https://instagram.com"
    },
    {
      platform: "twitter" as const,
      username: "@celebritypersona",
      content: "Just added: Ryan Gosling's premiere look breakdown with all the details about his custom suit. RT if you want to see more men's fashion!",
      date: "5 hours ago",
      link: "https://twitter.com"
    },
    {
      platform: "instagram" as const,
      username: "@celebritypersona",
      content: "Breaking down Margot Robbie's street style - swipe to see all the affordable alternatives! #StreetStyle #GetTheLook",
      image: "https://images.unsplash.com/photo-1599039628218-eac5d51a4c85?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      date: "1 day ago",
      link: "https://instagram.com"
    }
  ];

  // Enhanced FAQ data for structured data
  const faqData = [
    {
      question: "How do I find celebrity outfit inspiration?",
      answer: "Browse our curated collection of celebrity outfits by visiting the Celebrities or Outfits section. You can filter by style, event type, or search for your favorite celebrity directly."
    },
    {
      question: "Are the similar fashion items exact matches?",
      answer: "Our fashion experts curate similar items at various price points that capture the style essence of celebrity outfits. While not exact matches, they offer the same aesthetic at more affordable prices."
    },
    {
      question: "How often is new celebrity fashion content added?",
      answer: "We update our collection daily with the latest celebrity fashion moments from red carpets, street style, and social media appearances."
    },
    {
      question: "Can I purchase celebrity fashion items directly from CelebrityPersona?",
      answer: "CelebrityPersona partners with trusted retailers to offer similar items. When you click on a product, you'll be directed to the retailer's website where you can make your purchase securely."
    },
    {
      question: "How can I get personalized celebrity style recommendations?",
      answer: "Subscribe to our newsletter for personalized style recommendations based on your favorite celebrities and fashion preferences."
    }
  ];

  // Enhanced breadcrumb data
  const breadcrumbData = [
    {
      name: "Home",
      url: "/"
    }
  ];

  // Enhanced structured data for the homepage with more specific elements
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "CelebrityPersona",
      "url": window.location.origin,
      "description": "Your ultimate destination for celebrity fashion inspiration with affordable alternatives you can shop right now.",
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${window.location.origin}/search?q={search_term_string}`
        },
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "CelebrityPersona",
      "url": window.location.origin,
      "logo": `${window.location.origin}/logo.svg`,
      "sameAs": [
        "https://twitter.com/celebritypersona",
        "https://instagram.com/celebritypersona",
        "https://facebook.com/celebritypersona",
        "https://pinterest.com/celebritypersona"
      ]
    }
  ];
  
  // If we have featured outfits, add those to structured data
  if (featuredOutfits && featuredOutfits.length > 0) {
    jsonLd.push({
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Celebrity Fashion Inspiration",
      "description": "Trending celebrity outfits with affordable alternatives",
      "itemListElement": featuredOutfits.slice(0, 3).map((outfit, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Product",
          "name": outfit.title,
          "description": outfit.description,
          "image": outfit.image,
          "url": `${window.location.origin}/outfit/${outfit.id}`
        }
      }))
    });
  }

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/celebrities?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  // Display loading state if data is being fetched
  if (isLoading) {
    return (
      <PageLayout>
        <SEO />
        <div className="container-custom py-16 text-center">
          <p className="text-muted-foreground">Loading content...</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <SEO
        title="CelebrityPersona | Celebrity Style Inspiration & Affordable Fashion Alternatives"
        description="Discover celebrity fashion trends and affordable alternatives for your favorite star outfits. Shop celebrity-inspired dresses, accessories, shoes and party wear at budget-friendly prices."
        ogImage="/images/hero_img.jpg"
        ogTitle="Celebrity Style Inspiration & Affordable Fashion Alternatives | CelebrityPersona"
        ogDescription="Get the celebrity look for less! Browse our collection of celebrity-inspired fashion with affordable alternatives for every budget."
        twitterCard="summary_large_image"
        twitterTitle="Celebrity Style Inspiration & Affordable Alternatives"
        twitterDescription="Discover and shop celebrity-inspired fashion at budget-friendly prices. Red carpet looks, street style, and more!"
        twitterImage="/images/hero_img.jpg"
        keywords="celebrity outfits, celebrity dresses, celebrity fashion, affordable celebrity style, celebrity party wear, red carpet looks, celebrity street style, celebrity accessories, celebrity inspired clothing"
        jsonLd={jsonLd}
        breadcrumbs={breadcrumbData}
        faqSchema={faqData}
      />
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-pastel-lavender to-pastel-blue py-12 md:py-20 animate-fade-slide-up">
        <div className="container-custom flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium mb-4">
              Discover Celebrity Style & Shop Similar Looks
            </h1>
            <p className="text-muted-foreground mb-8 md:text-lg max-w-lg">
              Your ultimate destination for celebrity fashion inspiration with affordable alternatives you can shop right now.
            </p>
            <form onSubmit={handleSearch} className="relative max-w-md mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input 
                type="text"
                placeholder="Search celebrities, styles..."
                className="pl-10 pr-20 py-6 rounded-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button 
                type="submit" 
                className="absolute right-1 top-1/2 transform -translate-y-1/2 rounded-full px-4"
              >
                Search
              </Button>
            </form>
            <div className="flex space-x-4">
              <button 
                className="btn-primary flex items-center"
                onClick={() => navigate('/celebrities')}
              >
                Explore Celebrity Looks
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img
              src="/images/hero_img.jpg"
              alt="Celebrity red carpet fashion"
              className="rounded-2xl shadow-hero-glow max-w-sm md:max-w-md object-cover h-[500px] transform transition duration-500 hover:scale-105"
            />
          </div>
        </div>
      </section>

      {/* Trending Looks Section */}
      <section className="container-custom py-16">
        <SectionHeader
          title="This Week's Star Styles"
          viewAllLink="/outfits"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredOutfits.slice(0, 3).map((outfit) => (
            <OutfitCard
              key={outfit.id}
              id={outfit.id}
              image={outfit.image}
              celebrity={outfit.celebrity}
              celebrityId={outfit.celebrityId}
              title={outfit.title}
              description={outfit.description}
            />
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-secondary">
        <div className="container-custom">
          <h2 className="section-title text-center mb-10">
            Explore by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <CategoryCard
                key={index}
                title={category.title}
                icon={category.icon}
                link={category.link}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Shop the Look Section */}
      <section className="container-custom py-16">
        <SectionHeader
          title="Shop the Celeb Look"
          viewAllLink="/shop"
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {affiliateProducts.slice(0, 4).map((product, index) => (
            <AffiliateProductCard
              key={index}
              image={product.image}
              title={product.title}
              price={product.price}
              retailer={product.retailer}
              affiliateLink={product.affiliateLink}
            />
          ))}
        </div>
      </section>

      {/* Celebrity Spotlight */}
      {spotlightCelebrity && (
        <section className="py-16 bg-pastel-pink/30">
          <div className="container-custom">
            <h2 className="section-title text-center mb-10">
              Celebrity Spotlight
            </h2>
            <CelebritySpotlight {...spotlightCelebrity} />
          </div>
        </section>
      )}

      {/* Testimonials Section */}
      <section className="py-16 bg-pastel-lavender">
        <div className="container-custom">
          <h2 className="section-title text-center mx-auto mb-10">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <TestimonialCard
                key={testimonial.id}
                name={testimonial.name}
                role={testimonial.role}
                avatar={testimonial.avatar}
                quote={testimonial.quote}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="container-custom py-16">
        <SectionHeader
          title="Fashion Blog"
          viewAllLink="/blog"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {recentBlogPosts.map((post) => (
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
      </section>

      {/* Social Feed Section */}
      <section className="py-16 bg-secondary">
        <div className="container-custom">
          <SectionHeader
            title="Our Social Feed"
            viewAllLink="https://instagram.com"
            viewAllText="Follow Us"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {socialPosts.map((post, index) => (
              <SocialFeedCard
                key={index}
                platform={post.platform}
                username={post.username}
                content={post.content}
                image={post.image}
                date={post.date}
                link={post.link}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Join the Fashion Circle Section */}
      <section className="container-custom py-16">
        <div className="bg-gradient-to-r from-pastel-pink to-pastel-peach rounded-2xl p-8 md:p-12 text-center">
          <h2 className="font-serif text-2xl md:text-3xl font-medium mb-4">
            Join the Fashion Circle
          </h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Be the first to receive celebrity style alerts, exclusive guides on how to recreate the looks, and special discounts from our partners.
          </p>
          <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-grow rounded-full px-4 py-2.5 border border-border focus:outline-none focus:ring-2 focus:ring-primary-foreground"
              required
            />
            <button type="submit" className="btn-primary whitespace-nowrap">
              Subscribe
            </button>
          </form>
          <p className="text-xs text-muted-foreground mt-4">
            By subscribing, you agree to our Privacy Policy and consent to receive updates from CelebrityPersona.
          </p>
        </div>
      </section>
    </PageLayout>
  );
};

export default Index;
