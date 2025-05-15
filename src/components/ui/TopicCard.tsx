
import React from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface TopicCardProps {
  name: string;
  count: number;
  slug: string;
  image?: string;
  description?: string;
}

const TopicCard: React.FC<TopicCardProps> = ({
  name,
  count,
  slug,
  image,
  description
}) => {
  return (
    <Link 
      to={`/blog/topic/${slug}`} 
      aria-label={`View all ${name} articles`}
      className="block h-full transition-transform hover:scale-102 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
    >
      <Card 
        className="group hover:shadow-lg transition-all overflow-hidden cursor-pointer h-full border-primary/10"
      >
        <div 
          className={cn(
            "aspect-square w-full flex flex-col items-center justify-center group-hover:bg-primary/10 transition-all duration-300 relative",
            image ? "bg-cover bg-center text-white" : "bg-secondary/50"
          )}
          style={image ? { backgroundImage: `url(${image})` } : {}}
        >
          {image && (
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors"></div>
          )}
          <div className="relative z-10 text-center px-2">
            <h3 className="font-serif text-lg font-medium">
              {name}
            </h3>
            <span className="text-xs mt-1 inline-block opacity-80">
              {count} {count === 1 ? 'post' : 'posts'}
            </span>
            {description && (
              <p className="text-xs mt-2 opacity-80 line-clamp-2">{description}</p>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default TopicCard;
