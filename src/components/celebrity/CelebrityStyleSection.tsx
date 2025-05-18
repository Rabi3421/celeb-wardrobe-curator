
import React from "react";
import { Celebrity } from "@/types/data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Heart, User } from "lucide-react";

interface CelebrityStyleSectionProps {
  celebrity: Celebrity;
}

const CelebrityStyleSection: React.FC<CelebrityStyleSectionProps> = ({ celebrity }) => {
  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-pastel-lavender/30 to-pastel-blue/30 p-8 rounded-xl mb-8">
        <h2 className="font-serif text-2xl font-medium mb-4">Style Analysis</h2>
        <p className="mb-8 text-lg leading-relaxed">
          {celebrity.name}'s distinctive fashion sense combines classic elegance with contemporary trends.
          Known for bold color choices and avant-garde accessories, their style has evolved from early career
          minimalism to the current sophisticated aesthetic that influences fashion globally.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white/80 border-none shadow">
            <CardContent className="p-6">
              <h3 className="font-medium mb-2 flex items-center">
                <Star className="h-4 w-4 text-yellow-400 mr-2" />
                Signature Look
              </h3>
              <p className="text-muted-foreground">
                Monochromatic outfits with statement accessories and perfectly tailored silhouettes.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white/80 border-none shadow">
            <CardContent className="p-6">
              <h3 className="font-medium mb-2 flex items-center">
                <Heart className="h-4 w-4 text-red-400 mr-2" />
                Favorite Designers
              </h3>
              <p className="text-muted-foreground">
                Regularly spotted wearing Valentino, Chanel, and emerging sustainable brands.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white/80 border-none shadow">
            <CardContent className="p-6">
              <h3 className="font-medium mb-2 flex items-center">
                <User className="h-4 w-4 text-blue-400 mr-2" />
                Style Influence
              </h3>
              <p className="text-muted-foreground">
                Has inspired countless trends including layered minimalism and architectural accessories.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="border-none shadow">
          <CardContent className="p-6">
            <h3 className="font-serif text-xl font-medium mb-4">Color Palette</h3>
            <div className="flex flex-wrap gap-3 mb-4">
              {['bg-red-400', 'bg-blue-400', 'bg-green-400', 'bg-purple-400', 'bg-yellow-400'].map((color, idx) => (
                <div key={idx} className={`w-10 h-10 rounded-full ${color} shadow-sm`}></div>
              ))}
            </div>
            <p className="text-muted-foreground">
              {celebrity.name} gravitates toward bold, saturated colors with occasional neutral basics.
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow">
          <CardContent className="p-6">
            <h3 className="font-serif text-xl font-medium mb-4">Style Evolution</h3>
            <div className="space-y-5">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">2018</span>
                  <span className="text-sm font-medium">Early Career • Minimal</span>
                </div>
                <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-pastel-mint to-pastel-blue h-2 rounded-full" style={{width: '30%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">2020</span>
                  <span className="text-sm font-medium">Breakthrough • Experimental</span>
                </div>
                <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-pastel-mint to-pastel-blue h-2 rounded-full" style={{width: '60%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">2025</span>
                  <span className="text-sm font-medium">Current • Refined</span>
                </div>
                <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-pastel-mint to-pastel-blue h-2 rounded-full" style={{width: '90%'}}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <Card className="border-none shadow">
          <CardContent className="p-6">
            <h3 className="font-serif text-xl font-medium mb-4">Style Categories</h3>
            <div className="flex flex-wrap gap-2">
              <Badge className="px-3 py-1 bg-pastel-mint text-primary-foreground border-none">Elegant</Badge>
              <Badge className="px-3 py-1 bg-pastel-blue text-primary-foreground border-none">Contemporary</Badge>
              <Badge className="px-3 py-1 bg-pastel-lavender text-primary-foreground border-none">Minimalist</Badge>
              <Badge className="px-3 py-1 bg-pastel-pink text-primary-foreground border-none">Avant-garde</Badge>
              <Badge className="px-3 py-1 bg-pastel-yellow text-primary-foreground border-none">Sustainable</Badge>
              <Badge className="px-3 py-1 bg-muted text-foreground border-none">High Fashion</Badge>
              <Badge className="px-3 py-1 bg-muted text-foreground border-none">Streetwear</Badge>
              <Badge className="px-3 py-1 bg-muted text-foreground border-none">Classic</Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow">
          <CardContent className="p-6">
            <h3 className="font-serif text-xl font-medium mb-4">Fashion Philosophy</h3>
            <blockquote className="italic border-l-4 border-primary pl-4 py-2 mb-4">
              "Fashion is a form of self-expression. It's about finding pieces that make you feel confident and tell your story without words."
            </blockquote>
            <p className="text-muted-foreground">
              {celebrity.name}'s approach to fashion combines personal comfort with boundary-pushing creativity, always staying true to their authentic style while embracing innovation.
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card className="border-none shadow mt-8">
        <CardContent className="p-6">
          <h3 className="font-serif text-xl font-medium mb-4">Iconic Style Moments</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="group relative overflow-hidden rounded-md aspect-[3/4] bg-muted">
                <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/70 to-transparent text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="font-medium">Met Gala {2020 + i}</span>
                  <span className="text-sm">Designer: Iconic Fashion House</span>
                </div>
                <div className="w-full h-full bg-gradient-to-br from-pastel-lavender/30 to-pastel-blue/30"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CelebrityStyleSection;
