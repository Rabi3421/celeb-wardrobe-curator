
import { supabase } from "@/integrations/supabase/client";
import { Celebrity } from "@/types/data";

// Example of function that needs fixing in the api.ts file:
export const fetchCelebrities = async (): Promise<{data: Celebrity[], error: any}> => {
  try {
    const { data, error } = await supabase.from('celebrities').select('*');

    if (error) {
      throw error;
    }

    // Convert database fields to match our Celebrity type
    const formattedData: Celebrity[] = data.map(item => {
      let socialMediaValue = item.social_media;
      if (typeof socialMediaValue === 'string') {
        socialMediaValue = JSON.parse(socialMediaValue);
      }
      
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

// Fix for the addCelebrity function
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
