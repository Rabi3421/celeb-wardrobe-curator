
import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { celebrities, outfits, blogPosts } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Edit, Trash, Tag } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type TagType = {
  id: string;
  name: string;
  type: string;
  count: number;
};

const AdminTags: React.FC = () => {
  // Extract all categories and tags
  const getCategoryCount = (category: string) => {
    return celebrities.filter(c => c.category === category).length;
  };
  
  const getStyleTypeCount = (styleType: string) => {
    return celebrities.filter(c => c.styleType === styleType).length;
  };

  const getOccasionCount = (occasion: string) => {
    return outfits.filter(o => o.occasion === occasion).length;
  };

  const getBlogCategoryCount = (category: string) => {
    return blogPosts.filter(p => p.category === category).length;
  };

  const getOutfitTagCount = (tag: string) => {
    return outfits.filter(o => o.tags?.includes(tag)).length;
  };

  // Initial data setup
  const initialCategories: TagType[] = Array.from(new Set(celebrities.map(c => c.category)))
    .map(category => ({
      id: `category-${category}`,
      name: category,
      type: 'category',
      count: getCategoryCount(category)
    }));

  const initialStyleTypes: TagType[] = Array.from(new Set(celebrities.map(c => c.styleType)))
    .map(styleType => ({
      id: `styletype-${styleType}`,
      name: styleType,
      type: 'styleType',
      count: getStyleTypeCount(styleType)
    }));

  const initialOccasions: TagType[] = Array.from(new Set(outfits.map(o => o.occasion).filter(Boolean) as string[]))
    .map(occasion => ({
      id: `occasion-${occasion}`,
      name: occasion,
      type: 'occasion',
      count: getOccasionCount(occasion)
    }));

  const initialBlogCategories: TagType[] = Array.from(new Set(blogPosts.map(p => p.category)))
    .map(category => ({
      id: `blogcategory-${category}`,
      name: category,
      type: 'blogCategory',
      count: getBlogCategoryCount(category)
    }));

  // Extract all tags from outfit tags array and flatten
  const allTags: string[] = outfits
    .map(outfit => outfit.tags || [])
    .flat()
    .filter(Boolean);

  const initialTags: TagType[] = Array.from(new Set(allTags))
    .map(tag => ({
      id: `tag-${tag}`,
      name: tag,
      type: 'tag',
      count: getOutfitTagCount(tag)
    }));

  // States
  const [activeTab, setActiveTab] = useState("categories");
  const [categories, setCategories] = useState<TagType[]>(initialCategories);
  const [styleTypes, setStyleTypes] = useState<TagType[]>(initialStyleTypes);
  const [occasions, setOccasions] = useState<TagType[]>(initialOccasions);
  const [blogCategories, setBlogCategories] = useState<TagType[]>(initialBlogCategories);
  const [outfitTags, setOutfitTags] = useState<TagType[]>(initialTags);
  
  const [editingTag, setEditingTag] = useState<TagType | null>(null);
  const [newTagName, setNewTagName] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tagToDelete, setTagToDelete] = useState<TagType | null>(null);

  // Helper function to get the correct list based on active tab
  const getCurrentList = (): TagType[] => {
    switch (activeTab) {
      case "categories":
        return categories;
      case "styleTypes":
        return styleTypes;
      case "occasions":
        return occasions;
      case "blogCategories":
        return blogCategories;
      case "outfitTags":
        return outfitTags;
      default:
        return categories;
    }
  };

  // Helper function to update the correct list based on active tab
  const updateCurrentList = (updatedList: TagType[]) => {
    switch (activeTab) {
      case "categories":
        setCategories(updatedList);
        break;
      case "styleTypes":
        setStyleTypes(updatedList);
        break;
      case "occasions":
        setOccasions(updatedList);
        break;
      case "blogCategories":
        setBlogCategories(updatedList);
        break;
      case "outfitTags":
        setOutfitTags(updatedList);
        break;
    }
  };

  const handleAddTag = () => {
    if (!newTagName.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Name cannot be empty",
      });
      return;
    }

    const currentList = getCurrentList();
    
    if (currentList.some(tag => tag.name.toLowerCase() === newTagName.toLowerCase())) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "This name already exists",
      });
      return;
    }

    const newTag: TagType = {
      id: `${activeTab.slice(0, -1)}-${Date.now()}`,
      name: newTagName,
      type: activeTab.slice(0, -1),
      count: 0
    };

    updateCurrentList([...currentList, newTag]);
    setNewTagName("");
    
    toast({
      title: "Success",
      description: `${newTagName} has been added`,
    });
  };

  const handleEditTag = (tag: TagType) => {
    setEditingTag(tag);
    setNewTagName(tag.name);
  };

  const handleUpdateTag = () => {
    if (!newTagName.trim() || !editingTag) return;

    const currentList = getCurrentList();
    const updatedList = currentList.map(tag => 
      tag.id === editingTag.id ? { ...tag, name: newTagName } : tag
    );

    updateCurrentList(updatedList);
    setEditingTag(null);
    setNewTagName("");
    
    toast({
      title: "Updated",
      description: `Tag has been renamed to ${newTagName}`,
    });
  };

  const handleDeleteClick = (tag: TagType) => {
    setTagToDelete(tag);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!tagToDelete) return;

    const currentList = getCurrentList();
    const updatedList = currentList.filter(tag => tag.id !== tagToDelete.id);

    updateCurrentList(updatedList);
    setDeleteDialogOpen(false);
    setTagToDelete(null);
    
    toast({
      title: "Deleted",
      description: `${tagToDelete.name} has been removed`,
    });
  };

  const getTabTitle = (): string => {
    switch (activeTab) {
      case "categories":
        return "Celebrity Categories";
      case "styleTypes":
        return "Celebrity Style Types";
      case "occasions":
        return "Outfit Occasions";
      case "blogCategories":
        return "Blog Categories";
      case "outfitTags":
        return "Outfit Tags";
      default:
        return "Categories";
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-serif text-2xl font-medium">Tags & Categories</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage {getTabTitle()}</CardTitle>
          <CardDescription>
            Add, edit, or delete the tags and categories used throughout your site
          </CardDescription>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
            <TabsList>
              <TabsTrigger value="categories">Celebrity Categories</TabsTrigger>
              <TabsTrigger value="styleTypes">Style Types</TabsTrigger>
              <TabsTrigger value="occasions">Occasions</TabsTrigger>
              <TabsTrigger value="blogCategories">Blog Categories</TabsTrigger>
              <TabsTrigger value="outfitTags">Outfit Tags</TabsTrigger>
            </TabsList>
          
            <div className="mt-4">
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <Input
                    placeholder={`Add new ${activeTab.slice(0, -1)}...`}
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                  />
                </div>
                {editingTag ? (
                  <div className="flex gap-2">
                    <Button onClick={handleUpdateTag}>Update</Button>
                    <Button variant="outline" onClick={() => {
                      setEditingTag(null);
                      setNewTagName("");
                    }}>
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button onClick={handleAddTag}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add {activeTab.slice(0, -1)}
                  </Button>
                )}
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Usage Count</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getCurrentList().length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center h-32">
                          No {activeTab} found
                        </TableCell>
                      </TableRow>
                    ) : (
                      getCurrentList().map((tag) => (
                        <TableRow key={tag.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Tag className="h-4 w-4 text-muted-foreground" />
                              <span>{tag.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{tag.count}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button size="sm" variant="outline" onClick={() => handleEditTag(tag)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-500 hover:text-red-700"
                                onClick={() => handleDeleteClick(tag)}
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
          </Tabs>
        </CardHeader>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {tagToDelete?.type}</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{tagToDelete?.name}"? This may affect content that uses this {tagToDelete?.type}.
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

export default AdminTags;
