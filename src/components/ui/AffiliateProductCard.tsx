
import React from "react";

interface AffiliateProductCardProps {
  image: string;
  title: string;
  price: string;
  retailer: string;
  affiliateLink: string;
}

const AffiliateProductCard: React.FC<AffiliateProductCardProps> = ({
  image,
  title,
  price,
  retailer,
  affiliateLink,
}) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // In a real implementation, we would track clicks here
    console.log("Affiliate link clicked:", title);
  };

  return (
    <div className="affiliate-card">
      <div className="aspect-square overflow-hidden rounded-lg mb-3">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-contain"
          loading="lazy"
        />
      </div>
      <h3 className="text-sm font-medium line-clamp-2 h-10">{title}</h3>
      <div className="flex justify-between items-center mt-2">
        <span className="font-medium text-base">{price}</span>
        <span className="text-xs text-muted-foreground">{retailer}</span>
      </div>
      <a
        href={affiliateLink}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary text-center block w-full mt-3 py-1.5 text-sm"
        onClick={handleClick}
      >
        Shop Now
      </a>
    </div>
  );
};

export default AffiliateProductCard;
