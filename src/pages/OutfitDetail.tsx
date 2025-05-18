
import React from "react";
import { useParams, Link } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import AffiliateProductCard from "@/components/ui/AffiliateProductCard";
import { fetchOutfitBySlug, fetchOutfitById, fetchAffiliateProductsByOutfitId } from "@/services/api";
import { Outfit, AffiliateProduct } from "@/types/data";
import { Loader2, ShoppingCart, ExternalLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

const OutfitDetail: React.FC = () => {
  const { id, slug } = useParams<{ id?: string; slug?: string }>();
  const identifier = slug || id;
  
  // Query to fetch outfit data
  const { data: outfit, isLoading: isLoadingOutfit, error: outfitError } = useQuery({
    queryKey: ['outfit', identifier],
    queryFn: async () => {
      if (!identifier) throw new Error("Outfit ID or slug not found");
      
      // Try fetching by slug first if that's what we have, otherwise by ID
      const outfitData = slug 
        ? await fetchOutfitBySlug(slug)
        : await fetchOutfitById(id!);
      
      if (!outfitData) throw new Error("Outfit not found");
      return outfitData;
    }
  });

  // Query to fetch affiliate products for this outfit
  const { data: products = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ['outfit', identifier, 'products'],
    queryFn: async () => {
      if (!outfit) return [];
      return fetchAffiliateProductsByOutfitId(outfit.id);
    },
    enabled: !!outfit
  });

  const isLoading = isLoadingOutfit || isLoadingProducts;

  const handleBuyNowClick = () => {
    // If there's an affiliate link, open it in a new tab
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
            to={`/celebrity/s/${outfit.celebrityId}`}
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
            Back to {outfit.celebrity}'s Profile
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Left column - Image */}
          <div>
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <img
                src={outfit.image}
                alt={`${outfit.celebrity} wearing ${outfit.title} - Celebrity fashion inspiration`}
                className="w-full h-auto object-cover"
              />
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {outfit.occasion && (
                <span className="bg-pastel-blue px-3 py-1 rounded-full text-xs font-medium">
                  {outfit.occasion}
                </span>
              )}
              {outfit.tags && outfit.tags.map((tag, index) => (
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
              <Link to={`/celebrity/s/${outfit.celebrityId}`}>
                <h3 className="font-medium text-sm text-primary-foreground hover:underline">
                  {outfit.celebrity}
                </h3>
              </Link>
              <h1 className="font-serif text-3xl font-medium mt-1 mb-4">
                {outfit.title}
              </h1>
              <p className="text-muted-foreground">
                {outfit.fullDescription || outfit.description}
              </p>
              
              {outfit.affiliateLink && (
                <Button 
                  onClick={handleBuyNowClick} 
                  className="mt-6 w-full md:w-auto"
                  size="lg"
                >
                  <ShoppingCart className="mr-2" />
                  Buy Now
                  <ExternalLink className="ml-2 h-4 w-4" />
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
                {outfit.date && (
                  <div className="flex justify-between border-b border-border pb-2">
                    <span className="text-muted-foreground">Date</span>
                    <span className="font-medium">{new Date(outfit.date).toLocaleDateString('en-US', { 
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
                    <button aria-label="Share on Facebook">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                      </svg>
                    </button>
                    <button aria-label="Share on Twitter">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                      </svg>
                    </button>
                    <button aria-label="Share on Pinterest">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="12" x2="12" y1="5" y2="19" />
                        <line x1="5" x2="19" y1="12" y2="12" />
                      </svg>
                    </button>
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
