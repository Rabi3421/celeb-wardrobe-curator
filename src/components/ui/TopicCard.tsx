
import React from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface TopicCardProps {
  name: string;
  count: number;
  slug: string;
  image?: string;
}

const TopicCard: React.FC<TopicCardProps> = ({
  name,
  count,
  slug,
  image
}) => {
  return (
    <Link to={`/blog/topic/${slug}`}>
      <Card 
        className="group hover:shadow-lg transition-all overflow-hidden cursor-pointer h-full"
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
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default TopicCard;
