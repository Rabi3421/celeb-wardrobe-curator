
import React from "react";
import { Link } from "react-router-dom";
import { Calendar, User } from "lucide-react";

interface BlogPostCardProps {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  category: string;
  slug?: string;
  author?: string;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({
  id,
  title,
  excerpt,
  image,
  date,
  category,
  slug,
  author = "Celebrity Persona"
}) => {
  // Use slug if available, otherwise fallback to ID for SEO-friendly URLs
  const postLink = slug ? `/blog/${slug}` : `/blog/${id}`;
  
  // Format the date for better readability and SEO
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <article className="outfit-card h-full flex flex-col rounded-lg shadow-sm overflow-hidden bg-white animate-fade-in" itemScope itemType="https://schema.org/BlogPosting">
      <Link to={postLink} className="block">
        <div className="relative aspect-video overflow-hidden">
          <img
            src={image || "/placeholder.svg"}
            alt={`${title} - Celebrity fashion article featuring ${category}`}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            loading="lazy"
            itemProp="image"
          />
        </div>
      </Link>
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <time dateTime={new Date(date).toISOString()} className="ml-1" itemProp="datePublished">
              {formattedDate}
            </time>
          </div>
          <span className="bg-pastel-blue px-2 py-0.5 rounded-full" itemProp="articleSection">
            {category}
          </span>
        </div>
        <Link to={postLink} aria-label={`Read full article about ${title}`}>
          <h2 className="font-serif font-medium text-xl line-clamp-2 hover:text-primary transition-colors" itemProp="headline">
            {title}
          </h2>
          <p className="text-muted-foreground text-sm mt-2 line-clamp-3 flex-grow" itemProp="description">
            {excerpt}
          </p>
        </Link>
        <div className="flex justify-between items-center mt-3">
          <div className="flex items-center text-xs text-muted-foreground">
            <User className="h-3 w-3 mr-1" />
            <span itemProp="author" itemScope itemType="https://schema.org/Person">
              <span itemProp="name">{author}</span>
            </span>
          </div>
          <Link 
            to={postLink} 
            className="text-sm font-medium text-primary-foreground hover:underline"
            aria-label={`Read more about ${title}`}
          >
            Read more →
          </Link>
        </div>
        
        {/* Hidden SEO metadata */}
        <meta itemProp="mainEntityOfPage" content={`${window.location.origin}${postLink}`} />
        <meta itemProp="url" content={`${window.location.origin}${postLink}`} />
      </div>
    </article>
  );
};

export default BlogPostCard;
