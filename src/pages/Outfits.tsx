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
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Outfits: React.FC = () => {
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showTrendsDialog, setShowTrendsDialog] = useState(false);
  const [showStyleMatchDialog, setShowStyleMatchDialog] = useState(false);
  const [showGuidesDialog, setShowGuidesDialog] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
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
  
  // Handler functions for the resource cards
  const handleExploreTrends = () => {
    setShowTrendsDialog(true);
  };
  
  const handleFindStyleMatch = () => {
    setShowStyleMatchDialog(true);
  };
  
  const handleViewAllGuides = () => {
    setShowGuidesDialog(true);
  };
  
  const handleStyleSelection = (style: string) => {
    setSelectedStyle(style);
  };

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
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full group-hover:bg-primary group-hover:text-white transition-colors"
                  onClick={handleExploreTrends}
                >
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
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full group-hover:bg-primary group-hover:text-white transition-colors"
                  onClick={handleFindStyleMatch}
                >
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
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full group-hover:bg-primary group-hover:text-white transition-colors"
                  onClick={handleViewAllGuides}
                >
                  View All Guides
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Trends Dialog */}
      <Dialog open={showTrendsDialog} onOpenChange={setShowTrendsDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif">Spring/Summer 2025 Trends</DialogTitle>
            <DialogDescription>
              The latest fashion trends from celebrity style icons
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="space-y-4">
              <div className="border-b pb-4">
                <h3 className="font-medium text-lg mb-2">Oversized Silhouettes</h3>
                <p className="text-muted-foreground">
                  Celebrities like Zendaya and Rihanna are embracing voluminous shapes with oversized blazers, 
                  wide-leg pants, and billowing dresses that create dramatic, statement-making looks.
                </p>
              </div>
              
              <div className="border-b pb-4">
                <h3 className="font-medium text-lg mb-2">Bold Color Blocking</h3>
                <p className="text-muted-foreground">
                  A revival of 80s-inspired color combinations with modern twists - think cobalt blue paired 
                  with emerald green or hot pink with orange. Timothée Chalamet has been spotted experimenting with 
                  these daring color pairings.
                </p>
              </div>
              
              <div className="border-b pb-4">
                <h3 className="font-medium text-lg mb-2">Sustainable Celebrity Lines</h3>
                <p className="text-muted-foreground">
                  More celebrities are launching eco-conscious fashion lines using recycled materials, 
                  organic fabrics, and ethical production methods. Look for pieces that combine style with 
                  sustainability credentials.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-lg mb-2">Trending Accessories</h3>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                  <li>Chunky platform shoes</li>
                  <li>Statement shoulder bags</li>
                  <li>Tinted shield sunglasses</li>
                  <li>Layered mixed metal jewelry</li>
                  <li>Crochet and woven hats</li>
                </ul>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              onClick={() => setShowTrendsDialog(false)}
              className="w-full sm:w-auto"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Style Match Dialog */}
      <Dialog open={showStyleMatchDialog} onOpenChange={setShowStyleMatchDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif">Find Your Style Match</DialogTitle>
            <DialogDescription>
              Select the aesthetic that resonates most with your personal style
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  name: "Minimalist",
                  description: "Clean lines, neutral colors, and timeless simplicity",
                  celebrity: "Zendaya (off-duty style)"
                },
                {
                  name: "Bohemian",
                  description: "Flowy fabrics, earthy tones, and eclectic patterns",
                  celebrity: "Florence Welch"
                },
                {
                  name: "Streetwear",
                  description: "Urban, casual cool with a focus on comfort and statement pieces",
                  celebrity: "Rihanna"
                },
                {
                  name: "Y2K",
                  description: "Nostalgic revival of early 2000s trends and playful accessories",
                  celebrity: "Dua Lipa"
                },
                {
                  name: "Classic",
                  description: "Polished, refined silhouettes with an emphasis on quality",
                  celebrity: "Timothée Chalamet (red carpet)"
                }
              ].map((style) => (
                <div 
                  key={style.name}
                  className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                    selectedStyle === style.name ? 'border-primary bg-primary/5' : ''
                  }`}
                  onClick={() => handleStyleSelection(style.name)}
                >
                  <h3 className="font-medium">{style.name}</h3>
                  <p className="text-sm text-muted-foreground">{style.description}</p>
                  <p className="text-xs mt-2 italic">Celebrity inspo: {style.celebrity}</p>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button 
              variant="outline"
              onClick={() => setShowStyleMatchDialog(false)}
              className="sm:w-auto w-full order-1 sm:order-none"
            >
              Cancel
            </Button>
            <Button 
              onClick={() => {
                if (selectedStyle) {
                  toast({
                    title: "Style Match Confirmed",
                    description: `We'll curate content based on your ${selectedStyle} style preference.`,
                  });
                  setShowStyleMatchDialog(false);
                } else {
                  toast({
                    title: "Please select a style",
                    description: "Choose a style aesthetic to continue.",
                    variant: "destructive",
                  });
                }
              }}
              className="sm:w-auto w-full"
              disabled={!selectedStyle}
            >
              Confirm Selection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Shopping Guides Dialog */}
      <Dialog open={showGuidesDialog} onOpenChange={setShowGuidesDialog}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif">Celebrity Style Shopping Guides</DialogTitle>
            <DialogDescription>
              Curated collections inspired by your favorite celebrity looks
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="space-y-6">
              <div className="border rounded-lg overflow-hidden">
                <div className="grid grid-cols-1 sm:grid-cols-3">
                  <div className="aspect-square sm:aspect-auto bg-gray-100">
                    <img 
                      src="https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?q=80&w=1980&auto=format&fit=crop&ixlib=rb-4.0.3" 
                      alt="Zendaya Red Carpet Look" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="col-span-2 p-4">
                    <h3 className="font-medium text-lg mb-1">Zendaya's Red Carpet Look</h3>
                    <p className="text-sm text-muted-foreground mb-3">Recreate her stunning Met Gala emerald ensemble</p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Emerald statement dress</span>
                        <span className="text-sm font-medium">$189</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Crystal drop earrings</span>
                        <span className="text-sm font-medium">$45</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Metallic strappy heels</span>
                        <span className="text-sm font-medium">$79</span>
                      </div>
                    </div>
                    <Button size="sm" className="w-full sm:w-auto">Shop This Collection</Button>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg overflow-hidden">
                <div className="grid grid-cols-1 sm:grid-cols-3">
                  <div className="aspect-square sm:aspect-auto bg-gray-100">
                    <img 
                      src="https://images.unsplash.com/photo-1622495546323-5dac33dedb50?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3" 
                      alt="Rihanna Street Style" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="col-span-2 p-4">
                    <h3 className="font-medium text-lg mb-1">Rihanna's Street Style</h3>
                    <p className="text-sm text-muted-foreground mb-3">Urban chic with bold statement pieces and layers</p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Oversized bomber jacket</span>
                        <span className="text-sm font-medium">$155</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Graphic vintage tee</span>
                        <span className="text-sm font-medium">$38</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Wide-leg cargo pants</span>
                        <span className="text-sm font-medium">$85</span>
                      </div>
                    </div>
                    <Button size="sm" className="w-full sm:w-auto">Shop This Collection</Button>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg overflow-hidden">
                <div className="grid grid-cols-1 sm:grid-cols-3">
                  <div className="aspect-square sm:aspect-auto bg-gray-100">
                    <img 
                      src="https://images.unsplash.com/photo-1503185912284-5271ff81b9a8?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3" 
                      alt="Timothée's Casual Edit" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="col-span-2 p-4">
                    <h3 className="font-medium text-lg mb-1">Timothée's Casual Edit</h3>
                    <p className="text-sm text-muted-foreground mb-3">Effortless high-low mix with European influences</p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Fitted knit sweater</span>
                        <span className="text-sm font-medium">$68</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Slim-fit chinos</span>
                        <span className="text-sm font-medium">$59</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Chelsea boots</span>
                        <span className="text-sm font-medium">$120</span>
                      </div>
                    </div>
                    <Button size="sm" className="w-full sm:w-auto">Shop This Collection</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              onClick={() => setShowGuidesDialog(false)}
              className="w-full sm:w-auto"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default Outfits;
