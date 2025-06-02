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

  // Enhanced FAQ data specifically for outfits
  const outfitsFaqData = [
    ...seoFaqData.outfits,
    {
      question: "How often do you add new celebrity outfit inspirations?",
      answer: "We add new celebrity outfit inspirations daily, featuring the latest red carpet looks, street style moments, and trending fashion from your favorite stars."
    },
    {
      question: "Can I filter outfits by specific occasions?",
      answer: "Yes! You can filter outfits by occasions like red carpet, casual, street style, awards shows, and more to find the perfect inspiration for your event."
    }
  ];
  
  if (isLoading) {
    return (
      <PageLayout>
        <EnhancedSEO
          title="Celebrity Outfit Inspirations | Shop The Look For Less | CelebrityPersona"
          description="Discover 500+ celebrity outfit inspirations and shop affordable alternatives. From Zendaya's red carpet looks to Rihanna's street style - recreate your favorite celebrity outfits for less."
          keywords="celebrity outfits, celebrity fashion inspiration, affordable celebrity looks, shop celebrity style, celebrity outfit dupes, red carpet fashion, street style"
          breadcrumbs={breadcrumbs}
          faqSchema={outfitsFaqData}
          itemListSchema={itemListSchema}
          category="outfits"
          ogImage="/images/hero_img.webp"
          ogTitle="Celebrity Outfit Inspirations - Shop The Look For Less"
          ogDescription="Discover celebrity outfit inspirations from Zendaya, Rihanna, Harry Styles & more. Shop affordable alternatives to recreate your favorite celebrity looks."
          twitterTitle="Celebrity Outfit Inspirations - Shop The Look For Less"
          twitterDescription="Discover celebrity outfit inspirations and shop affordable alternatives. From red carpet to street style - get the look for less!"
          dateModified={new Date().toISOString()}
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
        description="Discover 500+ celebrity outfit inspirations and shop affordable alternatives. From Zendaya's red carpet looks to Rihanna's street style - recreate your favorite celebrity outfits for less."
        keywords="celebrity outfits, celebrity fashion inspiration, affordable celebrity looks, shop celebrity style, celebrity outfit dupes, red carpet fashion, street style"
        breadcrumbs={breadcrumbs}
        faqSchema={outfitsFaqData}
        itemListSchema={itemListSchema}
        category="outfits"
        ogImage="/images/hero_img.webp"
        ogTitle="Celebrity Outfit Inspirations - Shop The Look For Less"
        ogDescription="Discover celebrity outfit inspirations from Zendaya, Rihanna, Harry Styles & more. Shop affordable alternatives to recreate your favorite celebrity looks."
        twitterTitle="Celebrity Outfit Inspirations - Shop The Look For Less"
        twitterDescription="Discover celebrity outfit inspirations and shop affordable alternatives. From red carpet to street style - get the look for less!"
        dateModified={new Date().toISOString()}
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
                    alt={`${featuredOutfit.celebrity} ${featuredOutfit.title} - Celebrity fashion inspiration`}
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
