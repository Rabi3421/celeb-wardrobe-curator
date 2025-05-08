
import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { BlogPost } from "@/types/data";
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
import { Plus, Search, Edit, Trash, Eye, FileText, Loader2 } from "lucide-react";
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
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const AdminBlog: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [editPost, setEditPost] = useState<BlogPost | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null);
  const queryClient = useQueryClient();

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();

  // Fetch blog posts from Supabase
  const { data: blogPosts = [], isLoading } = useQuery({
    queryKey: ['blogPosts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) {
        console.error('Error fetching blog posts:', error);
        throw error;
      }
      
      return data.map(post => ({
        id: post.id,
        title: post.title,
        image: post.image,
        excerpt: post.excerpt,
        content: post.content,
        author: post.author,
        category: post.category,
        date: post.date
      }));
    }
  });

  // Fetch categories from Supabase
  const { data: categories = [] } = useQuery({
    queryKey: ['blogCategories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('name')
        .eq('type', 'blog')
        .order('name');
      
      if (error) {
        console.error('Error fetching blog categories:', error);
        return [];
      }
      
      return data.map(category => category.name);
    }
  });

  // Filter posts based on search term
  const filteredPosts = blogPosts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Add blog post mutation
  const addPostMutation = useMutation({
    mutationFn: async (data: any) => {
      const { data: newPost, error } = await supabase
        .from('blog_posts')
        .insert([{
          title: data.title,
          image: data.image,
          excerpt: data.excerpt,
          content: data.content,
          author: data.author,
          category: data.category,
          date: data.date || new Date().toISOString().split('T')[0]
        }])
        .select()
        .single();

      if (error) {
        console.error('Error adding blog post:', error);
        throw error;
      }

      return newPost;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      toast({
        title: "Blog post added",
        description: "Your blog post has been added successfully",
      });
      reset();
    },
    onError: (error) => {
      console.error('Error adding blog post:', error);
      toast({
        title: "Error",
        description: "Failed to add blog post. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Update blog post mutation
  const updatePostMutation = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase
        .from('blog_posts')
        .update({
          title: data.title,
          image: data.image,
          excerpt: data.excerpt,
          content: data.content,
          author: data.author,
          category: data.category,
          date: data.date,
          updated_at: new Date().toISOString()
        })
        .eq('id', data.id);

      if (error) {
        console.error('Error updating blog post:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      toast({
        title: "Blog post updated",
        description: "Your blog post has been updated successfully",
      });
      setEditPost(null);
      reset();
    },
    onError: (error) => {
      console.error('Error updating blog post:', error);
      toast({
        title: "Error",
        description: "Failed to update blog post. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Delete blog post mutation
  const deletePostMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting blog post:', error);
        throw error;
      }

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      toast({
        title: "Blog post deleted",
        description: "Your blog post has been removed successfully",
      });
      setPostToDelete(null);
      setDeleteDialogOpen(false);
    },
    onError: (error) => {
      console.error('Error deleting blog post:', error);
      toast({
        title: "Error",
        description: "Failed to delete blog post. Please try again.",
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: any) => {
    if (editPost) {
      updatePostMutation.mutate({ ...data, id: editPost.id });
    } else {
      addPostMutation.mutate(data);
    }
  };

  const handleDelete = (post: BlogPost) => {
    setPostToDelete(post);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (postToDelete) {
      deletePostMutation.mutate(postToDelete.id);
    }
  };

  const handleEdit = (post: BlogPost) => {
    setEditPost(post);
    // Set form values
    Object.keys(post).forEach((key) => {
      setValue(key as any, post[key as keyof BlogPost]);
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toISOString().split('T')[0]; // Format as YYYY-MM-DD
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-serif text-2xl font-medium">Blog Posts</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Blog Post
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>
                {editPost ? "Edit Blog Post" : "Add New Blog Post"}
              </DialogTitle>
              <DialogDescription>
                Fill in the details for the blog post.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    {...register("title", { required: "Title is required" })}
                    defaultValue={editPost?.title || ""}
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500">
                      {errors.title.message as string}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="image">Featured Image URL</Label>
                  <Input
                    id="image"
                    {...register("image", { required: "Image URL is required" })}
                    defaultValue={editPost?.image || ""}
                  />
                  {errors.image && (
                    <p className="text-sm text-red-500">
                      {errors.image.message as string}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <select
                      id="category"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                      {...register("category", { required: "Category is required" })}
                      defaultValue={editPost?.category || ""}
                    >
                      <option value="">Select a category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                      <option value="new-category">+ Add new category</option>
                    </select>
                    {errors.category && (
                      <p className="text-sm text-red-500">
                        {errors.category.message as string}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="author">Author</Label>
                    <Input
                      id="author"
                      {...register("author", { required: "Author name is required" })}
                      defaultValue={editPost?.author || ""}
                    />
                    {errors.author && (
                      <p className="text-sm text-red-500">
                        {errors.author.message as string}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="date">Publish Date</Label>
                  <Input
                    id="date"
                    type="date"
                    {...register("date")}
                    defaultValue={editPost ? formatDate(editPost.date) : formatDate(new Date().toISOString())}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <textarea
                    id="excerpt"
                    className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    {...register("excerpt", { required: "Excerpt is required" })}
                    defaultValue={editPost?.excerpt || ""}
                  />
                  {errors.excerpt && (
                    <p className="text-sm text-red-500">
                      {errors.excerpt.message as string}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="content">Full Content</Label>
                  <textarea
                    id="content"
                    className="flex min-h-32 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    {...register("content", { required: "Content is required" })}
                    defaultValue={editPost?.content || ""}
                  />
                  {errors.content && (
                    <p className="text-sm text-red-500">
                      {errors.content.message as string}
                    </p>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button 
                  type="submit"
                  disabled={addPostMutation.isPending || updatePostMutation.isPending}
                >
                  {(addPostMutation.isPending || updatePostMutation.isPending) && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {editPost ? "Update Blog Post" : "Add Blog Post"}
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
              placeholder="Search blog posts..."
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
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Published Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-32">
                    <div className="flex justify-center items-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredPosts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-32">
                    No blog posts found
                  </TableCell>
                </TableRow>
              ) : (
                filteredPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-secondary rounded overflow-hidden flex-shrink-0">
                          {post.image ? (
                            <img
                              src={post.image}
                              alt={post.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <FileText className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium line-clamp-1">{post.title}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1">{post.excerpt}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{post.category}</TableCell>
                    <TableCell>{post.author}</TableCell>
                    <TableCell>{new Date(post.date).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" asChild>
                          <a href={`/blog/${post.id}`} target="_blank" rel="noopener noreferrer">
                            <Eye className="h-4 w-4" />
                          </a>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(post)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDelete(post)}
                          disabled={deletePostMutation.isPending && postToDelete?.id === post.id}
                        >
                          {deletePostMutation.isPending && postToDelete?.id === post.id ? (
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
            <DialogTitle>Delete Blog Post</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{postToDelete?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deletePostMutation.isPending}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
              disabled={deletePostMutation.isPending}
            >
              {deletePostMutation.isPending ? (
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

export default AdminBlog;
