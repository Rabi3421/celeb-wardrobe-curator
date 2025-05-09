
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Instagram, Twitter } from "lucide-react";

interface SocialFeedCardProps {
  platform: "instagram" | "twitter";
  username: string;
  content: string;
  image?: string;
  date: string;
  link: string;
}

const SocialFeedCard: React.FC<SocialFeedCardProps> = ({
  platform,
  username,
  content,
  image,
  date,
  link,
}) => {
  return (
    <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300">
      <CardContent className="p-4">
        <div className="flex items-center mb-3">
          {platform === "instagram" ? (
            <Instagram className="h-5 w-5 mr-2 text-primary-foreground" />
          ) : (
            <Twitter className="h-5 w-5 mr-2 text-primary-foreground" />
          )}
          <span className="font-medium">{username}</span>
        </div>
        
        {image && (
          <div className="mb-3 rounded-lg overflow-hidden">
            <img
              src={image}
              alt={`${platform} post by ${username}`}
              className="w-full h-auto"
            />
          </div>
        )}
        
        <p className="text-sm mb-2">{content}</p>
        
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <span>{date}</span>
          <a 
            href={link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary-foreground hover:underline"
          >
            View Post
          </a>
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialFeedCard;
