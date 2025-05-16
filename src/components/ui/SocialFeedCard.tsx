
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Instagram, Twitter, MessageSquare, Heart, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

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
    <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800 rounded-xl animate-fade-in">
      <CardContent className="p-0">
        {/* Card Header with Platform Icon and Username */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {platform === "instagram" ? (
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-500 rounded-full blur-[1px]"></div>
                <div className="relative bg-white dark:bg-gray-800 rounded-full p-1.5">
                  <Instagram className="h-4 w-4 text-pink-600" />
                </div>
              </div>
            ) : (
              <div className="relative">
                <div className="absolute inset-0 bg-blue-400 rounded-full blur-[1px]"></div>
                <div className="relative bg-white dark:bg-gray-800 rounded-full p-1.5">
                  <Twitter className="h-4 w-4 text-blue-400" />
                </div>
              </div>
            )}
            <span className="font-medium text-sm">{username}</span>
          </div>
          
          <span className="text-xs text-gray-500 dark:text-gray-400">{date}</span>
        </div>
        
        {/* Image Content */}
        {image && (
          <div className="relative">
            <img
              src={image}
              alt={`${platform} post by ${username}`}
              className="w-full aspect-square object-cover"
              loading="lazy"
            />
            <div className={cn(
              "absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center",
              "bg-black/20 backdrop-blur-[1px]"
            )}>
              <a 
                href={link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/90 hover:bg-white text-gray-900 font-medium px-4 py-2 rounded-full text-sm transition-all"
                aria-label="View original post"
              >
                View Original
              </a>
            </div>
          </div>
        )}
        
        {/* Post Content */}
        <div className="p-4">
          <p className={cn(
            "text-sm mb-3", 
            !image && "border-l-4 pl-3 italic",
            platform === "instagram" ? "border-pink-400" : "border-blue-400"
          )}>
            {content}
          </p>
          
          {/* Social Interaction Buttons */}
          <div className="flex items-center justify-between mt-4 pt-2 border-t border-gray-100 dark:border-gray-700">
            <div className="flex gap-4">
              <button className="flex items-center gap-1.5 text-gray-500 hover:text-red-500 transition-colors">
                <Heart className="h-4 w-4" />
                <span className="text-xs">24</span>
              </button>
              <button className="flex items-center gap-1.5 text-gray-500 hover:text-blue-500 transition-colors">
                <MessageSquare className="h-4 w-4" />
                <span className="text-xs">3</span>
              </button>
              <button className="flex items-center gap-1.5 text-gray-500 hover:text-green-500 transition-colors">
                <Share2 className="h-4 w-4" />
              </button>
            </div>
            
            <a 
              href={link} 
              target="_blank" 
              rel="noopener noreferrer"
              className={cn(
                "text-xs font-medium transition-colors",
                platform === "instagram" ? "text-pink-600 hover:text-pink-700" : "text-blue-500 hover:text-blue-600"
              )}
            >
              View Post
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialFeedCard;
