import { supabase } from "@/integrations/supabase/client";
import { AffiliateProduct, BlogPost, Celebrity, CategoryItem, Outfit } from "@/types/data";
import { Json } from "@/integrations/supabase/types";

// Helper function to safely parse JSON and cast to specific types
function parseJsonField<T>(jsonValue: Json | null, defaultValue: T): T {
  if (!jsonValue) return defaultValue;
  
  if (typeof jsonValue === 'string') {
    try {
      return JSON.parse(jsonValue) as T;
    } catch (e) {
      return defaultValue;
    }
  }
  
  return jsonValue as unknown as T;
}

// Enhanced slug generation function
export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters except hyphens and spaces
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
};

// Check if slug already exists in celebrities table
export const checkCelebritySlugExists = async (slug: string, excludeId?: string): Promise<boolean> => {
  try {
    let query = supabase.from('celebrities').select('id').eq('slug', slug);
    
    if (excludeId) {
      query = query.neq('id', excludeId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error checking celebrity slug:', error);
      return false;
    }
    
    return data.length > 0;
  } catch (error) {
    console.error('Error checking celebrity slug:', error);
    return false;
  }
};

// Check if slug already exists in outfits table
export const checkOutfitSlugExists = async (slug: string, excludeId?: string): Promise<boolean> => {
  try {
    let query = supabase.from('outfits').select('id').eq('slug', slug);
    
    if (excludeId) {
      query = query.neq('id', excludeId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error checking outfit slug:', error);
      return false;
    }
    
    return data.length > 0;
  } catch (error) {
    console.error('Error checking outfit slug:', error);
    return false;
  }
};

// Generate unique slug for celebrity
export const generateUniqueCelebritySlug = async (name: string, excludeId?: string): Promise<string> => {
  let baseSlug = generateSlug(name);
  let slug = baseSlug;
  let counter = 1;
  
  while (await checkCelebritySlugExists(slug, excludeId)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  return slug;
};

// Generate unique slug for outfit
export const generateUniqueOutfitSlug = async (title: string, excludeId?: string): Promise<string> => {
  let baseSlug = generateSlug(title);
  let slug = baseSlug;
  let counter = 1;
  
  while (await checkOutfitSlugExists(slug, excludeId)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  return slug;
};

// Optimized helper function to get outfit counts for all celebrities at once
const getBatchOutfitCounts = async (celebrityIds: string[]): Promise<Record<string, number>> => {
  try {
    console.log('Fetching outfit counts for celebrities:', celebrityIds);
    
    if (celebrityIds.length === 0) {
      return {};
    }

    const { data, error } = await supabase
      .from('outfits')
      .select('celebrity_id')
      .in('celebrity_id', celebrityIds);

    if (error) {
      console.error('Error fetching outfit counts:', error);
      return {};
    }

    // Count outfits per celebrity
    const counts: Record<string, number> = {};
    celebrityIds.forEach(id => counts[id] = 0); // Initialize all to 0
    
    data.forEach(outfit => {
      counts[outfit.celebrity_id] = (counts[outfit.celebrity_id] || 0) + 1;
    });

    console.log('Outfit counts fetched successfully:', counts);
    return counts;
  } catch (error) {
    console.error('Error in getBatchOutfitCounts:', error);
    return {};
  }
};

// Fetch celebrities from the database with optimized outfit counting
export const fetchCelebrities = async (): Promise<Celebrity[]> => {
  try {
    console.log('Starting to fetch celebrities...');
    
    const { data, error } = await supabase.from('celebrities').select('*');

    if (error) {
      console.error('Error fetching celebrities from database:', error);
      throw error;
    }

    console.log(`Fetched ${data.length} celebrities from database`);

    if (data.length === 0) {
      return [];
    }

    // Get all celebrity IDs for batch outfit counting
    const celebrityIds = data.map(item => item.id);
    
    // Fetch outfit counts in batch instead of individual requests
    const outfitCounts = await getBatchOutfitCounts(celebrityIds);

    // Convert database fields to match our Celebrity type
    const formattedData: Celebrity[] = data.map((item) => {
      const socialMediaDefault = { instagram: "", twitter: "", facebook: "", youtube: "", tiktok: "", website: "" };
      const signatureDefault = { look: "", accessories: "", designers: "", perfume: "" };
      
      const socialMedia = parseJsonField(
        item.social_media, 
        socialMediaDefault
      );
      
      const signature = parseJsonField(
        item.signature,
        signatureDefault
      );

      return {
        id: item.id,
        name: item.name,
        image: item.image,
        outfitCount: outfitCounts[item.id] || 0, // Use batch-fetched count
        bio: item.bio,
        category: item.category,
        styleType: item.style_type,
        slug: item.slug || item.id,
        birthdate: item.birthdate,
        birthplace: item.birthplace,
        height: item.height,
        education: item.education,
        careerHighlights: item.career_highlights,
        personalLife: item.personal_life,
        awards: item.awards,
        socialMedia,
        interestingFacts: item.interesting_facts,
        nationality: item.nationality,
        languages: item.languages,
        netWorth: item.net_worth,
        zodiacSign: item.zodiac_sign,
        philanthropyWork: item.philanthropy_work,
        businessVentures: item.business_ventures,
        controversies: item.controversies,
        fanbaseNickname: item.fanbase_nickname,
        signature,
        measurements: item.measurements,
        dietFitness: item.diet_fitness,
        styleEvolution: item.style_evolution,
        influences: item.influences,
        quotes: item.quotes,
        publicPerception: item.public_perception,
        brandEndorsements: item.brand_endorsements
      };
    });

    console.log('Successfully formatted celebrity data');
    return formattedData;
  } catch (error) {
    console.error('Error fetching celebrities:', error);
    // Return empty array instead of throwing to prevent app crashes
    return [];
  }
};

// Get celebrity by ID with better error handling
export const getCelebrityById = async (id: string): Promise<Celebrity | null> => {
  try {
    console.log('Fetching celebrity by ID:', id);
    
    const { data, error } = await supabase
      .from('celebrities')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching celebrity by ID:', error);
      return null;
    }

    if (!data) {
      console.log('No celebrity found with ID:', id);
      return null;
    }

    // Process social media and signature with proper typing
    const socialMediaDefault = { instagram: "", twitter: "", facebook: "", youtube: "", tiktok: "", website: "" };
    const signatureDefault = { look: "", accessories: "", designers: "", perfume: "" };
    
    const socialMedia = parseJsonField(
      data.social_media, 
      socialMediaDefault
    );
    
    const signature = parseJsonField(
      data.signature,
      signatureDefault
    );

    // Get actual outfit count for this celebrity
    const outfitCounts = await getBatchOutfitCounts([data.id]);

    const celebrity: Celebrity = {
      id: data.id,
      name: data.name,
      image: data.image,
      outfitCount: outfitCounts[data.id] || 0,
      bio: data.bio,
      category: data.category,
      styleType: data.style_type,
      slug: data.slug || data.id,
      birthdate: data.birthdate,
      birthplace: data.birthplace,
      height: data.height,
      education: data.education,
      careerHighlights: data.career_highlights,
      personalLife: data.personal_life,
      awards: data.awards,
      socialMedia,
      interestingFacts: data.interesting_facts,
      nationality: data.nationality,
      languages: data.languages,
      netWorth: data.net_worth,
      zodiacSign: data.zodiac_sign,
      philanthropyWork: data.philanthropy_work,
      businessVentures: data.business_ventures,
      controversies: data.controversies,
      fanbaseNickname: data.fanbase_nickname,
      signature,
      measurements: data.measurements,
      dietFitness: data.diet_fitness,
      styleEvolution: data.style_evolution,
      influences: data.influences,
      quotes: data.quotes,
      publicPerception: data.public_perception,
      brandEndorsements: data.brand_endorsements
    };

    return celebrity;
  } catch (error) {
    console.error('Error fetching celebrity by ID:', error);
    return null;
  }
};

// Add the missing fetchCelebrityById function that's needed by CelebrityProfile component
export const fetchCelebrityById = getCelebrityById;

// Add celebrity
export const addCelebrity = async (celebrity: Partial<Celebrity>): Promise<{success: boolean, error: any, data?: any}> => {
  try {
    // Generate unique slug if not provided
    let slug = celebrity.slug;
    if (!slug && celebrity.name) {
      slug = await generateUniqueCelebritySlug(celebrity.name);
    }

    // Format the data for the database
    const dbData = {
      name: celebrity.name,
      image: celebrity.image,
      bio: celebrity.bio,
      category: celebrity.category,
      style_type: celebrity.styleType,
      slug: slug,
      birthdate: celebrity.birthdate,
      birthplace: celebrity.birthplace,
      height: celebrity.height,
      education: celebrity.education,
      career_highlights: celebrity.careerHighlights,
      personal_life: celebrity.personalLife,
      awards: celebrity.awards,
      social_media: celebrity.socialMedia,
      interesting_facts: celebrity.interestingFacts,
      nationality: celebrity.nationality,
      languages: celebrity.languages,
      net_worth: celebrity.netWorth,
      zodiac_sign: celebrity.zodiacSign,
      philanthropy_work: celebrity.philanthropyWork,
      business_ventures: celebrity.businessVentures,
      controversies: celebrity.controversies,
      fanbase_nickname: celebrity.fanbaseNickname,
      signature: celebrity.signature,
      measurements: celebrity.measurements,
      diet_fitness: celebrity.dietFitness,
      style_evolution: celebrity.styleEvolution,
      influences: celebrity.influences,
      quotes: celebrity.quotes,
      public_perception: celebrity.publicPerception,
      brand_endorsements: celebrity.brandEndorsements,
    };

    const { data, error } = await supabase
      .from('celebrities')
      .insert([dbData])
      .select();

    if (error) {
      throw error;
    }

    return { success: true, error: null, data };
  } catch (error) {
    console.error('Error adding celebrity:', error);
    return { success: false, error };
  }
};

// Add outfit function with automatic slug generation
export const addOutfit = async (outfit: Partial<Outfit>): Promise<{success: boolean, error: any, data?: any}> => {
  try {
    // Generate unique slug if not provided
    let slug = outfit.slug;
    if (!slug && outfit.title) {
      slug = await generateUniqueOutfitSlug(outfit.title);
    }

    // Format the data for the database
    const dbData = {
      title: outfit.title,
      image: outfit.image,
      description: outfit.description,
      full_description: outfit.fullDescription,
      date: outfit.date,
      celebrity_id: outfit.celebrityId,
      occasion: outfit.occasion,
      tags: outfit.tags || [],
      slug: slug,
      affiliate_link: outfit.affiliateLink,
    };

    const { data, error } = await supabase
      .from('outfits')
      .insert([dbData])
      .select();

    if (error) {
      throw error;
    }

    return { success: true, error: null, data };
  } catch (error) {
    console.error('Error adding outfit:', error);
    return { success: false, error };
  }
};

// Fetch celebrity by slug with better error handling
export const fetchCelebrityBySlug = async (slug: string): Promise<Celebrity | null> => {
  try {
    console.log('Fetching celebrity by slug:', slug);
    
    const { data, error } = await supabase
      .from('celebrities')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error('Error fetching celebrity by slug:', error);
      return null;
    }

    if (!data) {
      console.log('No celebrity found with slug:', slug);
      return null;
    }

    // Process social media and signature with proper typing
    const socialMediaDefault = { instagram: "", twitter: "", facebook: "", youtube: "", tiktok: "", website: "" };
    const signatureDefault = { look: "", accessories: "", designers: "", perfume: "" };
    
    const socialMedia = parseJsonField(
      data.social_media,
      socialMediaDefault
    );
    
    const signature = parseJsonField(
      data.signature,
      signatureDefault
    );

    // Get actual outfit count
    const outfitCounts = await getBatchOutfitCounts([data.id]);

    const celebrity: Celebrity = {
      id: data.id,
      name: data.name,
      image: data.image,
      outfitCount: outfitCounts[data.id] || 0,
      bio: data.bio,
      category: data.category,
      styleType: data.style_type,
      slug: data.slug || data.id,
      birthdate: data.birthdate,
      birthplace: data.birthplace,
      height: data.height,
      education: data.education,
      careerHighlights: data.career_highlights,
      personalLife: data.personal_life,
      awards: data.awards,
      socialMedia,
      interestingFacts: data.interesting_facts,
      nationality: data.nationality,
      languages: data.languages,
      netWorth: data.net_worth,
      zodiacSign: data.zodiac_sign,
      philanthropyWork: data.philanthropy_work,
      businessVentures: data.business_ventures,
      controversies: data.controversies,
      fanbaseNickname: data.fanbase_nickname,
      signature,
      measurements: data.measurements,
      dietFitness: data.diet_fitness,
      styleEvolution: data.style_evolution,
      influences: data.influences,
      quotes: data.quotes,
      publicPerception: data.public_perception,
      brandEndorsements: data.brand_endorsements
    };

    return celebrity;
  } catch (error) {
    console.error('Error fetching celebrity by slug:', error);
    return null;
  }
};

// Fetch blog post by slug
export const fetchBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error('Error fetching blog post by slug:', error);
      return null;
    }

    if (!data) {
      return null;
    }

    return {
      id: data.id,
      title: data.title,
      content: data.content,
      excerpt: data.excerpt,
      image: data.image,
      date: data.date,
      author: data.author,
      category: data.category,
      slug: data.slug || data.id,
      created_at: data.created_at,
      updated_at: data.updated_at,
      meta_description: data.meta_description || '',
      structured_data: data.structured_data || '',
      keywords: data.keywords || ''
    };
  } catch (error) {
    console.error('Error fetching blog post by slug:', error);
    return null;
  }
};

