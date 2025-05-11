
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileUp, Loader2, PlusCircle } from "lucide-react";
import { uploadBlogPost } from "@/utils/blogUploader";
import { toast } from "@/components/ui/use-toast";
import { newBlogPost } from "@/data/sampleBlogPost";
import { wamiqaGabbiArticle } from "@/data/wamiqa-gabbi-article";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const SampleBlogUploader: React.FC = () => {
  const queryClient = useQueryClient();
  const [postType, setPostType] = useState<'sample' | 'wamiqa'>('sample');

  const uploadMutation = useMutation({
    mutationFn: () => uploadBlogPost(postType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      toast({
        title: `${postType === 'wamiqa' ? 'Wamiqa Gabbi article' : 'Sample blog post'} uploaded`,
        description: `The ${postType === 'wamiqa' ? 'Wamiqa Gabbi article' : 'sample blog post'} has been added successfully`,
      });
    },
    onError: (error) => {
      console.error(`Error uploading ${postType === 'wamiqa' ? 'Wamiqa Gabbi article' : 'sample blog post'}:`, error);
      toast({
        title: "Error",
        description: `Failed to upload ${postType === 'wamiqa' ? 'Wamiqa Gabbi article' : 'sample blog post'}. Please try again.`,
        variant: "destructive",
      });
    }
  });

  const articleOptions = [
    { value: 'sample', title: newBlogPost.title, type: 'sample' as const },
    { value: 'wamiqa', title: wamiqaGabbiArticle.title, type: 'wamiqa' as const }
  ];

  const handleSelectArticle = (type: 'sample' | 'wamiqa') => {
    setPostType(type);
  };

  return (
    <div className="mb-6 p-4 border border-dashed border-primary/40 rounded-lg bg-secondary/20">
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-medium">Sample Blog Articles</h3>
        <p className="text-muted-foreground text-sm">
          Upload a pre-written article to get started:
        </p>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mt-2">
          <div className="text-sm font-medium">
            Selected: {postType === 'wamiqa' ? 'Wamiqa Gabbi Article' : 'Zendaya Sample Post'}
          </div>
          
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Select Article
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {articleOptions.map((option) => (
                  <DropdownMenuItem 
                    key={option.value}
                    onClick={() => handleSelectArticle(option.type)}
                  >
                    {option.title.length > 40 ? `${option.title.substring(0, 40)}...` : option.title}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button 
              onClick={() => uploadMutation.mutate()}
              disabled={uploadMutation.isPending}
              size="sm"
            >
              {uploadMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <FileUp className="mr-2 h-4 w-4" />
                  Upload Article
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SampleBlogUploader;
