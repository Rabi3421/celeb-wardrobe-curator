
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Heart, ExternalLink, DollarSign, Star } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const ShoppingGuidesCard: React.FC = () => {
  const [showGuidesDialog, setShowGuidesDialog] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedGuide, setSelectedGuide] = useState<string | null>(null);
  const { toast } = useToast();

  const guides = [
    {
      id: "zendaya-red-carpet",
      title: "Zendaya's Red Carpet Look",
      celebrity: "Zendaya",
      occasion: "Met Gala 2024",
      image: "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?q=80&w=1980&auto=format&fit=crop&ixlib=rb-4.0.3",
      totalPrice: "$313",
      items: [
        { name: "Emerald statement dress", price: "$189", retailer: "ASOS", inStock: true },
        { name: "Crystal drop earrings", price: "$45", retailer: "H&M", inStock: true },
        { name: "Metallic strappy heels", price: "$79", retailer: "Zara", inStock: false }
      ],
      description: "Recreate Zendaya's stunning emerald Met Gala look with these affordable alternatives."
    },
    {
      id: "rihanna-street",
      title: "Rihanna's Street Style",
      celebrity: "Rihanna",
      occasion: "NYC Street Style",
      image: "https://images.unsplash.com/photo-1622495546323-5dac33dedb50?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3",
      totalPrice: "$278",
      items: [
        { name: "Oversized bomber jacket", price: "$155", retailer: "Urban Outfitters", inStock: true },
        { name: "Graphic vintage tee", price: "$38", retailer: "Thrift Store", inStock: true },
        { name: "Wide-leg cargo pants", price: "$85", retailer: "Nike", inStock: true }
      ],
      description: "Get Rihanna's effortless street style with bold statement pieces."
    },
    {
      id: "timothee-casual",
      title: "Timothée's Casual Edit",
      celebrity: "Timothée Chalamet",
      occasion: "Off-duty Style",
      image: "https://images.unsplash.com/photo-1503185912284-5271ff81b9a8?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3",
      totalPrice: "$247",
      items: [
        { name: "Fitted knit sweater", price: "$68", retailer: "Uniqlo", inStock: true },
        { name: "Slim-fit chinos", price: "$59", retailer: "J.Crew", inStock: true },
        { name: "Chelsea boots", price: "$120", retailer: "Doc Martens", inStock: true }
      ],
      description: "Channel Timothée's European-inspired casual sophistication."
    }
  ];

  const toggleFavorite = (guideId: string) => {
    setFavorites(prev => 
      prev.includes(guideId) 
        ? prev.filter(id => id !== guideId)
        : [...prev, guideId]
    );
    
    const guide = guides.find(g => g.id === guideId);
    toast({
      title: favorites.includes(guideId) ? "Removed from Wishlist" : "Added to Wishlist",
      description: favorites.includes(guideId) 
        ? `${guide?.title} has been removed from your wishlist.`
        : `${guide?.title} has been added to your wishlist!`,
    });
  };

  const handleShopCollection = (guide: any) => {
    toast({
      title: "Redirecting to Shop",
      description: `Taking you to shop ${guide.title} collection...`,
    });
    // In a real app, this would redirect to the shopping page
  };

  const selectedGuideData = guides.find(g => g.id === selectedGuide);

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
        <div className="bg-gradient-to-br from-pastel-blue to-pastel-purple h-36 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 flex items-end p-4">
            <ShoppingBag className="h-8 w-8 text-white group-hover:scale-110 transition-transform" />
          </div>
          <div className="absolute top-4 right-4">
            <Badge variant="secondary" className="bg-white/20 text-white">
              <DollarSign className="h-3 w-3 mr-1" />
              Affordable
            </Badge>
          </div>
        </div>
        <CardHeader>
          <CardTitle className="text-lg group-hover:text-primary transition-colors flex items-center">
            Shopping Guides
            <Star className="h-4 w-4 ml-2 text-yellow-500 fill-current" />
          </CardTitle>
          <CardDescription>Celebrity-inspired collections you can shop</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 mb-4">
            {guides.slice(0, 3).map((guide) => (
              <div key={guide.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                    <img src={guide.image} alt={guide.celebrity} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="text-sm font-medium block">{guide.title}</span>
                    <span className="text-xs text-muted-foreground">{guide.totalPrice} total</span>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7"
                  onClick={() => toggleFavorite(guide.id)}
                >
                  <Heart className={`h-4 w-4 transition-colors ${
                    favorites.includes(guide.id) ? 'text-red-500 fill-current' : 'text-muted-foreground'
                  }`} />
                </Button>
              </div>
            ))}
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full group-hover:bg-primary group-hover:text-white transition-colors"
            onClick={() => setShowGuidesDialog(true)}
          >
            Browse All Collections
          </Button>
        </CardContent>
      </Card>

      <Dialog open={showGuidesDialog} onOpenChange={setShowGuidesDialog}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif flex items-center">
              <ShoppingBag className="h-6 w-6 mr-2 text-primary" />
              Celebrity Style Shopping Guides
            </DialogTitle>
          </DialogHeader>
          
          {selectedGuideData ? (
            <div className="py-4 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <img 
                    src={selectedGuideData.image} 
                    alt={selectedGuideData.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="text-xl font-semibold">{selectedGuideData.title}</h3>
                    <p className="text-muted-foreground">{selectedGuideData.description}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant="outline">{selectedGuideData.celebrity}</Badge>
                      <Badge variant="secondary">{selectedGuideData.occasion}</Badge>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">Complete Look</h4>
                      <span className="text-lg font-semibold text-primary">{selectedGuideData.totalPrice}</span>
                    </div>
                    <div className="space-y-3">
                      {selectedGuideData.items.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded">
                          <div className="flex-1">
                            <div className="text-sm font-medium">{item.name}</div>
                            <div className="text-xs text-muted-foreground">{item.retailer}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">{item.price}</div>
                            <Badge 
                              variant={item.inStock ? "secondary" : "destructive"} 
                              className="text-xs"
                            >
                              {item.inStock ? "In Stock" : "Out of Stock"}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      className="flex-1"
                      onClick={() => handleShopCollection(selectedGuideData)}
                    >
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Shop Collection
                    </Button>
                    <Button 
                      variant="outline"
                      size="icon"
                      onClick={() => toggleFavorite(selectedGuideData.id)}
                    >
                      <Heart className={`h-4 w-4 ${
                        favorites.includes(selectedGuideData.id) ? 'text-red-500 fill-current' : ''
                      }`} />
                    </Button>
                  </div>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                onClick={() => setSelectedGuide(null)}
                className="w-full"
              >
                ← Back to All Guides
              </Button>
            </div>
          ) : (
            <div className="py-4 space-y-6">
              <div className="grid gap-4">
                {guides.map((guide) => (
                  <div 
                    key={guide.id}
                    className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedGuide(guide.id)}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="aspect-square sm:aspect-auto">
                        <img 
                          src={guide.image} 
                          alt={guide.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="col-span-2 p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-medium text-lg">{guide.title}</h3>
                            <p className="text-sm text-muted-foreground">{guide.description}</p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(guide.id);
                            }}
                          >
                            <Heart className={`h-4 w-4 ${
                              favorites.includes(guide.id) ? 'text-red-500 fill-current' : 'text-muted-foreground'
                            }`} />
                          </Button>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                          {guide.items.slice(0, 2).map((item, index) => (
                            <div key={index} className="flex items-center justify-between text-sm">
                              <span>{item.name}</span>
                              <span className="font-medium">{item.price}</span>
                            </div>
                          ))}
                          {guide.items.length > 2 && (
                            <div className="text-xs text-muted-foreground">
                              +{guide.items.length - 2} more items
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex space-x-2">
                            <Badge variant="outline">{guide.celebrity}</Badge>
                            <Badge variant="secondary">{guide.occasion}</Badge>
                          </div>
                          <span className="text-lg font-semibold text-primary">{guide.totalPrice}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              onClick={() => setShowGuidesDialog(false)}
              className="w-full sm:w-auto"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ShoppingGuidesCard;
