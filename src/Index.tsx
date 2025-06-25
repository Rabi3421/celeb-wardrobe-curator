import React, { useState, useEffect } from "react";
import PageLayout from "@/components/layout/PageLayout";
import EnhancedSEO from "@/components/SEO/EnhancedSEO";
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
import { getIndianKeywordString } from "@/data/indianSeoKeywords";

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
        fetchOutfits(3),
        fetchBlogPosts(),
        fetchAffiliateProducts()
      ]);

      console.log("Loaded celebrities:", celebritiesData.length);
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
  const topCelebrities = celebrities.slice(0, 4);
  const recentBlogPosts = blogPosts.slice(0, 3);

  // Indian-focused testimonials
  const testimonials = [
    {
      id: 1,
      name: "Priya Sharma",
      role: "Fashion Blogger, Delhi",
      avatar: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      quote: "CelebrityPersona has completely changed how I shop for fashion! I can easily find affordable alternatives to Alia Bhatt and Deepika's looks on Myntra and Ajio."
    },
    {
      id: 2,
      name: "Arjun Patel",
      role: "Fashion Enthusiast, Mumbai",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      quote: "Finally, a platform that understands Indian fashion! The budget-friendly alternatives and shopping links to Indian websites make it so convenient."
    },
    {
      id: 3,
      name: "Kavya Reddy",
      role: "Personal Stylist, Bangalore",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      quote: "My clients love when I recreate Bollywood looks for them. This site helps me find the perfect pieces from Nykaa Fashion and Amazon Fashion."
    }
  ];

  // Indian fashion categories
  const categories = [
    { title: "Sarees", icon: "dress", link: "/category/sarees" },
    { title: "Lehengas", icon: "dress", link: "/category/lehengas" },
    { title: "Ethnic Wear", icon: "dress", link: "/category/ethnic" },
    { title: "Western", icon: "dress", link: "/category/western" },
    { title: "Jewelry", icon: "jewelry", link: "/category/jewelry" },
    { title: "Handbags", icon: "handbag", link: "/category/handbags" }
  ];

  // Spotlight celebrity with Indian products
  const spotlightCelebrity = celebrities.length > 0 ? {
    id: celebrities[0].id,
    name: celebrities[0].name,
    image: celebrities[0].image,
    outfit: "Latest Bollywood Fashion Statement",
    event: "Recent Red Carpet Appearance",
    description: celebrities[0].bio || "Stunning look from one of Bollywood's most fashionable stars.",
    products: [
      {
        image: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
        title: "Designer Saree - Similar Style",
        price: "₹2,499",
        retailer: "Myntra",
        affiliateLink: "https://myntra.com/sarees"
      },
      {
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
        title: "Gold Jewelry Set",
        price: "₹1,299",
        retailer: "Nykaa Fashion",
        affiliateLink: "https://nykaa.com/jewelry"
      },
      {
        image: "https://images.unsplash.com/photo-1590736969955-71cc94901144?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
        title: "Ethnic Clutch",
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
    ]
  } : null;

  // Indian social media posts
  const socialPosts = [
    {
      platform: "instagram" as const,
      username: "@celebritypersona_india",
      content: "Alia Bhatt's stunning saree look from last night's event! 😍 Swipe to see affordable alternatives on Myntra starting at ₹2,499. #AliaBhatt #SareeStyle #BollywoodFashion",
      image: "https://images.unsplash.com/photo-1594736797933-d0c6e5b6dd12?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      date: "2 hours ago",
      link: "https://instagram.com"
    },
    {
      platform: "twitter" as const,
      username: "@celebritypersona",
      content: "Deepika Padukone's airport look is giving us major style goals! ✈️ Recreate this comfortable yet chic outfit for under ₹3,000. Thread with shopping links below 👇 #DeepikaPadukone #AirportFashion",
      date: "5 hours ago",
      link: "https://twitter.com"
    },
    {
      platform: "instagram" as const,
      username: "@celebritypersona_india",
      content: "Kiara Advani's festive look breakdown! 🎆 This gorgeous lehenga can be recreated with pieces from Nykaa Fashion and Amazon. Total cost: ₹4,500! #KiaraAdvani #FestivalFashion #Lehenga",
      image: "https://images.unsplash.com/photo-1590736969955-71cc94901144?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      date: "1 day ago",
      link: "https://instagram.com"
    }
  ];

  // Indian-focused FAQ data
  const faqData = [
    {
      question: "How do I find affordable alternatives to Bollywood celebrity outfits?",
      answer: "Browse our curated collection of celebrity outfits and use our shopping guides to find similar pieces on Indian websites like Myntra, Ajio, Nykaa Fashion, and Amazon Fashion. We provide direct links to affordable alternatives for every look."
    },
    {
      question: "Which Indian websites offer the best celebrity fashion dupes?",
      answer: "Myntra, Ajio, Nykaa Fashion, Amazon Fashion, and Flipkart Fashion are the best Indian websites for celebrity-inspired fashion. We partner with these retailers to bring you authentic alternatives at budget-friendly prices."
    },
    {
      question: "Can I recreate expensive Bollywood looks on a budget?",
      answer: "Absolutely! Most celebrity looks can be recreated for ₹2,000 to ₹5,000 using alternatives from Indian fashion brands. We focus on capturing the essence of the look rather than exact designer pieces."
    },
    {
      question: "How often do you add new Bollywood celebrity fashion content?",
      answer: "We update our collection daily with the latest Bollywood fashion moments from red carpets, events, airport looks, and social media appearances of your favorite Indian celebrities."
    },
    {
      question: "Do you cover regional Indian celebrities too?",
      answer: "Yes! We cover fashion from Bollywood, Tollywood, Kollywood, and other regional film industries across India, ensuring diverse representation of Indian celebrity fashion."
    }
  ];

  // Generate Indian-focused keywords
  const keywords = getIndianKeywordString();

  // Enhanced structured data for Indian market
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "CelebrityPersona India",
      "url": window.location.origin,
      "description": "Your ultimate destination for Bollywood and Indian celebrity fashion inspiration with affordable alternatives from Myntra, Ajio, Nykaa Fashion. Get your favorite star's look for less in India.",
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
      "name": "CelebrityPersona India",
      "url": window.location.origin,
      "logo": `${window.location.origin}/logo.svg`,
      "description": "India's leading platform for celebrity fashion inspiration and affordable alternatives",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "India"
      },
      "sameAs": [
        "https://twitter.com/celebritypersona",
        "https://instagram.com/celebritypersona_india",
        "https://facebook.com/celebritypersona.india"
      ]
    }
  ];

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/celebrities?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <PageLayout>
      <EnhancedSEO
        title="CelebrityPersona India | Bollywood Celebrity Fashion & Affordable Style Alternatives"
        description="Discover the latest Bollywood celebrity fashion trends and shop affordable alternatives on Myntra, Ajio, Nykaa Fashion. Get your favorite star's look for less in India."
        ogImage="/images/hero_img.webp"
        ogTitle="Bollywood Celebrity Fashion & Affordable Alternatives | CelebrityPersona India"
        ogDescription="Shop celebrity-inspired fashion from your favorite Bollywood stars. Find affordable alternatives on Indian fashion websites like Myntra, Ajio, and Nykaa Fashion."
        twitterCard="summary_large_image"
        twitterTitle="Bollywood Celebrity Fashion & Affordable Style Alternatives"
        twitterDescription="Get the latest Bollywood looks for less! Shop celebrity-inspired fashion from Indian brands and retailers."
        twitterImage="/images/hero_img.webp"
        keywords={keywords}
        jsonLd={jsonLd}
        faqSchema={faqData}
        contentLanguage="en-IN"
        geoTargeting={{
          country: "IN",
          region: "Asia"
        }}
      />
      
      {/* Hero Banner - Optimized for Indian Market */}
      <section className="bg-gradient-to-r from-pink-100 via-purple-50 to-blue-100 py-12 md:py-20 animate-fade-slide-up">
        <div className="container-custom flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium mb-4">
              Bollywood Celebrity Fashion & Style Inspiration
            </h1>
            <p className="text-muted-foreground mb-6 md:text-lg max-w-lg">
              Discover the latest celebrity looks from your favorite Bollywood stars and shop affordable alternatives on Myntra, Ajio, Nykaa Fashion & more.
            </p>
            <form onSubmit={handleSearch} className="relative max-w-md mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input 
                type="text"
                placeholder="Search Alia Bhatt, Deepika, Kiara..."
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
                Explore Bollywood Looks
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              ✨ Shop from <strong>Myntra</strong>, <strong>Ajio</strong>, <strong>Nykaa Fashion</strong> & more
            </p>
          </div>
          <div className="md:w-1/2 flex justify-center w-full">
            <img
              src="/images/hero_img.webp"
              alt="Bollywood celebrity red carpet fashion inspiration for Indian fashion lovers"
              className="rounded-2xl shadow-hero-glow w-full max-w-[280px] sm:max-w-[350px] md:max-w-md object-cover h-auto md:h-[500px] transform transition duration-500 hover:scale-105"
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
              slug={outfit.slug}
            />
          ))}
        </div>
      </section>

      {/* Featured Celebrity Profiles Section - Made more visible */}
      <section className="py-16 bg-muted/50">
        <div className="container-custom">
          <SectionHeader
            title="Featured Celebrity Profiles"
            viewAllLink="/celebrities"
            viewAllText="View All Profiles"
          />
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading celebrities...</p>
            </div>
          ) : topCelebrities.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {topCelebrities.map((celebrity) => (
                <CelebrityCard
                  key={celebrity.id}
                  id={celebrity.id}
                  name={celebrity.name}
                  image={celebrity.image}
                  outfitCount={celebrity.outfitCount || 0}
                  slug={celebrity.slug}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No celebrities available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-secondary">
        <div className="container-custom">
          <h2 className="section-title text-center mb-10">
            Shop by Category
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

      {/* Email Signup - Indian Focused */}
      <section className="container-custom py-16">
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-2xl p-8 md:p-12 text-center">
          <h2 className="font-serif text-2xl md:text-3xl font-medium mb-4">
            Get Weekly Celebrity Looks in Your Inbox
          </h2>
          <p className="mb-2 max-w-lg mx-auto">
            <strong>Curated for Indian Fashion Lovers</strong>
          </p>
          <p className="text-white/90 mb-8 max-w-lg mx-auto">
            Be the first to get the latest Bollywood fashion trends, styling tips, and exclusive shopping deals from Myntra, Ajio, Nykaa Fashion, and more.
          </p>
          <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-grow rounded-full px-4 py-3 text-gray-900 border-0 focus:outline-none focus:ring-2 focus:ring-white"
              required
            />
            <button type="submit" className="bg-white text-purple-600 font-semibold py-3 px-6 rounded-full hover:bg-gray-100 transition-colors whitespace-nowrap">
              Join 50,000+ Subscribers
            </button>
          </form>
          <p className="text-xs text-white/75 mt-4">
            No spam, unsubscribe anytime. Join fashion enthusiasts across India 🇮🇳
          </p>
        </div>
      </section>
    </PageLayout>
  );
};

export default Index;
