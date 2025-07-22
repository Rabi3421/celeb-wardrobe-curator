import { AffiliateProduct, BlogPost, Celebrity, CategoryItem, Outfit } from "@/types/data";
import { API_CONFIG } from "../config/api";

// Mock data for development - replace with your own backend API calls
const mockCelebrities: Celebrity[] = [
  {
    id: "1",
    name: "Zendaya",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    outfitCount: 5,
    bio: "Zendaya is known for her bold fashion choices and has become a style icon on and off the red carpet.",
    category: "Actors",
    styleType: "Avant-garde",
    slug: "zendaya",
    birthdate: "1996-09-01",
    birthplace: "Oakland, California",
    height: "5'10\"",
    nationality: "American",
    socialMedia: {
      instagram: "@zendaya",
      twitter: "@zendaya",
      facebook: "",
      youtube: "",
      tiktok: "",
      website: ""
    },
    signature: {
      look: "Bold and experimental",
      accessories: "Statement jewelry",
      designers: "Valentino, Versace",
      perfume: ""
    }
  },
  {
    id: "2",
    name: "Harry Styles",
    image: "/images/Harry_Styles.jpeg",
    outfitCount: 3,
    bio: "Harry Styles has become known for his gender-fluid fashion and unique personal style.",
    category: "Musicians",
    styleType: "Eclectic",
    slug: "harry-styles",
    birthdate: "1994-02-01",
    birthplace: "Redditch, England",
    height: "6'0\"",
    nationality: "British",
    socialMedia: {
      instagram: "@harrystyles",
      twitter: "@harrystyles",
      facebook: "",
      youtube: "",
      tiktok: "",
      website: ""
    },
    signature: {
      look: "Gender-fluid and colorful",
      accessories: "Pearl necklaces, rings",
      designers: "Gucci, Harris Reed",
      perfume: ""
    }
  }
];

const mockOutfits: Outfit[] = [
  {
    id: "1",
    title: "Met Gala Statement Look",
    image: "/images/zendaya_red_carpet_look.avif",
    celebrityId: "1",
    celebrity: "Zendaya",
    description: "Zendaya's stunning outfit from the Met Gala that turned heads.",
    fullDescription: "This elaborate ensemble designed by a top fashion house perfectly embodied the gala's theme while showcasing Zendaya's fashion-forward sensibilities.",
    occasion: "Red Carpet",
    date: "2024-05-06",
    tags: ["gala", "designer", "couture"],
    slug: "zendaya-met-gala-2024"
  },
  {
    id: "2",
    title: "Concert Tour Opening Night",
    image: "https://images.unsplash.com/photo-1588117305388-c2631a279f82?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    celebrityId: "2",
    celebrity: "Harry Styles",
    description: "Harry's vibrant outfit from his latest tour opening show.",
    fullDescription: "This custom outfit designed for the opening night showcased Harry's unique style while allowing for maximum movement during performances.",
    occasion: "Concert",
    date: "2024-04-15",
    tags: ["concert", "bold", "sequins"],
    slug: "harry-styles-tour-2024"
  }
];

const mockBlogPosts: BlogPost[] = [
  {
    id: "1",
    title: "How Zendaya Revolutionized Red Carpet Fashion",
    excerpt: "Exploring how Zendaya has changed the landscape of celebrity fashion in recent years.",
    content: "Zendaya has consistently pushed boundaries with her red carpet choices...",
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    date: "2025-04-25",
    category: "Style Analysis",
    author: "Fashion Editor",
    created_at: "2025-04-25T00:00:00Z",
    updated_at: "2025-04-25T00:00:00Z",
    slug: "zendaya-red-carpet-revolution",
    meta_description: "How Zendaya revolutionized red carpet fashion with her bold choices",
    structured_data: "",
    keywords: "zendaya, fashion, red carpet"
  }
];

const mockAffiliateProducts: AffiliateProduct[] = [
  {
    id: "1",
    outfitId: "1",
    image: "https://images.unsplash.com/photo-1619096252214-ef06c45683e3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    title: "Designer Evening Gown - Similar Style",
    price: "$499.99",
    retailer: "LuxeFashion",
    affiliateLink: "https://example.com/product1",
    description: "A stunning evening gown inspired by Zendaya's Met Gala look."
  }
];

// Enhanced slug generation function
export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

// Generate unique celebrity slug
export const generateUniqueCelebritySlug = async (name: string, excludeId?: string): Promise<string> => {
  try {
    console.log('Generating unique celebrity slug for:', name);
    const baseSlug = generateSlug(name);
    
    // Check if slug already exists (mock implementation)
    const existingCelebrity = mockCelebrities.find(c => 
      c.slug === baseSlug && (!excludeId || c.id !== excludeId)
    );
    
    if (!existingCelebrity) {
      return baseSlug;
    }
    
    // If slug exists, append a number
    let counter = 1;
    let uniqueSlug = `${baseSlug}-${counter}`;
    
    while (mockCelebrities.find(c => 
      c.slug === uniqueSlug && (!excludeId || c.id !== excludeId)
    )) {
      counter++;
      uniqueSlug = `${baseSlug}-${counter}`;
    }
    
    return uniqueSlug;
  } catch (error) {
    console.error('Error generating unique celebrity slug:', error);
    return generateSlug(name);
  }
};

