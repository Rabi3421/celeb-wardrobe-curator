
import React from "react";
import { Link } from "react-router-dom";
import { useAnalytics } from "@/hooks/useAnalytics";
import { Heart, ShoppingBag, Eye, Star } from "lucide-react";

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
console.log("slug:",slug)
  // Use slug if available, fallback to id
  const outfitUrl = slug ? `/outfit/${slug}` : `/outfit/${id}`;

  return (
    <div className="group relative bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-border/40 hover:border-primary/20 transform hover:-translate-y-1">
      {/* Image Container */}
      <Link 
        to={outfitUrl} 
        onClick={handleOutfitClick}
        className="block relative overflow-hidden"
      >
        <div className="aspect-[3/4] overflow-hidden bg-gradient-to-br from-muted/20 to-muted/5">
          <img
            src={image}
            alt={`${celebrity} - ${title}`}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Action Buttons */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
            <button className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-200 shadow-lg">
              <Heart className="w-4 h-4 text-gray-700 hover:text-red-500 transition-colors" />
            </button>
            <button className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-200 shadow-lg">
              <Eye className="w-4 h-4 text-gray-700 hover:text-blue-500 transition-colors" />
            </button>
          </div>

          {/* Occasion Badge */}
          {occasion && (
            <div className="absolute top-4 left-4">
              <span className="bg-gradient-to-r from-primary/90 to-accent/90 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg">
                {occasion}
              </span>
            </div>
          )}

          {/* Quick Shop Button - Appears on Hover */}
          <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <button className="w-full bg-white/95 backdrop-blur-md text-gray-900 py-2.5 px-4 rounded-xl font-semibold text-sm hover:bg-white transition-all duration-200 shadow-lg flex items-center justify-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              Quick Shop
            </button>
          </div>
        </div>
      </Link>

      {/* Content Section */}
      <div className="p-5 bg-gradient-to-b from-card to-card/95">
        {/* Celebrity Brand Tag */}
        <Link
          to={`/celebrity/${celebrityId}`}
          className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-wider mb-3 group/celebrity"
          onClick={(e) => e.stopPropagation()}
        >
          <Star className="w-3 h-3 opacity-60 group-hover/celebrity:opacity-100 transition-opacity" />
          {celebrity}
        </Link>

        {/* Product Title */}
        <Link 
          to={outfitUrl} 
          onClick={handleOutfitClick}
          className="block mb-3 group/title"
        >
          <h3 className="font-semibold text-foreground text-base mb-2 line-clamp-2 group-hover/title:text-primary transition-colors duration-200 leading-tight">
            {title}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-sm text-muted-foreground/80 line-clamp-2 leading-relaxed mb-4">
          {description}
        </p>

        {/* Date */}
        {date && (
          <div className="text-xs text-muted-foreground/70 mb-4 font-medium flex items-center gap-1">
            <div className="w-1 h-1 bg-primary rounded-full"></div>
            {new Date(date).toLocaleDateString('en-US', { 
              month: 'long', 
              year: 'numeric' 
            })}
          </div>
        )}

        {/* CTA Button */}
        <Link 
          to={outfitUrl} 
          onClick={handleOutfitClick}
          className="block w-full text-center bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg"
        >
          Shop This Look
        </Link>
      </div>

      {/* Premium Border Glow Effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none -z-10 blur-xl transform scale-105" />
    </div>
  );
};

export default OutfitCard;
