import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { BlogPost } from "@/types/data";
import SampleBlogUploader from "@/components/admin/SampleBlogUploader";
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
import { convertToSlug, generateMetaDescription, generateStructuredData } from "@/utils/blogUploader";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const PAGE_SIZE = 10;

const AdminBlog: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [editPost, setEditPost] = useState<BlogPost | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const queryClient = useQueryClient();

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();

  const categories = [
    "Fashion",
    "Celebrity",
    "Style",
    "Beauty",
    "Lifestyle",
    "News"
  ];
  console.log("blogPosts:", blogPosts);
  // Fetch paginated blog posts from API
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`http://localhost:5000/api/blogs?page=${page}&limit=${PAGE_SIZE}`);
        setBlogPosts(res.data.data || []);
        setTotal(res.data.total || 0); // Adjust according to your API's response
      } catch (err) {
        setBlogPosts([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, [page]);

  // ...existing code...

  const deleteBlogPost = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/blogs/${id}`);
      setBlogPosts((prev) => prev.filter((post) => post._id !== id));
      toast({
        title: "Deleted",
        description: "Blog post deleted successfully.",
      });
      setDeleteDialogOpen(false);
      setPostToDelete(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete blog post.",
        variant: "destructive",
      });
    }
  };

  const confirmDelete = () => {
    if (postToDelete?._id) {
      deleteBlogPost(postToDelete._id);
    }
  };

  // ...existing code...

  // Filter posts based on search term
  const filteredPosts = blogPosts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toISOString().split('T')[0]; // Format as YYYY-MM-DD
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-serif text-2xl font-medium">Blog Posts</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button onClick={() => navigate("/blog/add")}>
              <Plus className="mr-2 h-4 w-4" />
              Add Blog Post
            </Button>
          </DialogTrigger>
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
          {/* Grid View */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {isLoading ? (
              <div className="col-span-full flex justify-center items-center h-32">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="col-span-full text-center h-32 flex items-center justify-center">
                No blog posts found
              </div>
            ) : (
              filteredPosts.map((post) => (
                <div key={post._id || post.id} className="bg-white rounded-xl shadow p-4 flex flex-col">
                  <div className="w-full h-40 bg-secondary rounded overflow-hidden mb-3 flex items-center justify-center">
                    {post.coverImage ? (
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FileText className="h-10 w-10 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h2 className="font-medium text-lg line-clamp-1">{post.title}</h2>
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{post.excerpt}</p>
                    <div className="flex flex-wrap gap-2 text-xs mb-2">
                      <span className="bg-gray-100 rounded px-2 py-0.5">
                        {Array.isArray(post.categories) ? post.categories[0] : post.category}
                      </span>
                      <span className="text-muted-foreground">{post.author}</span>
                      <span className="text-muted-foreground">
                        {new Date(post.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-2">
                    <Button size="sm" variant="outline" asChild>
                      <a href={`/blog/${post.slug || post._id}`} target="_blank" rel="noopener noreferrer">
                        <Eye className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate("/blog/add", { state: { post } })}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => {
                        setPostToDelete(post);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex justify-between items-center mt-4">
          <div>
            Page {page} of {totalPages || 1}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Prev
            </Button>
            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || totalPages === 0}
            >
              Next
            </Button>
          </div>
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
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminBlog;
