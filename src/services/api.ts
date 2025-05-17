import { supabase } from "@/integrations/supabase/client";
import { Celebrity, Outfit, BlogPost, AffiliateProduct, CategoryItem } from "@/types/data";

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
  const { data: outfitsData, error: outfitsError } = await supabase
    .from("outfits")
    .select(`
      *,
      celebrities:celebrity_id (name)
    `);
  
  if (outfitsError) {
    console.error("Error fetching outfits:", outfitsError);
    return [];
  }
  
  // Get all outfit tags
  const { data: tagData, error: tagError } = await supabase
    .from("outfit_tags")
    .select("*");
  
  if (tagError) {
    console.error("Error fetching outfit tags:", tagError);
    return [];
  }
  
  // Create a map of outfit ID to tags
  const tagMap: Record<string, string[]> = {};
  tagData?.forEach(tag => {
    if (!tagMap[tag.outfit_id]) {
      tagMap[tag.outfit_id] = [];
    }
    tagMap[tag.outfit_id].push(tag.tag_name);
  });
  
  // Transform the data to match the expected format
  return outfitsData?.map(outfit => ({
    id: outfit.id,
    image: outfit.image,
    celebrityId: outfit.celebrity_id,
    celebrity: outfit.celebrities?.name || "Unknown Celebrity",
    title: outfit.title,
    description: outfit.description,
    fullDescription: outfit.full_description,
    occasion: outfit.occasion,
    date: outfit.date,
    // Use tags from our tagMap if available, or fall back to the tags array from outfits table
    tags: tagMap[outfit.id] || outfit.tags || []
  })) || [];
}

export async function fetchOutfitById(id: string): Promise<Outfit | null> {
  const { data: outfit, error: outfitError } = await supabase
    .from("outfits")
    .select(`
      *,
      celebrities:celebrity_id (name)
    `)
    .eq("id", id)
    .single();
  
  if (outfitError) {
    console.error(`Error fetching outfit with ID ${id}:`, outfitError);
    return null;
  }
  
  if (!outfit) {
    return null;
  }
  
  // Get tags for this outfit
  const { data: tagData, error: tagError } = await supabase
    .from("outfit_tags")
    .select("tag_name")
    .eq("outfit_id", id);
  
  if (tagError) {
    console.error(`Error fetching tags for outfit ID ${id}:`, tagError);
  }
  
  // Extract tag names from the tag data
  const tags = tagData ? tagData.map(tag => tag.tag_name) : outfit.tags || [];
  
  // Transform the data to match the expected format
  return {
    id: outfit.id,
    image: outfit.image,
    celebrityId: outfit.celebrity_id,
    celebrity: outfit.celebrities?.name || "Unknown Celebrity",
    title: outfit.title,
    description: outfit.description,
    fullDescription: outfit.full_description,
    occasion: outfit.occasion,
    date: outfit.date,
    tags: tags
  };
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
  
  if (!data || data.length === 0) {
    console.log("No blog posts found, returning sample data");
    const currentDate = new Date().toISOString();
    // Return sample blog posts if no data is found
    return [
      {
        id: "sample-1",
        title: "Zendaya's Red Carpet Evolution: From Disney Star to Fashion Icon",
        excerpt: "Tracking the style evolution of Zendaya from her early Disney days to becoming one of fashion's most influential celebrities.",
        content: "Full content about Zendaya's fashion evolution...",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3",
        date: new Date().toISOString(),
        category: "Celebrity Style",
        author: "Fashion Editor",
        created_at: currentDate,
        updated_at: currentDate,
        slug: "zendaya-red-carpet-evolution",
        meta_description: "Explore Zendaya's fashion evolution from Disney star to red carpet fashion icon - see her most memorable looks and style transformation.",
        structured_data: "{}",
        keywords: "Zendaya, red carpet, fashion evolution, celebrity style"
      },
      {
        id: "sample-2",
        title: "The Rise of Sustainable Fashion in Celebrity Wardrobes",
        excerpt: "How A-list celebrities are championing sustainable and ethical fashion on and off the red carpet.",
        content: "Full content about sustainable fashion trends...",
        image: "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?q=80&w=1972&auto=format&fit=crop&ixlib=rb-4.0.3",
        date: new Date().toISOString(),
        category: "Sustainability",
        author: "Eco Fashion Writer",
        created_at: currentDate,
        updated_at: currentDate,
        slug: "sustainable-fashion-celebrity-wardrobes",
        meta_description: "Discover how celebrities are embracing sustainable and ethical fashion choices both on and off the red carpet.",
        structured_data: "{}",
        keywords: "sustainable fashion, eco-friendly, celebrity wardrobes, ethical fashion"
      },
      {
        id: "sample-3",
        title: "Met Gala 2025: Breaking Down the Most Iconic Looks",
        excerpt: "A detailed analysis of the most talked-about celebrity outfits from this year's Met Gala.",
        content: "Full content about Met Gala fashion...",
        image: "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?q=80&w=1980&auto=format&fit=crop&ixlib=rb-4.0.3",
        date: new Date().toISOString(),
        category: "Red Carpet",
        author: "Met Gala Specialist",
        created_at: currentDate,
        updated_at: currentDate,
        slug: "met-gala-2025-iconic-looks",
        meta_description: "Explore and analyze the most stunning and conversation-starting celebrity outfits from the 2025 Met Gala.",
        structured_data: "{}",
        keywords: "Met Gala 2025, red carpet looks, celebrity fashion, iconic outfits"
      }
    ];
  }
  
  return data;
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

// Category Items APIs
export async function fetchCategoryItems(categoryName: string): Promise<CategoryItem[]> {
  const { data, error } = await supabase
    .from("category_items")
    .select("*")
    .eq("category_name", categoryName.toLowerCase());
  
  if (error) {
    console.error(`Error fetching items for category ${categoryName}:`, error);
    return [];
  }
  
  return data?.map(item => ({
    id: item.id,
    categoryName: item.category_name,
    title: item.title,
    description: item.description || "",
    image: item.image,
    price: item.price || "",
    retailer: item.retailer || "",
    affiliateLink: item.affiliate_link || ""
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
