
import React from "react";
import { Link } from "react-router-dom";
import { useAnalytics } from "@/hooks/useAnalytics";
import { Heart, Eye } from "lucide-react";

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
    <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-border/50">
      {/* Product Image */}
      <Link 
        to={`/outfit/${slug || id}`} 
        onClick={handleOutfitClick}
        className="block relative"
      >
        <div className="aspect-[3/4] overflow-hidden bg-muted/20">
          <img
            src={image}
            alt={`${celebrity} - ${title}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Overlay with quick actions */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300">
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex flex-col gap-2">
                <button className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                  <Heart className="w-4 h-4 text-muted-foreground" />
                </button>
                <button className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                  <Eye className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>
          </div>
          {/* Occasion badge */}
          {occasion && (
            <div className="absolute top-3 left-3">
              <span className="bg-white/90 text-xs font-medium px-2 py-1 rounded-full text-foreground">
                {occasion}
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4">
        {/* Celebrity Name */}
        <Link
          to={`/celebrity/${celebrityId}`}
          className="inline-block text-xs font-medium text-primary hover:text-primary/80 transition-colors uppercase tracking-wide mb-2"
          onClick={(e) => e.stopPropagation()}
        >
          {celebrity}
        </Link>

        {/* Product Title */}
        <Link 
          to={`/outfit/${slug || id}`} 
          onClick={handleOutfitClick}
        >
          <h3 className="font-medium text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {description}
        </p>

        {/* Date */}
        {date && (
          <div className="text-xs text-muted-foreground">
            {new Date(date).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              year: 'numeric' 
            })}
          </div>
        )}

        {/* View Details Button */}
        <Link 
          to={`/outfit/${slug || id}`} 
          onClick={handleOutfitClick}
          className="mt-3 block w-full text-center py-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default OutfitCard;
