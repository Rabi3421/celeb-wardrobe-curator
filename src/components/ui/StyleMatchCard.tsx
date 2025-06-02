import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bookmark, User, Heart, Star } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const StyleMatchCard: React.FC = () => {
  const [showStyleDialog, setShowStyleDialog] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const { toast } = useToast();

  const quiz = [
    {
      question: "What's your ideal night out outfit?",
      options: [
        { id: "minimalist", text: "Simple black dress or sleek suit", style: "Minimalist" },
        { id: "bohemian", text: "Flowy dress with layered jewelry", style: "Bohemian" },
        { id: "streetwear", text: "Stylish sneakers and designer hoodie", style: "Streetwear" },
        { id: "classic", text: "Tailored blazer and trousers", style: "Classic" }
      ]
    },
    {
      question: "Which color palette speaks to you?",
      options: [
        { id: "minimalist", text: "Neutrals: Black, white, beige", style: "Minimalist" },
        { id: "bohemian", text: "Earth tones: Terracotta, sage, cream", style: "Bohemian" },
        { id: "streetwear", text: "Bold: Neon, primary colors", style: "Streetwear" },
        { id: "classic", text: "Rich: Navy, burgundy, emerald", style: "Classic" }
      ]
    },
    {
      question: "Your dream shopping destination?",
      options: [
        { id: "minimalist", text: "COS or Uniqlo - clean, modern pieces", style: "Minimalist" },
        { id: "bohemian", text: "Free People or vintage markets", style: "Bohemian" },
        { id: "streetwear", text: "Supreme or Off-White", style: "Streetwear" },
        { id: "classic", text: "Brooks Brothers or Theory", style: "Classic" }
      ]
    }
  ];

  const styleResults = {
    minimalist: {
      name: "Minimalist Chic",
      celebrity: "Zendaya",
      description: "Clean lines, neutral colors, and timeless elegance define your style.",
      traits: ["Effortless", "Sophisticated", "Versatile"],
      tips: "Invest in quality basics, focus on fit and proportion, choose classic silhouettes."
    },
    bohemian: {
      name: "Bohemian Spirit",
      celebrity: "Florence Welch",
      description: "Free-spirited, artistic, and connected to nature - your style tells a story.",
      traits: ["Creative", "Free-spirited", "Artistic"],
      tips: "Layer textures and patterns, embrace vintage finds, mix high and low pieces."
    },
    streetwear: {
      name: "Urban Edge",
      celebrity: "Rihanna",
      description: "Bold, comfortable, and fashion-forward - you're not afraid to make a statement.",
      traits: ["Bold", "Trendy", "Confident"],
      tips: "Mix luxury with casual pieces, stay updated on latest drops, experiment with proportions."
    },
    classic: {
      name: "Timeless Elegance",
      celebrity: "Meghan Markle",
      description: "Refined, polished, and sophisticated - you appreciate quality and craftsmanship.",
      traits: ["Polished", "Refined", "Timeless"],
      tips: "Invest in tailored pieces, choose quality over quantity, stick to classic cuts."
    }
  };

  const handleAnswer = (answerId: string) => {
    const newAnswers = [...answers, answerId];
    setAnswers(newAnswers);

    if (currentStep < quiz.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Calculate result
      const counts = newAnswers.reduce((acc, answer) => {
        acc[answer] = (acc[answer] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const result = Object.entries(counts).reduce((max, [style, count]) => 
        count > max.count ? { style, count } : max
      , { style: 'minimalist', count: 0 });
      
      setSelectedStyle(result.style);
    }
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setAnswers([]);
    setSelectedStyle(null);
  };

  const handleSaveResult = () => {
    if (selectedStyle) {
      const result = styleResults[selectedStyle as keyof typeof styleResults];
      toast({
        title: "Style Match Saved!",
        description: `Your ${result.name} style has been saved to your profile.`,
      });
      setShowStyleDialog(false);
      resetQuiz();
    }
  };

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
        <div className="bg-gradient-to-br from-pastel-lavender to-pastel-blue h-36 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 flex items-end p-4">
            <Bookmark className="h-8 w-8 text-white group-hover:scale-110 transition-transform" />
          </div>
          <div className="absolute top-4 right-4">
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="h-4 w-4 text-yellow-400 fill-current" />
              ))}
            </div>
          </div>
        </div>
        <CardHeader>
          <CardTitle className="text-lg group-hover:text-primary transition-colors flex items-center">
            Style Match Quiz
            <Heart className="h-4 w-4 ml-2 text-red-500" />
          </CardTitle>
          <CardDescription>Discover your celebrity style twin</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Style Categories</span>
              <Badge variant="secondary">4 Types</Badge>
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(styleResults).map(([key, style]) => (
                <Badge key={key} variant="outline" className="text-xs">
                  {style.name}
                </Badge>
              ))}
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center space-x-2 mb-1">
                <User className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Quick 3-Question Quiz</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Find out which celebrity's style matches your aesthetic preferences
              </p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full group-hover:bg-primary group-hover:text-white transition-colors"
            onClick={() => setShowStyleDialog(true)}
          >
            Take Style Quiz
          </Button>
        </CardContent>
      </Card>

      <Dialog open={showStyleDialog} onOpenChange={setShowStyleDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif flex items-center">
              <Bookmark className="h-6 w-6 mr-2 text-primary" />
              {selectedStyle ? 'Your Style Match' : 'Style Match Quiz'}
            </DialogTitle>
            <DialogDescription>
              {selectedStyle 
                ? `Congratulations! We've found your celebrity style match. Discover your fashion personality and get personalized style tips.`
                : `Take our quick 3-question quiz to discover which celebrity's style matches your personality and get personalized fashion advice.`
              }
            </DialogDescription>
          </DialogHeader>
          
          {selectedStyle ? (
            <div className="py-4 space-y-4">
              {(() => {
                const result = styleResults[selectedStyle as keyof typeof styleResults];
                return (
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <Heart className="h-10 w-10 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{result.name}</h3>
                      <p className="text-muted-foreground">Just like {result.celebrity}</p>
                    </div>
                    <p className="text-sm">{result.description}</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {result.traits.map((trait) => (
                        <Badge key={trait} variant="secondary">{trait}</Badge>
                      ))}
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg text-left">
                      <h4 className="font-medium mb-2">Style Tips:</h4>
                      <p className="text-sm text-muted-foreground">{result.tips}</p>
                    </div>
                  </div>
                );
              })()}
            </div>
          ) : (
            <div className="py-4">
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">
                    Question {currentStep + 1} of {quiz.length}
                  </span>
                  <Badge variant="outline">{Math.round(((currentStep + 1) / quiz.length) * 100)}%</Badge>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentStep + 1) / quiz.length) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">{quiz[currentStep].question}</h3>
                <div className="space-y-2">
                  {quiz[currentStep].options.map((option) => (
                    <Button
                      key={option.id}
                      variant="outline"
                      className="w-full text-left justify-start h-auto p-4 hover:bg-primary/5"
                      onClick={() => handleAnswer(option.id)}
                    >
                      <div>
                        <div className="font-medium">{option.text}</div>
                        <div className="text-xs text-muted-foreground">{option.style} Style</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="flex-col sm:flex-row gap-2">
            {selectedStyle ? (
              <>
                <Button variant="outline" onClick={resetQuiz} className="w-full sm:w-auto">
                  Retake Quiz
                </Button>
                <Button onClick={handleSaveResult} className="w-full sm:w-auto">
                  Save My Style
                </Button>
              </>
            ) : (
              <Button 
                variant="outline" 
                onClick={() => setShowStyleDialog(false)}
                className="w-full"
              >
                Close
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default StyleMatchCard;
