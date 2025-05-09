
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

interface TestimonialCardProps {
  name: string;
  role: string;
  avatar: string;
  quote: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  name,
  role,
  avatar,
  quote,
}) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <Card className="overflow-hidden bg-white border-none shadow-md transition-all duration-300 hover:shadow-lg h-full flex flex-col">
      <CardContent className="pt-6 px-6 pb-6 flex flex-col justify-between h-full">
        <div className="mb-4 relative">
          <MessageSquare
            className="text-pastel-pink/30 absolute -left-1 -top-1"
            size={28}
          />
          <p className="text-muted-foreground italic relative pl-6 pt-1">"{quote}"</p>
        </div>
        
        <div className="flex items-center mt-4">
          <Avatar className="h-12 w-12 border-2 border-pastel-pink">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback className="bg-pastel-lavender text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="ml-3">
            <h4 className="font-serif font-medium text-base">{name}</h4>
            <p className="text-sm text-muted-foreground">{role}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestimonialCard;
