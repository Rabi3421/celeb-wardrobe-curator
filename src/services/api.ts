
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
  
  // Map database fields to match our Celebrity type
  return data?.map(item => ({
    id: item.id,
    name: item.name,
    image: item.image,
    outfitCount: item.outfitcount || 0,
    bio: item.bio,
    category: item.category,
    styleType: item.style_type
  })) || [];
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
  
  // Map database fields to match our Celebrity type
  return data ? {
    id: data.id,
    name: data.name,
    image: data.image,
    outfitCount: data.outfitcount || 0,
    bio: data.bio,
    category: data.category,
    styleType: data.style_type
  } : null;
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
  return data?.map(outfit => ({
    id: outfit.id,
    image: outfit.image,
    celebrityId: outfit.celebrity_id,
    celebrity: outfit.celebrities?.name || "Unknown Celebrity",
    title: outfit.title,
    description: outfit.description,
    fullDescription: outfit.full_description,
    occasion: outfit.occasion,
    date: outfit.date,
    tags: outfit.tags
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
    id: data.id,
    image: data.image,
    celebrityId: data.celebrity_id,
    celebrity: data.celebrities?.name || "Unknown Celebrity",
    title: data.title,
    description: data.description,
    fullDescription: data.full_description,
    occasion: data.occasion,
    date: data.date,
    tags: data.tags
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
  
  // Transform the data to match the expected format
  return data?.map(product => ({
    id: product.id,
    outfitId: product.outfit_id,
    image: product.image,
    title: product.title,
    price: product.price,
    retailer: product.retailer,
    affiliateLink: product.affiliate_link,
    description: product.description || ""
  })) || [];
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
  
  // Transform the data to match the expected format
  return data?.map(product => ({
    id: product.id,
    outfitId: product.outfit_id,
    image: product.image,
    title: product.title,
    price: product.price,
    retailer: product.retailer,
    affiliateLink: product.affiliate_link,
    description: product.description || ""
  })) || [];
}

// Newsletter Subscription API
export async function subscribeToNewsletter(email: string, source: string = "footer"): Promise<{success: boolean, message: string}> {
  try {
    // Validate email format
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return { 
        success: false, 
        message: "Please enter a valid email address." 
      };
    }

    // Check if email already exists
    const { data: existingSubscriber } = await supabase
      .from("newsletter_subscribers")
      .select("id")
      .eq("email", email)
      .single();

    if (existingSubscriber) {
      return { 
        success: true, 
        message: "You're already subscribed to our newsletter!" 
      };
    }

    // Insert new subscriber
    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert([{ email, source }]);

    if (error) {
      console.error("Error subscribing to newsletter:", error);
      return { 
        success: false, 
        message: "An error occurred while subscribing. Please try again." 
      };
    }

    return { 
      success: true, 
      message: "Thank you for subscribing to our newsletter!" 
    };
  } catch (error) {
    console.error("Exception during newsletter subscription:", error);
    return { 
      success: false, 
      message: "An unexpected error occurred. Please try again later." 
    };
  }
}
