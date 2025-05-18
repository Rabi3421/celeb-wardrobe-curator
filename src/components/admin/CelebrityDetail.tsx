import React from 'react';
import { Celebrity } from '@/types/data';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Award, Calendar, Globe, Image, Info, Star, 
  Camera, Instagram, Twitter, Facebook, Youtube, 
  Link, DollarSign, User, Languages
} from 'lucide-react';

interface CelebrityDetailProps {
  celebrity: Celebrity;
}

const CelebrityDetail: React.FC<CelebrityDetailProps> = ({ celebrity }) => {
  return (
    <Card className="p-6">
      <div className="mb-6 flex items-start gap-4">
        {celebrity.image && (
          <img 
            src={celebrity.image} 
            alt={celebrity.name} 
            className="w-24 h-24 object-cover rounded-md"
          />
        )}
        <div>
          <h2 className="text-2xl font-bold">{celebrity.name}</h2>
          <p className="text-gray-500">{celebrity.category} • {celebrity.styleType}</p>
          {celebrity.nationality && <p className="text-sm"><Globe className="inline h-4 w-4 mr-1" /> {celebrity.nationality}</p>}
        </div>
      </div>
      
      <Tabs defaultValue="basic">
        <TabsList className="grid grid-cols-6 mb-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="bio">Biography</TabsTrigger>
          <TabsTrigger value="career">Career & Personal</TabsTrigger>
          <TabsTrigger value="style">Style & Fashion</TabsTrigger>
          <TabsTrigger value="additional">Additional Info</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic">
          <div className="grid gap-4">
            {celebrity.bio && (
              <div>
                <h3 className="font-semibold mb-1 flex items-center">
                  <Info className="h-4 w-4 mr-2" /> Bio
                </h3>
                <p>{celebrity.bio}</p>
              </div>
            )}
            
            {celebrity.category && (
              <div>
                <h3 className="font-semibold mb-1 flex items-center">
                  <Info className="h-4 w-4 mr-2" /> Category
                </h3>
                <p>{celebrity.category}</p>
              </div>
            )}
            
            {celebrity.styleType && (
              <div>
                <h3 className="font-semibold mb-1 flex items-center">
                  <Star className="h-4 w-4 mr-2" /> Style Type
                </h3>
                <p>{celebrity.styleType}</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="bio">
          <div className="grid gap-4">
            {celebrity.birthdate && (
              <div>
                <h3 className="font-semibold mb-1 flex items-center">
                  <Calendar className="h-4 w-4 mr-2" /> Birthdate
                </h3>
                <p>{celebrity.birthdate}</p>
              </div>
            )}
            
            {celebrity.birthplace && (
              <div>
                <h3 className="font-semibold mb-1 flex items-center">
                  <Globe className="h-4 w-4 mr-2" /> Birthplace
                </h3>
                <p>{celebrity.birthplace}</p>
              </div>
            )}
            
            {celebrity.nationality && (
              <div>
                <h3 className="font-semibold mb-1 flex items-center">
                  <Globe className="h-4 w-4 mr-2" /> Nationality
                </h3>
                <p>{celebrity.nationality}</p>
              </div>
            )}
            
            {celebrity.height && (
              <div>
                <h3 className="font-semibold mb-1 flex items-center">
                  <User className="h-4 w-4 mr-2" /> Height
                </h3>
                <p>{celebrity.height}</p>
              </div>
            )}
            
            {celebrity.zodiacSign && (
              <div>
                <h3 className="font-semibold mb-1 flex items-center">
                  <Star className="h-4 w-4 mr-2" /> Zodiac Sign
                </h3>
                <p>{celebrity.zodiacSign}</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="career">
          <div className="grid gap-4">
            {celebrity.education && (
              <div>
                <h3 className="font-semibold mb-1 flex items-center">
                  <Info className="h-4 w-4 mr-2" /> Education
                </h3>
                <p>{celebrity.education}</p>
              </div>
            )}
            
            {celebrity.careerHighlights && (
              <div>
                <h3 className="font-semibold mb-1 flex items-center">
                  <Star className="h-4 w-4 mr-2" /> Career Highlights
                </h3>
                <p>{celebrity.careerHighlights}</p>
              </div>
            )}
            
            {celebrity.awards && (
              <div>
                <h3 className="font-semibold mb-1 flex items-center">
                  <Award className="h-4 w-4 mr-2" /> Awards
                </h3>
                <p>{celebrity.awards}</p>
              </div>
            )}
            
            {celebrity.personalLife && (
              <div>
                <h3 className="font-semibold mb-1 flex items-center">
                  <User className="h-4 w-4 mr-2" /> Personal Life
                </h3>
                <p>{celebrity.personalLife}</p>
              </div>
            )}
            
            {celebrity.languages && (
              <div>
                <h3 className="font-semibold mb-1 flex items-center">
                  <Languages className="h-4 w-4 mr-2" /> Languages
                </h3>
                <p>{celebrity.languages}</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="style">
          <div className="grid gap-4">
            {celebrity.signature?.look && (
              <div>
                <h3 className="font-semibold mb-1 flex items-center">
                  <Image className="h-4 w-4 mr-2" /> Signature Look
                </h3>
                <p>{celebrity.signature.look}</p>
              </div>
            )}
            
            {celebrity.signature?.accessories && (
              <div>
                <h3 className="font-semibold mb-1 flex items-center">
                  <Star className="h-4 w-4 mr-2" /> Signature Accessories
                </h3>
                <p>{celebrity.signature.accessories}</p>
              </div>
            )}
            
            {celebrity.signature?.designers && (
              <div>
                <h3 className="font-semibold mb-1 flex items-center">
                  <User className="h-4 w-4 mr-2" /> Favorite Designers
                </h3>
                <p>{celebrity.signature.designers}</p>
              </div>
            )}
            
            {celebrity.signature?.perfume && (
              <div>
                <h3 className="font-semibold mb-1 flex items-center">
                  <Star className="h-4 w-4 mr-2" /> Signature Perfume
                </h3>
                <p>{celebrity.signature.perfume}</p>
              </div>
            )}
            
            {celebrity.styleEvolution && (
              <div>
                <h3 className="font-semibold mb-1 flex items-center">
                  <Camera className="h-4 w-4 mr-2" /> Style Evolution
                </h3>
                <p>{celebrity.styleEvolution}</p>
              </div>
            )}
            
            {celebrity.measurements && (
              <div>
                <h3 className="font-semibold mb-1 flex items-center">
                  <User className="h-4 w-4 mr-2" /> Measurements
                </h3>
                <p>{celebrity.measurements}</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="additional">
          <div className="grid gap-4">
            {celebrity.netWorth && (
              <div>
                <h3 className="font-semibold mb-1 flex items-center">
                  <DollarSign className="h-4 w-4 mr-2" /> Net Worth
                </h3>
                <p>{celebrity.netWorth}</p>
              </div>
            )}
            
            {celebrity.philanthropyWork && (
              <div>
                <h3 className="font-semibold mb-1 flex items-center">
                  <Award className="h-4 w-4 mr-2" /> Philanthropy Work
                </h3>
                <p>{celebrity.philanthropyWork}</p>
              </div>
            )}
            
            {celebrity.businessVentures && (
              <div>
                <h3 className="font-semibold mb-1 flex items-center">
                  <DollarSign className="h-4 w-4 mr-2" /> Business Ventures
                </h3>
                <p>{celebrity.businessVentures}</p>
              </div>
            )}
            
            {celebrity.controversies && (
              <div>
                <h3 className="font-semibold mb-1 flex items-center">
                  <Info className="h-4 w-4 mr-2" /> Controversies
                </h3>
                <p>{celebrity.controversies}</p>
              </div>
            )}
            
            {celebrity.fanbaseNickname && (
              <div>
                <h3 className="font-semibold mb-1 flex items-center">
                  <User className="h-4 w-4 mr-2" /> Fanbase Nickname
                </h3>
                <p>{celebrity.fanbaseNickname}</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="social">
          <div className="grid gap-4">
            {celebrity.socialMedia?.instagram && (
              <div>
                <h3 className="font-semibold mb-1 flex items-center">
                  <Instagram className="h-4 w-4 mr-2" /> Instagram
                </h3>
                <a href={celebrity.socialMedia.instagram.startsWith('http') 
                  ? celebrity.socialMedia.instagram 
                  : `https://instagram.com/${celebrity.socialMedia.instagram}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {celebrity.socialMedia.instagram}
                </a>
              </div>
            )}
            
            {celebrity.socialMedia?.twitter && (
              <div>
                <h3 className="font-semibold mb-1 flex items-center">
                  <Twitter className="h-4 w-4 mr-2" /> Twitter
                </h3>
                <a href={celebrity.socialMedia.twitter.startsWith('http') 
                  ? celebrity.socialMedia.twitter 
                  : `https://twitter.com/${celebrity.socialMedia.twitter}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {celebrity.socialMedia.twitter}
                </a>
              </div>
            )}
            
            {celebrity.socialMedia?.facebook && (
              <div>
                <h3 className="font-semibold mb-1 flex items-center">
                  <Facebook className="h-4 w-4 mr-2" /> Facebook
                </h3>
                <a href={celebrity.socialMedia.facebook}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {celebrity.socialMedia.facebook}
                </a>
              </div>
            )}
            
            {celebrity.socialMedia?.youtube && (
              <div>
                <h3 className="font-semibold mb-1 flex items-center">
                  <Youtube className="h-4 w-4 mr-2" /> YouTube
                </h3>
                <a href={celebrity.socialMedia.youtube}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {celebrity.socialMedia.youtube}
                </a>
              </div>
            )}
            
            {celebrity.socialMedia?.tiktok && (
              <div>
                <h3 className="font-semibold mb-1 flex items-center">
                  <Twitter className="h-4 w-4 mr-2" /> TikTok
                </h3>
                <a href={celebrity.socialMedia.tiktok.startsWith('http') 
                  ? celebrity.socialMedia.tiktok 
                  : `https://tiktok.com/@${celebrity.socialMedia.tiktok}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {celebrity.socialMedia.tiktok}
                </a>
              </div>
            )}
            
            {celebrity.socialMedia?.website && (
              <div>
                <h3 className="font-semibold mb-1 flex items-center">
                  <Link className="h-4 w-4 mr-2" /> Website
                </h3>
                <a href={celebrity.socialMedia.website}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {celebrity.socialMedia.website}
                </a>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default CelebrityDetail;