// Fetch blog post by ID
export const fetchBlogPostById = async (id: string): Promise<BlogPost | null> => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching blog post by ID:', error);
      return null;
    }

    if (!data) {
      return null;
    }

    return {
      id: data.id,
      title: data.title,
      content: data.content,
      excerpt: data.excerpt,
      image: data.image,
      date: data.date,
      author: data.author,
      category: data.category,
      slug: data.slug || data.id,
      created_at: data.created_at,
      updated_at: data.updated_at,
      meta_description: data.meta_description || '',
      structured_data: data.structured_data || '',
      keywords: data.keywords || ''
    };
  } catch (error) {
    console.error('Error fetching blog post by ID:', error);
    return null;
  }
};

// Subscribe to newsletter
export const subscribeToNewsletter = async (email: string, source: string): Promise<{success: boolean, message: string}> => {
  try {
    // Check if email is already subscribed
    const { data: existingSubscribers, error: checkError } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .eq('email', email);

    if (checkError) {
      throw checkError;
    }

    if (existingSubscribers && existingSubscribers.length > 0) {
      return { success: false, message: 'This email is already subscribed to our newsletter.' };
    }
    
    // Add new subscriber
    const { error: insertError } = await supabase
      .from('newsletter_subscribers')
      .insert([
        { 
          email, 
          source,
          subscribed_at: new Date().toISOString() 
        }
      ]);

    if (insertError) {
      throw insertError;
    }

    return { success: true, message: 'Thank you for subscribing to our newsletter!' };
  } catch (error) {
    console.error('Error during newsletter subscription:', error);
    return { success: false, message: 'An error occurred during subscription. Please try again later.' };
  }
};

