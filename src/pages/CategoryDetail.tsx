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
import { getKeywordString } from "@/data/seoKeywords";

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

  // FAQ data specific to this category
  const categoryFaqs = {
    dresses: [
      {
        question: `What are the latest celebrity ${formattedCategory.toLowerCase()} trends?`,
        answer: `Our collection showcases the latest celebrity ${formattedCategory.toLowerCase()} trends including statement gowns, cocktail dresses, and casual-chic styles worn by A-list celebrities.`
      },
      {
        question: `How can I style celebrity-inspired ${formattedCategory.toLowerCase()} for everyday wear?`,
        answer: `You can style celebrity-inspired ${formattedCategory.toLowerCase()} for everyday occasions by pairing them with minimal accessories and casual footwear. Our blog offers detailed styling guides.`
      },
      {
        question: `Are these celebrity ${formattedCategory.toLowerCase()} affordable?`,
        answer: `We offer alternatives at various price points to match celebrity ${formattedCategory.toLowerCase()}, including budget-friendly options that capture the same aesthetic without the designer price tag.`
      }
    ],
    shoes: [
      {
        question: `What celebrity ${formattedCategory.toLowerCase()} are trending this season?`,
        answer: `This season's trending celebrity ${formattedCategory.toLowerCase()} include platform heels, statement sneakers, and minimalist sandals as seen on red carpets and street style moments.`
      },
      {
        question: `How do I find comfortable celebrity-inspired ${formattedCategory.toLowerCase()}?`,
        answer: `Look for our comfort-rated alternatives to celebrity ${formattedCategory.toLowerCase()} that offer similar styles with added padding, arch support, and quality materials for all-day wear.`
      },
      {
        question: `What are the most versatile celebrity ${formattedCategory.toLowerCase()} styles?`,
        answer: `The most versatile celebrity ${formattedCategory.toLowerCase()} include neutral pumps, white sneakers, and ankle boots that can be styled with multiple outfits as demonstrated by fashion-forward stars.`
      }
    ],
    handbags: [
      {
        question: `Which celebrity ${formattedCategory.toLowerCase()} are worth the investment?`,
        answer: `Celebrity-approved investment ${formattedCategory.toLowerCase()} include timeless designs from luxury brands that maintain their value, but we also offer similar alternatives at more accessible price points.`
      },
      {
        question: `How can I spot a quality ${formattedCategory.toLowerCase()} like celebrities wear?`,
        answer: `Quality ${formattedCategory.toLowerCase()} feature consistent stitching, durable hardware, and structured shapes. Our product descriptions highlight these quality indicators in our celebrity-inspired selections.`
      },
      {
        question: `What are the must-have celebrity ${formattedCategory.toLowerCase()} styles?`,
        answer: `Must-have celebrity ${formattedCategory.toLowerCase()} include structured totes, crossbody bags, and statement clutches that offer both functionality and style as showcased by fashion icons.`
      }
    ],
    makeup: [
      {
        question: `What ${formattedCategory.toLowerCase()} products do celebrities actually use?`,
        answer: `We've researched actual products used by celebrities and their makeup artists, offering both the exact items and affordable dupes with similar finishes and ingredients.`
      },
      {
        question: `How can I achieve celebrity ${formattedCategory.toLowerCase()} looks at home?`,
        answer: `Our step-by-step guides detail how to recreate celebrity ${formattedCategory.toLowerCase()} looks using recommended products, application techniques, and professional tips from celebrity makeup artists.`
      },
      {
        question: `Are celebrity-endorsed ${formattedCategory.toLowerCase()} products worth the price?`,
        answer: `While some celebrity-endorsed ${formattedCategory.toLowerCase()} products deliver excellent results, we help you identify which are worth the splurge and which can be substituted with affordable alternatives.`
      }
    ]
  };

  // Select appropriate FAQs based on category
  const faqs = categoryFaqs[category as keyof typeof categoryFaqs] || [
    {
      question: `What celebrity ${formattedCategory.toLowerCase()} are currently trending?`,
      answer: `Our collection showcases the latest celebrity ${formattedCategory.toLowerCase()} trends including styles from red carpet events, casual outings, and social media appearances.`
    },
    {
      question: `How can I find affordable alternatives to celebrity ${formattedCategory.toLowerCase()}?`,
      answer: `CelebrityPersona offers carefully curated alternatives to celebrity ${formattedCategory.toLowerCase()} at various price points, helping you achieve the same look for less.`
    },
    {
      question: `Do celebrities actually wear these ${formattedCategory.toLowerCase()}?`,
      answer: `Yes, our catalogue features ${formattedCategory.toLowerCase()} styles that are worn by celebrities, and we provide similar options that capture the same aesthetic at different price points.`
    }
  ];

  // Breadcrumb data for structured data
  const breadcrumbs = [
    {
      name: "Home",
      url: "/"
    },
    {
      name: "Categories",
      url: "/categories"
    },
    {
      name: formattedCategory,
      url: `/category/${category}`
    }
  ];

  // Create JSON-LD structured data for SEO with enhanced information
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": `Celebrity ${formattedCategory} Collection`,
      "description": `Explore our collection of celebrity-inspired ${formattedCategory.toLowerCase()}.`,
      "itemListElement": filteredItems.slice(0, 10).map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Product",
          "name": item.title,
          "description": item.description || `Celebrity-inspired ${formattedCategory.toLowerCase()}`,
          "image": item.image,
          "offers": {
            "@type": "Offer",
            "price": item.price ? item.price.replace(/[^0-9.]/g, '') : "",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock",
            "url": item.affiliateLink || `${window.location.origin}/category/${category}/${item.id}`
          }
        }
      }))
    },
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": `Celebrity ${formattedCategory} Fashion Collection`,
      "description": `Discover celebrity-inspired ${formattedCategory.toLowerCase()} and affordable alternatives to recreate star looks.`,
      "primaryImageOfPage": {
        "@type": "ImageObject",
        "url": filteredItems.length > 0 ? filteredItems[0].image : `${window.location.origin}/images/categories/${category}.jpg`
      },
      "mainEntity": {
        "@type": "ItemList",
        "itemListElement": filteredItems.slice(0, 10).map((item, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "url": item.affiliateLink || `${window.location.origin}/category/${category}/${item.id}`
        }))
      }
    }
  ];

  return (
    <PageLayout>
      <SEO
        title={`Celebrity ${formattedCategory} Style | Shop The Look | CelebrityPersona`}
        description={`Discover celebrity-inspired ${formattedCategory.toLowerCase()} and affordable alternatives. Shop the same styles worn by your favorite stars at a fraction of the price.`}
        keywords={getKeywordString(category)}
        ogTitle={`Celebrity ${formattedCategory} | Shop Celebrity-Inspired Fashion`}
        ogDescription={`Get the look with our celebrity-inspired ${formattedCategory.toLowerCase()} collection. Affordable alternatives to styles worn by Hollywood stars.`}
        ogImage={filteredItems.length > 0 ? filteredItems[0].image : undefined}
        jsonLd={jsonLd}
        breadcrumbs={breadcrumbs}
        faqSchema={faqs}
        category={category}
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
