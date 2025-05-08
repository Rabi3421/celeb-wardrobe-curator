
import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Celebrity } from "@/types/data";
import { celebrities } from "@/data/mockData";
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
import { Plus, Search, Edit, Trash, Eye } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AdminCelebrities: React.FC = () => {
  const [celebrityList, setCelebrityList] = useState<Celebrity[]>(celebrities);
  const [searchTerm, setSearchTerm] = useState("");
  const [editCelebrity, setEditCelebrity] = useState<Celebrity | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [celebrityToDelete, setCelebrityToDelete] = useState<Celebrity | null>(null);

  const categories = Array.from(new Set(celebrities.map(c => c.category)));
  const styleTypes = Array.from(new Set(celebrities.map(c => c.styleType)));

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();

  // Filter celebrities based on search term
  const filteredCelebrities = celebrityList.filter((celebrity) =>
    celebrity.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onSubmit = (data: any) => {
    if (editCelebrity) {
      // Update existing celebrity
      const updated = celebrityList.map((c) =>
        c.id === editCelebrity.id ? { ...c, ...data } : c
      );
      setCelebrityList(updated);
      toast({
        title: "Celebrity updated",
        description: `${data.name} has been updated successfully`,
      });
    } else {
      // Add new celebrity
      const newCelebrity = {
        id: `celebrity-${Date.now()}`,
        ...data,
        outfitCount: 0,
      };
      setCelebrityList([...celebrityList, newCelebrity]);
      toast({
        title: "Celebrity added",
        description: `${data.name} has been added successfully`,
      });
    }
    reset();
    setEditCelebrity(null);
  };

  const handleDelete = (celebrity: Celebrity) => {
    setCelebrityToDelete(celebrity);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (celebrityToDelete) {
      setCelebrityList(celebrityList.filter((c) => c.id !== celebrityToDelete.id));
      toast({
        title: "Celebrity deleted",
        description: `${celebrityToDelete.name} has been removed`,
      });
      setCelebrityToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const handleEdit = (celebrity: Celebrity) => {
    setEditCelebrity(celebrity);
    // Set form values
    Object.keys(celebrity).forEach((key) => {
      setValue(key, celebrity[key as keyof Celebrity]);
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
                  {errors.category && (
                    <p className="text-sm text-red-500">
                      {errors.category.message as string}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="styleType">Style Type</Label>
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
                <Button type="submit">
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
              {filteredCelebrities.length === 0 ? (
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
            <DialogTitle>Delete Celebrity</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {celebrityToDelete?.name}? This action cannot be undone.
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

export default AdminCelebrities;
