
import React from "react";
import { Link } from "react-router-dom";

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
  description,
}) => {
  return (
    <div className="outfit-card animate-fade-in">
      <Link to={`/outfit/${id}`}>
        <div className="relative aspect-[3/4] overflow-hidden">
          <img
            src={image}
            alt={`${celebrity} wearing ${title}`}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            loading="lazy"
          />
        </div>
      </Link>
      <div className="p-4">
        <Link to={`/celebrity/${celebrityId}`} className="block">
          <h3 className="font-medium text-sm text-primary-foreground hover:underline">
            {celebrity}
          </h3>
        </Link>
        <Link to={`/outfit/${id}`}>
          <h2 className="font-serif font-medium text-lg mt-1 line-clamp-1">
            {title}
          </h2>
          <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
            {description}
          </p>
        </Link>
      </div>
    </div>
  );
};

export default OutfitCard;
