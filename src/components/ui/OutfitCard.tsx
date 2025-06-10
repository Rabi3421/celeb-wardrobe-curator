
import React from "react";
import { Link } from "react-router-dom";
import { useAnalytics } from "@/hooks/useAnalytics";
import { Heart, ShoppingBag } from "lucide-react";

interface OutfitCardProps {
  id: string;
  image: string;
  celebrity: string;
  celebrityId: string;
  title: string;
  description: string;
  date?: string;
  occasion?: string;
  slug?: string;
}

const OutfitCard: React.FC<OutfitCardProps> = ({
  id,
  image,
  celebrity,
  celebrityId,
  title,
  description,
  date,
  occasion,
  slug
}) => {
  const { trackEvent } = useAnalytics();

  const handleOutfitClick = () => {
    trackEvent({
      eventType: 'outfit_view',
      metadata: {
        outfitId: id,
        title,
        celebrity,
        celebrityId
      }
    });
  };

  return (
    <div className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-border/20 hover:border-primary/30">
      {/* Product Image */}
      <Link 
        to={`/outfit/${slug || id}`} 
        onClick={handleOutfitClick}
        className="block relative overflow-hidden"
      >
        <div className="aspect-[4/5] overflow-hidden bg-muted/10">
          <img
            src={image}
            alt={`${celebrity} - ${title}`}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300">
            {/* Quick action buttons */}
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
              <div className="flex flex-col gap-2">
                <button className="w-9 h-9 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white shadow-lg transition-all hover:scale-110">
                  <Heart className="w-4 h-4 text-muted-foreground" />
                </button>
                <button className="w-9 h-9 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white shadow-lg transition-all hover:scale-110">
                  <ShoppingBag className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>
          </div>
          {/* Occasion badge */}
          {occasion && (
            <div className="absolute top-3 left-3">
              <span className="bg-primary/90 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full">
                {occasion}
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4">
        {/* Celebrity Brand */}
        <Link
          to={`/celebrity/${celebrityId}`}
          className="inline-block text-xs font-semibold text-primary hover:text-primary/80 transition-colors uppercase tracking-wider mb-2"
          onClick={(e) => e.stopPropagation()}
        >
          {celebrity}
        </Link>

        {/* Product Title */}
        <Link 
          to={`/outfit/${slug || id}`} 
          onClick={handleOutfitClick}
          className="block"
        >
          <h3 className="font-medium text-foreground text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors leading-relaxed">
            {title}
          </h3>
        </Link>

        {/* Price-like styling for description */}
        <div className="mb-3">
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Date as release date */}
        {date && (
          <div className="text-xs text-muted-foreground mb-3 font-medium">
            Released {new Date(date).toLocaleDateString('en-US', { 
              month: 'short', 
              year: 'numeric' 
            })}
          </div>
        )}

        {/* CTA Button */}
        <Link 
          to={`/outfit/${slug || id}`} 
          onClick={handleOutfitClick}
          className="block w-full text-center bg-primary text-white py-2.5 px-4 rounded-lg text-sm font-medium hover:bg-primary/90 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Shop This Look
        </Link>
      </div>
    </div>
  );
};

export default OutfitCard;