// Fetch outfits
export const fetchOutfits = async (limit?: number, celebrityId?: string): Promise<Outfit[]> => {
  try {
    let query = supabase.from('outfits').select('*');

    if (limit) {
      query = query.limit(limit);
    }

    if (celebrityId) {
      query = query.eq('celebrity_id', celebrityId);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    // Convert database fields to match our Outfit type
    const formattedData: Outfit[] = data.map(item => {
      // Add celebrity property that's required in Outfit type
      // Since we don't have celebrity name in outfits table, we'll set it empty here
      // It should be populated elsewhere in the app by looking up the celebrity by ID
      return {
        id: item.id,
        title: item.title,
        image: item.image,
        description: item.description,
        fullDescription: item.full_description,
        date: item.date,
        slug: item.slug || item.id,
        celebrityId: item.celebrity_id,
        celebrity: '', // Required by Outfit type
        affiliateLink: item.affiliate_link,
        tags: item.tags || [],
        occasion: item.occasion || ''
      };
    });

    return formattedData;
  } catch (error) {
    console.error('Error fetching outfits:', error);
    return [];
  }
};

// Fetch outfit by slug
export const fetchOutfitBySlug = async (slug: string): Promise<Outfit | null> => {
  try {
    const { data, error } = await supabase
      .from('outfits')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      return null;
    }

    const outfit: Outfit = {
      id: data.id,
      title: data.title,
      image: data.image,
      description: data.description,
      fullDescription: data.full_description,
      date: data.date,
      slug: data.slug || data.id,
      celebrityId: data.celebrity_id,
      celebrity: '', // This needs to be filled elsewhere
      affiliateLink: data.affiliate_link,
      tags: data.tags || [],
      occasion: data.occasion || ''
    };

    return outfit;
  } catch (error) {
    console.error('Error fetching outfit by slug:', error);
    return null;
  }
};

