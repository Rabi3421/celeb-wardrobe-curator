
import React from "react";
import { Link } from "react-router-dom";
import AffiliateProductCard from "./AffiliateProductCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, TrendingUp, Heart, BadgeCheck } from "lucide-react";

interface SpotlightProduct {
  image: string;
  title: string;
  price: string;
  retailer: string;
  affiliateLink: string;
}

interface CelebritySpotlightProps {
  id: string;
  name: string;
  image: string;
  outfit: string;
  event: string;
  description: string;
  products: SpotlightProduct[];
}

const CelebritySpotlight: React.FC<CelebritySpotlightProps> = ({
  id,
  name,
  image,
  outfit,
  event,
  description,
  products
}) => {
  // Determine if id is a slug or UUID
  const isUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(id);
  const celebrityUrl = isUuid ? `/celebrity/id/${id}` : `/celebrity/${id}`;

  return (
    <div className="max-w-6xl mx-auto">
      <Card className="overflow-hidden border-none shadow-xl rounded-2xl bg-gradient-to-r from-pastel-pink/70 to-pastel-peach/70">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="relative h-80 md:h-auto">
            <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 bg-white/90 px-3 py-1 rounded-full">
              <Star className="text-yellow-500 h-4 w-4" />
              <span className="text-xs font-medium">Celebrity Spotlight</span>
            </div>
            
            <div className="absolute top-4 right-4 z-10 flex items-center bg-white/90 px-3 py-1 rounded-full">
              <TrendingUp className="text-primary-foreground h-4 w-4 mr-1" />
              <span className="text-xs font-medium">Trending</span>
            </div>
            
            <img
              src={image}
              alt={`${name} wearing ${outfit}`}
              className="w-full h-full object-cover md:rounded-l-2xl"
              loading="lazy"
            />
            
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-6 md:rounded-bl-2xl">
              <div className="flex items-center gap-2 mb-2">
                <BadgeCheck className="text-primary h-5 w-5" />
                <span className="text-white text-sm font-medium">Verified Style</span>
              </div>
              <Link to={celebrityUrl} className="block group">
                <h3 className="text-white font-serif font-medium text-2xl md:text-3xl group-hover:text-primary transition-colors">
                  {name}
                </h3>
                <p className="text-white/90 text-sm">
                  {event}
                </p>
              </Link>
            </div>
          </div>
          
          <div className="p-6 md:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-2xl md:text-2xl font-medium">{outfit}</h3>
                <button className="text-primary-foreground hover:text-red-500 transition-colors">
                  <Heart className="h-5 w-5" />
                </button>
              </div>
              
              <p className="text-muted-foreground mb-6 line-clamp-3">{description}</p>
              
              {products.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-sm uppercase tracking-wider">Get The Look</h4>
                    <Link 
                      to={`/celebrity/${id}`} 
                      className="text-xs text-primary-foreground hover:underline"
                    >
                      View all
                    </Link>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {products.slice(0, 2).map((product, index) => (
                      <div 
                        key={index}
                        className="relative group rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md"
                      >
                        <div className="aspect-square overflow-hidden">
                          <img 
                            src={product.image}
                            alt={product.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                          <div className="text-white text-sm font-medium truncate">{product.title}</div>
                          <div className="flex justify-between items-center">
                            <span className="text-white/90 text-xs">{product.price}</span>
                            <a 
                              href={product.affiliateLink}
                              target="_blank"
                              rel="noopener noreferrer" 
                              className="text-xs bg-white/90 hover:bg-white text-black px-2 py-0.5 rounded transition-colors"
                            >
                              Shop
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-auto flex flex-col sm:flex-row gap-3">
              <Button 
                className="bg-primary-foreground hover:bg-primary-foreground/90 text-white rounded-full"
                asChild
                size="lg"
              >
                <Link to={celebrityUrl}>View Full Profile</Link>
              </Button>
              <Button 
                variant="outline"
                className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 rounded-full"
                asChild
                size="lg"
              >
                <Link to={`/outfits?celebrity=${id}`}>All Outfits</Link>
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CelebritySpotlight;
