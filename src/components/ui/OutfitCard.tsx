
import React from "react";
import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";

interface OutfitCardProps {
  id: string;
  image: string;
  celebrity: string;
  celebrityId: string;
  title: string;
  description: string;
  date?: string;
  occasion?: string;
}

const OutfitCard: React.FC<OutfitCardProps> = ({
  id,
  image,
  celebrity,
  celebrityId,
  title,
  description,
  date,
  occasion
}) => {
  return (
    <div className="outfit-card rounded-lg shadow-sm overflow-hidden bg-white animate-fade-in">
      <Link to={`/outfit/${id}`}>
        <div className="relative aspect-[3/4] overflow-hidden">
          <img
            src={image}
            alt={`${celebrity} wearing ${title} - Celebrity fashion inspiration`}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            loading="lazy"
          />
          {occasion && (
            <span className="absolute top-2 right-2 bg-primary/80 text-white text-xs px-2 py-0.5 rounded-full">
              {occasion}
            </span>
          )}
        </div>
      </Link>
      <div className="p-4">
        <Link to={`/celebrity/${celebrityId}`} className="block">
          <h3 className="font-medium text-sm text-primary-foreground hover:underline">
            {celebrity}
          </h3>
        </Link>
        <Link to={`/outfit/${id}`}>
          <h2 className="font-serif font-medium text-lg mt-1 line-clamp-1 hover:text-primary transition-colors">
            {title}
          </h2>
          <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
            {description}
          </p>
        </Link>
        {date && (
          <div className="flex items-center text-xs text-muted-foreground mt-2">
            <Calendar className="h-3 w-3 mr-1" />
            <time dateTime={new Date(date).toISOString()}>
              {new Date(date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              })}
            </time>
          </div>
        )}
      </div>
    </div>
  );
};

export default OutfitCard;
