
import React from "react";
import { Link } from "react-router-dom";
import AffiliateProductCard from "./AffiliateProductCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

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
  return (
    <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-r from-pastel-pink to-pastel-peach">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="relative h-64 md:h-auto md:aspect-[3/4]">
          <img
            src={image}
            alt={`${name} wearing ${outfit}`}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
            <Link to={`/celebrity/${id}`} className="block">
              <h3 className="text-white font-serif font-medium text-2xl">{name}</h3>
            </Link>
            <p className="text-white/90 text-sm">{event}</p>
          </div>
        </div>
        
        <div className="p-6 md:p-8">
          <div className="mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <Star className="text-yellow-400" size={20} />
              <span className="font-medium text-sm">Celebrity of the Month</span>
            </div>
            <h3 className="font-serif text-2xl font-medium mb-3">{outfit}</h3>
            <p className="text-muted-foreground line-clamp-3 mb-4">{description}</p>
          </div>
          
          {products.length > 0 && (
            <div className="mb-6">
              <h4 className="font-medium mb-3 text-sm">Featured Products</h4>
              <div className="grid grid-cols-2 gap-3">
                {products.slice(0, 2).map((product, index) => (
                  <AffiliateProductCard
                    key={index}
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
          
          <Button 
            className="bg-white text-primary-foreground hover:bg-white/90"
            asChild
          >
            <Link to={`/celebrity/${id}`}>View Full Profile</Link>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default CelebritySpotlight;
