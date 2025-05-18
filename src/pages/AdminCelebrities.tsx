
import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Celebrity } from "@/types/data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Edit, Trash, Eye, Loader2, User, Image, Calendar, MapPin, Award, Star, Info, Link, Instagram, Twitter, Facebook, Youtube } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { toast } from "@/components/ui/use-toast";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminCelebrities: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [editCelebrity, setEditCelebrity] = useState<Celebrity | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [celebrityToDelete, setCelebrityToDelete] = useState<Celebrity | null>(null);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm({
    defaultValues: {
      name: "",
      image: "",
      bio: "",
      category: "",
      styleType: "",
      birthdate: "",
      birthplace: "",
      height: "",
      education: "",
      careerHighlights: "",
      personalLife: "",
      awards: "",
      socialMedia: {
        instagram: "",
        twitter: "",
        facebook: "",
        youtube: "",
        tiktok: "",
        website: ""
      },
      interestingFacts: "",
      nationality: "",
      languages: "",
      netWorth: "",
      zodiacSign: "",
      philanthropyWork: "",
      businessVentures: "",
      controversies: "",
      fanbaseNickname: "",
      signature: {
        look: "",
        accessories: "",
        designers: "",
        perfume: ""
      },
      measurements: "",
      dietFitness: "",
      styleEvolution: "",
      influences: "",
      quotes: "",
      publicPerception: "",
      brandEndorsements: ""
    }
  });

  // Fetch categories from Supabase
  const { data: categories = [], isLoading: isCategoriesLoading } = useQuery({
    queryKey: ['celebrityCategories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('name')
        .eq('type', 'celebrity')
        .order('name');
      
      if (error) {
        console.error('Error fetching categories:', error);
        throw error;
      }
      
      return data.map(category => category.name);
    }
  });

  // Fetch style types from Supabase
  const { data: styleTypes = [], isLoading: isStyleTypesLoading } = useQuery({
    queryKey: ['styleTypes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('name')
        .eq('type', 'style')
        .order('name');
      
      if (error) {
        console.error('Error fetching style types:', error);
        throw error;
      }
      
      return data.map(category => category.name);
    }
  });

  // Fetch all celebrities from Supabase with the new fields
  const { data: celebrities = [], isLoading: isCelebritiesLoading } = useQuery({
    queryKey: ['celebrities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('celebrities')
        .select(`
          *,
          outfits:outfits(count)
        `)
        .order('name');
      
      if (error) {
        console.error('Error fetching celebrities:', error);
        throw error;
      }

      return data.map(celebrity => {
        // Create proper socialMedia object that conforms to the Celebrity type definition
        const socialMedia = typeof celebrity.social_media === 'object' && celebrity.social_media !== null
          ? {
              instagram: typeof celebrity.social_media === 'object' && 'instagram' in celebrity.social_media 
                ? (celebrity.social_media.instagram as string) || undefined 
                : undefined,
              twitter: typeof celebrity.social_media === 'object' && 'twitter' in celebrity.social_media 
                ? (celebrity.social_media.twitter as string) || undefined 
                : undefined,
              facebook: typeof celebrity.social_media === 'object' && 'facebook' in celebrity.social_media 
                ? (celebrity.social_media.facebook as string) || undefined 
                : undefined,
              youtube: typeof celebrity.social_media === 'object' && 'youtube' in celebrity.social_media 
                ? (celebrity.social_media.youtube as string) || undefined 
                : undefined,
              tiktok: typeof celebrity.social_media === 'object' && 'tiktok' in celebrity.social_media 
                ? (celebrity.social_media.tiktok as string) || undefined 
                : undefined,
              website: typeof celebrity.social_media === 'object' && 'website' in celebrity.social_media 
                ? (celebrity.social_media.website as string) || undefined 
                : undefined
            }
          : {};
          
        // Handle signature object
        const signature = typeof celebrity.signature === 'object' && celebrity.signature !== null
          ? {
              look: typeof celebrity.signature === 'object' && 'look' in celebrity.signature 
                ? (celebrity.signature.look as string) || "" 
                : "",
              accessories: typeof celebrity.signature === 'object' && 'accessories' in celebrity.signature 
                ? (celebrity.signature.accessories as string) || "" 
                : "",
              designers: typeof celebrity.signature === 'object' && 'designers' in celebrity.signature 
                ? (celebrity.signature.designers as string) || "" 
                : "",
              perfume: typeof celebrity.signature === 'object' && 'perfume' in celebrity.signature 
                ? (celebrity.signature.perfume as string) || "" 
                : ""
            }
          : { look: "", accessories: "", designers: "", perfume: "" };

        return {
          id: celebrity.id,
          name: celebrity.name,
          image: celebrity.image,
          bio: celebrity.bio,
          category: celebrity.category,
          styleType: celebrity.style_type,
          outfitCount: celebrity.outfits?.[0]?.count || 0,
          birthdate: celebrity.birthdate,
          birthplace: celebrity.birthplace || "",
          height: celebrity.height || "",
          education: celebrity.education || "",
          careerHighlights: celebrity.career_highlights || "",
          personalLife: celebrity.personal_life || "",
          awards: celebrity.awards || "",
          socialMedia,
          interestingFacts: celebrity.interesting_facts || "",
          nationality: celebrity.nationality || "",
          languages: celebrity.languages || "",
          netWorth: celebrity.net_worth || "",
          zodiacSign: celebrity.zodiac_sign || "",
          philanthropyWork: celebrity.philanthropy_work || "",
          businessVentures: celebrity.business_ventures || "",
          controversies: celebrity.controversies || "",
          fanbaseNickname: celebrity.fanbase_nickname || "",
          signature,
          measurements: celebrity.measurements || "",
          dietFitness: celebrity.diet_fitness || "",
          styleEvolution: celebrity.style_evolution || "",
          influences: celebrity.influences || "",
          quotes: celebrity.quotes || "",
          publicPerception: celebrity.public_perception || "",
          brandEndorsements: celebrity.brand_endorsements || ""
        };
      });
    }
  });

  // Add celebrity mutation
  const addCelebrityMutation = useMutation({
    mutationFn: async (data: any) => {
      const { data: newCelebrity, error } = await supabase
        .from('celebrities')
        .insert([{
          name: data.name,
          image: data.image,
          bio: data.bio,
          category: data.category,
          style_type: data.styleType,
          birthdate: data.birthdate || null,
          birthplace: data.birthplace || "",
          height: data.height || "",
          education: data.education || "",
          career_highlights: data.careerHighlights || "",
          personal_life: data.personalLife || "",
          awards: data.awards || "",
          social_media: data.socialMedia || {},
          interesting_facts: data.interestingFacts || "",
          nationality: data.nationality || "",
          languages: data.languages || "",
          net_worth: data.netWorth || "",
          zodiac_sign: data.zodiacSign || "",
          philanthropy_work: data.philanthropyWork || "",
          business_ventures: data.businessVentures || "",
          controversies: data.controversies || "",
          fanbase_nickname: data.fanbaseNickname || "",
          signature: data.signature || {},
          measurements: data.measurements || "",
          diet_fitness: data.dietFitness || "",
          style_evolution: data.styleEvolution || "",
          influences: data.influences || "",
          quotes: data.quotes || "",
          public_perception: data.publicPerception || "",
          brand_endorsements: data.brandEndorsements || ""
        }])
        .select()
        .single();

      if (error) {
        console.error('Error adding celebrity:', error);
        throw error;
      }

      return newCelebrity;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['celebrities'] });
      toast({
        title: "Celebrity added",
        description: "New celebrity has been added successfully",
      });
      form.reset();
      setFormDialogOpen(false);
    },
    onError: (error) => {
      console.error('Error adding celebrity:', error);
      toast({
        title: "Error",
        description: "Failed to add celebrity. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Update celebrity mutation
  const updateCelebrityMutation = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase
        .from('celebrities')
        .update({
          name: data.name,
          image: data.image,
          bio: data.bio,
          category: data.category,
          style_type: data.styleType,
          birthdate: data.birthdate || null,
          birthplace: data.birthplace || "",
          height: data.height || "",
          education: data.education || "",
          career_highlights: data.careerHighlights || "",
          personal_life: data.personalLife || "",
          awards: data.awards || "",
          social_media: data.socialMedia || {},
          interesting_facts: data.interestingFacts || "",
          nationality: data.nationality || "",
          languages: data.languages || "",
          net_worth: data.netWorth || "",
          zodiac_sign: data.zodiacSign || "",
          philanthropy_work: data.philanthropyWork || "",
          business_ventures: data.businessVentures || "",
          controversies: data.controversies || "",
          fanbase_nickname: data.fanbaseNickname || "",
          signature: data.signature || {},
          measurements: data.measurements || "",
          diet_fitness: data.dietFitness || "",
          style_evolution: data.styleEvolution || "",
          influences: data.influences || "",
          quotes: data.quotes || "",
          public_perception: data.publicPerception || "",
          brand_endorsements: data.brandEndorsements || ""
        })
        .eq('id', editCelebrity!.id);

      if (error) {
        console.error('Error updating celebrity:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['celebrities'] });
      toast({
        title: "Celebrity updated",
        description: "Celebrity has been updated successfully",
      });
      setEditCelebrity(null);
      form.reset();
      setFormDialogOpen(false);
    },
    onError: (error) => {
      console.error('Error updating celebrity:', error);
      toast({
        title: "Error",
        description: "Failed to update celebrity. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Delete celebrity mutation
  const deleteCelebrityMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('celebrities')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting celebrity:', error);
        throw error;
      }

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['celebrities'] });
      toast({
        title: "Celebrity deleted",
        description: "Celebrity has been removed successfully",
      });
      setCelebrityToDelete(null);
      setDeleteDialogOpen(false);
    },
    onError: (error) => {
      console.error('Error deleting celebrity:', error);
      toast({
        title: "Error",
        description: "Failed to delete celebrity. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Filter celebrities based on search term
  const filteredCelebrities = celebrities.filter((celebrity) =>
    celebrity.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onSubmit = (data: any) => {
    if (editCelebrity) {
      updateCelebrityMutation.mutate(data);
    } else {
      addCelebrityMutation.mutate(data);
    }
  };

  const handleDelete = (celebrity: Celebrity) => {
    setCelebrityToDelete(celebrity);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (celebrityToDelete) {
      deleteCelebrityMutation.mutate(celebrityToDelete.id);
    }
  };

  const handleEdit = (celebrity: Celebrity) => {
    setEditCelebrity(celebrity);
    // Format the birthdate to a form the input can handle
    let formattedBirthdate = "";
    if (celebrity.birthdate) {
      const date = new Date(celebrity.birthdate);
      formattedBirthdate = date.toISOString().split('T')[0];
    }

    // Set form values
    form.reset({
      name: celebrity.name,
      image: celebrity.image,
      bio: celebrity.bio,
      category: celebrity.category,
      styleType: celebrity.styleType,
      birthdate: formattedBirthdate,
      birthplace: celebrity.birthplace || "",
      height: celebrity.height || "",
      education: celebrity.education || "",
      careerHighlights: celebrity.careerHighlights || "",
      personalLife: celebrity.personalLife || "",
      awards: celebrity.awards || "",
      socialMedia: {
        instagram: celebrity.socialMedia?.instagram || "",
        twitter: celebrity.socialMedia?.twitter || "",
        facebook: celebrity.socialMedia?.facebook || "",
        youtube: celebrity.socialMedia?.youtube || "",
        tiktok: celebrity.socialMedia?.tiktok || "",
        website: celebrity.socialMedia?.website || ""
      },
      interestingFacts: celebrity.interestingFacts || "",
      nationality: celebrity.nationality || "",
      languages: celebrity.languages || "",
      netWorth: celebrity.netWorth || "",
      zodiacSign: celebrity.zodiacSign || "",
      philanthropyWork: celebrity.philanthropyWork || "",
      businessVentures: celebrity.businessVentures || "",
      controversies: celebrity.controversies || "",
      fanbaseNickname: celebrity.fanbaseNickname || "",
      signature: celebrity.signature || { look: "", accessories: "", designers: "", perfume: "" },
      measurements: celebrity.measurements || "",
      dietFitness: celebrity.dietFitness || "",
      styleEvolution: celebrity.styleEvolution || "",
      influences: celebrity.influences || "",
      quotes: celebrity.quotes || "",
      publicPerception: celebrity.publicPerception || "",
      brandEndorsements: celebrity.brandEndorsements || ""
    });
    setFormDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditCelebrity(null);
    form.reset({
      name: "",
      image: "",
      bio: "",
      category: "",
      styleType: "",
      birthdate: "",
      birthplace: "",
      height: "",
      education: "",
      careerHighlights: "",
      personalLife: "",
      awards: "",
      socialMedia: {
        instagram: "",
        twitter: "",
        facebook: "",
        youtube: "",
        tiktok: "",
        website: ""
      },
      interestingFacts: "",
      nationality: "",
      languages: "",
      netWorth: "",
      zodiacSign: "",
      philanthropyWork: "",
      businessVentures: "",
      controversies: "",
      fanbaseNickname: "",
      signature: {
        look: "",
        accessories: "",
        designers: "",
        perfume: ""
      },
      measurements: "",
      dietFitness: "",
      styleEvolution: "",
      influences: "",
      quotes: "",
      publicPerception: "",
      brandEndorsements: ""
    });
    setFormDialogOpen(true);
  }

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-serif text-2xl font-medium">Celebrities</h1>
        <Button onClick={handleAddNew}>
          <Plus className="mr-2 h-4 w-4" />
          Add Celebrity
        </Button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search celebrities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Celebrity</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Style Type</TableHead>
                <TableHead>Outfits</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isCelebritiesLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-32">
                    <div className="flex justify-center items-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredCelebrities.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-32">
                    No celebrities found
                  </TableCell>
                </TableRow>
              ) : (
                filteredCelebrities.map((celebrity) => (
                  <TableRow key={celebrity.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={celebrity.image} alt={celebrity.name} />
                          <AvatarFallback>{celebrity.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{celebrity.name}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{celebrity.category}</TableCell>
                    <TableCell>{celebrity.styleType}</TableCell>
                    <TableCell>{celebrity.outfitCount}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" asChild>
                          <a href={`/celebrity/${celebrity.id}`} target="_blank" rel="noopener noreferrer">
                            <Eye className="h-4 w-4" />
                          </a>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(celebrity)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDelete(celebrity)}
                          disabled={deleteCelebrityMutation.isPending && celebrityToDelete?.id === celebrity.id}
                        >
                          {deleteCelebrityMutation.isPending && celebrityToDelete?.id === celebrity.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Celebrity Form Dialog */}
      <Dialog open={formDialogOpen} onOpenChange={setFormDialogOpen}>
        <DialogContent className="sm:max-w-[850px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editCelebrity ? "Edit Celebrity" : "Add New Celebrity"}
            </DialogTitle>
            <DialogDescription>
              Fill in the details for the celebrity profile. Complete information helps create comprehensive celebrity profiles.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="mb-4 flex flex-wrap">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="biography">Biography</TabsTrigger>
                  <TabsTrigger value="career">Career &amp; Personal</TabsTrigger>
                  <TabsTrigger value="style">Style &amp; Fashion</TabsTrigger>
                  <TabsTrigger value="additional">Additional Info</TabsTrigger>
                  <TabsTrigger value="social">Social Media</TabsTrigger>
                </TabsList>
                
                {/* Basic Info Tab */}
                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      rules={{ required: "Name is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                              <Input className="pl-9" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="birthdate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Birth Date</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                              <Input className="pl-9" type="date" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="nationality"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nationality</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g., American, British, etc." />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="languages"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Languages Spoken</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g., English, Spanish, etc." />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="category"
                      rules={{ required: "Category is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <FormControl>
                            {isCategoriesLoading ? (
                              <div className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Loading categories...</span>
                              </div>
                            ) : (
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                                value={field.value}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                  {categories.map(category => (
                                    <SelectItem key={category} value={category}>
                                      {category}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="styleType"
                      rules={{ required: "Style Type is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Style Type</FormLabel>
                          <FormControl>
                            {isStyleTypesLoading ? (
                              <div className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Loading style types...</span>
                              </div>
                            ) : (
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                                value={field.value}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a style type" />
                                </SelectTrigger>
                                <SelectContent>
                                  {styleTypes.map(styleType => (
                                    <SelectItem key={styleType} value={styleType}>
                                      {styleType}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="birthplace"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Birthplace</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                              <Input className="pl-9" {...field} placeholder="e.g., Los Angeles, California, USA" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="height"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Height</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g., 5' 9&quot; (175 cm)" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="image"
                    rules={{ required: "Image URL is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Profile Image URL</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Image className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input className="pl-9" {...field} />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Provide a link to a high-quality image of the celebrity (recommended size: 800x1000 pixels)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="zodiacSign"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Zodiac Sign</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g., Leo, Virgo, etc." />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="netWorth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Net Worth</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g., $50 million" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                {/* Biography Tab */}
                <TabsContent value="biography" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="bio"
                    rules={{ required: "Biography is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Short Biography</FormLabel>
                        <FormDescription>
                          A brief introduction that will appear at the top of the profile (1-2 paragraphs)
                        </FormDescription>
                        <FormControl>
                          <Textarea 
                            className="min-h-24" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="education"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Education</FormLabel>
                        <FormDescription>
                          Details about the celebrity&apos;s educational background
                        </FormDescription>
                        <FormControl>
                          <Textarea 
                            placeholder="e.g., Graduated from New York University with a degree in Fine Arts"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="personalLife"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Personal Life</FormLabel>
                        <FormDescription>
                          Information about family, relationships, hobbies, causes, etc.
                        </FormDescription>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="quotes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notable Quotes</FormLabel>
                        <FormDescription>
                          Famous or meaningful quotes from the celebrity
                        </FormDescription>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter one quote per line"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="interestingFacts"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Interesting Facts</FormLabel>
                        <FormDescription>
                          Unique or lesser-known facts about the celebrity
                        </FormDescription>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                {/* Career & Personal Tab */}
                <TabsContent value="career" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="careerHighlights"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Career Highlights</FormLabel>
                        <FormDescription>
                          Notable achievements, roles, or milestones in their career
                        </FormDescription>
                        <FormControl>
                          <Textarea 
                            className="min-h-24"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="awards"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Awards &amp; Recognition</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Award className="absolute left-3 top-3 text-muted-foreground h-4 w-4" />
                            <Textarea 
                              className="pl-9"
                              placeholder="List major awards, nominations, and honors received"
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="businessVentures"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Ventures</FormLabel>
                        <FormDescription>
                          Companies, products, or business initiatives the celebrity has launched or invested in
                        </FormDescription>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="philanthropyWork"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Philanthropy &amp; Charity Work</FormLabel>
                        <FormDescription>
                          Charitable organizations, causes, and advocacy work the celebrity is involved with
                        </FormDescription>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="brandEndorsements"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Brand Endorsements</FormLabel>
                        <FormDescription>
                          Major brand partnerships, sponsorships, and ambassadorships
                        </FormDescription>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                {/* Style & Fashion Tab */}
                <TabsContent value="style" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="styleEvolution"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Style Evolution</FormLabel>
                        <FormDescription>
                          How the celebrity&apos;s fashion sense has changed over time
                        </FormDescription>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="signature.look"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Signature Look</FormLabel>
                        <FormDescription>
                          Distinctive fashion elements the celebrity is known for
                        </FormDescription>
                        <FormControl>
                          <div className="relative">
                            <Star className="absolute left-3 top-3 text-muted-foreground h-4 w-4" />
                            <Textarea 
                              className="pl-9"
                              {...field} 
                              placeholder="e.g., Monochromatic outfits, bold prints, etc."
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="signature.accessories"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Signature Accessories</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g., Unique jewelry, hats, etc." />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="signature.perfume"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Signature Perfume/Cologne</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g., Chanel No. 5, Dior Sauvage, etc." />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="signature.designers"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Favorite Designers</FormLabel>
                        <FormDescription>
                          Fashion designers frequently worn by the celebrity
                        </FormDescription>
                        <FormControl>
                          <Input {...field} placeholder="e.g., Gucci, Versace, Louis Vuitton, etc." />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="measurements"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Measurements</FormLabel>
                        <FormDescription>
                          Physical measurements if publicly available
                        </FormDescription>
                        <FormControl>
                          <Input {...field} placeholder="e.g., 34-26-36 (inches)" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dietFitness"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Diet &amp; Fitness Routine</FormLabel>
                        <FormDescription>
                          Information about the celebrity&apos;s health and wellness habits
                        </FormDescription>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                {/* Additional Info Tab */}
                <TabsContent value="additional" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="controversies"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Controversies</FormLabel>
                        <FormDescription>
                          Any significant controversies or scandals associated with the celebrity
                        </FormDescription>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fanbaseNickname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fanbase Nickname</FormLabel>
                        <FormDescription>
                          What the celebrity&apos;s fans call themselves
                        </FormDescription>
                        <FormControl>
                          <Input {...field} placeholder="e.g., Swifties, Beyhive, etc." />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="influences"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Influences &amp; Inspirations</FormLabel>
                        <FormDescription>
                          People, artists, or movements that have influenced the celebrity
                        </FormDescription>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="publicPerception"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Public Perception &amp; Reputation</FormLabel>
                        <FormDescription>
                          How the celebrity is generally perceived by the public and media
                        </FormDescription>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                {/* Social Media Tab */}
                <TabsContent value="social" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="socialMedia.instagram"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Instagram URL</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Instagram className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                              <Input 
                                className="pl-9"
                                {...field} 
                                placeholder="https://www.instagram.com/username"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="socialMedia.twitter"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Twitter URL</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Twitter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                              <Input 
                                className="pl-9"
                                {...field} 
                                placeholder="https://twitter.com/username"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="socialMedia.facebook"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Facebook URL</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Facebook className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                              <Input 
                                className="pl-9"
                                {...field} 
                                placeholder="https://www.facebook.com/username"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="socialMedia.youtube"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>YouTube Channel</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Youtube className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                              <Input 
                                className="pl-9"
                                {...field} 
                                placeholder="https://www.youtube.com/channel/..."
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="socialMedia.tiktok"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>TikTok URL</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="https://www.tiktok.com/@username"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="socialMedia.website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Official Website</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                              <Input 
                                className="pl-9"
                                {...field} 
                                placeholder="https://www.officialsite.com"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>
              </Tabs>

              <DialogFooter>
                <Button 
                  type="submit"
                  disabled={addCelebrityMutation.isPending || updateCelebrityMutation.isPending}
                >
                  {(addCelebrityMutation.isPending || updateCelebrityMutation.isPending) && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {editCelebrity ? "Update Celebrity" : "Add Celebrity"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Celebrity</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {celebrityToDelete?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleteCelebrityMutation.isPending}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
              disabled={deleteCelebrityMutation.isPending}
            >
              {deleteCelebrityMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminCelebrities;