// Generate unique outfit slug
export const generateUniqueOutfitSlug = async (title: string, excludeId?: string): Promise<string> => {
  try {
    console.log('Generating unique outfit slug for:', title);
    const baseSlug = generateSlug(title);
    
    // Check if slug already exists (mock implementation)
    const existingOutfit = mockOutfits.find(o => 
      o.slug === baseSlug && (!excludeId || o.id !== excludeId)
    );
    
    if (!existingOutfit) {
      return baseSlug;
    }
    
    // If slug exists, append a number
    let counter = 1;
    let uniqueSlug = `${baseSlug}-${counter}`;
    
    while (mockOutfits.find(o => 
      o.slug === uniqueSlug && (!excludeId || o.id !== excludeId)
    )) {
      counter++;
      uniqueSlug = `${baseSlug}-${counter}`;
    }
    
    return uniqueSlug;
  } catch (error) {
    console.error('Error generating unique outfit slug:', error);
    return generateSlug(title);
  }
};

// Mock implementation - replace with your backend API calls
export const fetchCelebrities = async (page = 1, limit = 10, apiKey: string): Promise<Celebrity[]> => {
  try {
    const response = await fetch(
      `${API_CONFIG.baseUrl}/celebrities?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "api_key": apiKey,
        },
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    // Adjust this if your API response structure is different
    return data.celebrities || [];
  } catch (error) {
    console.error('Error fetching celebrities:', error);
    return [];
  }
};

export const getCelebrityById = async (id: string): Promise<Celebrity | null> => {
  try {
    console.log('Fetching celebrity by ID:', id);
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockCelebrities.find(celebrity => celebrity.id === id) || null;
  } catch (error) {
    console.error('Error fetching celebrity by ID:', error);
    return null;
  }
};

export const fetchCelebrityById = getCelebrityById;

export const fetchCelebrityBySlug = async (slug: string): Promise<Celebrity | null> => {
  try {
    console.log('Fetching celebrity by slug:', slug);
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockCelebrities.find(celebrity => celebrity.slug === slug) || null;
  } catch (error) {
    console.error('Error fetching celebrity by slug:', error);
    return null;
  }
};

// export const addCelebrity = async (celebrity: Partial<Celebrity>): Promise<{success: boolean, error: any, data?: any}> => {
//   try {
//     // TODO: Replace with your backend API call
//     console.log('Adding celebrity:', celebrity);
//     await new Promise(resolve => setTimeout(resolve, 500));
    
//     const newCelebrity = {
//       id: Date.now().toString(),
//       ...celebrity,
//       slug: celebrity.slug || generateUniqueCelebritySlug(celebrity.name || ''),
//       outfitCount: 0
//     } as Celebrity;
    
//     mockCelebrities.push(newCelebrity);
//     return { success: true, error: null, data: newCelebrity };
//   } catch (error) {
//     console.error('Error adding celebrity:', error);
//     return { success: false, error };
//   }
// };

export const addCelebrity = async (celebrity: Partial<Celebrity>): Promise<{success: boolean, error: any, data?: any}> => {
  try {
    console.log('Adding celebrity:', celebrity);
    
    // Generate slug if not provided
    const slug = celebrity.slug || await generateUniqueCelebritySlug(celebrity.name || '');
    
    // Prepare data for backend API
    const celebrityData = {
      name: celebrity.name,
      slug: slug,
      bio: celebrity.bio,
      category: celebrity.category,
      styleType: celebrity.styleType,
      profession: celebrity.profession || celebrity.category, // Use category as fallback
      birthdate: celebrity.birthdate,
      birthplace: celebrity.birthplace,
      nationality: celebrity.nationality,
      height: celebrity.height,
      image: celebrity.image,
      socialMedia: celebrity.socialMedia || {},
      signature: celebrity.signature || {},
      tags: celebrity.tags || []
    };

    // Make actual API call to backend
    const response = await fetch('http://localhost:5000/api/celebrities', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}` // You'll need to implement this
      },
      body: JSON.stringify(celebrityData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    // Update local mock data for consistency (optional, remove when fully using backend)
    const newCelebrity = {
      id: result.data.id || Date.now().toString(),
      ...celebrity,
      slug: slug,
      outfitCount: 0
    } as Celebrity;
    mockCelebrities.push(newCelebrity);
    
    return { success: true, error: null, data: result.data };
  } catch (error) {
    console.error('Error adding celebrity:', error);
    return { success: false, error: error instanceof Error ? error.message : error };
  }
};

// Helper function to get auth token (implement based on your auth system)
const getAuthToken = (): string => {
  // Replace with your actual token retrieval logic
  return localStorage.getItem('authToken') || 'YOUR_JWT_TOKEN';
};

export const addOutfit = async (outfit: Partial<Outfit>): Promise<{success: boolean, error: any, data?: any}> => {
  try {
    // TODO: Replace with your backend API call
    console.log('Adding outfit:', outfit);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newOutfit = {
      id: Date.now().toString(),
      ...outfit,
      slug: outfit.slug || generateUniqueOutfitSlug(outfit.title || ''),
      celebrity: mockCelebrities.find(c => c.id === outfit.celebrityId)?.name || ''
    } as Outfit;
    
    mockOutfits.push(newOutfit);
    return { success: true, error: null, data: newOutfit };
  } catch (error) {
    console.error('Error adding outfit:', error);
    return { success: false, error };
  }
};

export const fetchOutfits = async (limit?: number, celebrityId?: string): Promise<Outfit[]> => {
  try {
    console.log('Fetching outfits...');
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let outfits = [...mockOutfits];
    
    if (celebrityId) {
      outfits = outfits.filter(outfit => outfit.celebrityId === celebrityId);
    }
    
    if (limit) {
      outfits = outfits.slice(0, limit);
    }
    
    return outfits;
  } catch (error) {
    console.error('Error fetching outfits:', error);
    return [];
  }
};

export const fetchOutfitBySlug = async (slug: string): Promise<Outfit | null> => {
  try {
    console.log('Fetching outfit by slug:', slug);
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockOutfits.find(outfit => outfit.slug === slug) || null;
  } catch (error) {
    console.error('Error fetching outfit by slug:', error);
    return null;
  }
};

export const fetchOutfitById = async (id: string): Promise<Outfit | null> => {
  try {
    console.log('Fetching outfit by ID:', id);
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockOutfits.find(outfit => outfit.id === id) || null;
  } catch (error) {
    console.error('Error fetching outfit by ID:', error);
    return null;
  }
};

export const fetchBlogPosts = async (limit?: number, categoryFilter?: string): Promise<BlogPost[]> => {
  try {
    console.log('Fetching blog posts...');
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let posts = [...mockBlogPosts];
    
    if (categoryFilter) {
      posts = posts.filter(post => post.category === categoryFilter);
    }
    
    if (limit) {
      posts = posts.slice(0, limit);
    }
    
    return posts;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
};

export const fetchBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  try {
    console.log('Fetching blog post by slug:', slug);
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockBlogPosts.find(post => post.slug === slug) || null;
  } catch (error) {
    console.error('Error fetching blog post by slug:', error);
    return null;
  }
};

export const fetchBlogPostById = async (id: string): Promise<BlogPost | null> => {
  try {
    console.log('Fetching blog post by ID:', id);
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockBlogPosts.find(post => post.id === id) || null;
  } catch (error) {
    console.error('Error fetching blog post by ID:', error);
    return null;
  }
};

export const fetchAffiliateProducts = async (limit?: number): Promise<AffiliateProduct[]> => {
  try {
    console.log('Fetching affiliate products...');
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let products = [...mockAffiliateProducts];
    
    if (limit) {
      products = products.slice(0, limit);
    }
    
    return products;
  } catch (error) {
    console.error('Error fetching affiliate products:', error);
    return [];
  }
};

export const fetchAffiliateProductsByOutfitId = async (outfitId: string): Promise<AffiliateProduct[]> => {
  try {
    console.log('Fetching affiliate products by outfit ID:', outfitId);
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockAffiliateProducts.filter(product => product.outfitId === outfitId);
  } catch (error) {
    console.error('Error fetching affiliate products by outfit ID:', error);
    return [];
  }
};

export const fetchCategoryItems = async (category: string): Promise<CategoryItem[]> => {
  try {
    console.log('Fetching category items for:', category);
    await new Promise(resolve => setTimeout(resolve, 200));
    // TODO: Replace with your backend API call
    return [];
  } catch (error) {
    console.error(`Error fetching category items for ${category}:`, error);
    return [];
  }
};

export const subscribeToNewsletter = async (email: string, source: string): Promise<{success: boolean, message: string}> => {
  try {
    console.log('Newsletter subscription:', email, source);
    await new Promise(resolve => setTimeout(resolve, 500));
    // TODO: Replace with your backend API call
    return { success: true, message: 'Thank you for subscribing to our newsletter!' };
  } catch (error) {
    console.error('Error during newsletter subscription:', error);
    return { success: false, message: 'An error occurred during subscription. Please try again later.' };
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
