
import { supabase } from "@/integrations/supabase/client";
import { newBlogPost } from "@/data/sampleBlogPost";
import { wamiqaGabbiArticle } from "@/data/wamiqa-gabbi-article";
import { tiktokFashionArticle } from "@/data/tiktok-fashion-article";

export type PostType = 'sample' | 'wamiqa' | 'tiktok';

export const uploadBlogPost = async (postType: PostType = 'sample') => {
  try {
    let selectedPost;
    
    switch(postType) {
      case 'wamiqa':
        selectedPost = wamiqaGabbiArticle;
        break;
      case 'tiktok':
        selectedPost = tiktokFashionArticle;
        break;
      case 'sample':
      default:
        selectedPost = newBlogPost;
    }
    
    const { data, error } = await supabase
      .from('blog_posts')
      .insert({
        title: selectedPost.title,
        slug: selectedPost.slug || convertToSlug(selectedPost.title),
        excerpt: selectedPost.excerpt,
        content: selectedPost.content,
        image: selectedPost.image,
        date: selectedPost.date,
        category: selectedPost.category,
        author: selectedPost.author,
        keywords: selectedPost.keywords ? (typeof selectedPost.keywords === 'string' ? selectedPost.keywords : selectedPost.keywords.join(', ')) : '',
        meta_description: selectedPost.metaDescription || selectedPost.excerpt,
        structured_data: JSON.stringify(selectedPost.structuredData || {})
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
