
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import SEO from "@/components/SEO/SEO";
import { fetchCategoryItems } from "@/services/api";
import { CategoryItem } from "@/types/data";
import CategoryItemCard from "@/components/ui/CategoryItemCard";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const CategoryDetail: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const [items, setItems] = useState<CategoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
      setIsLoading(false);
    };

    loadCategoryItems();
  }, [category]);

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

      {/* Category Items Grid */}
      <div className="container-custom py-12">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item) => (
              <CategoryItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-xl mb-4">No items found for this category</h2>
            <p className="text-muted-foreground mb-8">
              We couldn't find any items in this category. Please check back later!
            </p>
            <Button onClick={() => window.history.back()}>Go Back</Button>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default CategoryDetail;
