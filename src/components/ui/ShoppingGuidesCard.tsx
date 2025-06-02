
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Heart, Star, ExternalLink } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const ShoppingGuidesCard: React.FC = () => {
  const [showGuidesDialog, setShowGuidesDialog] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const { toast } = useToast();

  const shoppingGuides = [
    {
      id: "red-carpet",
      title: "Red Carpet Glamour",
      celebrity: "Zendaya",
      description: "Recreate stunning red carpet looks on any budget",
      items: [
        { name: "Sequin Evening Dress", price: "$89", retailer: "ASOS", originalPrice: "$2,500" },
        { name: "Statement Earrings", price: "$25", retailer: "H&M", originalPrice: "$850" },
        { name: "Strappy Heels", price: "$45", retailer: "Target", originalPrice: "$1,200" }
      ],
      totalSavings: "$4,391",
      image: "/images/zendaya_red_carpet_look.avif"
    },
    {
      id: "street-style",
      title: "Effortless Street Style",
      celebrity: "Rihanna",
      description: "Master casual-chic with these versatile pieces",
      items: [
        { name: "Oversized Blazer", price: "$49", retailer: "Zara", originalPrice: "$890" },
        { name: "High-Waist Jeans", price: "$39", retailer: "Uniqlo", originalPrice: "$295" },
        { name: "Designer-Inspired Sneakers", price: "$65", retailer: "Steve Madden", originalPrice: "$750" }
      ],
      totalSavings: "$1,821",
      image: "/images/Rihanna.jpeg"
    },
    {
      id: "minimalist",
      title: "Minimalist Chic",
      celebrity: "Gwyneth Paltrow",
      description: "Clean lines and neutral tones for timeless elegance",
      items: [
        { name: "Cashmere-Look Sweater", price: "$35", retailer: "COS", originalPrice: "$495" },
        { name: "Tailored Trousers", price: "$55", retailer: "Mango", originalPrice: "$650" },
        { name: "Leather-Look Loafers", price: "$42", retailer: "ASOS", originalPrice: "$525" }
      ],
      totalSavings: "$1,538",
      image: "/placeholder.svg"
    }
  ];

  const handleFavorite = (guideId: string) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(guideId) 
        ? prev.filter(id => id !== guideId)
        : [...prev, guideId];
      
      toast({
        description: prev.includes(guideId) 
          ? "Removed from favorites" 
          : "Added to favorites!",
      });
      
      return newFavorites;
    });
  };

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
        <div className="bg-gradient-to-br from-pastel-mint to-pastel-yellow h-36 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 flex items-end p-4">
            <ShoppingBag className="h-8 w-8 text-white group-hover:scale-110 transition-transform" />
          </div>
          <div className="absolute top-4 right-4">
            <Badge variant="secondary" className="bg-white/20 text-white">
              3 Guides
            </Badge>
          </div>
        </div>
        <CardHeader>
          <CardTitle className="text-lg group-hover:text-primary transition-colors flex items-center">
            Shopping Guides
            <ExternalLink className="h-4 w-4 ml-2 text-green-500" />
          </CardTitle>
          <CardDescription>Shop celebrity looks for less</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Featured Collections</span>
              <Badge variant="secondary">Save 80%+</Badge>
            </div>
            <div className="space-y-2">
              {shoppingGuides.slice(0, 2).map((guide) => (
                <div key={guide.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-sm font-medium">{guide.title}</span>
                  </div>
                  <span className="text-xs text-green-600 font-medium">Save {guide.totalSavings}</span>
                </div>
              ))}
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center space-x-2 mb-1">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span className="text-sm font-medium">Shopable Collections</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Direct links to affordable alternatives for celebrity outfits
              </p>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="w-full group-hover:bg-primary group-hover:text-white transition-colors"
            onClick={() => setShowGuidesDialog(true)}
          >
            Browse All Guides
          </Button>
        </CardContent>
      </Card>

      <Dialog open={showGuidesDialog} onOpenChange={setShowGuidesDialog}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif flex items-center">
              <ShoppingBag className="h-6 w-6 mr-2 text-primary" />
              Celebrity Shopping Guides
            </DialogTitle>
            <DialogDescription>
              Discover affordable alternatives to recreate your favorite celebrity looks. All items are carefully curated with direct shopping links.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {shoppingGuides.map((guide) => (
              <div key={guide.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-medium text-lg">{guide.title}</h3>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleFavorite(guide.id)}
                        className="p-1 h-auto"
                      >
                        <Heart 
                          className={`h-4 w-4 ${
                            favorites.includes(guide.id) 
                              ? 'fill-red-500 text-red-500' 
                              : 'text-gray-400'
                          }`} 
                        />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Inspired by {guide.celebrity}
                    </p>
                    <p className="text-sm mb-3">{guide.description}</p>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Total Savings: {guide.totalSavings}
                    </Badge>
                  </div>
                  <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden ml-4">
                    <img
                      src={guide.image}
                      alt={guide.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Shopping List:</h4>
                  {guide.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex-1">
                        <span className="text-sm font-medium">{item.name}</span>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <span>{item.retailer}</span>
                          <span>•</span>
                          <span className="line-through">{item.originalPrice}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-green-600">{item.price}</span>
                        <Button size="sm" variant="outline" className="h-6 px-2 text-xs">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Shop
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ShoppingGuidesCard;
