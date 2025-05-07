
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import OutfitCard from "@/components/ui/OutfitCard";
import SectionHeader from "@/components/ui/SectionHeader";
import { celebrities, outfits } from "@/data/mockData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Heart, Instagram, Star, Tag, Twitter, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CelebrityProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const celebrity = celebrities.find(celeb => celeb.id === id);
  const celebrityOutfits = outfits.filter(outfit => outfit.celebrityId === id);
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState("outfits");
  const [isFollowing, setIsFollowing] = useState(false);
  const [followers, setFollowers] = useState(3200);

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

  if (!celebrity) {
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
  const latestOutfit = celebrityOutfits[0];
  
  // Group outfits by occasion
  const occasionGroups: Record<string, typeof outfits> = {};
  
  celebrityOutfits.forEach(outfit => {
    const occasion = outfit.occasion || "Other";
    if (!occasionGroups[occasion]) {
      occasionGroups[occasion] = [];
    }
    occasionGroups[occasion].push(outfit);
  });

  return (
    <PageLayout>
      {/* Celebrity Header */}
      <section className="bg-gradient-to-r from-pastel-lavender to-pastel-blue py-12">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center">
            <div className="mb-8 md:mb-0 md:mr-10">
              <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-lg">
                <img
                  src={celebrity.image}
                  alt={celebrity.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="text-center md:text-left flex-1">
              <h1 className="font-serif text-3xl md:text-4xl font-medium mb-4">
                {celebrity.name}
              </h1>
              <p className="text-muted-foreground md:text-lg mb-5 max-w-2xl">
                {celebrity.bio}
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start mb-4">
                <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                  <span className="text-sm text-muted-foreground">Outfits</span>
                  <p className="font-medium">{celebrityOutfits.length}</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                  <span className="text-sm text-muted-foreground">Style</span>
                  <p className="font-medium">{celebrity.styleType || "Trendsetter"}</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                  <span className="text-sm text-muted-foreground">Followers</span>
                  <p className="font-medium">{followers.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center justify-center md:justify-start space-x-4">
                <Button 
                  className={isFollowing ? "bg-muted hover:bg-muted/80 text-foreground" : "btn-primary"}
                  onClick={handleFollowToggle}
                >
                  {isFollowing ? "Following" : "Follow"}
                </Button>
                <div className="flex space-x-2">
                  <Button variant="outline" size="icon" className="rounded-full">
                    <Instagram className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <Twitter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Celebrity Content Tabs */}
      <section className="container-custom py-12">
        <Tabs defaultValue="outfits" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start mb-8 bg-muted/50">
            <TabsTrigger 
              value="outfits"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Outfits
            </TabsTrigger>
            <TabsTrigger 
              value="style"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Style Analysis
            </TabsTrigger>
            <TabsTrigger 
              value="timeline"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Fashion Timeline
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="outfits" className="space-y-8">
            {/* Latest Look */}
            {latestOutfit && (
              <div className="mb-12">
                <SectionHeader title="Latest Look" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="relative aspect-[3/4]">
                    <img 
                      src={latestOutfit.image} 
                      alt={latestOutfit.title}
                      className="absolute inset-0 w-full h-full object-cover rounded-lg shadow-lg"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <div className="mb-2">
                      <span className="bg-pastel-mint px-3 py-1 rounded-full text-sm text-primary-foreground">
                        {latestOutfit.occasion || "Casual"}
                      </span>
                    </div>
                    <h2 className="font-serif text-3xl font-medium mb-4">{latestOutfit.title}</h2>
                    <p className="text-muted-foreground mb-6">{latestOutfit.description}</p>
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Last Week</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Tag className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Summer Collection</span>
                      </div>
                    </div>
                    <Button className="btn-primary w-fit">View Outfit Details</Button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Outfit Categories */}
            <div>
              <Tabs defaultValue={Object.keys(occasionGroups)[0] || "all"}>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="section-title mb-0">Browse By Occasion</h2>
                  <TabsList className="bg-transparent">
                    {Object.keys(occasionGroups).map((occasion) => (
                      <TabsTrigger
                        key={occasion}
                        value={occasion}
                        className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                      >
                        {occasion}
                      </TabsTrigger>
                    ))}
                  </TabsList>
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
                        />
                      ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </TabsContent>
          
          <TabsContent value="style" className="space-y-8">
            <div className="bg-secondary/30 p-6 rounded-xl mb-8">
              <h2 className="font-serif text-2xl font-medium mb-4">Style Analysis</h2>
              <p className="mb-6">
                {celebrity.name}'s distinctive fashion sense combines classic elegance with contemporary trends.
                Known for bold color choices and avant-garde accessories, their style has evolved from early career
                minimalism to the current sophisticated aesthetic that influences fashion globally.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/80 p-4 rounded-lg">
                  <h3 className="font-medium mb-2 flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 mr-2" />
                    Signature Look
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Monochromatic outfits with statement accessories and perfectly tailored silhouettes.
                  </p>
                </div>
                <div className="bg-white/80 p-4 rounded-lg">
                  <h3 className="font-medium mb-2 flex items-center">
                    <Heart className="h-4 w-4 text-red-400 mr-2" />
                    Favorite Designers
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Regularly spotted wearing Valentino, Chanel, and emerging sustainable brands.
                  </p>
                </div>
                <div className="bg-white/80 p-4 rounded-lg">
                  <h3 className="font-medium mb-2 flex items-center">
                    <User className="h-4 w-4 text-blue-400 mr-2" />
                    Style Influence
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Has inspired countless trends including layered minimalism and architectural accessories.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-serif text-xl font-medium mb-4">Color Palette</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {['bg-red-400', 'bg-blue-400', 'bg-green-400', 'bg-purple-400', 'bg-yellow-400'].map((color, idx) => (
                      <div key={idx} className={`w-8 h-8 rounded-full ${color}`}></div>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {celebrity.name} gravitates toward bold, saturated colors with occasional neutral basics.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-serif text-xl font-medium mb-4">Style Evolution</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>2018</span>
                      <span className="font-medium">Early Career</span>
                      <span>Minimal</span>
                    </div>
                    <div className="w-full bg-muted h-1 rounded-full">
                      <div className="bg-primary h-1 rounded-full" style={{width: '30%'}}></div>
                    </div>
                    <div className="flex justify-between">
                      <span>2020</span>
                      <span className="font-medium">Breakthrough</span>
                      <span>Experimental</span>
                    </div>
                    <div className="w-full bg-muted h-1 rounded-full">
                      <div className="bg-primary h-1 rounded-full" style={{width: '60%'}}></div>
                    </div>
                    <div className="flex justify-between">
                      <span>2025</span>
                      <span className="font-medium">Current</span>
                      <span>Refined</span>
                    </div>
                    <div className="w-full bg-muted h-1 rounded-full">
                      <div className="bg-primary h-1 rounded-full" style={{width: '90%'}}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="timeline" className="space-y-8">
            <h2 className="font-serif text-2xl font-medium mb-6">Fashion Timeline</h2>
            <div className="relative border-l border-border ml-6">
              {[2023, 2024, 2025].map((year, idx) => (
                <div key={idx} className="mb-10 ml-8">
                  <div className="absolute w-6 h-6 bg-primary rounded-full -left-3 border-4 border-background"></div>
                  <time className="mb-1 text-sm font-normal leading-none text-muted-foreground">{year}</time>
                  <h3 className="font-serif text-xl font-medium mb-2">
                    {year === 2025 ? "Modern Minimalism" : 
                     year === 2024 ? "Sustainable Fashion Era" : "Bold Statement Period"}
                  </h3>
                  <p className="mb-4 text-muted-foreground">
                    {year === 2025 ? 
                      "Embraced clean lines and sustainable materials while maintaining a bold color palette." :
                     year === 2024 ? 
                      "Shifted to eco-conscious brands and vintage pieces, influencing sustainable fashion trends." :
                      "Known for experimental silhouettes and vibrant color blocking that defined red carpet appearances."}
                  </p>
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="aspect-square bg-muted rounded-md"></div>
                    ))}
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
