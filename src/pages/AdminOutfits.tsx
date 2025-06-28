import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Outfit } from '@/types/data';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { fetchOutfitsAsync } from '@/store/slices/outfitSlice';

const AdminOutfits = () => {
  const dispatch = useAppDispatch();
  const { outfits, isLoading, error } = useAppSelector((state) => state.outfits);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedOutfit, setSelectedOutfit] = useState<Outfit | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Load outfits on mount
  useEffect(() => {
    dispatch(fetchOutfitsAsync({}));
  }, [dispatch]);

  // Handle add success
  const handleAddSuccess = () => {
    setIsAddDialogOpen(false);
    dispatch(fetchOutfitsAsync({}));
    toast.success('Outfit added successfully');
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this outfit?')) {
      try {
        // TODO: Implement delete API call with Redux
        console.log('Deleting outfit with ID:', id);
        toast.success('Outfit deleted successfully');
        dispatch(fetchOutfitsAsync({}));
      } catch (error) {
        console.error('Error deleting outfit:', error);
        toast.error('Failed to delete outfit');
      }
    }
  };

  if (error) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => dispatch(fetchOutfitsAsync({}))}>
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
          <h1 className="text-3xl font-bold">Manage Outfits</h1>
          <div className="flex gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-md p-1">
              <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'grid' | 'list')}>
                <TabsList>
                  <TabsTrigger value="grid">Grid</TabsTrigger>
                  <TabsTrigger value="list">List</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <Button onClick={() => setIsAddDialogOpen(true)}>Add New Outfit</Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center p-8">
            <p>Loading outfits...</p>
          </div>
        ) : (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {outfits.map(outfit => (
                  <div 
                    key={outfit.id} 
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
                  >
                    <div className="relative h-48">
                      <img 
                        src={outfit.image || 'https://via.placeholder.com/400x200?text=No+Image'} 
                        alt={outfit.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-xl font-semibold mb-2">{outfit.title}</h3>
                      <p className="text-gray-500 mb-2">{outfit.celebrity}</p>
                      <p className="text-sm mb-2">{outfit.occasion}</p>
                      <p className="text-sm mb-4 line-clamp-2">{outfit.description}</p>
                      <div className="flex justify-between">
                        <Button variant="outline" onClick={() => setSelectedOutfit(outfit)}>
                          View Details
                        </Button>
                        <Button variant="destructive" onClick={() => handleDelete(outfit.id)}>
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
                      <th className="px-6 py-3 border-b text-left">Celebrity</th>
                      <th className="px-6 py-3 border-b text-left">Occasion</th>
                      <th className="px-6 py-3 border-b text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {outfits.map(outfit => (
                      <tr key={outfit.id}>
                        <td className="px-6 py-3 border-b">
                          <div className="w-16 h-16 overflow-hidden rounded">
                            <img 
                              src={outfit.image || 'https://via.placeholder.com/150?text=No+Image'} 
                              alt={outfit.title} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </td>
                        <td className="px-6 py-3 border-b">{outfit.title}</td>
                        <td className="px-6 py-3 border-b">{outfit.celebrity}</td>
                        <td className="px-6 py-3 border-b">{outfit.occasion}</td>
                        <td className="px-6 py-3 border-b">
                          <div className="flex justify-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => setSelectedOutfit(outfit)}>
                              View
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDelete(outfit.id)}>
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
        
        {/* Add Outfit Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Outfit</DialogTitle>
            </DialogHeader>
            <div className="p-4">
              <p>Outfit form component would go here</p>
              <Button onClick={handleAddSuccess}>Save Outfit</Button>
            </div>
          </DialogContent>
        </Dialog>
        
        {/* Outfit Detail Dialog */}
        <Dialog open={!!selectedOutfit} onOpenChange={() => setSelectedOutfit(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Outfit Details</DialogTitle>
            </DialogHeader>
            {selectedOutfit && (
              <div className="p-4">
                <img 
                  src={selectedOutfit.image} 
                  alt={selectedOutfit.title}
                  className="w-full h-64 object-cover rounded mb-4"
                />
                <h3 className="text-xl font-semibold mb-2">{selectedOutfit.title}</h3>
                <p className="mb-2"><strong>Celebrity:</strong> {selectedOutfit.celebrity}</p>
                <p className="mb-2"><strong>Occasion:</strong> {selectedOutfit.occasion}</p>
                <p className="mb-2"><strong>Date:</strong> {selectedOutfit.date}</p>
                <p className="mb-4">{selectedOutfit.fullDescription || selectedOutfit.description}</p>
                {selectedOutfit.tags && (
                  <div className="flex flex-wrap gap-2">
                    {selectedOutfit.tags.map((tag, index) => (
                      <span key={index} className="bg-gray-200 px-2 py-1 rounded text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminOutfits;
