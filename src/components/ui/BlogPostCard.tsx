
import React from "react";
import { Link } from "react-router-dom";

interface BlogPostCardProps {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  category: string;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({
  id,
  title,
  excerpt,
  image,
  date,
  category,
}) => {
  return (
    <div className="outfit-card h-full flex flex-col animate-fade-in">
      <Link to={`/blog/${id}`}>
        <div className="relative aspect-video overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            loading="lazy"
          />
        </div>
      </Link>
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
          <span>{date}</span>
          <span className="bg-pastel-blue px-2 py-0.5 rounded-full">
            {category}
          </span>
        </div>
        <Link to={`/blog/${id}`}>
          <h2 className="font-serif font-medium text-xl line-clamp-2">
            {title}
          </h2>
          <p className="text-muted-foreground text-sm mt-2 line-clamp-3 flex-grow">
            {excerpt}
          </p>
          <div className="mt-3">
            <span className="text-sm font-medium text-primary-foreground hover:underline">
              Read more →
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default BlogPostCard;
