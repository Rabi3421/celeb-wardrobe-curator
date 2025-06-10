
import React from "react";
import { Link } from "react-router-dom";
import { useAnalytics } from "@/hooks/useAnalytics";

interface OutfitCardProps {
  id: string;
  image: string;
  celebrity: string;
  celebrityId: string;
  title: string;
  description: string;
}

const OutfitCard: React.FC<OutfitCardProps> = ({
  id,
  image,
  celebrity,
  celebrityId,
  title,
  description
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
    <Link 
      to={`/outfit/${id}`} 
      className="group block"
      onClick={handleOutfitClick}
    >
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="aspect-[3/4] overflow-hidden">
          <img
            src={image}
            alt={`${celebrity} - ${title}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-4">
          <Link
            to={`/celebrity/${celebrityId}`}
            className="text-sm text-muted-foreground hover:text-primary-foreground transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            {celebrity}
          </Link>
          <h3 className="font-serif text-lg font-medium mt-1 mb-2 line-clamp-2">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default OutfitCard;
