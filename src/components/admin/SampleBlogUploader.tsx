
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileUp, Loader2, PlusCircle } from "lucide-react";
import { uploadBlogPost, PostType } from "@/utils/blogUploader";
import { toast } from "@/components/ui/use-toast";
import { newBlogPost } from "@/data/sampleBlogPost";
import { wamiqaGabbiArticle } from "@/data/wamiqa-gabbi-article";
import { tiktokFashionArticle } from "@/data/tiktok-fashion-article";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const SampleBlogUploader: React.FC = () => {
  const queryClient = useQueryClient();
  const [postType, setPostType] = useState<PostType>('sample');

  const uploadMutation = useMutation({
    mutationFn: () => uploadBlogPost(postType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      toast({
        title: `${getArticleTitle(postType)} uploaded`,
        description: `The ${getArticleTitle(postType)} has been added successfully`,
      });
    },
    onError: (error) => {
      console.error(`Error uploading ${getArticleTitle(postType)}:`, error);
      toast({
        title: "Error",
        description: `Failed to upload ${getArticleTitle(postType)}. Please try again.`,
        variant: "destructive",
      });
    }
  });

  const getArticleTitle = (type: PostType): string => {
    switch(type) {
      case 'wamiqa':
        return 'Wamiqa Gabbi article';
      case 'tiktok':
        return 'TikTok Fashion Trends article';
      case 'sample':
      default:
        return 'sample blog post';
    }
  };

  const articleOptions = [
    { value: 'sample', title: newBlogPost.title, type: 'sample' as PostType },
    { value: 'wamiqa', title: wamiqaGabbiArticle.title, type: 'wamiqa' as PostType },
    { value: 'tiktok', title: tiktokFashionArticle.title, type: 'tiktok' as PostType }
  ];

  const handleSelectArticle = (type: PostType) => {
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
            Selected: {getArticleTitle(postType)}
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
