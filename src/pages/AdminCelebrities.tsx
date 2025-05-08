
import React, { useState, useEffect } from "react";
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
import { Plus, Search, Edit, Trash, Eye, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const AdminCelebrities: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [editCelebrity, setEditCelebrity] = useState<Celebrity | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [celebrityToDelete, setCelebrityToDelete] = useState<Celebrity | null>(null);
  const queryClient = useQueryClient();

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();

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

  // Fetch all celebrities from Supabase
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

      return data.map(celebrity => ({
        id: celebrity.id,
        name: celebrity.name,
        image: celebrity.image,
        bio: celebrity.bio,
        category: celebrity.category,
        styleType: celebrity.style_type,
        outfitCount: celebrity.outfits?.[0]?.count || 0
      }));
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
          style_type: data.styleType
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
      reset();
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
          style_type: data.styleType
        })
        .eq('id', data.id);

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
      reset();
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
      updateCelebrityMutation.mutate({ ...data, id: editCelebrity.id });
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
    // Set form values
    Object.keys(celebrity).forEach((key) => {
      if (key !== 'outfitCount') {
        setValue(key as any, celebrity[key as keyof Celebrity]);
      }
    });
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-serif text-2xl font-medium">Celebrities</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Celebrity
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>
                {editCelebrity ? "Edit Celebrity" : "Add New Celebrity"}
              </DialogTitle>
              <DialogDescription>
                Fill in the details for the celebrity profile.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    {...register("name", { required: "Name is required" })}
                    defaultValue={editCelebrity?.name || ""}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">
                      {errors.name.message as string}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="image">Profile Image URL</Label>
                  <Input
                    id="image"
                    {...register("image", { required: "Image URL is required" })}
                    defaultValue={editCelebrity?.image || ""}
                  />
                  {errors.image && (
                    <p className="text-sm text-red-500">
                      {errors.image.message as string}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  {isCategoriesLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Loading categories...</span>
                    </div>
                  ) : (
                    <select
                      id="category"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                      {...register("category", { required: "Category is required" })}
                      defaultValue={editCelebrity?.category || ""}
                    >
                      <option value="">Select a category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  )}
                  {errors.category && (
                    <p className="text-sm text-red-500">
                      {errors.category.message as string}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="styleType">Style Type</Label>
                  {isStyleTypesLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Loading style types...</span>
                    </div>
                  ) : (
                    <select
                      id="styleType"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                      {...register("styleType", { required: "Style Type is required" })}
                      defaultValue={editCelebrity?.styleType || ""}
                    >
                      <option value="">Select a style type</option>
                      {styleTypes.map(styleType => (
                        <option key={styleType} value={styleType}>{styleType}</option>
                      ))}
                    </select>
                  )}
                  {errors.styleType && (
                    <p className="text-sm text-red-500">
                      {errors.styleType.message as string}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="bio">Biography</Label>
                  <textarea
                    id="bio"
                    className="flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    {...register("bio", { required: "Bio is required" })}
                    defaultValue={editCelebrity?.bio || ""}
                  />
                  {errors.bio && (
                    <p className="text-sm text-red-500">
                      {errors.bio.message as string}
                    </p>
                  )}
                </div>
              </div>
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
          </DialogContent>
        </Dialog>
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
