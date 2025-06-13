
import React from "react";
import { Link } from "react-router-dom";
import { useAnalytics } from "@/hooks/useAnalytics";
import { Heart, ShoppingBag, Star } from "lucide-react";

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

  // Use slug if available, fallback to id
  const outfitUrl = slug ? `/outfit/${slug}` : `/outfit/${id}`;

  return (
    <div className="group bg-white rounded-lg border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      {/* Product Image */}
      <Link 
        to={outfitUrl} 
        onClick={handleOutfitClick}
        className="block relative aspect-[3/4] overflow-hidden bg-gray-50"
      >
        <img
          src={image}
          alt={`${celebrity} - ${title}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Wishlist Button */}
        <button className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-50">
          <Heart className="w-4 h-4 text-gray-600 hover:text-red-500 transition-colors" />
        </button>

        {/* Occasion Badge */}
        {occasion && (
          <div className="absolute top-3 left-3">
            <span className="bg-black text-white text-xs font-medium px-2 py-1 rounded">
              {occasion.toUpperCase()}
            </span>
          </div>
        )}

        {/* Quick Add Overlay */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button className="w-full bg-white text-black py-2 px-4 rounded font-medium text-sm hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
            <ShoppingBag className="w-4 h-4" />
            Quick Shop
          </button>
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4">
        {/* Celebrity Brand */}
        <Link
          to={`/celebrity/${celebrityId}`}
          className="text-xs font-semibold text-gray-500 uppercase tracking-wide hover:text-gray-700 transition-colors mb-1 block"
          onClick={(e) => e.stopPropagation()}
        >
          {celebrity}
        </Link>

        {/* Product Title */}
        <Link 
          to={outfitUrl} 
          onClick={handleOutfitClick}
          className="block mb-2"
        >
          <h3 className="font-medium text-gray-900 text-sm leading-tight line-clamp-2 hover:text-gray-700 transition-colors">
            {title}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-3 h-3 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
              />
            ))}
          </div>
          <span className="text-xs text-gray-500 ml-1">(4.0)</span>
        </div>

        {/* Price Section */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-gray-900">From $25</span>
            <span className="text-sm text-gray-500 line-through">$89</span>
          </div>
          <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
            72% OFF
          </span>
        </div>

        {/* Description */}
        <p className="text-xs text-gray-600 line-clamp-2 mb-3 leading-relaxed">
          {description}
        </p>

        {/* Add to Cart Button */}
        <Link 
          to={outfitUrl} 
          onClick={handleOutfitClick}
          className="block w-full bg-black text-white text-center py-2.5 px-4 rounded font-medium text-sm hover:bg-gray-800 transition-colors"
        >
          Shop This Look
        </Link>

        {/* Additional Info */}
        {date && (
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
            <span className="text-xs text-gray-500">
              {new Date(date).toLocaleDateString('en-US', { 
                month: 'short', 
                year: 'numeric' 
              })}
            </span>
            <span className="text-xs text-green-600 font-medium">Free Shipping</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default OutfitCard;
