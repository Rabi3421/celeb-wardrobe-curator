import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import PageLayout from "@/components/layout/PageLayout";
import OutfitCard from "@/components/ui/OutfitCard";
import SectionHeader from "@/components/ui/SectionHeader";
import { fetchCelebrityBySlug, getCelebrityById, fetchOutfits } from "@/services/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Calendar,
  Heart, 
  Instagram, 
  Twitter,
  Facebook, 
  User,
  Grid3x3,
  Shirt,
  MapPin,
  Award,
  GraduationCap,
  Link
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Celebrity, Outfit } from "@/types/data";
import { useQuery } from "@tanstack/react-query";
import CelebrityInfoSection from "@/components/celebrity/CelebrityInfoSection";
import CelebrityTimelineSection from "@/components/celebrity/CelebrityTimelineSection";
import CelebrityStyleSection from "@/components/celebrity/CelebrityStyleSection";

const CelebrityProfile: React.FC = () => {
  const { id, slug } = useParams<{ id?: string; slug?: string }>();
  const identifier = slug || id;
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState("info");
  const [isFollowing, setIsFollowing] = useState(false);
  const [followers, setFollowers] = useState(3200);

  // Query to fetch celebrity data
  const { data: celebrity, isLoading: isLoadingCelebrity, error: celebrityError } = useQuery({
    queryKey: ['celebrity', identifier],
    queryFn: async () => {
      if (!identifier) return null;
      
      console.log("Fetching celebrity with identifier:", identifier);
      
      try {
        // Check if the identifier is a UUID (for id-based routes)
        const isUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(identifier);
        
        // If it's a UUID, fetch by ID, otherwise fetch by slug
        const celebData = isUuid 
          ? await getCelebrityById(identifier)
          : await fetchCelebrityBySlug(identifier);
        
        if (!celebData) {
          console.error("Celebrity not found for identifier:", identifier);
          throw new Error("Celebrity not found");
        }
        
        console.log("Found celebrity:", celebData.name);
        return celebData;
      } catch (error) {
        console.error("Error fetching celebrity:", error);
        throw error;
      }
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
          <div className="h-8 w-8 animate-spin mx-auto border-4 border-primary border-t-transparent rounded-full"></div>
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

  // Prepare meta description for SEO
  const metaDescription = `Discover ${celebrity.name}'s fashion style, outfits, biography and more. Browse through their latest looks and get inspired.`;
  const canonicalUrl = `https://celebritypersona.com/celebrity/${celebrity.slug || celebrity.id}`;
  
  // Create structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": celebrity.name,
    "image": celebrity.image,
    "description": celebrity.bio,
    "birthPlace": celebrity.birthplace,
    "height": celebrity.height,
    "url": canonicalUrl
  };

  return (
    <PageLayout>
      {/* SEO Optimization */}
      <Helmet>
        <title>{celebrity.name} - Fashion Style & Outfits | Celebrity Persona</title>
        <meta name="description" content={metaDescription} />
        <meta property="og:title" content={`${celebrity.name} - Fashion Style & Outfits`} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={celebrity.image} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="profile" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${celebrity.name} - Fashion Style & Outfits`} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={celebrity.image} />
        <link rel="canonical" href={canonicalUrl} />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      {/* Hero Section with Celebrity Details */}
      <section className="relative bg-gradient-to-r from-pastel-lavender/70 to-pastel-blue/70 pb-20 pt-16 overflow-hidden">
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
                  <Award className="h-7 w-7 text-primary-foreground" />
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
                {celebrity.birthplace && (
                  <div className="flex items-center gap-2">
                    <div className="bg-background/50 backdrop-blur-sm rounded-full p-2">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">From</p>
                      <p className="font-medium">{celebrity.birthplace}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <div className="bg-background/50 backdrop-blur-sm rounded-full p-2">
                    <Shirt className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Outfits</p>
                    <p className="font-medium text-lg">{celebrity.outfitCount}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="bg-background/50 backdrop-blur-sm rounded-full p-2">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Followers</p>
                    <p className="font-medium text-lg">{followers.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-center lg:justify-start space-x-4">
                <Button 
                  className={`px-6 shadow-md ${isFollowing ? "bg-muted hover:bg-muted/80 text-foreground" : "bg-primary text-white hover:bg-primary/90"}`}
                  onClick={handleFollowToggle}
                  size="lg"
                >
                  {isFollowing ? (
                    <>
                      <Heart className="h-5 w-5 mr-2 fill-primary" />
                      Following
                    </>
                  ) : (
                    <>
                      <Heart className="h-5 w-5 mr-2" />
                      Follow
                    </>
                  )}
                </Button>
                
                {/* Social Media Links */}
                <div className="flex space-x-2">
                  {celebrity.socialMedia?.instagram && (
                    <Button variant="outline" size="icon" className="rounded-full bg-background/30 backdrop-blur-sm" asChild>
                      <a href={celebrity.socialMedia.instagram} target="_blank" rel="noopener noreferrer">
                        <Instagram className="h-5 w-5" />
                      </a>
                    </Button>
                  )}
                  
                  {celebrity.socialMedia?.twitter && (
                    <Button variant="outline" size="icon" className="rounded-full bg-background/30 backdrop-blur-sm" asChild>
                      <a href={celebrity.socialMedia.twitter} target="_blank" rel="noopener noreferrer">
                        <Twitter className="h-5 w-5" />
                      </a>
                    </Button>
                  )}
                  
                  {celebrity.socialMedia?.facebook && (
                    <Button variant="outline" size="icon" className="rounded-full bg-background/30 backdrop-blur-sm" asChild>
                      <a href={celebrity.socialMedia.facebook} target="_blank" rel="noopener noreferrer">
                        <Facebook className="h-5 w-5" />
                      </a>
                    </Button>
                  )}
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
        <Tabs defaultValue="info" className="w-full" onValueChange={setActiveTab}>
          <div className="border-b mb-8">
            <TabsList className="w-full justify-start bg-transparent h-12">
              <TabsTrigger 
                value="info"
                className="h-12 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground"
              >
                <User className="h-4 w-4 mr-2" />
                Biography
              </TabsTrigger>
              <TabsTrigger 
                value="outfits"
                className="h-12 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground"
              >
                <Shirt className="h-4 w-4 mr-2" />
                Outfits
              </TabsTrigger>
              <TabsTrigger 
                value="style"
                className="h-12 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground"
              >
                <Award className="h-4 w-4 mr-2" />
                Style Analysis
              </TabsTrigger>
              <TabsTrigger 
                value="timeline"
                className="h-12 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Fashion Timeline
              </TabsTrigger>
            </TabsList>
          </div>
          
          {/* Biography & Information Tab */}
          <TabsContent value="info">
            <CelebrityInfoSection celebrity={celebrity} />
          </TabsContent>
          
          {/* Outfits Tab */}
          <TabsContent value="outfits" className="space-y-12">
            {/* Latest Look */}
            {outfits.length > 0 && (
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
                        src={outfits[0].image} 
                        alt={outfits[0].title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col justify-center p-8">
                      <div className="mb-2">
                        <Badge className="bg-pastel-mint text-primary-foreground border-none">
                          {outfits[0].occasion || "Casual"}
                        </Badge>
                      </div>
                      <h2 className="font-serif text-3xl font-medium mb-4">{outfits[0].title}</h2>
                      <p className="text-muted-foreground mb-6">{outfits[0].description}</p>
                      <div className="flex items-center space-x-4 mb-8">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{outfits[0].date ? new Date(outfits[0].date).toLocaleDateString() : "Recent"}</span>
                        </div>
                        {outfits[0].tags && outfits[0].tags.length > 0 && (
                          <div className="flex items-center space-x-2">
                            <Link className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{outfits[0].tags[0]}</span>
                          </div>
                        )}
                      </div>
                      <Button 
                        className="bg-primary text-white hover:bg-primary/90 w-fit" 
                        asChild
                        size="lg"
                      >
                        <a href={`/outfit/${outfits[0].slug || outfits[0].id}`}>View Outfit Details</a>
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            )}
            
            {/* All Outfits */}
            {isLoadingOutfits ? (
              <div className="text-center py-8">
                <div className="h-8 w-8 animate-spin mx-auto border-4 border-primary border-t-transparent rounded-full"></div>
                <p className="text-muted-foreground mt-4">Loading outfits...</p>
              </div>
            ) : outfits.length > 0 ? (
              <div>
                <SectionHeader 
                  title="All Outfits" 
                  subtitle={`Browse ${celebrity.name}'s complete collection of ${outfits.length} outfits`} 
                />
                
                {/* Group outfits by occasion */}
                {(() => {
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
                                celebrity={outfit.celebrity || celebrity.name}
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
                  );
                })()}
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
          
          {/* Style Analysis Tab */}
          <TabsContent value="style" className="space-y-8">
            <CelebrityStyleSection celebrity={celebrity} />
          </TabsContent>
          
          {/* Timeline Tab */}
          <TabsContent value="timeline" className="space-y-8">
            <CelebrityTimelineSection celebrity={celebrity} />
          </TabsContent>
        </Tabs>
      </section>

      {/* Related Celebrities - Optional Section */}
      <section className="container-custom py-12 border-t">
        <SectionHeader 
          title="You May Also Like" 
          viewAllLink="/celebrities" 
          viewAllText="View All Celebrities"
        />
        
        <div className="py-4">
          <p className="text-center text-muted-foreground">
            Discover more celebrities with similar style to {celebrity.name}.
          </p>
        </div>
      </section>
    </PageLayout>
  );
};

export default CelebrityProfile;
