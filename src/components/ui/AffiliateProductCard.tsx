
import React from "react";
import { useAnalytics } from "@/hooks/useAnalytics";

interface AffiliateProductCardProps {
  image: string;
  title: string;
  price: string;
  retailer: string;
  affiliateLink: string;
  productId?: string;
}

const AffiliateProductCard: React.FC<AffiliateProductCardProps> = ({
  image,
  title,
  price,
  retailer,
  affiliateLink,
  productId
}) => {
  const { trackEvent } = useAnalytics();

  const handleAffiliateClick = () => {
    if (productId) {
      trackEvent({
        eventType: 'affiliate_click',
        metadata: {
          productId,
          title,
          retailer,
          price,
          affiliateLink
        }
      });
    }
    
    trackEvent({
      eventType: 'buy_now_click',
      metadata: {
        title,
        retailer,
        price
      }
    });
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 group">
      <div className="aspect-square overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <h3 className="font-medium text-sm mb-2 line-clamp-2">{title}</h3>
        <p className="text-xs text-muted-foreground mb-2">{retailer}</p>
        <div className="flex items-center justify-between">
          <span className="font-medium text-primary-foreground">{price}</span>
          <a
            href={affiliateLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleAffiliateClick}
            className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium hover:bg-primary/90 transition-colors"
          >
            Buy Now
          </a>
        </div>
      </div>
    </div>
  );
};

export default AffiliateProductCard;
