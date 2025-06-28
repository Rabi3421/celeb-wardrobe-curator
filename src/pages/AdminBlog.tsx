import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { BlogPost } from '@/types/data';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { fetchBlogPostsAsync } from '@/store/slices/blogSlice';

const AdminBlog = () => {
  const dispatch = useAppDispatch();
  const { blogPosts, isLoading, error } = useAppSelector((state) => state.blogs);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Load blog posts on mount
  useEffect(() => {
    dispatch(fetchBlogPostsAsync({}));
  }, [dispatch]);

  // Handle add success
  const handleAddSuccess = () => {
    setIsAddDialogOpen(false);
    dispatch(fetchBlogPostsAsync({}));
    toast.success('Blog post added successfully');
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        // TODO: Implement delete API call with Redux
        console.log('Deleting blog post with ID:', id);
        toast.success('Blog post deleted successfully');
        dispatch(fetchBlogPostsAsync({}));
      } catch (error) {
        console.error('Error deleting blog post:', error);
        toast.error('Failed to delete blog post');
      }
    }
  };

  if (error) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => dispatch(fetchBlogPostsAsync({}))}>
            Retry
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Manage Blog Posts</h1>
          <div className="flex gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-md p-1">
              <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'grid' | 'list')}>
                <TabsList>
                  <TabsTrigger value="grid">Grid</TabsTrigger>
                  <TabsTrigger value="list">List</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <Button onClick={() => setIsAddDialogOpen(true)}>Add New Post</Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center p-8">
            <p>Loading blog posts...</p>
          </div>
        ) : (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogPosts.map(post => (
                  <div 
                    key={post.id} 
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
                  >
                    <div className="relative h-48">
                      <img 
                        src={post.image || 'https://via.placeholder.com/400x200?text=No+Image'} 
                        alt={post.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                      <p className="text-gray-500 mb-2">{post.category}</p>
                      <p className="text-sm mb-2">By {post.author}</p>
                      <p className="text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                      <div className="flex justify-between">
                        <Button variant="outline" onClick={() => setSelectedPost(post)}>
                          View Details
                        </Button>
                        <Button variant="destructive" onClick={() => handleDelete(post.id)}>
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow-md">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 border-b text-left">Image</th>
                      <th className="px-6 py-3 border-b text-left">Title</th>
                      <th className="px-6 py-3 border-b text-left">Category</th>
                      <th className="px-6 py-3 border-b text-left">Author</th>
                      <th className="px-6 py-3 border-b text-left">Date</th>
                      <th className="px-6 py-3 border-b text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blogPosts.map(post => (
                      <tr key={post.id}>
                        <td className="px-6 py-3 border-b">
                          <div className="w-16 h-16 overflow-hidden rounded">
                            <img 
                              src={post.image || 'https://via.placeholder.com/150?text=No+Image'} 
                              alt={post.title} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </td>
                        <td className="px-6 py-3 border-b">{post.title}</td>
                        <td className="px-6 py-3 border-b">{post.category}</td>
                        <td className="px-6 py-3 border-b">{post.author}</td>
                        <td className="px-6 py-3 border-b">{new Date(post.date).toLocaleDateString()}</td>
                        <td className="px-6 py-3 border-b">
                          <div className="flex justify-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => setSelectedPost(post)}>
                              View
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDelete(post.id)}>
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
        
        {/* Add Post Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Blog Post</DialogTitle>
            </DialogHeader>
            <div className="p-4">
              <p>Blog post form component would go here</p>
              <Button onClick={handleAddSuccess}>Save Post</Button>
            </div>
          </DialogContent>
        </Dialog>
        
        {/* Post Detail Dialog */}
        <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Blog Post Details</DialogTitle>
            </DialogHeader>
            {selectedPost && (
              <div className="p-4">
                <img 
                  src={selectedPost.image} 
                  alt={selectedPost.title}
                  className="w-full h-64 object-cover rounded mb-4"
                />
                <h3 className="text-xl font-semibold mb-2">{selectedPost.title}</h3>
                <p className="mb-2"><strong>Category:</strong> {selectedPost.category}</p>
                <p className="mb-2"><strong>Author:</strong> {selectedPost.author}</p>
                <p className="mb-2"><strong>Date:</strong> {new Date(selectedPost.date).toLocaleDateString()}</p>
                <p className="mb-4"><strong>Excerpt:</strong> {selectedPost.excerpt}</p>
                <div className="prose max-w-none">
                  <p>{selectedPost.content}</p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminBlog;
