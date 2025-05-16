
import React from "react";
import { CategoryItem } from "@/types/data";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CategoryItemCardProps {
  item: CategoryItem;
}

const CategoryItemCard: React.FC<CategoryItemCardProps> = ({ item }) => {
  const { toast } = useToast();
  
  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    toast({
      title: `Quick view: ${item.title}`,
      description: item.description,
    });
  };
  
  const handleClick = () => {
    // Track click analytics in a real app
    console.log("Product clicked:", item.title);
  };

  // Format price with commas if needed
  const formattedPrice = item.price.includes('$') 
    ? item.price 
    : `$${item.price}`;

  // Determine if item is on sale (for demo purposes, we'll just mark some items)
  const isOnSale = item.id.length % 2 === 0;
  
  return (
    <Card className="overflow-hidden h-full flex flex-col group hover:shadow-md transition-all duration-300">
      <div className="aspect-square overflow-hidden relative">
        <img 
          src={item.image} 
          alt={item.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {isOnSale && (
          <Badge className="absolute top-2 left-2 bg-red-500">Sale</Badge>
        )}
        <button
          onClick={handleQuickView}
          className="absolute bottom-2 right-2 bg-white/90 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white"
          aria-label="Quick view"
        >
          <Eye className="h-5 w-5" />
        </button>
      </div>
      <CardContent className="pt-6 flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-serif text-lg font-medium line-clamp-2">{item.title}</h3>
        </div>
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{item.description}</p>
        <div className="flex justify-between items-center">
          <span className="font-medium text-lg">{formattedPrice}</span>
          <span className="text-xs text-muted-foreground">{item.retailer}</span>
        </div>
        {/* Product ratings - simulated for demo purposes */}
        <div className="flex items-center mt-2">
          <div className="flex">
            {Array(5).fill(0).map((_, i) => (
              <svg 
                key={i} 
                className={`w-4 h-4 ${i < Math.floor(3 + item.id.length % 3) ? "text-yellow-400" : "text-gray-300"}`} 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-xs text-muted-foreground ml-1">
            ({10 + (item.id.length % 90)} reviews)
          </span>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <a 
          href={item.affiliateLink} 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn-primary text-center block w-full py-3 text-sm font-medium hover:bg-primary-hover transition-colors duration-300"
          onClick={handleClick}
        >
          Shop Now
        </a>
      </CardFooter>
    </Card>
  );
};

export default CategoryItemCard;