// Fetch outfit by ID
export const fetchOutfitById = async (id: string): Promise<Outfit | null> => {
  try {
    const { data, error } = await supabase
      .from('outfits')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      return null;
    }

    const outfit: Outfit = {
      id: data.id,
      title: data.title,
      image: data.image,
      description: data.description,
      fullDescription: data.full_description,
      date: data.date,
      slug: data.slug || data.id,
      celebrityId: data.celebrity_id,
      celebrity: '', // This needs to be filled elsewhere
      affiliateLink: data.affiliate_link,
      tags: data.tags || [],
      occasion: data.occasion || ''
    };

    return outfit;
  } catch (error) {
    console.error('Error fetching outfit by id:', error);
    return null;
  }
};

// Fetch blog posts with better error handling
export const fetchBlogPosts = async (limit?: number, categoryFilter?: string): Promise<BlogPost[]> => {
  try {
    console.log('Fetching blog posts...');
    
    let query = supabase.from('blog_posts').select('*').order('date', { ascending: false });
    
    if (limit) {
      query = query.limit(limit);
    }
    
    if (categoryFilter) {
      query = query.eq('category', categoryFilter);
    }
    
    const { data, error } = await query;

    if (error) {
      console.error('Error fetching blog posts:', error);
      return [];
    }

    // Format the blog posts
    return data.map(post => ({
      id: post.id,
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      image: post.image,
      date: post.date,
      author: post.author,
      category: post.category,
      slug: post.slug || post.id,
      created_at: post.created_at,
      updated_at: post.updated_at,
      meta_description: post.meta_description || '',
      structured_data: post.structured_data || '',
      keywords: post.keywords || ''
    }));
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
};

// Fetch affiliate products
export const fetchAffiliateProducts = async (limit?: number): Promise<AffiliateProduct[]> => {
  try {
    let query = supabase.from('affiliate_products').select('*');
    
    if (limit) {
      query = query.limit(limit);
    }
    
    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return data.map(product => ({
      id: product.id,
      outfitId: product.outfit_id,
      image: product.image,
      title: product.title,
      price: product.price,
      retailer: product.retailer,
      affiliateLink: product.affiliate_link,
      description: product.description || ''
    }));
  } catch (error) {
    console.error('Error fetching affiliate products:', error);
    return [];
  }
};

// Fetch affiliate products by outfit ID
export const fetchAffiliateProductsByOutfitId = async (outfitId: string): Promise<AffiliateProduct[]> => {
  try {
    // Since there's no outfit_products relation table in the schema shown
    // We'll directly fetch affiliate products with the given outfit_id
    const { data, error } = await supabase
      .from('affiliate_products')
      .select('*')
      .eq('outfit_id', outfitId);

    if (error) {
      throw error;
    }

    return data.map(product => ({
      id: product.id,
      outfitId: product.outfit_id,
      image: product.image,
      title: product.title,
      price: product.price,
      retailer: product.retailer,
      affiliateLink: product.affiliate_link,
      description: product.description || ''
    }));
  } catch (error) {
    console.error('Error fetching affiliate products by outfit ID:', error);
    return [];
  }
};

// Fetch category items
export const fetchCategoryItems = async (category: string): Promise<CategoryItem[]> => {
  try {
    const { data, error } = await supabase
      .from('category_items')
      .select('*')
      .eq('category_name', category);

    if (error) {
      throw error;
    }

    return data.map(item => ({
      id: item.id,
      categoryName: item.category_name,
      title: item.title,
      description: item.description || '',
      image: item.image,
      price: item.price || '',
      retailer: item.retailer || '',
      affiliateLink: item.affiliate_link || ''
    }));
  } catch (error) {
    console.error(`Error fetching category items for ${category}:`, error);
    return [];
  }
};

export default { 
  fetchCelebrities,
  getCelebrityById,
  fetchCelebrityById,
  fetchCelebrityBySlug,
  addCelebrity,
  addOutfit,
  generateSlug,
  generateUniqueCelebritySlug,
  generateUniqueOutfitSlug,
  checkCelebritySlugExists,
  checkOutfitSlugExists,
  fetchOutfits,
  fetchOutfitBySlug,
  fetchOutfitById,
  fetchBlogPosts,
  fetchBlogPostById,
  fetchBlogPostBySlug,
  fetchAffiliateProducts,
  fetchAffiliateProductsByOutfitId,
  fetchCategoryItems,
  subscribeToNewsletter
};
