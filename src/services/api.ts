
import { supabase } from "@/integrations/supabase/client";
import { Celebrity, Outfit, BlogPost, AffiliateProduct } from "@/types/data";

// Celebrity APIs
export async function fetchCelebrities(): Promise<Celebrity[]> {
  const { data, error } = await supabase
    .from("celebrities")
    .select("*");
  
  if (error) {
    console.error("Error fetching celebrities:", error);
    return [];
  }
  
  return data || [];
}

export async function fetchCelebrityById(id: string): Promise<Celebrity | null> {
  const { data, error } = await supabase
    .from("celebrities")
    .select("*")
    .eq("id", id)
    .single();
  
  if (error) {
    console.error(`Error fetching celebrity with ID ${id}:`, error);
    return null;
  }
  
  return data;
}

// Outfit APIs
export async function fetchOutfits(): Promise<Outfit[]> {
  const { data, error } = await supabase
    .from("outfits")
    .select(`
      *,
      celebrities:celebrity_id (name)
    `);
  
  if (error) {
    console.error("Error fetching outfits:", error);
    return [];
  }
  
  // Transform the data to match the expected format
  return data.map((outfit) => ({
    ...outfit,
    celebrity: outfit.celebrities?.name || "Unknown Celebrity"
  })) || [];
}

export async function fetchOutfitById(id: string): Promise<Outfit | null> {
  const { data, error } = await supabase
    .from("outfits")
    .select(`
      *,
      celebrities:celebrity_id (name)
    `)
    .eq("id", id)
    .single();
  
  if (error) {
    console.error(`Error fetching outfit with ID ${id}:`, error);
    return null;
  }
  
  // Transform the data to match the expected format
  return data ? {
    ...data,
    celebrity: data.celebrities?.name || "Unknown Celebrity"
  } : null;
}

// Blog APIs
export async function fetchBlogPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*");
  
  if (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }
  
  return data || [];
}

export async function fetchBlogPostById(id: string): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .single();
  
  if (error) {
    console.error(`Error fetching blog post with ID ${id}:`, error);
    return null;
  }
  
  return data;
}

// Affiliate Products APIs
export async function fetchAffiliateProducts(): Promise<AffiliateProduct[]> {
  const { data, error } = await supabase
    .from("affiliate_products")
    .select("*");
  
  if (error) {
    console.error("Error fetching affiliate products:", error);
    return [];
  }
  
  return data || [];
}

export async function fetchAffiliateProductsByOutfitId(outfitId: string): Promise<AffiliateProduct[]> {
  const { data, error } = await supabase
    .from("affiliate_products")
    .select("*")
    .eq("outfit_id", outfitId);
  
  if (error) {
    console.error(`Error fetching affiliate products for outfit ID ${outfitId}:`, error);
    return [];
  }
  
  return data || [];
}
