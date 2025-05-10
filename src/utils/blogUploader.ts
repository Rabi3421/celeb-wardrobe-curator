
import { supabase } from "@/integrations/supabase/client";
import { newBlogPost } from "@/data/sampleBlogPost";

export const uploadBlogPost = async () => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .insert({
        title: newBlogPost.title,
        slug: newBlogPost.slug || convertToSlug(newBlogPost.title),
        excerpt: newBlogPost.excerpt,
        content: newBlogPost.content,
        image: newBlogPost.image,
        date: newBlogPost.date,
        category: newBlogPost.category,
        author: newBlogPost.author,
        keywords: newBlogPost.keywords ? newBlogPost.keywords.join(', ') : '',
        meta_description: newBlogPost.metaDescription || newBlogPost.excerpt,
        structured_data: JSON.stringify(newBlogPost.structuredData || {})
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

// Helper function to convert title to SEO-friendly slug
const convertToSlug = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
};

// Usage example (can be called from another component or admin page)
// import { uploadBlogPost } from "@/utils/blogUploader";
// const result = await uploadBlogPost();
// if (result.success) {
//   toast({ description: "Blog post uploaded successfully!" });
// }
