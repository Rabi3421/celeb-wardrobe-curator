
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import OutfitCard from "@/components/ui/OutfitCard";
import SectionHeader from "@/components/ui/SectionHeader";
import { outfits } from "@/data/mockData";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import SEO from "@/components/SEO/SEO";

const Categories: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  // Decode and format the category name for display
  const categoryName = category ? 
    category.charAt(0).toUpperCase() + category.slice(1) : 
    "Category";
  
  // Filter outfits based on category and search term
  const filteredOutfits = outfits.filter(outfit => {
    const matchesSearch = outfit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         outfit.description.toLowerCase().includes(searchTerm.toLowerCase());
    // For now, we'll use a simple mock filter since we don't have actual category data in the outfits
    // In a real app, you would have a category property to filter by
    return matchesSearch;
  });

  // Handle "Load More" button click
  const handleLoadMore = () => {
    setIsLoadingMore(true);
    // Simulate loading delay
    setTimeout(() => {
      setIsLoadingMore(false);
    }, 1000);
  };
  
  // Create structured data for the page
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${categoryName} Celebrity Style - CelebrityPersona`,
    "description": `Explore our collection of celebrity ${categoryName.toLowerCase()} inspirations and find your next style statement.`,
    "url": `${window.location.origin}/categories/${category}`,
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": filteredOutfits.map((outfit, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `${window.location.origin}/outfit/${outfit.id}`
      }))
    }
  };
  
  return (
    <PageLayout>
      <SEO 
        title={`${categoryName} Celebrity Style - CelebrityPersona`}
        description={`Explore our collection of celebrity ${categoryName.toLowerCase()} inspirations and find your next style statement.`}
        canonical={`${window.location.origin}/categories/${category}`}
        ogType="website"
        ogImage={filteredOutfits[0]?.image || "/images/hero_img.jpg"}
        keywords={`celebrity ${categoryName.toLowerCase()}, ${categoryName.toLowerCase()} fashion, celebrity style, fashion inspiration`}
        jsonLd={jsonLd}
      />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-pastel-peach to-pastel-pink py-16">
        <div className="container-custom text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-medium mb-4">
            {categoryName}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Explore our collection of celebrity {categoryName.toLowerCase()} inspirations and find your next style statement.
          </p>
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder={`Search ${categoryName.toLowerCase()}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-6 rounded-full"
            />
          </div>
        </div>
      </div>

      <div className="container-custom py-12">
        {/* Heading */}
        <SectionHeader 
          title={`Celebrity ${categoryName} Collection`} 
        />

        {/* Outfit Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredOutfits.map((outfit) => (
            <OutfitCard
              key={outfit.id}
              id={outfit.id}
              image={outfit.image}
              celebrity={outfit.celebrity}
              celebrityId={outfit.celebrityId}
              title={outfit.title}
              description={outfit.description}
            />
          ))}
        </div>

        {/* Load More Button */}
        <div className="flex justify-center mt-12">
          <Button 
            onClick={handleLoadMore} 
            disabled={isLoadingMore}
            className="btn-primary"
          >
            {isLoadingMore ? "Loading..." : "Load More"}
          </Button>
        </div>
      </div>
    </PageLayout>
  );
};

export default Categories;
