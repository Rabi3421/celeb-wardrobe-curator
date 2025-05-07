
import React, { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import CelebrityCard from "@/components/ui/CelebrityCard";
import SectionHeader from "@/components/ui/SectionHeader";
import { celebrities } from "@/data/mockData";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Shuffle, Star } from "lucide-react";

const Celebrities: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  // Filter celebrities based on search term and category
  const filteredCelebrities = celebrities.filter(celebrity => {
    const matchesSearch = celebrity.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || celebrity.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = ["all", ...Array.from(new Set(celebrities.map(celeb => celeb.category)))];
  
  // Celebrity of the month
  const featuredCelebrity = celebrities[0]; // Just using the first one as an example
  
  // Handle "Load More" button click
  const handleLoadMore = () => {
    setIsLoadingMore(true);
    // Simulate loading delay
    setTimeout(() => {
      setIsLoadingMore(false);
    }, 1000);
  };

  // Random celebrity recommendation
  const getRandomCelebrity = () => {
    const randomIndex = Math.floor(Math.random() * celebrities.length);
    return celebrities[randomIndex];
  };
  
  return (
    <PageLayout>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-pastel-blue to-pastel-lavender py-16">
        <div className="container-custom text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-medium mb-4">
            Celebrity Style Icons
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Explore your favorite celebrities' fashion styles, outfits, and trends. Get inspired by the most iconic looks from red carpets to street style.
          </p>
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search celebrities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-6 rounded-full"
            />
          </div>
        </div>
      </div>

      <div className="container-custom py-12">
        {/* Featured Celebrity */}
        <div className="mb-12">
          <SectionHeader title="Celebrity of the Month" />
          <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-r from-pastel-pink to-pastel-peach">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-6 md:p-8">
                <CardHeader className="p-0 pb-6">
                  <CardTitle className="text-2xl md:text-3xl">{featuredCelebrity.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <p className="mb-4">{featuredCelebrity.bio}</p>
                  <div className="flex items-center space-x-4 mb-4">
                    <Star className="text-yellow-400" />
                    <span className="font-medium">Style Icon</span>
                  </div>
                  <Button className="bg-white text-primary-foreground hover:bg-white/90">
                    View Profile
                  </Button>
                </CardContent>
              </div>
              <div className="relative h-64 md:h-auto">
                <img
                  src={featuredCelebrity.image}
                  alt={featuredCelebrity.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Categories Tabs */}
        <div className="mb-8">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="bg-transparent mb-6 overflow-x-auto flex-wrap">
              {categories.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  onClick={() => setSelectedCategory(category)}
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Celebrity Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {filteredCelebrities.map((celebrity) => (
            <CelebrityCard
              key={celebrity.id}
              id={celebrity.id}
              name={celebrity.name}
              image={celebrity.image}
              outfitCount={celebrity.outfitCount}
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

        {/* Random Celebrity Recommendation */}
        <div className="mt-16">
          <SectionHeader title="Discover New Style Icons" />
          <Card className="overflow-hidden bg-muted/50">
            <div className="flex flex-col md:flex-row items-center p-6">
              <div className="mb-4 md:mb-0 md:mr-6">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary">
                  <img
                    src={getRandomCelebrity().image}
                    alt="Random Celebrity"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="text-center md:text-left flex-1">
                <h3 className="font-serif font-medium text-lg mb-2">
                  Looking for style inspiration?
                </h3>
                <p className="text-muted-foreground mb-4">
                  Discover new celebrity style icons with our random recommendation feature.
                </p>
              </div>
              <Button 
                className="bg-pastel-mint text-primary-foreground hover:bg-opacity-90"
                onClick={() => window.location.href = `/celebrity/${getRandomCelebrity().id}`}
              >
                <Shuffle className="mr-2 h-4 w-4" />
                Random Celebrity
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default Celebrities;
