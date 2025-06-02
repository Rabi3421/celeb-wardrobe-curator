
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Palette, TrendingUp, Sparkles, Calendar } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const SeasonalTrendsCard: React.FC = () => {
  const [showTrendsDialog, setShowTrendsDialog] = useState(false);
  const [selectedTrend, setSelectedTrend] = useState<string | null>(null);

  const trends = [
    {
      id: "oversized",
      name: "Oversized Silhouettes",
      description: "Voluminous shapes creating dramatic statements",
      celebrities: ["Zendaya", "Billie Eilish", "Rihanna"],
      color: "bg-blue-100 text-blue-800",
      details: "This trend embraces comfort while making a bold fashion statement. Oversized blazers, wide-leg pants, and billowing dresses are dominating red carpets and street style."
    },
    {
      id: "neon",
      name: "Bold Neon Colors",
      description: "Electric brights in unexpected combinations",
      celebrities: ["Dua Lipa", "Harry Styles", "Lizzo"],
      color: "bg-pink-100 text-pink-800",
      details: "Neon colors are making a major comeback with celebrities experimenting with electric greens, hot pinks, and vibrant oranges in both casual and formal wear."
    },
    {
      id: "sustainable",
      name: "Sustainable Fashion",
      description: "Eco-friendly materials and ethical production",
      celebrities: ["Emma Watson", "Leonardo DiCaprio", "Stella McCartney"],
      color: "bg-green-100 text-green-800",
      details: "More celebrities are choosing sustainable fashion options, supporting brands that use recycled materials and ethical production methods."
    }
  ];

  const handleTrendClick = (trendId: string) => {
    setSelectedTrend(trendId);
    setShowTrendsDialog(true);
  };

  const selectedTrendData = trends.find(trend => trend.id === selectedTrend);

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer">
        <div className="bg-gradient-to-br from-pastel-peach to-pastel-pink h-36 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 flex items-end p-4">
            <div className="flex items-center space-x-2">
              <Palette className="h-8 w-8 text-white group-hover:scale-110 transition-transform" />
              <TrendingUp className="h-6 w-6 text-white/80" />
            </div>
          </div>
          <div className="absolute top-4 right-4">
            <Badge variant="secondary" className="bg-white/20 text-white">
              <Calendar className="h-3 w-3 mr-1" />
              2025
            </Badge>
          </div>
        </div>
        <CardHeader>
          <CardTitle className="text-lg group-hover:text-primary transition-colors flex items-center">
            Seasonal Trends
            <Sparkles className="h-4 w-4 ml-2 text-yellow-500" />
          </CardTitle>
          <CardDescription>Spring/Summer 2025 Celebrity Favorites</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 mb-4">
            {trends.map((trend) => (
              <div 
                key={trend.id}
                onClick={() => handleTrendClick(trend.id)}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span className="text-sm font-medium">{trend.name}</span>
                </div>
                <Badge className={trend.color} variant="secondary">
                  {trend.celebrities.length}+ celebs
                </Badge>
              </div>
            ))}
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full group-hover:bg-primary group-hover:text-white transition-colors"
            onClick={() => setShowTrendsDialog(true)}
          >
            Explore All Trends
          </Button>
        </CardContent>
      </Card>

      <Dialog open={showTrendsDialog} onOpenChange={setShowTrendsDialog}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif flex items-center">
              <Palette className="h-6 w-6 mr-2 text-primary" />
              Spring/Summer 2025 Trends
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {selectedTrendData ? (
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <h3 className="font-medium text-xl mb-2 flex items-center">
                    {selectedTrendData.name}
                    <Badge className={selectedTrendData.color} variant="secondary" size="sm">
                      Trending
                    </Badge>
                  </h3>
                  <p className="text-muted-foreground mb-3">{selectedTrendData.details}</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedTrendData.celebrities.map((celebrity) => (
                      <Badge key={celebrity} variant="outline">
                        {celebrity}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedTrend(null)}
                  className="w-full"
                >
                  View All Trends
                </Button>
              </div>
            ) : (
              <div className="grid gap-4">
                {trends.map((trend) => (
                  <div 
                    key={trend.id}
                    onClick={() => handleTrendClick(trend.id)}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-lg">{trend.name}</h3>
                      <Badge className={trend.color} variant="secondary">
                        Hot
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm mb-3">{trend.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {trend.celebrities.map((celebrity) => (
                        <Badge key={celebrity} variant="outline" size="sm">
                          {celebrity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SeasonalTrendsCard;
