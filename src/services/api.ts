
import { supabase } from "@/integrations/supabase/client";
import { AffiliateProduct, BlogPost, Celebrity, CategoryItem, Outfit } from "@/types/data";

// Fetch celebrities from the database
export const fetchCelebrities = async (): Promise<{data: Celebrity[], error: any}> => {
  try {
    const { data, error } = await supabase.from('celebrities').select('*');

    if (error) {
      throw error;
    }

    // Convert database fields to match our Celebrity type
    const formattedData: Celebrity[] = data.map(item => {
      // Handle social_media JSON parsing
      let socialMediaValue = item.social_media;
      if (typeof socialMediaValue === 'string') {
        socialMediaValue = JSON.parse(socialMediaValue);
      }
      
      // Handle signature JSON parsing
      let signatureValue = item.signature;
      if (typeof signatureValue === 'string') {
        signatureValue = JSON.parse(signatureValue);
      }
      
      return {
        id: item.id,
        name: item.name,
        image: item.image,
        outfitCount: item.outfitcount || 0,
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
        socialMedia: socialMediaValue as Celebrity['socialMedia'],
        interestingFacts: item.interesting_facts,
        nationality: item.nationality,
        languages: item.languages,
        netWorth: item.net_worth,
        zodiacSign: item.zodiac_sign,
        philanthropyWork: item.philanthropy_work,
        businessVentures: item.business_ventures,
        controversies: item.controversies,
        fanbaseNickname: item.fanbase_nickname,
        signature: signatureValue as Celebrity['signature'],
        measurements: item.measurements,
        dietFitness: item.diet_fitness,
        styleEvolution: item.style_evolution,
        influences: item.influences,
        quotes: item.quotes,
        publicPerception: item.public_perception,
        brandEndorsements: item.brand_endorsements
      };
    });

    return { data: formattedData, error: null };
  } catch (error) {
    console.error('Error fetching celebrities:', error);
    return { data: [], error };
  }
};

// Get celebrity by ID
export const getCelebrityById = async (id: string): Promise<{data: Celebrity | null, error: any}> => {
  try {
    const { data, error } = await supabase
      .from('celebrities')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      return { data: null, error: null };
    }

    // Process social media and signature data
    let socialMediaValue = data.social_media;
    if (typeof socialMediaValue === 'string') {
      socialMediaValue = JSON.parse(socialMediaValue);
    }
    
    let signatureValue = data.signature;
    if (typeof signatureValue === 'string') {
      signatureValue = JSON.parse(signatureValue);
    }

    // Convert database fields to match our Celebrity type
    const celebrity: Celebrity = {
      id: data.id,
      name: data.name,
      image: data.image,
      outfitCount: data.outfitcount || 0,
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
      socialMedia: socialMediaValue as Celebrity['socialMedia'],
      interestingFacts: data.interesting_facts,
      nationality: data.nationality,
      languages: data.languages,
      netWorth: data.net_worth,
      zodiacSign: data.zodiac_sign,
      philanthropyWork: data.philanthropy_work,
      businessVentures: data.business_ventures,
      controversies: data.controversies,
      fanbaseNickname: data.fanbase_nickname,
      signature: signatureValue as Celebrity['signature'],
      measurements: data.measurements,
      dietFitness: data.diet_fitness,
      styleEvolution: data.style_evolution,
      influences: data.influences,
      quotes: data.quotes,
      publicPerception: data.public_perception,
      brandEndorsements: data.brand_endorsements
    };

    return { data: celebrity, error: null };
  } catch (error) {
    console.error('Error fetching celebrity by ID:', error);
    return { data: null, error };
  }
};

// Add celebrity
export const addCelebrity = async (celebrity: Partial<Celebrity>): Promise<{success: boolean, error: any, data?: any}> => {
  try {
    // Format the data for the database
    const dbData = {
      name: celebrity.name,
      image: celebrity.image,
      bio: celebrity.bio,
      category: celebrity.category,
      style_type: celebrity.styleType,
      slug: celebrity.slug,
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

export const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '');
};

// Fetch celebrity by slug
export const fetchCelebrityBySlug = async (slug: string): Promise<{data: Celebrity | null, error: any}> => {
  try {
    const { data, error } = await supabase
      .from('celebrities')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      return { data: null, error: null };
    }

    // Process social media and signature data
    let socialMediaValue = data.social_media;
    if (typeof socialMediaValue === 'string') {
      socialMediaValue = JSON.parse(socialMediaValue);
    }
    
    let signatureValue = data.signature;
    if (typeof signatureValue === 'string') {
      signatureValue = JSON.parse(signatureValue);
    }

    const celebrity: Celebrity = {
      id: data.id,
      name: data.name,
      image: data.image,
      outfitCount: data.outfitcount || 0,
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
      socialMedia: socialMediaValue as Celebrity['socialMedia'],
      interestingFacts: data.interesting_facts,
      nationality: data.nationality,
      languages: data.languages,
      netWorth: data.net_worth,
      zodiacSign: data.zodiac_sign,
      philanthropyWork: data.philanthropy_work,
      businessVentures: data.business_ventures,
      controversies: data.controversies,
      fanbaseNickname: data.fanbase_nickname,
      signature: signatureValue as Celebrity['signature'],
      measurements: data.measurements,
      dietFitness: data.diet_fitness,
      styleEvolution: data.style_evolution,
      influences: data.influences,
      quotes: data.quotes,
      publicPerception: data.public_perception,
      brandEndorsements: data.brand_endorsements
    };

    return { data: celebrity, error: null };
  } catch (error) {
    console.error('Error fetching celebrity by slug:', error);
    return { data: null, error };
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
export const fetchOutfits = async (limit?: number, celebrityId?: string): Promise<{data: Outfit[], error: any}> => {
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
    const formattedData: Outfit[] = data.map(item => ({
      id: item.id,
      title: item.title,
      image: item.image,
      description: item.description,
      date: item.date,
      location: item.location,
      event: item.event,
      slug: item.slug || item.id,
      celebrityId: item.celebrity_id,
      lookType: item.look_type,
      season: item.season,
      products: item.products,
      tags: item.tags,
      likes: item.likes || 0,
      stylist: item.stylist,
      photographer: item.photographer,
      makeupArtist: item.makeup_artist,
      hairStylist: item.hair_stylist
    }));

    return { data: formattedData, error: null };
  } catch (error) {
    console.error('Error fetching outfits:', error);
    return { data: [], error };
  }
};

// Fetch outfit by slug
export const fetchOutfitBySlug = async (slug: string): Promise<{data: Outfit | null, error: any}> => {
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
      return { data: null, error: null };
    }

    const outfit: Outfit = {
      id: data.id,
      title: data.title,
      image: data.image,
      description: data.description,
      date: data.date,
      location: data.location,
      event: data.event,
      slug: data.slug || data.id,
      celebrityId: data.celebrity_id,
      lookType: data.look_type,
      season: data.season,
      products: data.products,
      tags: data.tags,
      likes: data.likes || 0,
      stylist: data.stylist,
      photographer: data.photographer,
      makeupArtist: data.makeup_artist,
      hairStylist: data.hair_stylist
    };

    return { data: outfit, error: null };
  } catch (error) {
    console.error('Error fetching outfit by slug:', error);
    return { data: null, error };
  }
};

