
import React from "react";
import { Link } from "react-router-dom";
import { useAnalytics } from "@/hooks/useAnalytics";

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
  author
}) => {
  const { trackEvent } = useAnalytics();

  const handleBlogClick = () => {
    trackEvent({
      eventType: 'blog_view',
      metadata: {
        blogPostId: id,
        title,
        category,
        date
      }
    });
  };

  return (
    <Link 
      to={`/blog/${slug || id}`} 
      className="group block"
      onClick={handleBlogClick}
    >
      <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="aspect-[16/10] overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-medium text-primary-foreground bg-secondary px-2 py-1 rounded-full">
              {category}
            </span>
            <span className="text-xs text-muted-foreground">
              {new Date(date).toLocaleDateString()}
            </span>
          </div>
          <h2 className="font-serif text-xl font-medium mb-3 line-clamp-2 group-hover:text-primary-foreground transition-colors">
            {title}
          </h2>
          <p className="text-muted-foreground line-clamp-3">
            {excerpt}
          </p>
        </div>
      </article>
    </Link>
  );
};

export default BlogPostCard;
