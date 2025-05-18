
import React from "react";
import { Celebrity } from "@/types/data";

interface CelebrityTimelineSectionProps {
  celebrity: Celebrity;
}

const CelebrityTimelineSection: React.FC<CelebrityTimelineSectionProps> = ({ celebrity }) => {
  return (
    <div className="space-y-8">
      <h2 className="font-serif text-2xl font-medium mb-6">Fashion Timeline</h2>
      <div className="relative border-l-2 border-primary/30 ml-6">
        {[2023, 2024, 2025].map((year, idx) => (
          <div key={idx} className="mb-12 ml-10">
            <div className="absolute w-8 h-8 bg-primary rounded-full -left-4 border-4 border-background flex items-center justify-center text-white text-xs font-bold">
              {idx + 1}
            </div>
            <div className="bg-gradient-to-r from-white to-pastel-blue/10 rounded-lg p-6 shadow-sm">
              <time className="inline-block mb-1 text-sm font-normal leading-none px-3 py-1 bg-pastel-blue/30 rounded-full">{year}</time>
              <h3 className="font-serif text-xl font-medium mt-2 mb-3">
                {year === 2025 ? "Modern Minimalism" : 
                year === 2024 ? "Sustainable Fashion Era" : "Bold Statement Period"}
              </h3>
              <p className="mb-5 text-muted-foreground">
                {year === 2025 ? 
                  "Embraced clean lines and sustainable materials while maintaining a bold color palette." :
                year === 2024 ? 
                  "Shifted to eco-conscious brands and vintage pieces, influencing sustainable fashion trends." :
                  "Known for experimental silhouettes and vibrant color blocking that defined red carpet appearances."}
              </p>
              <div className="grid grid-cols-3 gap-3 mt-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="aspect-square bg-muted rounded-md overflow-hidden shadow-sm">
                    <div className="w-full h-full bg-gradient-to-br from-pastel-lavender/20 to-pastel-blue/20"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-gradient-to-r from-pastel-mint/30 to-pastel-blue/20 p-6 rounded-lg shadow-sm mt-8">
        <h3 className="font-serif text-xl font-medium mb-4">Style Journey Overview</h3>
        <p className="text-muted-foreground">
          {celebrity.name}'s fashion evolution reflects broader trends in the industry while maintaining a distinctive personal aesthetic. 
          Starting with more conventional looks early in their career, they've gradually developed a signature style that blends classic silhouettes with modern details.
          Their willingness to experiment with emerging designers and sustainable brands has positioned them as both a style icon and an industry influencer.
        </p>
      </div>
    </div>
  );
};

export default CelebrityTimelineSection;
