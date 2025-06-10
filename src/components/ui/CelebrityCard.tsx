
import React from "react";
import { Link } from "react-router-dom";

interface CelebrityCardProps {
  id: string;
  name: string;
  image: string;
  outfitCount: number;
  slug?: string;
}

const CelebrityCard: React.FC<CelebrityCardProps> = ({
  id,
  name,
  image,
  outfitCount,
  slug
}) => {
  // Use slug if available, fallback to ID
  const celebrityUrl = slug ? `/celebrity/${slug}` : `/celebrity/${id}`;

  return (
    <Link to={celebrityUrl}>
      <div className="celebrity-profile animate-fade-in">
        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-background shadow-md">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <h3 className="font-serif font-medium text-lg mt-3">{name}</h3>
        <p className="text-sm text-muted-foreground">{outfitCount} outfits</p>
      </div>
    </Link>
  );
};

export default CelebrityCard;
