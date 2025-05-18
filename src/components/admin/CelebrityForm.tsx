import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Award, Calendar, Globe, Image, Info, Star,
  Camera, Instagram, Twitter, Facebook, Youtube, TikTok, 
  Link as LinkIcon, DollarSign, User, Languages
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Celebrity } from '@/types/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { addCelebrity } from '@/services/api';
import { generateSlug } from '@/services/api';

interface CelebrityFormProps {
  onSuccess: () => void;
}

const CelebrityForm: React.FC<CelebrityFormProps> = ({ onSuccess }) => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [formState, setFormState] = useState<Partial<Celebrity>>({
    name: '',
    image: '',
    bio: '',
    category: '',
    styleType: '',
    socialMedia: {
      instagram: '',
      twitter: '',
      facebook: '',
      youtube: '',
      tiktok: '',
      website: ''
    },
    signature: {
      look: '',
      accessories: '',
      designers: '',
      perfume: ''
    }
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle nested objects
    if (name.includes('.')) {
      const [parentKey, childKey] = name.split('.');
      setFormState(prev => ({
        ...prev,
        [parentKey]: {
          ...prev[parentKey as keyof Celebrity] as any,
          [childKey]: value
        }
      }));
    } else {
      setFormState(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    
    try {
      // Generate a unique filename
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = `celebrities/${fileName}`;
      
      // Upload the file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('images')
        .upload(filePath, file);
      
      if (error) {
        throw error;
      }
      
      // Get the public URL for the uploaded image
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);
      
      // Update the form state with the image URL
      setFormState(prev => ({
        ...prev,
        image: publicUrl
      }));
      
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Generate a slug for the celebrity if not provided
      if (!formState.slug && formState.name) {
        formState.slug = generateSlug(formState.name);
      }
      
      const result = await addCelebrity(formState);
      
      if (result.success) {
        toast.success('Celebrity added successfully');
        onSuccess();
        setFormState({
          name: '',
          image: '',
          bio: '',
          category: '',
          styleType: '',
          socialMedia: {
            instagram: '',
            twitter: '',
            facebook: '',
            youtube: '',
            tiktok: '',
            website: ''
          },
          signature: {
            look: '',
            accessories: '',
            designers: '',
            perfume: ''
          }
        });
      } else {
        toast.error(`Failed to add celebrity: ${result.error}`);
      }
    } catch (error) {
      console.error('Error adding celebrity:', error);
      toast.error('An unexpected error occurred');
    }
  };
  
  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="basic">
          <TabsList className="grid grid-cols-6 mb-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="bio">Biography</TabsTrigger>
            <TabsTrigger value="career">Career & Personal</TabsTrigger>
            <TabsTrigger value="style">Style & Fashion</TabsTrigger>
            <TabsTrigger value="additional">Additional Info</TabsTrigger>
            <TabsTrigger value="social">Social Media</TabsTrigger>
          </TabsList>
          
          {/* Basic Info Tab */}
          <TabsContent value="basic">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">
                  <User className="inline mr-2 h-4 w-4" />
                  Name
                </Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={formState.name || ''} 
                  onChange={handleChange} 
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="image">
                  <Image className="inline mr-2 h-4 w-4" />
                  Image
                </Label>
                <Input 
                  id="image" 
                  name="image" 
                  value={formState.image || ''} 
                  onChange={handleChange} 
                  placeholder="Image URL or upload below"
                />
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                />
                {isUploading && <p className="text-sm text-gray-500">Uploading...</p>}
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="category">
                  <Info className="inline mr-2 h-4 w-4" />
                  Category
                </Label>
                <select 
                  id="category" 
                  name="category" 
                  value={formState.category || ''} 
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Select Category</option>
                  <option value="Actor">Actor</option>
                  <option value="Musician">Musician</option>
                  <option value="Model">Model</option>
                  <option value="Athlete">Athlete</option>
                  <option value="Influencer">Influencer</option>
                  <option value="Fashion Icon">Fashion Icon</option>
                </select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="styleType">
                  <Star className="inline mr-2 h-4 w-4" />
                  Style Type
                </Label>
                <Input 
                  id="styleType" 
                  name="styleType" 
                  value={formState.styleType || ''} 
                  onChange={handleChange} 
                  placeholder="e.g., Chic, Elegant, Streetwear"
                />
              </div>
            </div>
          </TabsContent>
          
          {/* Biography Tab */}
          <TabsContent value="bio">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="bio">
                  <Info className="inline mr-2 h-4 w-4" />
                  Bio
                </Label>
                <Textarea 
                  id="bio" 
                  name="bio" 
                  value={formState.bio || ''} 
                  onChange={handleChange} 
                  rows={3}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="birthdate">
                  <Calendar className="inline mr-2 h-4 w-4" />
                  Birthdate
                </Label>
                <Input 
                  id="birthdate" 
                  name="birthdate" 
                  type="date"
                  value={formState.birthdate || ''} 
                  onChange={handleChange} 
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="birthplace">
                  <Globe className="inline mr-2 h-4 w-4" />
                  Birthplace
                </Label>
                <Input 
                  id="birthplace" 
                  name="birthplace" 
                  value={formState.birthplace || ''} 
                  onChange={handleChange} 
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="nationality">
                  <Globe className="inline mr-2 h-4 w-4" />
                  Nationality
                </Label>
                <Input 
                  id="nationality" 
                  name="nationality" 
                  value={formState.nationality || ''} 
                  onChange={handleChange} 
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="height">
                  <User className="inline mr-2 h-4 w-4" />
                  Height
                </Label>
                <Input 
                  id="height" 
                  name="height" 
                  value={formState.height || ''} 
                  onChange={handleChange} 
                  placeholder="e.g., 5'10\" or 178cm"
                />
              </div>
            </div>
          </TabsContent>
          
          {/* Career & Personal Tab */}
          <TabsContent value="career">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="education">
                  <Info className="inline mr-2 h-4 w-4" />
                  Education
                </Label>
                <Textarea 
                  id="education" 
                  name="education" 
                  value={formState.education || ''} 
                  onChange={handleChange} 
                  rows={2}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="careerHighlights">
                  <Star className="inline mr-2 h-4 w-4" />
                  Career Highlights
                </Label>
                <Textarea 
                  id="careerHighlights" 
                  name="careerHighlights" 
                  value={formState.careerHighlights || ''} 
                  onChange={handleChange} 
                  rows={3}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="awards">
                  <Award className="inline mr-2 h-4 w-4" />
                  Awards
                </Label>
                <Textarea 
                  id="awards" 
                  name="awards" 
                  value={formState.awards || ''} 
                  onChange={handleChange} 
                  rows={2}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="personalLife">
                  <User className="inline mr-2 h-4 w-4" />
                  Personal Life
                </Label>
                <Textarea 
                  id="personalLife" 
                  name="personalLife" 
                  value={formState.personalLife || ''} 
                  onChange={handleChange} 
                  rows={3}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="languages">
                  <Languages className="inline mr-2 h-4 w-4" />
                  Languages
                </Label>
                <Input 
                  id="languages" 
                  name="languages" 
                  value={formState.languages || ''} 
                  onChange={handleChange} 
                  placeholder="e.g., English, Spanish, French"
                />
              </div>
            </div>
          </TabsContent>
          
          {/* Style & Fashion Tab */}
          <TabsContent value="style">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="signature.look">
                  <Image className="inline mr-2 h-4 w-4" />
                  Signature Look
                </Label>
                <Input 
                  id="signature.look" 
                  name="signature.look" 
                  value={formState.signature?.look || ''} 
                  onChange={handleChange} 
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="signature.accessories">
                  <Star className="inline mr-2 h-4 w-4" />
                  Signature Accessories
                </Label>
                <Input 
                  id="signature.accessories" 
                  name="signature.accessories" 
                  value={formState.signature?.accessories || ''} 
                  onChange={handleChange} 
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="signature.designers">
                  <User className="inline mr-2 h-4 w-4" />
                  Favorite Designers
                </Label>
                <Input 
                  id="signature.designers" 
                  name="signature.designers" 
                  value={formState.signature?.designers || ''} 
                  onChange={handleChange} 
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="signature.perfume">
                  <Star className="inline mr-2 h-4 w-4" />
                  Signature Perfume
                </Label>
                <Input 
                  id="signature.perfume" 
                  name="signature.perfume" 
                  value={formState.signature?.perfume || ''} 
                  onChange={handleChange} 
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="styleEvolution">
                  <Camera className="inline mr-2 h-4 w-4" />
                  Style Evolution
                </Label>
                <Textarea 
                  id="styleEvolution" 
                  name="styleEvolution" 
                  value={formState.styleEvolution || ''} 
                  onChange={handleChange} 
                  rows={3}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="measurements">
                  <User className="inline mr-2 h-4 w-4" />
                  Measurements
                </Label>
                <Input 
                  id="measurements" 
                  name="measurements" 
                  value={formState.measurements || ''} 
                  onChange={handleChange} 
                />
              </div>
            </div>
          </TabsContent>
          
          {/* Additional Info Tab */}
          <TabsContent value="additional">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="netWorth">
                  <DollarSign className="inline mr-2 h-4 w-4" />
                  Net Worth
                </Label>
                <Input 
                  id="netWorth" 
                  name="netWorth" 
                  value={formState.netWorth || ''} 
                  onChange={handleChange} 
                  placeholder="e.g., $10 Million"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="zodiacSign">
                  <Star className="inline mr-2 h-4 w-4" />
                  Zodiac Sign
                </Label>
                <Input 
                  id="zodiacSign" 
                  name="zodiacSign" 
                  value={formState.zodiacSign || ''} 
                  onChange={handleChange} 
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="philanthropyWork">
                  <Award className="inline mr-2 h-4 w-4" />
                  Philanthropy Work
                </Label>
                <Textarea 
                  id="philanthropyWork" 
                  name="philanthropyWork" 
                  value={formState.philanthropyWork || ''} 
                  onChange={handleChange} 
                  rows={2}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="businessVentures">
                  <DollarSign className="inline mr-2 h-4 w-4" />
                  Business Ventures
                </Label>
                <Textarea 
                  id="businessVentures" 
                  name="businessVentures" 
                  value={formState.businessVentures || ''} 
                  onChange={handleChange} 
                  rows={2}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="controversies">
                  <Info className="inline mr-2 h-4 w-4" />
                  Controversies
                </Label>
                <Textarea 
                  id="controversies" 
                  name="controversies" 
                  value={formState.controversies || ''} 
                  onChange={handleChange} 
                  rows={2}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="fanbaseNickname">
                  <User className="inline mr-2 h-4 w-4" />
                  Fanbase Nickname
                </Label>
                <Input 
                  id="fanbaseNickname" 
                  name="fanbaseNickname" 
                  value={formState.fanbaseNickname || ''} 
                  onChange={handleChange} 
                />
              </div>
            </div>
          </TabsContent>
          
          {/* Social Media Tab */}
          <TabsContent value="social">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="socialMedia.instagram">
                  <Instagram className="inline mr-2 h-4 w-4" />
                  Instagram
                </Label>
                <Input 
                  id="socialMedia.instagram" 
                  name="socialMedia.instagram" 
                  value={formState.socialMedia?.instagram || ''} 
                  onChange={handleChange} 
                  placeholder="Instagram username or URL"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="socialMedia.twitter">
                  <Twitter className="inline mr-2 h-4 w-4" />
                  Twitter
                </Label>
                <Input 
                  id="socialMedia.twitter" 
                  name="socialMedia.twitter" 
                  value={formState.socialMedia?.twitter || ''} 
                  onChange={handleChange} 
                  placeholder="Twitter username or URL"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="socialMedia.facebook">
                  <Facebook className="inline mr-2 h-4 w-4" />
                  Facebook
                </Label>
                <Input 
                  id="socialMedia.facebook" 
                  name="socialMedia.facebook" 
                  value={formState.socialMedia?.facebook || ''} 
                  onChange={handleChange} 
                  placeholder="Facebook page URL"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="socialMedia.youtube">
                  <Youtube className="inline mr-2 h-4 w-4" />
                  YouTube
                </Label>
                <Input 
                  id="socialMedia.youtube" 
                  name="socialMedia.youtube" 
                  value={formState.socialMedia?.youtube || ''} 
                  onChange={handleChange} 
                  placeholder="YouTube channel URL"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="socialMedia.tiktok">
                  <TikTok className="inline mr-2 h-4 w-4" />
                  TikTok
                </Label>
                <Input 
                  id="socialMedia.tiktok" 
                  name="socialMedia.tiktok" 
                  value={formState.socialMedia?.tiktok || ''} 
                  onChange={handleChange} 
                  placeholder="TikTok username or URL"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="socialMedia.website">
                  <LinkIcon className="inline mr-2 h-4 w-4" />
                  Website
                </Label>
                <Input 
                  id="socialMedia.website" 
                  name="socialMedia.website" 
                  value={formState.socialMedia?.website || ''} 
                  onChange={handleChange} 
                  placeholder="Official website URL"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6">
          <Button type="submit" className="w-full">
            Add Celebrity
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default CelebrityForm;