// Fetch outfit by ID
export const fetchOutfitById = async (id: string): Promise<{data: Outfit | null, error: any}> => {
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
      return { data: null, error: null };
    }

    const outfit: Outfit = {
      id: data.id,
      title: data.title,
      image: data.image,
      description: data.description,
      date: data.date,
      location: data.location,
      event: data.event,
      slug: data.slug || data.id,
      celebrityId: data.celebrity_id,
      lookType: data.look_type,
      season: data.season,
      products: data.products,
      tags: data.tags,
      likes: data.likes || 0,
      stylist: data.stylist,
      photographer: data.photographer,
      makeupArtist: data.makeup_artist,
      hairStylist: data.hair_stylist
    };

    return { data: outfit, error: null };
  } catch (error) {
    console.error('Error fetching outfit by id:', error);
    return { data: null, error };
  }
};

// Fetch blog posts
export const fetchBlogPosts = async (limit?: number, categoryFilter?: string): Promise<BlogPost[]> => {
  try {
    let query = supabase.from('blog_posts').select('*');
    
    if (limit) {
      query = query.limit(limit);
    }
    
    if (categoryFilter) {
      query = query.eq('category', categoryFilter);
    }
    
    const { data, error } = await query;

    if (error) {
      throw error;
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
      tags: post.tags,
      slug: post.slug || post.id,
      readTime: post.read_time || '5 min',
      relatedPosts: post.related_posts || []
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
      name: product.name,
      description: product.description,
      image: product.image,
      price: product.price,
      brand: product.brand,
      category: product.category,
      link: product.link,
      discount: product.discount,
      rating: product.rating,
      reviewCount: product.review_count,
      isFeatured: product.is_featured,
      isNew: product.is_new,
      isBestSeller: product.is_best_seller
    }));
  } catch (error) {
    console.error('Error fetching affiliate products:', error);
    return [];
  }
};

// Fetch affiliate products by outfit ID
export const fetchAffiliateProductsByOutfitId = async (outfitId: string): Promise<AffiliateProduct[]> => {
  try {
    // First, get the outfit-product relationships
    const { data: relationships, error: relError } = await supabase
      .from('outfit_products')
      .select('product_id')
      .eq('outfit_id', outfitId);

    if (relError) {
      throw relError;
    }

    if (!relationships || relationships.length === 0) {
      return [];
    }

    // Get all product IDs
    const productIds = relationships.map(rel => rel.product_id);

    // Fetch all products with those IDs
    const { data, error } = await supabase
      .from('affiliate_products')
      .select('*')
      .in('id', productIds);

    if (error) {
      throw error;
    }

    return data.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description,
      image: product.image,
      price: product.price,
      brand: product.brand,
      category: product.category,
      link: product.link,
      discount: product.discount,
      rating: product.rating,
      reviewCount: product.review_count,
      isFeatured: product.is_featured,
      isNew: product.is_new,
      isBestSeller: product.is_best_seller
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
      .eq('category', category);

    if (error) {
      throw error;
    }

    return data.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description,
      image: item.image,
      price: item.price,
      brand: item.brand,
      category: item.category,
      link: item.link,
      celebrityIds: item.celebrity_ids || [],
      outfitIds: item.outfit_ids || [],
      rating: item.rating,
      reviewCount: item.review_count
    }));
  } catch (error) {
    console.error(`Error fetching category items for ${category}:`, error);
    return [];
  }
};

export default { 
  fetchCelebrities,
  getCelebrityById,
  fetchCelebrityBySlug,
  addCelebrity,
  generateSlug,
  fetchOutfits,
  fetchOutfitBySlug,
  fetchOutfitById,
  fetchBlogPosts,
  fetchAffiliateProducts,
  fetchAffiliateProductsByOutfitId,
  fetchCategoryItems,
  subscribeToNewsletter
};
