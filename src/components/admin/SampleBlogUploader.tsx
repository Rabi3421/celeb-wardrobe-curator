
import React from "react";
import { Button } from "@/components/ui/button";
import { FileUp, Loader2 } from "lucide-react";
import { uploadBlogPost } from "@/utils/blogUploader";
import { toast } from "@/components/ui/use-toast";
import { newBlogPost } from "@/data/sampleBlogPost";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const SampleBlogUploader: React.FC = () => {
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: uploadBlogPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      toast({
        title: "Sample blog post uploaded",
        description: "The sample blog post has been added successfully",
      });
    },
    onError: (error) => {
      console.error('Error uploading sample blog post:', error);
      toast({
        title: "Error",
        description: "Failed to upload sample blog post. Please try again.",
        variant: "destructive",
      });
    }
  });

  return (
    <div className="mb-6 p-4 border border-dashed border-primary/40 rounded-lg bg-secondary/20">
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-medium">Sample Blog Post</h3>
        <p className="text-muted-foreground text-sm">
          Upload a pre-written sample blog post: "{newBlogPost.title}"
        </p>
        <div className="flex justify-end mt-2">
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
                Upload Sample Post
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SampleBlogUploader;
