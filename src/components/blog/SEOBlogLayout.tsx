
import React from "react";
import { Link } from "react-router-dom";
import { Clock, User, Tag, Share2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AffiliateProductCard from "@/components/ui/AffiliateProductCard";

interface SEOBlogLayoutProps {
  title: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  content: string;
  tags: string[];
  relatedProducts: Array<{
    image: string;
    title: string;
    price: string;
    retailer: string;
    affiliateLink: string;
  }>;
  relatedPosts: Array<{
    id: string;
    title: string;
    image: string;
    slug: string;
  }>;
}

const SEOBlogLayout: React.FC<SEOBlogLayoutProps> = ({
  title,
  category,
  author,
  date,
  readTime,
  image,
  content,
  tags,
  relatedProducts,
  relatedPosts
}) => {
  return (
    <article className="max-w-4xl mx-auto">
      {/* Breadcrumb Navigation */}
      <nav className="mb-6 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-primary">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/blog" className="hover:text-primary">Blog</Link>
        <span className="mx-2">/</span>
        <Link to={`/category/${category.toLowerCase()}`} className="hover:text-primary">{category}</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{title}</span>
      </nav>

      {/* Article Header */}
      <header className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            {category}
          </Badge>
          <span className="text-sm text-muted-foreground">•</span>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{readTime}</span>
          </div>
        </div>
        
        <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
          {title}
        </h1>
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>By {author}</span>
            </div>
            <span>•</span>
            <time dateTime={date}>
              {new Date(date).toLocaleDateString('en-IN', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </time>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Heart className="h-4 w-4 mr-1" />
              Save
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      <div className="mb-8">
        <img
          src={image}
          alt={title}
          className="w-full h-64 md:h-96 object-cover rounded-xl"
        />
      </div>

      {/* Newsletter Signup - Above Content */}
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-6 mb-8 text-center">
        <h3 className="text-xl font-semibold mb-2">
          Get Weekly Celebrity Looks in Your Inbox
        </h3>
        <p className="text-muted-foreground mb-4">
          Curated for Indian Fashion Lovers - Never miss a trending look!
        </p>
        <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-grow px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Button className="whitespace-nowrap">
            Subscribe Free
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Join 50,000+ fashion enthusiasts across India
        </p>
      </div>

      {/* Article Content */}
      <div className="prose prose-lg max-w-none mb-8" dangerouslySetInnerHTML={{ __html: content }} />

      {/* Shop the Look Section */}
      {relatedProducts.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Shop the Look</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((product, index) => (
              <AffiliateProductCard
                key={index}
                image={product.image}
                title={product.title}
                price={product.price}
                retailer={product.retailer}
                affiliateLink={product.affiliateLink}
              />
            ))}
          </div>
        </section>
      )}

      {/* Tags */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <Link
              key={index}
              to={`/tag/${tag.toLowerCase().replace(/\s+/g, '-')}`}
              className="inline-flex items-center gap-1 px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm hover:bg-secondary/80 transition-colors"
            >
              <Tag className="h-3 w-3" />
              {tag}
            </Link>
          ))}
        </div>
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                className="group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Bottom Newsletter CTA */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl p-8 text-center">
        <h3 className="text-2xl font-bold mb-2">
          Love Celebrity Fashion?
        </h3>
        <p className="mb-6 opacity-90">
          Get the latest Bollywood fashion trends, styling tips, and affordable alternatives delivered to your inbox every week.
        </p>
        <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Your email address"
            className="flex-grow px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
          />
          <Button variant="secondary" size="lg" className="whitespace-nowrap">
            Join Now
          </Button>
        </div>
        <p className="text-sm opacity-75 mt-3">
          No spam, unsubscribe anytime. Trusted by fashion lovers across India.
        </p>
      </div>
    </article>
  );
};

export default SEOBlogLayout;
