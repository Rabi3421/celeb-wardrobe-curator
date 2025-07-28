import React, { useState, useEffect, useMemo } from 'react';
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
import { deleteCelebrityAsync, fetchCelebritiesAsync, setSelectedCelebrity } from '@/store/slices/celebritySlice';
import { useNavigate } from 'react-router-dom';

// Helper to get unique tags and categories
const getUnique = (arr: Celebrity[], key: keyof Celebrity) =>
  Array.from(new Set(arr.flatMap(item => Array.isArray(item[key]) ? item[key] as string[] : [item[key] as string]))).filter(Boolean);

const AdminCelebrities = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { celebrities, isLoading, selectedCelebrity } = useAppSelector((state) => state.celebrities);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'name-asc' | 'name-desc'>('date-desc');

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
      setIsProcessing(true);
      try {
        await dispatch(deleteCelebrityAsync(id)).unwrap();
        toast.success('Celebrity deleted successfully');
        dispatch(fetchCelebritiesAsync()); // Refresh the list after delete
      } catch (error) {
        console.error('Error deleting celebrity:', error);
        toast.error('Failed to delete celebrity');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  // Open celebrity detail modal
  const openCelebrityDetail = (celebrity: Celebrity) => {
    dispatch(setSelectedCelebrity(celebrity));
  };

  // Close celebrity detail modal
  const closeCelebrityDetail = () => {
    dispatch(setSelectedCelebrity(null));
  };

  // Unique tags and categories for filter dropdowns
  const allTags = useMemo(() => getUnique(celebrities, 'tags').flat(), [celebrities]);
  const allCategories = useMemo(() => getUnique(celebrities, 'category'), [celebrities]);

  // Filtered and sorted celebrities
  const filteredCelebrities = useMemo(() => {
    let filtered = celebrities;

    // Search by name
    if (search.trim()) {
      filtered = filtered.filter(c =>
        c.name?.toLowerCase().includes(search.trim().toLowerCase())
      );
    }

    // Filter by tag
    if (tagFilter) {
      filtered = filtered.filter(c =>
        Array.isArray(c.tags) && c.tags.includes(tagFilter)
      );
    }

    // Filter by category
    if (categoryFilter) {
      filtered = filtered.filter(c =>
        c.category === categoryFilter
      );
    }

    // Sorting
    filtered = [...filtered].sort((a, b) => {
      if (sortBy === 'date-desc') {
        return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime();
      }
      if (sortBy === 'date-asc') {
        return new Date(a.createdAt || '').getTime() - new Date(b.createdAt || '').getTime();
      }
      if (sortBy === 'name-asc') {
        return (a.name || '').localeCompare(b.name || '');
      }
      if (sortBy === 'name-desc') {
        return (b.name || '').localeCompare(a.name || '');
      }
      return 0;
    });

    return filtered;
  }, [celebrities, search, tagFilter, categoryFilter, sortBy]);
  console.log("Filtered celebrities:", filteredCelebrities);
  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold">Manage Celebrities</h1>
          <div className="flex flex-wrap gap-2 items-center">
            {/* Search */}
            <input
              type="text"
              placeholder="Search by name"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="border rounded px-3 py-1 text-sm"
            />
            {/* Tag Filter */}
            <select
              value={tagFilter}
              onChange={e => setTagFilter(e.target.value)}
              className="border rounded px-3 py-1 text-sm"
            >
              <option value="">All Tags</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="border rounded px-3 py-1 text-sm"
            >
              <option value="">All Categories</option>
              {allCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {/* Sort */}
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="border rounded px-3 py-1 text-sm"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
            </select>
            {/* View Mode */}
            <div className="bg-white dark:bg-gray-800 rounded-md p-1">
              <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'grid' | 'list')}>
                <TabsList>
                  <TabsTrigger value="grid">Grid</TabsTrigger>
                  <TabsTrigger value="list">List</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <Button onClick={() => navigate('/admin/celebrities/add')}>Add New Celebrity</Button>          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center p-8">
            <p>Loading celebrities...</p>
          </div>
        ) : (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCelebrities.map(celebrity => (
                  <div
                    key={celebrity.id}
                    className="relative bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden group transition-transform hover:-translate-y-1 hover:shadow-2xl"
                  >
                    {/* Main Image with gradient overlay */}
                    <div className="relative h-56 w-full">
                      <img
                        src={celebrity.coverImage || 'https://via.placeholder.com/400x250?text=No+Image'}
                        alt={celebrity.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                      {/* Avatar */}
                      <div className="absolute left-4 -bottom-8 z-10">
                        <img
                          src={celebrity.infoboxImage || 'https://via.placeholder.com/80?text=No+Image'}
                          alt={celebrity.name}
                          className="w-16 h-16 rounded-full border-4 border-white shadow-lg object-cover bg-white"
                        />
                      </div>
                    </div>
                    {/* Card Content */}
                    <div className="pt-10 pb-4 px-4">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 truncate">{celebrity.name}</h3>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded">{celebrity.category}</span>
                        {celebrity.styleType && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">{celebrity.styleType}</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-300 mb-2 line-clamp-2">{celebrity.bio}</p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {Array.isArray(celebrity.tags) && celebrity.tags.map(tag => (
                          <span key={tag} className="bg-pink-100 text-pink-700 px-2 py-0.5 rounded text-xs">{tag}</span>
                        ))}
                      </div>
                      <div className="flex justify-between items-center gap-2 mt-2">
                        <Button
                          variant="outline"
                          className="w-1/2"
                          onClick={() => navigate('/admin/celebrities/add', { state: { celebrity } })}
                        >
                          View
                        </Button>
                        <Button
                          variant="destructive"
                          className="w-1/2"
                          onClick={() => handleDelete(celebrity._id)}
                        >
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
                      <th className="px-6 py-3 border-b text-left">Tags</th>
                      <th className="px-6 py-3 border-b text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCelebrities.map(celebrity => (
                      <tr key={celebrity._id}>
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
                          <div className="flex flex-wrap gap-1">
                            {Array.isArray(celebrity.tags) && celebrity.tags.map(tag => (
                              <span key={tag} className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded text-xs">{tag}</span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-3 border-b">
                          <div className="flex justify-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => openCelebrityDetail(celebrity)}>
                              View
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDelete(celebrity._id)}>
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

        {/* Celebrity Detail Dialog */}
        <Dialog open={!!selectedCelebrity} onOpenChange={closeCelebrityDetail}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Celebrity Details</DialogTitle>
            </DialogHeader>
            {selectedCelebrity && <CelebrityDetail celebrity={selectedCelebrity} />}
          </DialogContent>
        </Dialog>
        {isProcessing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
            <div className="flex flex-col items-center">
              <svg className="animate-spin h-12 w-12 text-purple-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              <span className="text-white text-lg font-semibold">Processing...</span>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminCelebrities;