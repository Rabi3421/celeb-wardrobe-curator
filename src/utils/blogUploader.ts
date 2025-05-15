
import { supabase } from "@/integrations/supabase/client";
import { newBlogPost } from "@/data/sampleBlogPost";
import { wamiqaGabbiArticle } from "@/data/wamiqa-gabbi-article";
import { tiktokFashionArticle } from "@/data/tiktok-fashion-article";

export type PostType = 'sample' | 'wamiqa' | 'tiktok';

// Helper function to convert title to SEO-friendly slug
const convertToSlug = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
};

// Helper function to generate meta description if one isn't provided
const generateMetaDescription = (excerpt: string) => {
  return excerpt.length > 160 ? excerpt.substring(0, 157) + '...' : excerpt;
};

// Helper function to generate JSON-LD structured data for a blog post
const generateStructuredData = (postData: any) => {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": postData.title,
    "image": [postData.image],
    "datePublished": postData.date,
    "dateModified": postData.date,
    "author": {
      "@type": "Person",
      "name": postData.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "CelebrityPersona",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.celebritypersona.com/logo.png"
      }
    },
    "description": postData.excerpt,
    "keywords": postData.keywords || `${postData.category}, celebrity fashion, style inspiration`
  };
};

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
    
    // Generate SEO-friendly slug if not provided
    const slug = selectedPost.slug || convertToSlug(selectedPost.title);
    
    // Generate meta description if not provided
    const metaDescription = selectedPost.metaDescription || generateMetaDescription(selectedPost.excerpt);
    
    // Generate structured data if not provided
    const structuredData = selectedPost.structuredData || generateStructuredData(selectedPost);
    
    // Keywords for better SEO
    const keywords = selectedPost.keywords 
      ? (typeof selectedPost.keywords === 'string' ? selectedPost.keywords : selectedPost.keywords.join(', ')) 
      : `${selectedPost.category}, celebrity fashion, ${selectedPost.author}, style trends`;
    
    const { data, error } = await supabase
      .from('blog_posts')
      .insert({
        title: selectedPost.title,
        slug: slug,
        excerpt: selectedPost.excerpt,
        content: selectedPost.content,
        image: selectedPost.image,
        date: selectedPost.date,
        category: selectedPost.category,
        author: selectedPost.author,
        keywords: keywords,
        meta_description: metaDescription,
        structured_data: JSON.stringify(structuredData)
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

// Export helper functions for reuse
export {
  convertToSlug,
  generateMetaDescription,
  generateStructuredData
};
