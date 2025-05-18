import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Outfit, Celebrity } from "@/types/data";
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
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Edit, Trash, Eye, Image, Loader2, ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { toast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface SupabaseOutfit extends Omit<Outfit, 'id' | 'celebrityId' | 'celebrity'> {
  id: string;
  celebrity_id: string;
}

const AdminOutfits: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [editOutfit, setEditOutfit] = useState<Outfit | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [outfitToDelete, setOutfitToDelete] = useState<Outfit | null>(null);
  const [showAddEditForm, setShowAddEditForm] = useState(false);
  const queryClient = useQueryClient();

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();

  // Fetch celebrities
  const { data: celebrities = [], isLoading: isCelebritiesLoading } = useQuery({
    queryKey: ['celebrities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('celebrities')
        .select('*');
      
      if (error) {
        console.error('Error fetching celebrities:', error);
        throw error;
      }

      return data.map((celebrity: any) => ({
        id: celebrity.id,
        name: celebrity.name,
        image: celebrity.image,
        bio: celebrity.bio,
        category: celebrity.category,
        styleType: celebrity.style_type,
        outfitCount: 0 // This will be updated later if needed
      }));
    }
  });

  // Fetch outfits
  const { data: outfits = [], isLoading: isOutfitsLoading } = useQuery({
    queryKey: ['outfits'],
    queryFn: async () => {
      const { data: outfitsData, error: outfitsError } = await supabase
        .from('outfits')
        .select(`
          *,
          celebrities(name)
        `);

      if (outfitsError) {
        console.error('Error fetching outfits:', outfitsError);
        throw outfitsError;
      }

      // Map Supabase outfits to our application's Outfit type
      return outfitsData.map((outfit: any) => ({
        id: outfit.id,
        image: outfit.image,
        celebrityId: outfit.celebrity_id,
        celebrity: outfit.celebrities?.name || 'Unknown',
        title: outfit.title,
        description: outfit.description,
        fullDescription: outfit.full_description,
        occasion: outfit.occasion,
        date: outfit.date,
        affiliateLink: outfit.affiliate_link,
      }));
    }
  });

  // Fetch tags for each outfit
  const { data: outfitTags = [] } = useQuery({
    queryKey: ['outfit-tags'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('outfit_tags')
        .select('*');
      
      if (error) {
        console.error('Error fetching outfit tags:', error);
        throw error;
      }

      return data;
    },
    enabled: outfits.length > 0
  });

  // Create a map of outfit IDs to their tags
  const outfitTagsMap = React.useMemo(() => {
    const tagsMap: Record<string, string[]> = {};
    
    outfitTags.forEach((tagRecord: any) => {
      const outfitId = tagRecord.outfit_id;
      if (!tagsMap[outfitId]) {
        tagsMap[outfitId] = [];
      }
      tagsMap[outfitId].push(tagRecord.tag_name);
    });
    
    return tagsMap;
  }, [outfitTags]);

  // Add tags to outfits
  const outfitsWithTags = React.useMemo(() => {
    return outfits.map(outfit => ({
      ...outfit,
      tags: outfitTagsMap[outfit.id] || []
    }));
  }, [outfits, outfitTagsMap]);

  // Filter outfits based on search term
  const filteredOutfits = outfitsWithTags.filter((outfit) =>
    outfit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    outfit.celebrity.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Add outfit mutation
  const addOutfitMutation = useMutation({
    mutationFn: async (data: any) => {
      // First insert the outfit
      const { data: newOutfit, error: outfitError } = await supabase
        .from('outfits')
        .insert([{
          title: data.title,
          image: data.image,
          celebrity_id: data.celebrityId,
          description: data.description,
          full_description: data.fullDescription || null,
          occasion: data.occasion || null,
          date: data.date || null,
          affiliate_link: data.affiliateLink || null,
        }])
        .select('*')
        .single();

      if (outfitError) {
        throw outfitError;
      }

      // If there are tags, insert them
      if (data.tags && data.tags.length > 0) {
        const tagInserts = data.tags.map((tag: string) => ({
          outfit_id: newOutfit.id,
          tag_name: tag
        }));

        const { error: tagsError } = await supabase
          .from('outfit_tags')
          .insert(tagInserts);

        if (tagsError) {
          throw tagsError;
        }
      }

      return newOutfit;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outfits'] });
      queryClient.invalidateQueries({ queryKey: ['outfit-tags'] });
      toast({
        title: "Outfit added",
        description: "Your outfit has been added successfully",
      });
      reset();
    },
    onError: (error) => {
      console.error('Error adding outfit:', error);
      toast({
        title: "Error",
        description: "There was an error adding the outfit. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Update outfit mutation
  const updateOutfitMutation = useMutation({
    mutationFn: async (data: any) => {
      // First update the outfit
      const { error: outfitError } = await supabase
        .from('outfits')
        .update({
          title: data.title,
          image: data.image,
          celebrity_id: data.celebrityId,
          description: data.description,
          full_description: data.fullDescription || null,
          occasion: data.occasion || null,
          date: data.date || null,
          affiliate_link: data.affiliateLink || null,
        })
        .eq('id', data.id);

      if (outfitError) {
        throw outfitError;
      }

      // Delete existing tags for this outfit
      const { error: deleteTagsError } = await supabase
        .from('outfit_tags')
        .delete()
        .eq('outfit_id', data.id);

      if (deleteTagsError) {
        throw deleteTagsError;
      }

      // If there are tags, insert them
      if (data.tags && data.tags.length > 0) {
        const tagInserts = data.tags.map((tag: string) => ({
          outfit_id: data.id,
          tag_name: tag
        }));

        const { error: tagsError } = await supabase
          .from('outfit_tags')
          .insert(tagInserts);

        if (tagsError) {
          throw tagsError;
        }
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outfits'] });
      queryClient.invalidateQueries({ queryKey: ['outfit-tags'] });
      toast({
        title: "Outfit updated",
        description: "Your outfit has been updated successfully",
      });
      setEditOutfit(null);
      reset();
    },
    onError: (error) => {
      console.error('Error updating outfit:', error);
      toast({
        title: "Error",
        description: "There was an error updating the outfit. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Delete outfit mutation
  const deleteOutfitMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('outfits')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outfits'] });
      queryClient.invalidateQueries({ queryKey: ['outfit-tags'] });
      toast({
        title: "Outfit deleted",
        description: "The outfit has been removed successfully",
      });
      setOutfitToDelete(null);
      setDeleteDialogOpen(false);
    },
    onError: (error) => {
      console.error('Error deleting outfit:', error);
      toast({
        title: "Error",
        description: "There was an error deleting the outfit. Please try again.",
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: any) => {
    // Process the tags (convert from comma-separated string to array)
    if (data.tagsString) {
      data.tags = data.tagsString.split(',').map((tag: string) => tag.trim()).filter(Boolean);
    }

    if (editOutfit) {
      updateOutfitMutation.mutate({ ...data, id: editOutfit.id });
    } else {
      addOutfitMutation.mutate(data);
    }
    
    setShowAddEditForm(false);
  };

  const handleDelete = (outfit: Outfit) => {
    setOutfitToDelete(outfit);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (outfitToDelete) {
      deleteOutfitMutation.mutate(outfitToDelete.id);
    }
  };

  const handleEdit = (outfit: Outfit) => {
    setEditOutfit(outfit);
    
    // Set form values
    Object.keys(outfit).forEach((key) => {
      if (key !== 'tags') {
        setValue(key, outfit[key as keyof Outfit]);
      }
    });
    
    // Set tags as comma-separated string
    if (outfit.tags) {
      setValue('tagsString', outfit.tags.join(', '));
    }
    
    setShowAddEditForm(true);
  };
  
  const handleAddNew = () => {
    setEditOutfit(null);
    reset();
    setShowAddEditForm(true);
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "";
    return new Date(dateString).toISOString().split('T')[0]; // Format as YYYY-MM-DD
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-serif text-2xl font-medium">Outfits</h1>
        <Button onClick={handleAddNew}>
          <Plus className="mr-2 h-4 w-4" />
          Add Outfit
        </Button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search outfits..."
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
                <TableHead>Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Celebrity</TableHead>
                <TableHead>Occasion</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isOutfitsLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-32">
                    <div className="flex justify-center items-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredOutfits.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-32">
                    No outfits found
                  </TableCell>
                </TableRow>
              ) : (
                filteredOutfits.map((outfit) => (
                  <TableRow key={outfit.id}>
                    <TableCell>
                      <div className="w-16 h-20 bg-secondary rounded overflow-hidden">
                        {outfit.image ? (
                          <img
                            src={outfit.image}
                            alt={outfit.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Image className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{outfit.title}</TableCell>
                    <TableCell>{outfit.celebrity}</TableCell>
                    <TableCell>{outfit.occasion || "-"}</TableCell>
                    <TableCell>
                      {outfit.date ? new Date(outfit.date).toLocaleDateString() : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" asChild>
                          <a href={`/outfit/${outfit.id}`} target="_blank" rel="noopener noreferrer">
                            <Eye className="h-4 w-4" />
                          </a>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(outfit)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDelete(outfit)}
                          disabled={deleteOutfitMutation.isPending}
                        >
                          {deleteOutfitMutation.isPending && outfitToDelete?.id === outfit.id ? (
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

      {/* Add/Edit Form Dialog */}
      <Dialog open={showAddEditForm} onOpenChange={setShowAddEditForm}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {editOutfit ? "Edit Outfit" : "Add New Outfit"}
            </DialogTitle>
            <DialogDescription>
              Fill in the details for the outfit.
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="flex-1 pr-4">
            <form id="outfit-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="title" className="font-medium">Title *</Label>
                  <Input
                    id="title"
                    {...register("title", { required: "Title is required" })}
                    defaultValue={editOutfit?.title || ""}
                    placeholder="Enter outfit title"
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500">
                      {errors.title.message as string}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="image" className="font-medium">Image URL *</Label>
                  <Input
                    id="image"
                    {...register("image", { required: "Image URL is required" })}
                    defaultValue={editOutfit?.image || ""}
                    placeholder="https://example.com/image.jpg"
                  />
                  {errors.image && (
                    <p className="text-sm text-red-500">
                      {errors.image.message as string}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="celebrityId" className="font-medium">Celebrity *</Label>
                  {isCelebritiesLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Loading celebrities...</span>
                    </div>
                  ) : (
                    <select
                      id="celebrityId"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                      {...register("celebrityId", { required: "Celebrity is required" })}
                      defaultValue={editOutfit?.celebrityId || ""}
                    >
                      <option value="">Select a celebrity</option>
                      {celebrities.map((celebrity: Celebrity) => (
                        <option key={celebrity.id} value={celebrity.id}>{celebrity.name}</option>
                      ))}
                    </select>
                  )}
                  {errors.celebrityId && (
                    <p className="text-sm text-red-500">
                      {errors.celebrityId.message as string}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="occasion" className="font-medium">Occasion</Label>
                  <Input
                    id="occasion"
                    {...register("occasion")}
                    defaultValue={editOutfit?.occasion || ""}
                    placeholder="e.g., Red Carpet, Award Show, etc."
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="description" className="font-medium">Description *</Label>
                  <Input
                    id="description"
                    {...register("description", { required: "Description is required" })}
                    defaultValue={editOutfit?.description || ""}
                    placeholder="Brief description of the outfit"
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500">
                      {errors.description.message as string}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="date" className="font-medium">Date Worn</Label>
                  <Input
                    id="date"
                    type="date"
                    {...register("date")}
                    defaultValue={formatDate(editOutfit?.date)}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="affiliateLink" className="font-medium">Affiliate Link</Label>
                <div className="relative">
                  <Input
                    id="affiliateLink"
                    {...register("affiliateLink")}
                    defaultValue={editOutfit?.affiliateLink || ""}
                    placeholder="https://example.com/product-link"
                  />
                  <ExternalLink className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                </div>
                <p className="text-xs text-muted-foreground">
                  Add a direct purchase link for this outfit (optional)
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="tagsString" className="font-medium">Tags (comma separated)</Label>
                <Input
                  id="tagsString"
                  {...register("tagsString")}
                  defaultValue={editOutfit?.tags ? editOutfit.tags.join(', ') : ""}
                  placeholder="red carpet, formal, gala, etc."
                />
                <p className="text-xs text-muted-foreground">
                  Separate tags with commas
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="fullDescription" className="font-medium">Full Description</Label>
                <Textarea
                  id="fullDescription"
                  className="min-h-32"
                  {...register("fullDescription")}
                  defaultValue={editOutfit?.fullDescription || ""}
                  placeholder="Detailed description of the outfit, including style notes, materials, designer information, etc."
                />
              </div>
            </form>
          </ScrollArea>
          
          <DialogFooter className="pt-2">
            <Button variant="outline" onClick={() => setShowAddEditForm(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              form="outfit-form"
              disabled={addOutfitMutation.isPending || updateOutfitMutation.isPending}
            >
              {(addOutfitMutation.isPending || updateOutfitMutation.isPending) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {editOutfit ? "Update Outfit" : "Add Outfit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Outfit</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{outfitToDelete?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleteOutfitMutation.isPending}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
              disabled={deleteOutfitMutation.isPending}
            >
              {deleteOutfitMutation.isPending ? (
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

export default AdminOutfits;
