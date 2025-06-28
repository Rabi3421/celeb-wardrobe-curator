
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Celebrity } from '@/types/data';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import CelebrityForm from '@/components/admin/CelebrityForm';
import CelebrityDetail from '@/components/admin/CelebrityDetail';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { fetchCelebritiesAsync } from '@/store/slices/celebritySlice';

const AdminCelebrities = () => {
  const dispatch = useAppDispatch();
  const { celebrities, isLoading, error } = useAppSelector((state) => state.celebrities);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedCelebrity, setSelectedCelebrity] = useState<Celebrity | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Load celebrities on mount
  useEffect(() => {
    dispatch(fetchCelebritiesAsync());
  }, [dispatch]);

  // Handle add success
  const handleAddSuccess = () => {
    setIsAddDialogOpen(false);
    dispatch(fetchCelebritiesAsync());
    toast.success('Celebrity added successfully');
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this celebrity?')) {
      try {
        // TODO: Implement delete API call with Redux
        console.log('Deleting celebrity with ID:', id);
        toast.success('Celebrity deleted successfully');
        dispatch(fetchCelebritiesAsync());
      } catch (error) {
        console.error('Error deleting celebrity:', error);
        toast.error('Failed to delete celebrity');
      }
    }
  };

  // Open celebrity detail modal
  const openCelebrityDetail = (celebrity: Celebrity) => {
    setSelectedCelebrity(celebrity);
  };

  if (error) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => dispatch(fetchCelebritiesAsync())}>
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
          <h1 className="text-3xl font-bold">Manage Celebrities</h1>
          <div className="flex gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-md p-1">
              <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'grid' | 'list')}>
                <TabsList>
                  <TabsTrigger value="grid">Grid</TabsTrigger>
                  <TabsTrigger value="list">List</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <Button onClick={() => setIsAddDialogOpen(true)}>Add New Celebrity</Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center p-8">
            <p>Loading celebrities...</p>
          </div>
        ) : (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {celebrities.map(celebrity => (
                  <div 
                    key={celebrity.id} 
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
                  >
                    <div className="relative h-48">
                      <img 
                        src={celebrity.image || 'https://via.placeholder.com/400x200?text=No+Image'} 
                        alt={celebrity.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-xl font-semibold mb-2">{celebrity.name}</h3>
                      <p className="text-gray-500 mb-2">{celebrity.category}</p>
                      <p className="text-sm mb-4 line-clamp-2">{celebrity.bio}</p>
                      <div className="flex justify-between">
                        <Button variant="outline" onClick={() => openCelebrityDetail(celebrity)}>
                          View Details
                        </Button>
                        <Button variant="destructive" onClick={() => handleDelete(celebrity.id)}>
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
                      <th className="px-6 py-3 border-b text-left">Name</th>
                      <th className="px-6 py-3 border-b text-left">Category</th>
                      <th className="px-6 py-3 border-b text-left">Style</th>
                      <th className="px-6 py-3 border-b text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {celebrities.map(celebrity => (
                      <tr key={celebrity.id}>
                        <td className="px-6 py-3 border-b">
                          <div className="w-16 h-16 overflow-hidden rounded-full">
                            <img 
                              src={celebrity.image || 'https://via.placeholder.com/150?text=No+Image'} 
                              alt={celebrity.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </td>
                        <td className="px-6 py-3 border-b">{celebrity.name}</td>
                        <td className="px-6 py-3 border-b">{celebrity.category}</td>
                        <td className="px-6 py-3 border-b">{celebrity.styleType}</td>
                        <td className="px-6 py-3 border-b">
                          <div className="flex justify-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => openCelebrityDetail(celebrity)}>
                              View
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDelete(celebrity.id)}>
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
        
        {/* Add Celebrity Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Celebrity</DialogTitle>
            </DialogHeader>
            <CelebrityForm onSuccess={handleAddSuccess} />
          </DialogContent>
        </Dialog>
        
        {/* Celebrity Detail Dialog */}
        <Dialog open={!!selectedCelebrity} onOpenChange={() => setSelectedCelebrity(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Celebrity Details</DialogTitle>
            </DialogHeader>
            {selectedCelebrity && <CelebrityDetail celebrity={selectedCelebrity} />}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminCelebrities;
