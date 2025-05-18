import React from "react";
import { Celebrity } from "@/types/data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  MapPin, 
  Instagram, 
  Twitter, 
  Facebook, 
  GraduationCap,
  Link,
  Award,
  User as UserIcon
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface CelebrityInfoSectionProps {
  celebrity: Celebrity;
}

const CelebrityInfoSection: React.FC<CelebrityInfoSectionProps> = ({ celebrity }) => {
  // Format birthdate if available
  const formatBirthDate = (dateString: string | undefined) => {
    if (!dateString) return "Not available";
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };
  
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Biography */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white border-none shadow-md overflow-hidden">
            <CardContent className="p-6 space-y-6">
              <div>
                <h2 className="text-2xl font-serif font-medium mb-4">Biography</h2>
                <p className="text-muted-foreground leading-relaxed">{celebrity.bio}</p>
              </div>

              {celebrity.careerHighlights && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-xl font-medium mb-3">Career Highlights</h3>
                    <div className="prose prose-stone max-w-none">
                      <p className="text-muted-foreground whitespace-pre-line">{celebrity.careerHighlights}</p>
                    </div>
                  </div>
                </>
              )}
              
              {celebrity.personalLife && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-xl font-medium mb-3">Personal Life</h3>
                    <p className="text-muted-foreground whitespace-pre-line">{celebrity.personalLife}</p>
                  </div>
                </>
              )}
              
              {celebrity.awards && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-xl font-medium mb-3">Awards & Recognition</h3>
                    <div className="flex items-center mb-3">
                      <Award className="h-5 w-5 text-amber-500 mr-2" />
                      <span className="font-medium">Notable Achievements</span>
                    </div>
                    <p className="text-muted-foreground whitespace-pre-line">{celebrity.awards}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
          
          {/* Interesting Facts */}
          {celebrity.interestingFacts && (
            <Card className="bg-gradient-to-r from-pastel-mint/30 to-pastel-blue/20 border-none shadow-md overflow-hidden">
              <CardContent className="p-6">
                <h3 className="text-xl font-medium mb-4">Interesting Facts</h3>
                <p className="text-muted-foreground whitespace-pre-line">{celebrity.interestingFacts}</p>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Quick Info */}
        <div className="space-y-6">
          <Card className="bg-white border-none shadow-md overflow-hidden">
            <CardContent className="p-6">
              <h3 className="text-xl font-medium mb-4">Quick Info</h3>
              
              <ul className="space-y-4">
                {celebrity.birthdate && (
                  <li className="flex items-start">
                    <Calendar className="h-5 w-5 text-primary mr-3 mt-0.5" />
                    <div>
                      <span className="block text-sm text-muted-foreground">Born</span>
                      <span className="font-medium">{formatBirthDate(celebrity.birthdate)}</span>
                    </div>
                  </li>
                )}
                
                {celebrity.birthplace && (
                  <li className="flex items-start">
                    <MapPin className="h-5 w-5 text-primary mr-3 mt-0.5" />
                    <div>
                      <span className="block text-sm text-muted-foreground">Birthplace</span>
                      <span className="font-medium">{celebrity.birthplace}</span>
                    </div>
                  </li>
                )}
                
                {celebrity.height && (
                  <li className="flex items-start">
                    <UserIcon className="h-5 w-5 text-primary mr-3 mt-0.5" />
                    <div>
                      <span className="block text-sm text-muted-foreground">Height</span>
                      <span className="font-medium">{celebrity.height}</span>
                    </div>
                  </li>
                )}
                
                {celebrity.education && (
                  <li className="flex items-start">
                    <GraduationCap className="h-5 w-5 text-primary mr-3 mt-0.5" />
                    <div>
                      <span className="block text-sm text-muted-foreground">Education</span>
                      <span className="font-medium">{celebrity.education}</span>
                    </div>
                  </li>
                )}
                
                <li className="flex items-start">
                  <Badge className="mr-3 mt-0.5" variant="outline">
                    {celebrity.styleType}
                  </Badge>
                  <div>
                    <span className="block text-sm text-muted-foreground">Style Type</span>
                    <span className="font-medium">{celebrity.styleType}</span>
                  </div>
                </li>
              </ul>
              
              <Separator className="my-5" />
              
              {/* Social Media Links */}
              <h4 className="text-lg font-medium mb-4">Social Media</h4>
              <div className="flex flex-wrap gap-3">
                {celebrity.socialMedia?.instagram && (
                  <Button variant="outline" size="sm" className="gap-2" asChild>
                    <a href={celebrity.socialMedia.instagram} target="_blank" rel="noopener noreferrer">
                      <Instagram className="h-4 w-4" />
                      Instagram
                    </a>
                  </Button>
                )}
                
                {celebrity.socialMedia?.twitter && (
                  <Button variant="outline" size="sm" className="gap-2" asChild>
                    <a href={celebrity.socialMedia.twitter} target="_blank" rel="noopener noreferrer">
                      <Twitter className="h-4 w-4" />
                      Twitter
                    </a>
                  </Button>
                )}
                
                {celebrity.socialMedia?.facebook && (
                  <Button variant="outline" size="sm" className="gap-2" asChild>
                    <a href={celebrity.socialMedia.facebook} target="_blank" rel="noopener noreferrer">
                      <Facebook className="h-4 w-4" />
                      Facebook
                    </a>
                  </Button>
                )}
                
                {celebrity.socialMedia?.website && (
                  <Button variant="outline" size="sm" className="gap-2" asChild>
                    <a href={celebrity.socialMedia.website} target="_blank" rel="noopener noreferrer">
                      <Link className="h-4 w-4" />
                      Website
                    </a>
                  </Button>
                )}
                
                {(!celebrity.socialMedia?.instagram && 
                  !celebrity.socialMedia?.twitter && 
                  !celebrity.socialMedia?.facebook && 
                  !celebrity.socialMedia?.website) && (
                  <p className="text-muted-foreground text-sm">No social media links available</p>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Fashion Influence */}
          <Card className="bg-gradient-to-r from-pastel-lavender/40 to-pastel-blue/30 border-none shadow-md overflow-hidden">
            <CardContent className="p-6">
              <h3 className="text-xl font-medium mb-3">Fashion Influence</h3>
              <p className="text-muted-foreground mb-4">
                {celebrity.name} has made a significant impact on {celebrity.styleType.toLowerCase()} fashion.
              </p>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Trend Setting</span>
                  <span className="text-sm">85%</span>
                </div>
                <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                  <div className="bg-primary h-2 rounded-full" style={{width: '85%'}}></div>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Style Innovation</span>
                  <span className="text-sm">92%</span>
                </div>
                <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                  <div className="bg-primary h-2 rounded-full" style={{width: '92%'}}></div>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Brand Collaborations</span>
                  <span className="text-sm">78%</span>
                </div>
                <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                  <div className="bg-primary h-2 rounded-full" style={{width: '78%'}}></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CelebrityInfoSection;
