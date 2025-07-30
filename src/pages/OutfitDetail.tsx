import React from "react";
import { useParams, Link } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import AffiliateProductCard from "@/components/ui/AffiliateProductCard";
import MediaGallery from "@/components/ui/MediaGallery";
import { fetchOutfitById, fetchAffiliateProductsByOutfitId } from "@/services/api";
import { Loader2, ShoppingCart, ExternalLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface MediaItem {
  id: string;
  url: string;
  type: 'image' | 'video';
  isPrimary: boolean;
  displayOrder: number;
}

const OutfitDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // Query to fetch outfit data by ID
  const { data: outfit, isLoading: isLoadingOutfit, error: outfitError } = useQuery({
    queryKey: ['outfit', id],
    queryFn: async () => {
      if (!id) throw new Error("Outfit ID not found");
      const outfitData = await fetchOutfitById(id);
      if (!outfitData) throw new Error("Outfit not found");
      return outfitData;
    }
  });

  // Use images array from outfit for gallery
  const displayMedia: MediaItem[] = outfit?.images?.length
    ? outfit.images.map((url: string, idx: number) => ({
      id: `img-${idx}`,
      url,
      type: 'image',
      isPrimary: idx === 0,
      displayOrder: idx,
    }))
    : [];

  // Query to fetch affiliate products for this outfit
  const { data: products = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ['outfit', id, 'products'],
    queryFn: async () => {
      if (!outfit) return [];
      return fetchAffiliateProductsByOutfitId(outfit._id);
    },
    enabled: !!outfit
  });

  const isLoading = isLoadingOutfit || isLoadingProducts;

  const handleBuyNowClick = () => {
    if (outfit?.affiliateLink) {
      window.open(outfit.affiliateLink, '_blank');
      toast({
        title: "Opening retailer website",
        description: "You're being redirected to the retailer's website",
      });
    } else {
      toast({
        title: "No purchase link available",
        description: "This outfit doesn't have a direct purchase link",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <PageLayout>
        <div className="container-custom py-16 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading outfit details...</p>
        </div>
      </PageLayout>
    );
  }

  if (outfitError || !outfit) {
    return (
      <PageLayout>
        <div className="container-custom py-16 text-center">
          <h2 className="font-serif text-2xl mb-4">Outfit not found</h2>
          <p className="text-muted-foreground">The outfit you're looking for doesn't exist or has been removed.</p>
          <Link to="/outfits" className="mt-6 inline-block text-primary hover:underline">
            View all outfits
          </Link>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="container-custom py-8 md:py-16">
        <div className="mb-6">
          <Link
            to={`/celebrity/${outfit.celebrity?._id}`}
            className="text-sm font-medium text-primary-foreground hover:underline inline-flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-1"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            Back to {outfit.celebrity?.name}'s Profile
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {/* Left column - Media Gallery */}
          <div>
            {displayMedia.length > 0 ? (
              <MediaGallery
                media={displayMedia}
                title={outfit.title}
                celebrity={outfit.celebrity?.name}
              />
            ) : (
              <div className="aspect-[4/5] bg-gray-100 rounded-2xl flex items-center justify-center">
                <p className="text-muted-foreground">No media available</p>
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-2">
              {outfit.occasion && (
                <span className="bg-pastel-blue px-3 py-1 rounded-full text-xs font-medium">
                  {outfit.occasion}
                </span>
              )}
              {outfit.tags && outfit.tags.map((tag: string, index: number) => (
                <span
                  key={index}
                  className="bg-secondary px-3 py-1 rounded-full text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right column - Details */}
          <div>
            <div className="mb-6">
              <Link to={`/celebrity/${outfit.celebrity?._id}`}>
                <h3 className="font-medium text-sm text-primary-foreground hover:underline">
                  {outfit.celebrity?.name}
                </h3>
              </Link>
              <h1 className="font-serif text-3xl font-medium mt-1 mb-4">
                {outfit.title}
              </h1>
              <p className="text-muted-foreground">
                {outfit.fullDescription || outfit.description}
              </p>
              {outfit.price && (
                <div className="text-lg font-bold text-primary mt-4 mb-2">
                  ₹{outfit.price.toLocaleString("en-IN")}
                </div>
              )}
              {outfit.brand && (
                <div className="text-sm text-muted-foreground mb-2">
                  Brand: <span className="font-medium">{outfit.brand}</span>
                </div>
              )}
              {outfit.affiliateLink && (
                <Button
                  onClick={handleBuyNowClick}
                  className="mt-6 w-full md:w-auto px-7 py-3 text-base font-semibold rounded-xl bg-[#e63946]/90 text-white border border-[#e63946] hover:bg-[#e63946] hover:shadow-lg transition-all duration-300 ease-in-out flex items-center justify-center gap-2"
                  size="lg"
                  style={{
                    letterSpacing: "0.025em",
                    boxShadow: "0 6px 14px rgba(230, 57, 70, 0.15)",
                  }}
                >
                  <ShoppingCart className="h-5 w-5 text-white opacity-90" />
                  Buy Now
                  <ExternalLink className="h-5 w-5 text-white opacity-90" />
                </Button>
              )}
            </div>

            {products.length > 0 && (
              <div className="mb-8">
                <h2 className="font-serif text-xl font-medium mb-4">
                  Shop Similar Items
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {products.map((product) => (
                    <AffiliateProductCard
                      key={product.id}
                      image={product.image}
                      title={product.title}
                      price={product.price}
                      retailer={product.retailer}
                      affiliateLink={product.affiliateLink}
                    />
                  ))}
                </div>
              </div>
            )}

            <div>
              <h2 className="font-serif text-xl font-medium mb-3">
                Outfit Details
              </h2>
              <div className="space-y-3">
                {outfit.createdAt && (
                  <div className="flex justify-between border-b border-border pb-2">
                    <span className="text-muted-foreground">Date</span>
                    <span className="font-medium">{new Date(outfit.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}</span>
                  </div>
                )}
                {outfit.occasion && (
                  <div className="flex justify-between border-b border-border pb-2">
                    <span className="text-muted-foreground">Occasion</span>
                    <span className="font-medium">{outfit.occasion}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Share</span>
                  <div className="flex space-x-4">
                    {/* ...share buttons... */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default OutfitDetail;