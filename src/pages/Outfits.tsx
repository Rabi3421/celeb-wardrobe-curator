import React, { useState, useEffect } from "react";
import PageLayout from "@/components/layout/PageLayout";
import OutfitCard from "@/components/ui/OutfitCard";
import SectionHeader from "@/components/ui/SectionHeader";
import SeasonalTrendsCard from "@/components/ui/SeasonalTrendsCard";
import StyleMatchCard from "@/components/ui/StyleMatchCard";
import ShoppingGuidesCard from "@/components/ui/ShoppingGuidesCard";
import EnhancedSEO from "@/components/SEO/EnhancedSEO";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Calendar, Heart, Tag, Home, ChevronRight } from "lucide-react";
import { fetchOutfits } from "@/services/api";
import { Outfit } from "@/types/data";
import { useToast } from "@/hooks/use-toast";
import { seoFaqData } from "@/data/enhancedSeoKeywords";
import { generateOptimizedAltText, generateInternalLinks, seoContentSnippets } from "@/utils/seoContentOptimizer";
import { generateMockReviews } from "@/utils/socialProofSchema";

const Outfits: React.FC = () => {
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const loadOutfits = async () => {
      setIsLoading(true);
      try {
        const data = await fetchOutfits();
        console.log("Fetched outfits:", data);
        setOutfits(data);
      } catch (error) {
        console.error("Error loading outfits:", error);
        toast({
          title: "Error loading outfits",
          description: "Could not load the outfits. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadOutfits();
  }, [toast]);

  // Filter outfits based on search and category
  const filteredOutfits = outfits.filter(outfit => {
    const matchesSearch = outfit.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          outfit.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          outfit.celebrity.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || outfit.occasion === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique occasions/categories
  const occasions = ["all", ...Array.from(new Set(outfits.map(outfit => outfit.occasion || "casual")))];
  
  // Handle "Load More" button click
  const handleLoadMore = () => {
    setIsLoadingMore(true);
    // Simulate loading delay
    setTimeout(() => {
      setIsLoadingMore(false);
      toast({
        description: "All outfits have been loaded!",
      });
    }, 1000);
  };

  // Featured outfit (could be based on any criteria)
  const featuredOutfit = outfits.length > 0 ? outfits[0] : null;

  // Enhanced internal linking data
  const internalLinks = generateInternalLinks(selectedCategory, featuredOutfit?.celebrity, selectedCategory);
  
  // Social proof metrics (would come from analytics in real app)
  const socialProofMetrics = {
    totalViews: 12500,
    likes: 3200,
    shares: 450,
    comments: 180,
    saves: 890
  };

  // Mock review data for featured outfit
  const featuredOutfitReviews = featuredOutfit ? generateMockReviews(featuredOutfit.title, featuredOutfit.celebrity) : undefined;

  // Enhanced meta description
  const optimizedDescription = `Discover ${filteredOutfits.length}+ celebrity outfit inspirations from Zendaya, Rihanna, Harry Styles & more. Shop affordable alternatives to recreate red carpet looks, street style, and casual celebrity fashion for less than $100.`;

  // Breadcrumbs for SEO
  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Outfits", url: "/outfits" }
  ];

  // Enhanced structured data for outfit listings
  const itemListSchema = {
    name: "Celebrity Outfit Inspirations",
    description: "Browse through our curated collection of celebrity outfits for your daily style inspiration.",
    items: filteredOutfits.slice(0, 20).map((outfit) => ({
      name: outfit.title,
      description: outfit.description,
      image: outfit.image,
      url: `/outfit/${outfit.id}`,
      author: outfit.celebrity
    }))
  };

  // Enhanced FAQ data with internal linking
  const outfitsFaqData = [
    ...seoFaqData.outfits,
    {
      question: "How often do you add new celebrity outfit inspirations?",
      answer: "We add new celebrity outfit inspirations daily, featuring the latest red carpet looks, street style moments, and trending fashion from your favorite stars. Check our blog for the latest celebrity fashion trends and styling tips."
    },
    {
      question: "Can I filter outfits by specific occasions?",
      answer: "Yes! You can filter outfits by occasions like red carpet, casual, street style, awards shows, and more to find the perfect inspiration for your event. Browse our categories section for more specific style guides."
    },
    {
      question: "What's the average cost to recreate a celebrity look?",
      answer: "Most celebrity looks can be recreated for under $100 using our curated affordable alternatives. We provide direct shopping links to budget-friendly dupes from brands like H&M, Zara, ASOS, and Target."
    }
  ];
  
  if (isLoading) {
    return (
      <PageLayout>
        <EnhancedSEO
          title="Celebrity Outfit Inspirations | Shop The Look For Less | CelebrityPersona"
          description={optimizedDescription}
          keywords="celebrity outfits, celebrity fashion inspiration, affordable celebrity looks, shop celebrity style, celebrity outfit dupes, red carpet fashion, street style"
          breadcrumbs={breadcrumbs}
          faqSchema={outfitsFaqData}
          itemListSchema={itemListSchema}
          category="outfits"
          ogImage="/images/hero_img.webp"
          ogTitle="Celebrity Outfit Inspirations - Shop The Look For Less"
          ogDescription={optimizedDescription}
          twitterTitle="Celebrity Outfit Inspirations - Shop The Look For Less"
          twitterDescription="Discover celebrity outfit inspirations and shop affordable alternatives. From red carpet to street style - get the look for less!"
          dateModified={new Date().toISOString()}
          socialProofMetrics={socialProofMetrics}
          reviewData={featuredOutfitReviews}
          robotsContent="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
          geoTargeting={{ country: "US", region: "worldwide" }}
        />
        <div className="container-custom py-16 text-center">
          <p className="text-muted-foreground">Loading outfits...</p>
        </div>
      </PageLayout>
    );
  }
  
  return (
    <PageLayout>
      <EnhancedSEO
        title="Celebrity Outfit Inspirations | Shop The Look For Less | CelebrityPersona"
        description={optimizedDescription}
        keywords="celebrity outfits, celebrity fashion inspiration, affordable celebrity looks, shop celebrity style, celebrity outfit dupes, red carpet fashion, street style"
        breadcrumbs={breadcrumbs}
        faqSchema={outfitsFaqData}
        itemListSchema={itemListSchema}
        category="outfits"
        ogImage="/images/hero_img.webp"
        ogTitle="Celebrity Outfit Inspirations - Shop The Look For Less"
        ogDescription={optimizedDescription}
        twitterTitle="Celebrity Outfit Inspirations - Shop The Look For Less"
        twitterDescription="Discover celebrity outfit inspirations and shop affordable alternatives. From red carpet to street style - get the look for less!"
        dateModified={new Date().toISOString()}
        socialProofMetrics={socialProofMetrics}
        reviewData={featuredOutfitReviews}
        robotsContent="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        geoTargeting={{ country: "US", region: "worldwide" }}
      />

      {/* Breadcrumbs */}
      <div className="bg-gray-50 py-3">
        <div className="container-custom">
          <nav className="flex items-center space-x-2 text-sm">
            <a href="/" className="text-muted-foreground hover:text-primary flex items-center">
              <Home className="h-4 w-4 mr-1" />
              Home
            </a>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span className="text-primary font-medium">Outfits</span>
          </nav>
        </div>
      </div>

      {/* Enhanced Hero Section with optimized content */}
      <div className="bg-gradient-to-r from-pastel-peach to-pastel-pink py-16">
        <div className="container-custom text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-medium mb-4">
            {seoContentSnippets.outfitGrid.heading}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            {seoContentSnippets.outfitGrid.description}
          </p>
          
          {/* Internal linking section */}
          <div className="text-sm mb-8">
            <span className="text-muted-foreground">Explore: </span>
            {internalLinks.slice(0, 3).map((link, index) => (
              <span key={link.url}>
                <a 
                  href={link.url} 
                  className="text-primary hover:text-primary/80 underline"
                  title={link.title}
                >
                  {link.anchor}
                </a>
                {index < 2 && <span className="text-muted-foreground mx-2">•</span>}
              </span>
            ))}
          </div>
          
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search celebrity outfits by name, style, or occasion..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-6 rounded-full"
              aria-label="Search celebrity outfits"
            />
          </div>
        </div>
      </div>

      <div className="container-custom py-12">
        {/* Enhanced Featured Outfit */}
        {featuredOutfit && (
          <div className="mb-12">
            <SectionHeader title="Look of the Day" />
            <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-r from-pastel-blue to-pastel-lavender">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="relative aspect-[3/4] md:aspect-auto">
                  <img
                    src={featuredOutfit.image}
                    alt={generateOptimizedAltText(
                      featuredOutfit.celebrity,
                      featuredOutfit.title,
                      featuredOutfit.occasion
                    )}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="eager"
                  />
                </div>
                <div className="p-6 md:p-8">
                  <CardHeader className="p-0 pb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Tag className="h-4 w-4 text-primary-foreground" />
                      <span className="text-sm font-medium">{featuredOutfit.occasion || "Casual"}</span>
                    </div>
                    <CardTitle className="text-2xl md:text-3xl">
                      {featuredOutfit.title}
                    </CardTitle>
                    <CardDescription className="text-base">
                      By {featuredOutfit.celebrity}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0 pt-4">
                    <p className="mb-4">{featuredOutfit.description}</p>
                    <p className="text-sm text-muted-foreground mb-6">
                      {seoContentSnippets.featuredOutfit.description}
                    </p>
                    
                    {/* Social proof indicators */}
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{featuredOutfit.date ? new Date(featuredOutfit.date).toLocaleDateString() : "Recent"}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Heart className="h-4 w-4 text-red-500" />
                        <span className="text-sm">{socialProofMetrics.likes} Likes</span>
                      </div>
                    </div>
                    <Button 
                      className="bg-white text-primary-foreground hover:bg-white/90"
                      onClick={() => window.location.href = `/outfit/${featuredOutfit.id}`}
                    >
                      View Details & Shop The Look
                    </Button>
                  </CardContent>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Enhanced Categories Tabs */}
        <div className="mb-8">
          <Tabs defaultValue="all" className="w-full">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="section-title mb-2">Browse By Occasion</h2>
                <p className="text-sm text-muted-foreground">
                  {seoContentSnippets.categoryFilter.description}
                </p>
              </div>
              {/* ... keep existing TabsList */}
            </div>
          </Tabs>
        </div>

        {/* Enhanced Outfit Grid with better alt text */}
        {filteredOutfits.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredOutfits.map((outfit) => (
              <div key={outfit.id} className="group">
                <OutfitCard
                  id={outfit.id}
                  image={outfit.image}
                  celebrity={outfit.celebrity}
                  celebrityId={outfit.celebrityId}
                  title={outfit.title}
                  description={outfit.description}
                  slug={outfit.slug}
                />
                
                {/* Hidden structured data for individual outfits */}
                <script type="application/ld+json">
                  {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "Article",
                    "headline": outfit.title,
                    "description": outfit.description,
                    "author": {
                      "@type": "Person",
                      "name": outfit.celebrity
                    },
                    "image": outfit.image,
                    "url": `${window.location.origin}/outfit/${outfit.id}`,
                    "publisher": {
                      "@type": "Organization",
                      "name": "CelebrityPersona"
                    }
                  })}
                </script>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-muted-foreground mb-4">No outfits found matching your search criteria.</p>
            <p className="text-sm text-muted-foreground">
              Try searching for different terms or{" "}
              <button 
                onClick={() => {setSearchTerm(""); setSelectedCategory("all");}}
                className="text-primary hover:text-primary/80 underline"
              >
                browse all outfits
              </button>
            </p>
          </div>
        )}

        {/* Load More Button */}
        {filteredOutfits.length > 0 && (
          <div className="flex justify-center mt-12">
            <Button 
              onClick={handleLoadMore} 
              disabled={isLoadingMore}
              className="btn-primary"
            >
              {isLoadingMore ? "Loading..." : "Load More"}
            </Button>
          </div>
        )}

        {/* Enhanced Fashion Resources & Tips Section */}
        <div className="mt-16">
          <SectionHeader title={seoContentSnippets.shoppingGuides.heading} />
          <p className="text-muted-foreground mb-8 text-center max-w-2xl mx-auto">
            {seoContentSnippets.shoppingGuides.description}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SeasonalTrendsCard />
            <StyleMatchCard />
            <ShoppingGuidesCard />
          </div>
        </div>
        
        {/* Internal linking section */}
        <div className="mt-12 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Explore More Celebrity Fashion</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {internalLinks.map((link) => (
              <a
                key={link.url}
                href={link.url}
                className="text-primary hover:text-primary/80 underline text-sm"
                title={link.title}
              >
                {link.anchor}
              </a>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Outfits;
