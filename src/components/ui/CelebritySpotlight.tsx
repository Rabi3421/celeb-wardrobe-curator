
import React from "react";
import { Link } from "react-router-dom";
import AffiliateProductCard from "./AffiliateProductCard";

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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      <div>
        <div className="relative rounded-2xl overflow-hidden aspect-[3/4]">
          <img
            src={image}
            alt={`${name} wearing ${outfit}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
            <Link to={`/celebrity/${id}`} className="block">
              <h3 className="text-white font-serif font-medium text-2xl">{name}</h3>
            </Link>
            <p className="text-white/90 text-sm">{event}</p>
          </div>
        </div>
      </div>
      <div>
        <h3 className="font-serif text-2xl font-medium mb-3">{outfit}</h3>
        <p className="text-muted-foreground mb-6">{description}</p>
        
        <div className="grid grid-cols-2 gap-4">
          {products.map((product, index) => (
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
        
        <div className="mt-6">
          <Link to={`/celebrity/${id}`} className="btn-primary inline-block">
            View All Looks
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CelebritySpotlight;
