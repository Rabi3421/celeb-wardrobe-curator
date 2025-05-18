
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import OutfitCard from "@/components/ui/OutfitCard";
import SectionHeader from "@/components/ui/SectionHeader";
import { fetchCelebrityBySlug, fetchCelebrityById, fetchOutfits } from "@/services/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Calendar,
  Heart, 
  Instagram, 
  Loader2, 
  Star, 
  Tag, 
  Twitter, 
  User,
  Grid3x3,
  Shirt 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Celebrity, Outfit } from "@/types/data";
import { useQuery } from "@tanstack/react-query";

const CelebrityProfile: React.FC = () => {
  const { id, slug } = useParams<{ id?: string; slug?: string }>();
  const identifier = slug || id;
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState("outfits");
  const [isFollowing, setIsFollowing] = useState(false);
  const [followers, setFollowers] = useState(3200);

  // Query to fetch celebrity data
  const { data: celebrity, isLoading: isLoadingCelebrity, error: celebrityError } = useQuery({
    queryKey: ['celebrity', identifier],
    queryFn: async () => {
      if (!identifier) return null;
      
      // Try fetching by slug first if that's what we have, otherwise by ID
      const celebData = slug 
        ? await fetchCelebrityBySlug(slug)
        : await fetchCelebrityById(id!);
      
      if (!celebData) throw new Error("Celebrity not found");
      return celebData;
    }
  });

  // Query to fetch outfits for this celebrity
  const { data: outfits = [], isLoading: isLoadingOutfits } = useQuery({
    queryKey: ['celebrity', identifier, 'outfits'],
    queryFn: async () => {
      if (!celebrity) return [];
      
      const allOutfits = await fetchOutfits();
      return allOutfits.filter(outfit => outfit.celebrityId === celebrity.id);
    },
    enabled: !!celebrity
  });

  // Handle Follow/Unfollow
  const handleFollowToggle = () => {
    if (isFollowing) {
      setFollowers(followers - 1);
      setIsFollowing(false);
      toast({
        description: `You unfollowed ${celebrity?.name}`,
        duration: 2000,
      });
    } else {
      setFollowers(followers + 1);
      setIsFollowing(true);
      toast({
        description: `You are now following ${celebrity?.name}`,
        duration: 2000,
      });
    }
  };

  if (isLoadingCelebrity) {
    return (
      <PageLayout>
        <div className="container-custom py-16 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="text-muted-foreground mt-4">Loading celebrity profile...</p>
        </div>
      </PageLayout>
    );
  }

  if (celebrityError || !celebrity) {
    return (
      <PageLayout>
        <div className="container-custom py-16 text-center">
          <h2 className="font-serif text-2xl mb-4">Celebrity not found</h2>
          <p className="text-muted-foreground">The celebrity you're looking for doesn't exist or has been removed.</p>
        </div>
      </PageLayout>
    );
  }

  // Get latest outfit
  const latestOutfit = outfits[0];
  
  // Group outfits by occasion
  const occasionGroups: Record<string, Outfit[]> = {};
  
  outfits.forEach(outfit => {
    const occasion = outfit.occasion || "Other";
    if (!occasionGroups[occasion]) {
      occasionGroups[occasion] = [];
    }
    occasionGroups[occasion].push(outfit);
  });

  return (
    <PageLayout>
      {/* Hero Section with Celebrity Details */}
      <section className="relative bg-gradient-to-r from-pastel-lavender to-pastel-blue pb-20 pt-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/80"></div>
        <div className="container-custom relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Celebrity Image Column */}
            <div className="lg:col-span-4 xl:col-span-3 flex justify-center">
              <div className="relative">
                <div className="w-64 h-64 md:w-72 md:h-72 rounded-full overflow-hidden border-4 border-white shadow-2xl">
                  <img
                    src={celebrity.image}
                    alt={celebrity.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-3 -right-3 bg-primary rounded-full p-2 shadow-lg">
                  <Star className="h-7 w-7 text-primary-foreground" />
                </div>
              </div>
            </div>
            
            {/* Celebrity Info Column */}
            <div className="lg:col-span-8 xl:col-span-9 text-center lg:text-left">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-4">
                <Badge variant="secondary" className="text-xs font-medium py-1">
                  {celebrity.category}
                </Badge>
                <Badge variant="secondary" className="text-xs font-medium py-1">
                  {celebrity.styleType}
                </Badge>
              </div>
              
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium mb-4 tracking-tight">
                {celebrity.name}
              </h1>
              
              <p className="text-muted-foreground md:text-lg mb-6 max-w-3xl mx-auto lg:mx-0">
                {celebrity.bio}
              </p>
              
              <div className="flex flex-wrap gap-6 items-center justify-center lg:justify-start mb-8">
                <div className="flex items-center gap-2">
                  <div className="bg-background/50 backdrop-blur-sm rounded-full p-2">
                    <Shirt className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Outfits</p>
                    <p className="font-medium text-lg">{celebrity.outfitCount}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-background/50 backdrop-blur-sm rounded-full p-2">
                    <Star className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Style</p>
                    <p className="font-medium text-lg">{celebrity.styleType}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-background/50 backdrop-blur-sm rounded-full p-2">
                    <User className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Followers</p>
                    <p className="font-medium text-lg">{followers.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-center lg:justify-start space-x-4">
                <Button 
                  className={`px-6 shadow-md ${isFollowing ? "bg-muted hover:bg-muted/80 text-foreground" : "bg-primary-foreground text-white hover:bg-primary-foreground/90"}`}
                  onClick={handleFollowToggle}
                  size="lg"
                >
                  {isFollowing ? (
                    <>
                      <Heart className="h-5 w-5 mr-2 fill-primary-foreground" />
                      Following
                    </>
                  ) : (
                    <>
                      <Heart className="h-5 w-5 mr-2" />
                      Follow
                    </>
                  )}
                </Button>
                <div className="flex space-x-2">
                  <Button variant="outline" size="icon" className="rounded-full bg-background/30 backdrop-blur-sm">
                    <Instagram className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full bg-background/30 backdrop-blur-sm">
                    <Twitter className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-background to-transparent"></div>
        <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-pastel-mint/20 blur-3xl"></div>
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-pastel-pink/20 blur-3xl"></div>
      </section>

      {/* Celebrity Content Tabs */}
      <section className="container-custom py-12">
        <Tabs defaultValue="outfits" className="w-full" onValueChange={setActiveTab}>
          <div className="border-b mb-8">
            <TabsList className="w-full justify-start bg-transparent h-12">
              <TabsTrigger 
                value="outfits"
                className="h-12 rounded-none border-b-2 border-transparent data-[state=active]:border-primary-foreground data-[state=active]:bg-transparent data-[state=active]:text-foreground"
              >
                <Shirt className="h-4 w-4 mr-2" />
                Outfits
              </TabsTrigger>
              <TabsTrigger 
                value="style"
                className="h-12 rounded-none border-b-2 border-transparent data-[state=active]:border-primary-foreground data-[state=active]:bg-transparent data-[state=active]:text-foreground"
              >
                <Star className="h-4 w-4 mr-2" />
                Style Analysis
              </TabsTrigger>
              <TabsTrigger 
                value="timeline"
                className="h-12 rounded-none border-b-2 border-transparent data-[state=active]:border-primary-foreground data-[state=active]:bg-transparent data-[state=active]:text-foreground"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Fashion Timeline
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="outfits" className="space-y-12">
            {/* Latest Look */}
            {latestOutfit && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <SectionHeader title="Latest Look" className="mb-0" />
                  <Badge variant="outline" className="text-xs font-medium py-1">
                    New
                  </Badge>
                </div>
                <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-r from-pastel-blue/30 to-pastel-lavender/30">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                    <div className="relative aspect-[3/4]">
                      <img 
                        src={latestOutfit.image} 
                        alt={latestOutfit.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col justify-center p-8">
                      <div className="mb-2">
                        <Badge className="bg-pastel-mint text-primary-foreground border-none">
                          {latestOutfit.occasion || "Casual"}
                        </Badge>
                      </div>
                      <h2 className="font-serif text-3xl font-medium mb-4">{latestOutfit.title}</h2>
                      <p className="text-muted-foreground mb-6">{latestOutfit.description}</p>
                      <div className="flex items-center space-x-4 mb-8">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Last Week</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Tag className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{latestOutfit.tags?.[0] || "Summer Collection"}</span>
                        </div>
                      </div>
                      <Button 
                        className="bg-primary-foreground text-white hover:bg-primary-foreground/90 w-fit" 
                        asChild
                        size="lg"
                      >
                        <a href={`/outfit/s/${latestOutfit.slug || latestOutfit.id}`}>View Outfit Details</a>
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            )}
            
            {/* Outfit Categories */}
            {isLoadingOutfits ? (
              <div className="text-center py-8">
                <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                <p className="text-muted-foreground mt-4">Loading outfits...</p>
              </div>
            ) : outfits.length > 0 ? (
              <div>
                <SectionHeader title="All Outfits" subtitle={`Browse ${celebrity.name}'s complete collection`} />
                
                <Tabs defaultValue={Object.keys(occasionGroups)[0] || "all"} className="mt-8">
                  <div className="flex justify-between items-center mb-6 flex-wrap">
                    <div className="flex items-center gap-3 mb-4 md:mb-0">
                      <h3 className="font-medium">Filter by occasion:</h3>
                      <TabsList className="bg-muted/50 p-1">
                        {Object.keys(occasionGroups).map((occasion) => (
                          <TabsTrigger
                            key={occasion}
                            value={occasion}
                            className="data-[state=active]:bg-white"
                          >
                            {occasion}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="h-9">
                        <Grid3x3 className="h-4 w-4 mr-2" />
                        Grid
                      </Button>
                    </div>
                  </div>

                  {Object.entries(occasionGroups).map(([occasion, outfitList]) => (
                    <TabsContent key={occasion} value={occasion} className="mt-0">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {outfitList.map((outfit) => (
                          <OutfitCard
                            key={outfit.id}
                            id={outfit.id}
                            image={outfit.image}
                            celebrity={outfit.celebrity}
                            celebrityId={outfit.celebrityId}
                            title={outfit.title}
                            description={outfit.description}
                            date={outfit.date}
                            occasion={outfit.occasion}
                            slug={outfit.slug}
                          />
                        ))}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
            ) : (
              <div className="text-center py-12 bg-muted/20 rounded-lg">
                <Shirt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">No outfits found</h3>
                <p className="text-muted-foreground">
                  No outfits have been added for {celebrity.name} yet.
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="style" className="space-y-8">
            <div className="bg-gradient-to-r from-pastel-lavender/30 to-pastel-blue/30 p-8 rounded-xl mb-8">
              <h2 className="font-serif text-2xl font-medium mb-4">Style Analysis</h2>
              <p className="mb-8 text-lg">
                {celebrity.name}'s distinctive fashion sense combines classic elegance with contemporary trends.
                Known for bold color choices and avant-garde accessories, their style has evolved from early career
                minimalism to the current sophisticated aesthetic that influences fashion globally.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-white/80 border-none shadow">
                  <CardContent className="p-6">
                    <h3 className="font-medium mb-2 flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 mr-2" />
                      Signature Look
                    </h3>
                    <p className="text-muted-foreground">
                      Monochromatic outfits with statement accessories and perfectly tailored silhouettes.
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-white/80 border-none shadow">
                  <CardContent className="p-6">
                    <h3 className="font-medium mb-2 flex items-center">
                      <Heart className="h-4 w-4 text-red-400 mr-2" />
                      Favorite Designers
                    </h3>
                    <p className="text-muted-foreground">
                      Regularly spotted wearing Valentino, Chanel, and emerging sustainable brands.
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-white/80 border-none shadow">
                  <CardContent className="p-6">
                    <h3 className="font-medium mb-2 flex items-center">
                      <User className="h-4 w-4 text-blue-400 mr-2" />
                      Style Influence
                    </h3>
                    <p className="text-muted-foreground">
                      Has inspired countless trends including layered minimalism and architectural accessories.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="border-none shadow">
                <CardContent className="p-6">
                  <h3 className="font-serif text-xl font-medium mb-4">Color Palette</h3>
                  <div className="flex flex-wrap gap-3 mb-4">
                    {['bg-red-400', 'bg-blue-400', 'bg-green-400', 'bg-purple-400', 'bg-yellow-400'].map((color, idx) => (
                      <div key={idx} className={`w-10 h-10 rounded-full ${color} shadow-sm`}></div>
                    ))}
                  </div>
                  <p className="text-muted-foreground">
                    {celebrity.name} gravitates toward bold, saturated colors with occasional neutral basics.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-none shadow">
                <CardContent className="p-6">
                  <h3 className="font-serif text-xl font-medium mb-4">Style Evolution</h3>
                  <div className="space-y-5">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">2018</span>
                        <span className="text-sm font-medium">Early Career • Minimal</span>
                      </div>
                      <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-pastel-mint to-pastel-blue h-2 rounded-full" style={{width: '30%'}}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">2020</span>
                        <span className="text-sm font-medium">Breakthrough • Experimental</span>
                      </div>
                      <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-pastel-mint to-pastel-blue h-2 rounded-full" style={{width: '60%'}}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">2025</span>
                        <span className="text-sm font-medium">Current • Refined</span>
                      </div>
                      <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-pastel-mint to-pastel-blue h-2 rounded-full" style={{width: '90%'}}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="timeline" className="space-y-8">
            <h2 className="font-serif text-2xl font-medium mb-6">Fashion Timeline</h2>
            <div className="relative border-l-2 border-primary-foreground/30 ml-6">
              {[2023, 2024, 2025].map((year, idx) => (
                <div key={idx} className="mb-12 ml-10">
                  <div className="absolute w-8 h-8 bg-primary-foreground rounded-full -left-4 border-4 border-background flex items-center justify-center text-white text-xs font-bold">
                    {idx + 1}
                  </div>
                  <div className="bg-gradient-to-r from-white to-pastel-blue/10 rounded-lg p-6 shadow-sm">
                    <time className="inline-block mb-1 text-sm font-normal leading-none px-3 py-1 bg-pastel-blue/30 rounded-full">{year}</time>
                    <h3 className="font-serif text-xl font-medium mt-2 mb-3">
                      {year === 2025 ? "Modern Minimalism" : 
                      year === 2024 ? "Sustainable Fashion Era" : "Bold Statement Period"}
                    </h3>
                    <p className="mb-5 text-muted-foreground">
                      {year === 2025 ? 
                        "Embraced clean lines and sustainable materials while maintaining a bold color palette." :
                      year === 2024 ? 
                        "Shifted to eco-conscious brands and vintage pieces, influencing sustainable fashion trends." :
                        "Known for experimental silhouettes and vibrant color blocking that defined red carpet appearances."}
                    </p>
                    <div className="grid grid-cols-3 gap-3 mt-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="aspect-square bg-muted rounded-md overflow-hidden shadow-sm">
                          <div className="w-full h-full bg-gradient-to-br from-pastel-lavender/20 to-pastel-blue/20"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </PageLayout>
  );
};

export default CelebrityProfile;
