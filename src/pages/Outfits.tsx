import React, { useState, useEffect } from "react";
import PageLayout from "@/components/layout/PageLayout";
import OutfitCard from "@/components/ui/OutfitCard";
import SectionHeader from "@/components/ui/SectionHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Calendar, Heart, Tag, Palette, ShoppingBag, Bookmark } from "lucide-react";
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
  
  if (isLoading) {
    return (
      <PageLayout>
        <div className="container-custom py-16 text-center">
          <p className="text-muted-foreground">Loading outfits...</p>
        </div>
      </PageLayout>
    );
  }
  
  return (
    <PageLayout>
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

        {/* Enhanced Style Tips Section */}
        <div className="mt-16">
          <SectionHeader title="Fashion Resources & Tips" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Seasonal Trends Card */}
            <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
              <div className="bg-pastel-peach h-36 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 flex items-end p-4">
                  <Palette className="h-8 w-8 text-white group-hover:scale-110 transition-transform" />
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-lg group-hover:text-primary transition-colors">Seasonal Trends</CardTitle>
                <CardDescription>Spring/Summer 2025</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                    <span className="text-sm">Oversized silhouettes continue to dominate</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                    <span className="text-sm">Bold color blocking in unexpected combinations</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                    <span className="text-sm">Sustainable fabrics from celebrity-backed brands</span>
                  </li>
                </ul>
                <Button variant="outline" size="sm" className="w-full group-hover:bg-primary group-hover:text-white transition-colors">
                  Explore Trends
                </Button>
              </CardContent>
            </Card>

            {/* Style Inspirations Card */}
            <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
              <div className="bg-pastel-lavender h-36 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 flex items-end p-4">
                  <Bookmark className="h-8 w-8 text-white group-hover:scale-110 transition-transform" />
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-lg group-hover:text-primary transition-colors">Style Inspirations</CardTitle>
                <CardDescription>Find your personal aesthetic</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {["Minimalist", "Bohemian", "Streetwear", "Y2K", "Classic"].map((style) => (
                    <span 
                      key={style}
                      className="text-xs px-2 py-1 rounded-full bg-secondary hover:bg-primary hover:text-white cursor-pointer transition-colors"
                    >
                      {style}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Discover which celebrity's style aligns with your personal aesthetic and build your wardrobe accordingly.
                </p>
                <Button variant="outline" size="sm" className="w-full group-hover:bg-primary group-hover:text-white transition-colors">
                  Find Your Style Match
                </Button>
              </CardContent>
            </Card>

            {/* Shopping Guides Card */}
            <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
              <div className="bg-pastel-blue h-36 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 flex items-end p-4">
                  <ShoppingBag className="h-8 w-8 text-white group-hover:scale-110 transition-transform" />
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-lg group-hover:text-primary transition-colors">Shopping Guides</CardTitle>
                <CardDescription>Celebrity-inspired collections</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Zendaya's Red Carpet Look</span>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <Heart className="h-4 w-4 text-muted-foreground hover:text-red-500 transition-colors" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Rihanna's Street Style</span>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <Heart className="h-4 w-4 text-muted-foreground hover:text-red-500 transition-colors" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Timothée's Casual Edit</span>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <Heart className="h-4 w-4 text-muted-foreground hover:text-red-500 transition-colors" />
                    </Button>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full group-hover:bg-primary group-hover:text-white transition-colors">
                  View All Guides
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Outfits;
