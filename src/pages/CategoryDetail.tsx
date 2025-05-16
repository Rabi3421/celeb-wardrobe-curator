import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import SEO from "@/components/SEO/SEO";
import { fetchCategoryItems } from "@/services/api";
import { CategoryItem } from "@/types/data";
import CategoryItemCard from "@/components/ui/CategoryItemCard";
import { Button } from "@/components/ui/button";
import { Loader2, Filter, ArrowUpDown, Heart } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { subscribeToNewsletter } from "@/services/api";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const CategoryDetail: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const [items, setItems] = useState<CategoryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<CategoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sortOrder, setSortOrder] = useState<string>("default");
  const [priceRange, setPriceRange] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Format the category name for display
  const formattedCategory = category ? 
    category.charAt(0).toUpperCase() + category.slice(1) : 
    "Category";

  useEffect(() => {
    const loadCategoryItems = async () => {
      if (!category) return;
      
      setIsLoading(true);
      const categoryItems = await fetchCategoryItems(category);
      setItems(categoryItems);
      setFilteredItems(categoryItems);
      setIsLoading(false);
    };

    loadCategoryItems();
  }, [category]);

  useEffect(() => {
    filterAndSortItems();
  }, [sortOrder, priceRange, searchQuery, items]);

  const filterAndSortItems = () => {
    let result = [...items];
    
    // Filter by search query
    if (searchQuery) {
      result = result.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by price range
    if (priceRange !== "all") {
      result = result.filter(item => {
        const price = parseFloat(item.price.replace(/[^0-9.]/g, ''));
        switch (priceRange) {
          case "under100":
            return price < 100;
          case "100to500":
            return price >= 100 && price <= 500;
          case "over500":
            return price > 500;
          default:
            return true;
        }
      });
    }
    
    // Sort items
    switch (sortOrder) {
      case "priceLow":
        result.sort((a, b) => 
          parseFloat(a.price.replace(/[^0-9.]/g, '')) - 
          parseFloat(b.price.replace(/[^0-9.]/g, ''))
        );
        break;
      case "priceHigh":
        result.sort((a, b) => 
          parseFloat(b.price.replace(/[^0-9.]/g, '')) - 
          parseFloat(a.price.replace(/[^0-9.]/g, ''))
        );
        break;
      case "newest":
        // In a real app, you would sort by date
        // For now, we'll keep the default order
        break;
      default:
        // Keep the default order
        break;
    }
    
    setFilteredItems(result);
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    const result = await subscribeToNewsletter(email, `category-${category}`);
    setIsSubmitting(false);

    if (result.success) {
      toast({
        title: "Subscription Successful",
        description: result.message,
      });
      setEmail("");
    } else {
      toast({
        title: "Subscription Failed",
        description: result.message,
        variant: "destructive",
      });
    }
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
    
    toast({
      title: favorites.includes(id) ? "Removed from favorites" : "Added to favorites",
      description: favorites.includes(id) 
        ? "This item has been removed from your favorites."
        : "This item has been added to your favorites!",
    });
  };

  // Related categories based on current category
  const relatedCategories = {
    dresses: ["shoes", "handbags", "makeup"],
    shoes: ["dresses", "handbags", "makeup"],
    makeup: ["dresses", "handbags", "shoes"],
    handbags: ["dresses", "shoes", "makeup"],
    cars: ["bikes"],
    bikes: ["cars"],
  }[category as string] || ["dresses", "shoes", "makeup"];

  // Create JSON-LD structured data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `Celebrity ${formattedCategory} Collection`,
    "description": `Explore our collection of celebrity-inspired ${formattedCategory.toLowerCase()}.`,
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Product",
        "name": item.title,
        "description": item.description,
        "image": item.image,
        "offers": {
          "@type": "Offer",
          "price": item.price,
          "priceCurrency": "USD"
        }
      }
    }))
  };

  return (
    <PageLayout>
      <SEO
        title={`${formattedCategory} | CelebrityPersona`}
        description={`Explore celebrity-inspired ${formattedCategory.toLowerCase()} and shop similar styles.`}
        keywords={`celebrity ${formattedCategory.toLowerCase()}, celebrity fashion, celebrity style`}
        jsonLd={jsonLd}
      />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-pastel-peach to-pastel-pink py-16">
        <div className="container-custom text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-medium mb-4">
            Celebrity {formattedCategory}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Explore our collection of celebrity-inspired {formattedCategory.toLowerCase()} and find your next style statement.
          </p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-gray-50 py-6 border-b">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="w-full md:w-auto">
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
              />
            </div>
            
            <div className="flex flex-wrap gap-2 items-center">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span className="text-sm font-medium">Price:</span>
                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="All Prices" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Prices</SelectItem>
                    <SelectItem value="under100">Under $100</SelectItem>
                    <SelectItem value="100to500">$100 - $500</SelectItem>
                    <SelectItem value="over500">Over $500</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4" />
                <span className="text-sm font-medium">Sort:</span>
                <Select value={sortOrder} onValueChange={setSortOrder}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Default" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="priceLow">Price: Low to High</SelectItem>
                    <SelectItem value="priceHigh">Price: High to Low</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Items Grid */}
      <div className="container-custom py-12">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : filteredItems.length > 0 ? (
          <>
            <div className="mb-4 text-sm text-muted-foreground">
              Showing {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredItems.map((item) => (
                <div key={item.id} className="relative">
                  <button
                    onClick={() => toggleFavorite(item.id)}
                    className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
                    aria-label={favorites.includes(item.id) ? "Remove from favorites" : "Add to favorites"}
                  >
                    <Heart 
                      className={cn(
                        "h-5 w-5 transition-colors", 
                        favorites.includes(item.id) ? "fill-red-500 text-red-500" : "text-gray-400"
                      )} 
                    />
                  </button>
                  <CategoryItemCard item={item} />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-xl mb-4">No items found</h2>
            <p className="text-muted-foreground mb-8">
              Try adjusting your filters or search criteria.
            </p>
            <Button 
              onClick={() => {
                setSearchQuery("");
                setPriceRange("all");
                setSortOrder("default");
              }}
            >
              Reset Filters
            </Button>
          </div>
        )}
      </div>

      {/* Related Categories Section */}
      <div className="bg-gray-50 py-12">
        <div className="container-custom">
          <h2 className="text-2xl font-serif font-medium mb-8 text-center">
            Explore Related Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {relatedCategories.map(relatedCategory => (
              <a 
                key={relatedCategory}
                href={`/category/${relatedCategory}`}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center"
              >
                <h3 className="text-lg font-medium capitalize">{relatedCategory}</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Discover celebrity-inspired {relatedCategory}
                </p>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-pastel-blue to-pastel-purple py-16">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-serif font-medium mb-4">
              Get Celebrity Style Updates
            </h2>
            <p className="text-muted-foreground mb-6">
              Subscribe to our newsletter to receive updates on the latest {formattedCategory.toLowerCase()} trends from your favorite celebrities.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 justify-center">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="max-w-xs"
              />
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Subscribing...
                  </>
                ) : (
                  "Subscribe"
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default CategoryDetail;
