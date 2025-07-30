import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import PageLayout from "@/components/layout/PageLayout";
import OutfitCard from "@/components/ui/OutfitCard";
import SectionHeader from "@/components/ui/SectionHeader";
import { fetchCelebrityBySlug, getCelebrityById, fetchOutfits } from "@/services/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Calendar,
  Heart,
  Instagram,
  Twitter,
  Facebook,
  User,
  Shirt,
  MapPin,
  Award,
  Link
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Celebrity, Outfit } from "@/types/data";
import { useQuery } from "@tanstack/react-query";
import CelebrityInfoSection from "@/components/celebrity/CelebrityInfoSection";
import CelebrityTimelineSection from "@/components/celebrity/CelebrityTimelineSection";
import CelebrityStyleSection from "@/components/celebrity/CelebrityStyleSection";
import CelebrityWikiProfile from "@/components/celebrity/CelebrityWikiProfile";
import { Square } from "lucide-react";

const CelebrityProfile: React.FC = () => {
  const { id, slug } = useParams<{ id?: string; slug?: string }>();
  const identifier = slug || id;
  const { toast } = useToast();
  const [modalImage, setModalImage] = useState<{ src: string; alt: string } | null>(null);
  const [activeTab, setActiveTab] = useState("info");
  const [isFollowing, setIsFollowing] = useState(false);
  const [followers, setFollowers] = useState(3200);

  // Query to fetch celebrity data
  const { data: celebrity, isLoading: isLoadingCelebrity, error: celebrityError } = useQuery({
    queryKey: ['celebrity', identifier],
    queryFn: async () => {
      if (!identifier) return null;
      // Check if the identifier is a UUID (for id-based routes)
      const isUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(identifier);
      // If it's a UUID, fetch by ID, otherwise fetch by slug
      const celebData = isUuid
        ? await getCelebrityById(identifier)
        : await fetchCelebrityBySlug(identifier);
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

  useEffect(() => {
    if (!modalImage) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModalImage(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [modalImage]);

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
    "image": celebrity.coverImage || celebrity.infoboxImage,
    "description": celebrity.bio,
    "birthPlace": celebrity.birthplace,
    "height": celebrity.height,
    "url": canonicalUrl
  };
  console.log("finalcelebrity", celebrity);
  return (
    <PageLayout>
      {/* SEO Optimization */}
      <Helmet>
        <title>{celebrity.name} - Fashion Style & Outfits | Celebrity Persona</title>
        <meta name="description" content={metaDescription} />
        <meta property="og:title" content={`${celebrity.name} - Fashion Style & Outfits`} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={celebrity.coverImage || celebrity.infoboxImage} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="profile" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${celebrity.name} - Fashion Style & Outfits`} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={celebrity.coverImage || celebrity.infoboxImage} />
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
                    src={celebrity.coverImage || celebrity.infoboxImage}
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
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium mb-4 tracking-tight">
                {celebrity.name}
              </h1>

              <div className="flex flex-wrap gap-6 items-center justify-center lg:justify-start mb-8">
                <div className="flex items-center gap-2">
                  <div className="bg-background/50 backdrop-blur-sm rounded-full p-2">
                    <Shirt className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Outfits</p>
                    <p className="font-medium text-lg">{celebrity.outfitCount || outfits.length || 0}</p>
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

              <div className="flex items-center justify-center lg:justify-start space-x-4 mt-4">
                {/* Follow Button */}
                <Button
                  className={`px-8 py-3 font-semibold shadow-xl transition-all duration-200 rounded-full text-base border-0
      ${isFollowing
                      ? "bg-gradient-to-r from-pastel-mint to-pastel-blue text-primary hover:from-pastel-blue hover:to-pastel-mint"
                      : "bg-gradient-to-r from-pastel-pink to-pastel-lavender text-white hover:from-pastel-lavender hover:to-pastel-pink scale-105"
                    }`}
                  onClick={handleFollowToggle}
                  size="lg"
                  style={{ minWidth: 140 }}
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
                <div className="flex space-x-3">
                  {celebrity.socialMedia?.instagram && (
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full bg-gradient-to-br from-pastel-pink/60 to-pastel-mint/60 border-0 hover:scale-110 transition-all duration-200 shadow-lg"
                      asChild
                    >
                      <a href={celebrity.socialMedia.instagram} target="_blank" rel="noopener noreferrer">
                        <Instagram className="h-5 w-5 text-primary" />
                      </a>
                    </Button>
                  )}
                  {celebrity.socialMedia?.twitter && (
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full bg-gradient-to-br from-pastel-blue/60 to-pastel-mint/60 border-0 hover:scale-110 transition-all duration-200 shadow-lg"
                      asChild
                    >
                      <a href={celebrity.socialMedia.twitter} target="_blank" rel="noopener noreferrer">
                        <Twitter className="h-5 w-5 text-primary" />
                      </a>
                    </Button>
                  )}
                  {celebrity.socialMedia?.facebook && (
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full bg-gradient-to-br from-pastel-lavender/60 to-pastel-blue/60 border-0 hover:scale-110 transition-all duration-200 shadow-lg"
                      asChild
                    >
                      <a href={celebrity.socialMedia.facebook} target="_blank" rel="noopener noreferrer">
                        <Facebook className="h-5 w-5 text-primary" />
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

      {/* Celebrity Information Tabs */}
      <section className="container-custom py-12 border-t">
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
                value="style"
                className="h-12 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground"
              >
                <Award className="h-4 w-4 mr-2" />
                Style Analysis
              </TabsTrigger>
              <TabsTrigger
                value="gallery"
                className="h-12 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground"
              >
                <Shirt className="h-4 w-4 mr-2" />
                Gallery
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Biography & Information Tab */}
          <TabsContent value="info">
            <CelebrityWikiProfile celebrity={celebrity} />
            {/* <CelebrityInfoSection celebrity={celebrity} /> */}
          </TabsContent>

          {/* Style Analysis Tab */}
          <TabsContent value="style" className="space-y-8">
            <CelebrityStyleSection celebrity={celebrity} />
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="gallery" className="space-y-8">
            <SectionHeader title={`${celebrity.name}'s Gallery`} />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {celebrity.galleryImages && celebrity.galleryImages.length > 0 ? (
                celebrity.galleryImages.map((img, idx) => (
                  <div
                    key={img + idx}
                    className="aspect-[3/4] rounded-lg overflow-hidden shadow cursor-pointer relative group"
                    onClick={() => setModalImage({ src: img, alt: `${celebrity.name} Gallery Image ${idx + 1}` })}
                  >
                    <img
                      src={img}
                      alt={`${celebrity.name} Gallery Image ${idx + 1}`}
                      className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                    {/* Hover overlay with icon */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Square className="h-10 w-10 text-white drop-shadow-lg" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center text-muted-foreground py-8">
                  No gallery images found for {celebrity.name}.
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Outfits Section */}
      <section className="container-custom py-12">
        {/* Latest Look */}
        {outfits.length > 0 && outfits[0] && (
          <div className="mb-12">
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
                    src={outfits[0].images[0]}
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {outfits.map((outfit) => (
                <OutfitCard
                  key={outfit._id || outfit.id}
                  id={outfit._id || outfit.id}
                  image={Array.isArray(outfit.images) ? outfit.images[0] : outfit.image}
                  celebrity={
                    typeof outfit.celebrity === "object" && outfit.celebrity !== null
                      ? outfit.celebrity.name
                      : outfit.celebrity || celebrity.name
                  }
                  celebrityId={
                    typeof outfit.celebrity === "object" && outfit.celebrity !== null
                      ? outfit.celebrity._id
                      : outfit.celebrityId
                  }
                  title={outfit.title}
                  description={outfit.description}
                  date={outfit.date}
                  occasion={outfit.occasion}
                  slug={outfit.slug}
                />
              ))}
            </div>
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

      {modalImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-2"
          onClick={() => setModalImage(null)}
          aria-modal="true"
          role="dialog"
        >
          <div
            className="relative bg-background rounded-xl shadow-2xl max-w-4xl w-full p-0 md:p-6 flex flex-col items-center"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 text-3xl text-muted-foreground hover:text-primary bg-white/80 rounded-full w-10 h-10 flex items-center justify-center shadow"
              onClick={() => setModalImage(null)}
              aria-label="Close"
              tabIndex={0}
            >
              &times;
            </button>
            <img
              src={modalImage.src}
              alt={modalImage.alt}
              className="rounded-lg shadow-lg max-h-[85vh] w-auto max-w-full object-contain bg-white"
            />
            <div className="mt-4 mb-2 text-center text-muted-foreground text-base px-4">
              {modalImage.alt}
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}

export default CelebrityProfile;