
import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Outfit, Celebrity } from "@/types/data";
import { outfits, celebrities } from "@/data/mockData";
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
import { Plus, Search, Edit, Trash, Eye, Image } from "lucide-react";
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

const AdminOutfits: React.FC = () => {
  const [outfitList, setOutfitList] = useState<Outfit[]>(outfits);
  const [searchTerm, setSearchTerm] = useState("");
  const [editOutfit, setEditOutfit] = useState<Outfit | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [outfitToDelete, setOutfitToDelete] = useState<Outfit | null>(null);

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();

  // Filter outfits based on search term
  const filteredOutfits = outfitList.filter((outfit) =>
    outfit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    outfit.celebrity.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onSubmit = (data: any) => {
    if (editOutfit) {
      // Update existing outfit
      const updated = outfitList.map((o) =>
        o.id === editOutfit.id ? { ...o, ...data } : o
      );
      setOutfitList(updated);
      toast({
        title: "Outfit updated",
        description: `${data.title} has been updated successfully`,
      });
    } else {
      // Add new outfit
      const newOutfit = {
        id: `outfit-${Date.now()}`,
        ...data,
      };
      setOutfitList([...outfitList, newOutfit]);
      toast({
        title: "Outfit added",
        description: `${data.title} has been added successfully`,
      });
    }
    reset();
    setEditOutfit(null);
  };

  const handleDelete = (outfit: Outfit) => {
    setOutfitToDelete(outfit);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (outfitToDelete) {
      setOutfitList(outfitList.filter((o) => o.id !== outfitToDelete.id));
      toast({
        title: "Outfit deleted",
        description: `${outfitToDelete.title} has been removed`,
      });
      setOutfitToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const handleEdit = (outfit: Outfit) => {
    setEditOutfit(outfit);
    // Set form values
    Object.keys(outfit).forEach((key) => {
      setValue(key, outfit[key as keyof Outfit]);
    });
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "";
    return new Date(dateString).toISOString().split('T')[0]; // Format as YYYY-MM-DD
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-serif text-2xl font-medium">Outfits</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Outfit
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {editOutfit ? "Edit Outfit" : "Add New Outfit"}
              </DialogTitle>
              <DialogDescription>
                Fill in the details for the outfit.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    {...register("title", { required: "Title is required" })}
                    defaultValue={editOutfit?.title || ""}
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500">
                      {errors.title.message as string}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="image">Image URL</Label>
                  <Input
                    id="image"
                    {...register("image", { required: "Image URL is required" })}
                    defaultValue={editOutfit?.image || ""}
                  />
                  {errors.image && (
                    <p className="text-sm text-red-500">
                      {errors.image.message as string}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="celebrityId">Celebrity</Label>
                  <select
                    id="celebrityId"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    {...register("celebrityId", { required: "Celebrity is required" })}
                    defaultValue={editOutfit?.celebrityId || ""}
                    onChange={(e) => {
                      // Set the celebrity name when celebrityId changes
                      const selected = celebrities.find(c => c.id === e.target.value);
                      if (selected) {
                        setValue("celebrity", selected.name);
                      }
                    }}
                  >
                    <option value="">Select a celebrity</option>
                    {celebrities.map(celebrity => (
                      <option key={celebrity.id} value={celebrity.id}>{celebrity.name}</option>
                    ))}
                  </select>
                  {errors.celebrityId && (
                    <p className="text-sm text-red-500">
                      {errors.celebrityId.message as string}
                    </p>
                  )}
                </div>

                <input
                  type="hidden"
                  {...register("celebrity")}
                  defaultValue={editOutfit?.celebrity || ""}
                />

                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    {...register("description", { required: "Description is required" })}
                    defaultValue={editOutfit?.description || ""}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500">
                      {errors.description.message as string}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="occasion">Occasion</Label>
                  <Input
                    id="occasion"
                    {...register("occasion")}
                    defaultValue={editOutfit?.occasion || ""}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    {...register("date")}
                    defaultValue={formatDate(editOutfit?.date)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="fullDescription">Full Description</Label>
                  <textarea
                    id="fullDescription"
                    className="flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    {...register("fullDescription")}
                    defaultValue={editOutfit?.fullDescription || ""}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">
                  {editOutfit ? "Update Outfit" : "Add Outfit"}
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
              {filteredOutfits.length === 0 ? (
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
      </div>

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
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminOutfits;
