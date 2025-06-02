import React, { useState, useEffect } from "react";
import PageLayout from "@/components/layout/PageLayout";
import OutfitCard from "@/components/ui/OutfitCard";
import SectionHeader from "@/components/ui/SectionHeader";
import SeasonalTrendsCard from "@/components/ui/SeasonalTrendsCard";
import StyleMatchCard from "@/components/ui/StyleMatchCard";
import ShoppingGuidesCard from "@/components/ui/ShoppingGuidesCard";
import SEO from "@/components/SEO/SEO";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Calendar, Heart, Tag, Home, ChevronRight } from "lucide-react";
import { fetchOutfits } from "@/services/api";
import { Outfit } from "@/types/data";
import { useToast } from "@/hooks/use-toast";

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

  // Breadcrumbs for SEO
  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Outfits", url: "/outfits" }
  ];

  // Generate structured data for outfit listings
  const outfitListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Celebrity Outfit Inspirations",
    "description": "Browse through our curated collection of celebrity outfits for your daily style inspiration.",
    "numberOfItems": filteredOutfits.length,
    "itemListElement": filteredOutfits.slice(0, 20).map((outfit, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Article",
        "name": outfit.title,
        "description": outfit.description,
        "image": outfit.image,
        "author": {
          "@type": "Person",
          "name": outfit.celebrity
        },
        "url": `${window.location.origin}/outfit/${outfit.id}`
      }
    }))
  };

  // FAQ Schema for common questions
  const faqSchema = [
    {
      question: "How can I recreate celebrity outfits on a budget?",
      answer: "Look for affordable alternatives at fast fashion retailers, thrift stores, and online marketplaces. Focus on similar silhouettes, colors, and styling rather than exact designer pieces."
    },
    {
      question: "Where do celebrities get their outfits?",
      answer: "Celebrities often work with stylists who source outfits from luxury designers, emerging brands, vintage pieces, and custom-made garments for red carpet events and public appearances."
    },
    {
      question: "Can I buy the exact outfits celebrities wear?",
      answer: "Some celebrity outfits are available for purchase, especially from mainstream brands. We provide affiliate links when possible to help you shop similar or exact pieces."
    }
  ];
  
  if (isLoading) {
    return (
      <PageLayout>
        <SEO
          title="Celebrity Outfit Inspirations | CelebrityPersona"
          description="Browse through our curated collection of celebrity outfits for your daily style inspiration. From red carpet looks to casual street style."
          keywords="celebrity outfits, celebrity fashion, style inspiration, celebrity looks"
          breadcrumbs={breadcrumbs}
          faqSchema={faqSchema}
          jsonLd={outfitListSchema}
        />
        <div className="container-custom py-16 text-center">
          <p className="text-muted-foreground">Loading outfits...</p>
        </div>
      </PageLayout>
    );
  }
  
  return (
    <PageLayout>
      <SEO
        title="Celebrity Outfit Inspirations | CelebrityPersona"
        description="Browse through our curated collection of celebrity outfits for your daily style inspiration. From red carpet looks to casual street style - find your next fashion statement."
        keywords="celebrity outfits, celebrity fashion, style inspiration, celebrity looks, red carpet fashion, street style"
        breadcrumbs={breadcrumbs}
        faqSchema={faqSchema}
        jsonLd={outfitListSchema}
        ogImage="/images/hero_img.webp"
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

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-pastel-peach to-pastel-pink py-16">
        <div className="container-custom text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-medium mb-4">
            Celebrity Outfit Inspirations
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Browse through our curated collection of celebrity outfits for your daily style inspiration.
            From red carpet looks to casual street style - find your next fashion statement.
          </p>
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search outfits by name, style, or celebrity..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-6 rounded-full"
            />
          </div>
        </div>
      </div>

      <div className="container-custom py-12">
        {/* Featured Outfit */}
        {featuredOutfit && (
          <div className="mb-12">
            <SectionHeader title="Look of the Day" />
            <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-r from-pastel-blue to-pastel-lavender">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="relative aspect-[3/4] md:aspect-auto">
                  <img
                    src={featuredOutfit.image}
                    alt={featuredOutfit.title}
                    className="absolute inset-0 w-full h-full object-cover"
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
                    <p className="mb-6">{featuredOutfit.description}</p>
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{featuredOutfit.date ? new Date(featuredOutfit.date).toLocaleDateString() : "Recent"}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Heart className="h-4 w-4 text-red-500" />
                        <span className="text-sm">3.2k Likes</span>
                      </div>
                    </div>
                    <Button 
                      className="bg-white text-primary-foreground hover:bg-white/90"
                      onClick={() => window.location.href = `/outfit/${featuredOutfit.id}`}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Categories Tabs */}
        <div className="mb-8">
          <Tabs defaultValue="all" className="w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="section-title mb-0">Browse By Occasion</h2>
              <TabsList className="bg-transparent overflow-x-auto">
                {occasions.map((occasion) => (
                  <TabsTrigger
                    key={occasion}
                    value={occasion}
                    onClick={() => setSelectedCategory(occasion)}
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground capitalize"
                  >
                    {occasion}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </Tabs>
        </div>

        {/* Outfit Grid */}
        {filteredOutfits.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredOutfits.map((outfit) => (
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
        ) : (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">No outfits found matching your search criteria.</p>
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
          <SectionHeader title="Fashion Resources & Tips" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SeasonalTrendsCard />
            <StyleMatchCard />
            <ShoppingGuidesCard />
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Outfits;
