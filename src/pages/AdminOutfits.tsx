import React, { useState, useEffect, useRef } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import MediaUploader from "@/components/admin/MediaUploader";
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
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_CONFIG } from "@/config/api";

interface MediaFile {
  id?: string;
  file?: File;
  url: string;
  type: 'image' | 'video';
  displayOrder: number;
  isPrimary: boolean;
}

const AdminOutfits: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [editOutfit, setEditOutfit] = useState<any | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [outfitToDelete, setOutfitToDelete] = useState<any | null>(null);
  const [showAddEditForm, setShowAddEditForm] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const mediaUploaderRef = useRef<{ uploadAllMedia: () => Promise<MediaFile[]> }>(null);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  // Fetch outfits from your backend
  const { data: outfits = [], isLoading: isOutfitsLoading } = useQuery({
    queryKey: ['outfits'],
    queryFn: async () => {
      const response = await axios.get(
        `${API_CONFIG.baseUrl}/outfits?page=1&limit=100`,
        {
          headers: {
            api_key: API_CONFIG.websiteApiKey,
          },
        }
      );
      return response.data.data || [];
    }
  });
  console.log(outfits)
  // Mock celebrities loading
  const [celebrities, setCelebrities] = useState<Celebrity[]>([]);
  const [isCelebritiesLoading, setIsCelebritiesLoading] = useState(false);
  useEffect(() => {
    setIsCelebritiesLoading(true);
    // Replace with your real API call
    setTimeout(() => {
      setCelebrities([
        { id: "1", name: "Ranveer Singh" },
        { id: "2", name: "Kartik Aaryan" },
      ]);
      setIsCelebritiesLoading(false);
    }, 500);
  }, []);

  // Filtering
  const filteredOutfits = outfits.filter((outfit: any) =>
    outfit.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format date helper
  function formatDate(date?: string) {
    if (!date) return "";
    return new Date(date).toISOString().split("T")[0];
  }

  // React Hook Form
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();

  // Add/Update Outfit Mutations (mocked)
  const addOutfitMutation = useMutation({
    mutationFn: async (data: any) => {
      // Upload media to Firebase
      let uploadedMedia = mediaFiles;
      if (mediaUploaderRef.current) {
        uploadedMedia = await mediaUploaderRef.current.uploadAllMedia();
        setMediaFiles(uploadedMedia);
      }
      data.images = uploadedMedia.map((file: any) => file.url);
      // Send to backend
      await axios.post(`${API_CONFIG.baseUrl}/outfits`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outfits'] });
      setShowAddEditForm(false);
      toast({ title: "Outfit added", description: "Outfit added successfully" });
      reset();
      setMediaFiles([]);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to add outfit", variant: "destructive" });
    }
  });

  const updateOutfitMutation = useMutation({
    mutationFn: async (data: any) => {
      let uploadedMedia = mediaFiles;
      if (mediaUploaderRef.current) {
        uploadedMedia = await mediaUploaderRef.current.uploadAllMedia();
        setMediaFiles(uploadedMedia);
      }
      data.images = uploadedMedia.map((file: any) => file.url);
      await axios.put(`${API_CONFIG.baseUrl}/outfits/${editOutfit._id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outfits'] });
      setShowAddEditForm(false);
      toast({ title: "Outfit updated", description: "Outfit updated successfully" });
      reset();
      setMediaFiles([]);
      setEditOutfit(null);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update outfit", variant: "destructive" });
    }
  });

  // Handle form submit
  const onSubmit = (data: any) => {
    if (editOutfit) {
      updateOutfitMutation.mutate(data);
    } else {
      addOutfitMutation.mutate(data);
    }
  };

  // Handle edit
  const handleEdit = (outfit: any) => {
    navigate("/add-outfit", { state: { outfit } });
  };

  // Handle add
  const handleAdd = () => {
    setEditOutfit(null);
    setShowAddEditForm(true);
    setMediaFiles([]);
    reset();
  };

  // Handle delete
  const handleDelete = async (outfitId: string) => {
    try {
      await axios.delete(`${API_CONFIG.baseUrl}/outfits/${outfitId}`);
      queryClient.invalidateQueries({ queryKey: ['outfits'] });
      toast({
        title: "Outfit deleted",
        description: "The outfit has been removed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error deleting the outfit. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-serif text-2xl font-medium">Outfits</h1>
        <div className="flex gap-2">
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            onClick={() => setViewMode("list")}
            size="icon"
            title="List View"
          >
            <svg width="20" height="20" fill="none"><rect x="3" y="5" width="14" height="2" rx="1" fill="currentColor" /><rect x="3" y="9" width="14" height="2" rx="1" fill="currentColor" /><rect x="3" y="13" width="14" height="2" rx="1" fill="currentColor" /></svg>
          </Button>
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            onClick={() => setViewMode("grid")}
            size="icon"
            title="Grid View"
          >
            <svg width="20" height="20" fill="none"><rect x="3" y="3" width="6" height="6" rx="1" fill="currentColor" /><rect x="11" y="3" width="6" height="6" rx="1" fill="currentColor" /><rect x="3" y="11" width="6" height="6" rx="1" fill="currentColor" /><rect x="11" y="11" width="6" height="6" rx="1" fill="currentColor" /></svg>
          </Button>
          <Button onClick={() => navigate("/add-outfit")}>
            <Plus className="mr-2 h-4 w-4" />
            Add Outfit
          </Button>
        </div>
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
        {viewMode === "list" ? (
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
                  filteredOutfits.map((outfit: any) => (
                    <TableRow key={outfit._id}>
                      <TableCell>
                        <div className="w-16 h-20 bg-secondary rounded overflow-hidden">
                          {Array.isArray(outfit.images) &&
                            typeof outfit.images[0] === "string" &&
                            outfit.images[0] &&
                            outfit.images[0].startsWith("http") ? (
                            <img
                              src={outfit.images[0]}
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
                      <TableCell>{outfit.celebrity?.name || "-"}</TableCell>
                      <TableCell>{outfit.occasion || "-"}</TableCell>
                      <TableCell>
                        {outfit.createdAt ? new Date(outfit.createdAt).toLocaleDateString() : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="outline" asChild>
                            <a href={`/outfit/${outfit._id}`} target="_blank" rel="noopener noreferrer">
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
                            onClick={() => handleDelete(outfit._id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {isOutfitsLoading ? (
              <div className="col-span-full flex justify-center items-center h-32">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredOutfits.length === 0 ? (
              <div className="col-span-full text-center h-32">No outfits found</div>
            ) : (
              filteredOutfits.map((outfit: any) => (
                <div key={outfit._id} className="bg-white rounded-xl shadow p-4 flex flex-col">
                  <div className="w-full h-40 bg-secondary rounded overflow-hidden mb-3">
                    {Array.isArray(outfit.images) &&
                      typeof outfit.images[0] === "string" &&
                      outfit.images[0] &&
                      outfit.images[0].startsWith("http") ? (
                      <img
                        src={outfit.images[0]}
                        alt={outfit.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Image className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="font-semibold text-lg mb-1">{outfit.title}</div>
                  <div className="text-sm text-muted-foreground mb-2">{outfit.celebrity?.name || "-"}</div>
                  <div className="text-xs text-muted-foreground mb-2">{outfit.occasion || "-"}</div>
                  <div className="text-xs text-muted-foreground mb-2">{outfit.createdAt ? new Date(outfit.createdAt).toLocaleDateString() : "-"}</div>
                  <div className="flex gap-2 mt-auto">
                    <Button size="sm" variant="outline" asChild>
                      <a href={`/outfit/${outfit._id}`} target="_blank" rel="noopener noreferrer">
                        <Eye className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleEdit(outfit)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(outfit._id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Form Dialog */}
      <Dialog open={showAddEditForm} onOpenChange={setShowAddEditForm}>
        <DialogContent className="max-w-4xl max-h-[95vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {editOutfit ? "Edit Outfit" : "Add New Outfit"}
            </DialogTitle>
            <DialogDescription>
              Fill in the details for the outfit and upload images/videos.
            </DialogDescription>
          </DialogHeader>

          <form id="outfit-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
            <MediaUploader
              ref={mediaUploaderRef}
              outfitId={editOutfit?._id}
              existingMedia={mediaFiles}
              onMediaChange={setMediaFiles}
            />

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
                <Label htmlFor="celebrityId" className="font-medium">Celebrity *</Label>
                {isCelebritiesLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Loading celebrities...</span>
                  </div>
                ) : (
                  <select
                    id="celebrityId"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base"
                    {...register("celebrityId", { required: "Celebrity is required" })}
                    defaultValue={editOutfit?.celebrity?._id || ""}
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
            <DialogFooter className="pt-4 border-t">
              <Button variant="outline" type="button" onClick={() => setShowAddEditForm(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={addOutfitMutation.isPending || updateOutfitMutation.isPending}
              >
                {(addOutfitMutation.isPending || updateOutfitMutation.isPending) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {editOutfit ? "Update Outfit" : "Add Outfit"}
              </Button>
            </DialogFooter>
          </form>
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
            >
              Cancel
            </Button>
            {/* Add delete confirmation logic here if needed */}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminOutfits;