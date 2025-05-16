
import React from "react";
import { CategoryItem } from "@/types/data";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface CategoryItemCardProps {
  item: CategoryItem;
}

const CategoryItemCard: React.FC<CategoryItemCardProps> = ({ item }) => {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="aspect-square overflow-hidden">
        <img 
          src={item.image} 
          alt={item.title} 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <CardContent className="pt-6 flex-grow">
        <h3 className="font-serif text-lg font-medium mb-2">{item.title}</h3>
        <p className="text-muted-foreground text-sm mb-3">{item.description}</p>
        <div className="flex justify-between items-center">
          <span className="font-medium">{item.price}</span>
          <span className="text-xs text-muted-foreground">{item.retailer}</span>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <a 
          href={item.affiliateLink} 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn-primary text-center block w-full py-2 text-sm"
        >
          Shop Now
        </a>
      </CardFooter>
    </Card>
  );
};

export default CategoryItemCard;
