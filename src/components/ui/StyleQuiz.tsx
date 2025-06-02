
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StyleQuizResult from "./StyleQuizResult";

interface QuizQuestion {
  id: number;
  question: string;
  options: { value: string; label: string }[];
}

const questions: QuizQuestion[] = [
  {
    id: 1,
    question: "What's your go-to outfit for a night out?",
    options: [
      { value: "elegant", label: "A classic little black dress with heels" },
      { value: "edgy", label: "Leather jacket with boots and dark jeans" },
      { value: "boho", label: "Flowing maxi dress with layered jewelry" },
      { value: "sporty", label: "Stylish athleisure with trendy sneakers" }
    ]
  },
  {
    id: 2,
    question: "Which accessory do you never leave home without?",
    options: [
      { value: "elegant", label: "A designer handbag" },
      { value: "edgy", label: "Statement sunglasses" },
      { value: "boho", label: "Layered necklaces" },
      { value: "sporty", label: "A sleek watch or fitness tracker" }
    ]
  },
  {
    id: 3,
    question: "Your ideal vacation style is:",
    options: [
      { value: "elegant", label: "Chic resort wear with sophisticated pieces" },
      { value: "edgy", label: "Urban exploration with comfortable cool pieces" },
      { value: "boho", label: "Flowy fabrics and earthy tones" },
      { value: "sporty", label: "Functional yet fashionable activewear" }
    ]
  },
  {
    id: 4,
    question: "What's your favorite color palette?",
    options: [
      { value: "elegant", label: "Neutrals: black, white, beige, navy" },
      { value: "edgy", label: "Dark tones: black, grey, deep reds" },
      { value: "boho", label: "Earth tones: browns, greens, warm oranges" },
      { value: "sporty", label: "Bright colors: neons, blues, vibrant pinks" }
    ]
  }
];

const StyleQuiz: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResult(false);
    setQuizStarted(false);
  };

  const startQuiz = () => {
    setQuizStarted(true);
  };

  if (!quizStarted) {
    return (
      <Card className="max-w-2xl mx-auto text-center">
        <CardHeader>
          <CardTitle className="text-2xl font-serif mb-4">
            Discover Your Celebrity Style Match
          </CardTitle>
          <p className="text-muted-foreground mb-6">
            Take our quick style quiz to find celebrities with similar fashion sense and get personalized outfit inspiration!
          </p>
        </CardHeader>
        <CardContent>
          <Button onClick={startQuiz} className="btn-primary">
            Start Style Quiz
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (showResult) {
    return <StyleQuizResult answers={answers} onRestart={resetQuiz} />;
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="w-full bg-secondary rounded-full h-2 mb-4">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <CardTitle className="text-xl font-serif">
          Question {currentQuestion + 1} of {questions.length}
        </CardTitle>
        <p className="text-lg text-foreground mt-2">{question.question}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <Button
              key={index}
              variant="outline"
              className="w-full text-left justify-start p-4 h-auto whitespace-normal"
              onClick={() => handleAnswer(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default StyleQuiz;
