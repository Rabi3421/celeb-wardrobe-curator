
import { supabase } from "@/integrations/supabase/client";
import { newBlogPost } from "@/data/sampleBlogPost";

export const uploadBlogPost = async () => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .insert({
        title: newBlogPost.title,
        excerpt: newBlogPost.excerpt,
        content: newBlogPost.content,
        image: newBlogPost.image,
        date: newBlogPost.date,
        category: newBlogPost.category,
        author: newBlogPost.author
      })
      .select();
    
    if (error) {
      console.error("Error uploading blog post:", error);
      return { success: false, error };
    }
    
    return { success: true, data };
  } catch (error) {
    console.error("Exception during blog post upload:", error);
    return { success: false, error };
  }
};

// Usage example (can be called from another component or admin page)
// import { uploadBlogPost } from "@/utils/blogUploader";
// const result = await uploadBlogPost();
// if (result.success) {
//   toast({ description: "Blog post uploaded successfully!" });
// }
