
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface StyleQuizResultProps {
  answers: string[];
  onRestart: () => void;
}

interface StyleMatch {
  type: string;
  title: string;
  description: string;
  celebrities: string[];
  image: string;
  tips: string[];
}

const styleMatches: Record<string, StyleMatch> = {
  elegant: {
    type: "elegant",
    title: "Elegant & Timeless",
    description: "You have sophisticated taste and prefer classic, polished looks that never go out of style.",
    celebrities: ["Emma Stone", "Angelina Jolie", "Kate Middleton"],
    image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    tips: [
      "Invest in quality basics in neutral colors",
      "Choose timeless pieces over trendy items",
      "Focus on clean lines and tailored fits"
    ]
  },
  edgy: {
    type: "edgy",
    title: "Edgy & Bold",
    description: "You're not afraid to make a statement and love experimenting with bold, unconventional styles.",
    celebrities: ["Rihanna", "Lady Gaga", "Billie Eilish"],
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    tips: [
      "Mix textures like leather and denim",
      "Don't shy away from bold accessories",
      "Experiment with unique silhouettes"
    ]
  },
  boho: {
    type: "boho",
    title: "Boho & Free-Spirited",
    description: "You love flowing fabrics, earthy tones, and pieces that tell a story of adventure and creativity.",
    celebrities: ["Vanessa Hudgens", "Sienna Miller", "Florence Welch"],
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    tips: [
      "Layer different textures and patterns",
      "Embrace flowy, comfortable silhouettes",
      "Add vintage or handmade accessories"
    ]
  },
  sporty: {
    type: "sporty",
    title: "Sporty & Active",
    description: "You prioritize comfort and functionality while maintaining a fresh, athletic-inspired aesthetic.",
    celebrities: ["Gigi Hadid", "Kendall Jenner", "Hailey Bieber"],
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    tips: [
      "Mix athletic pieces with casual wear",
      "Choose comfortable yet stylish footwear",
      "Opt for versatile pieces that work day to night"
    ]
  }
};

const StyleQuizResult: React.FC<StyleQuizResultProps> = ({ answers, onRestart }) => {
  const navigate = useNavigate();

  // Calculate the most common answer
  const answerCounts = answers.reduce((acc, answer) => {
    acc[answer] = (acc[answer] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const dominantStyle = Object.entries(answerCounts).reduce((a, b) => 
    answerCounts[a[0]] > answerCounts[b[0]] ? a : b
  )[0];

  const result = styleMatches[dominantStyle];

  const handleExploreCelebrities = () => {
    navigate('/celebrities');
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-serif mb-4">
          Your Style Match: {result.title}
        </CardTitle>
        <img 
          src={result.image} 
          alt={result.title}
          className="w-32 h-32 rounded-full mx-auto object-cover mb-4"
        />
        <p className="text-muted-foreground">{result.description}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold mb-2">Celebrities with similar style:</h3>
          <div className="flex flex-wrap gap-2">
            {result.celebrities.map((celebrity, index) => (
              <span 
                key={index}
                className="bg-secondary px-3 py-1 rounded-full text-sm"
              >
                {celebrity}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Style Tips for You:</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            {result.tips.map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button 
            onClick={handleExploreCelebrities} 
            className="btn-primary flex-1"
          >
            Explore Celebrity Styles
          </Button>
          <Button 
            variant="outline" 
            onClick={onRestart}
            className="flex-1"
          >
            Retake Quiz
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StyleQuizResult;
