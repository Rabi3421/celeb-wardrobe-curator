
// Indian-focused SEO keywords and celebrity data
export const indianCelebrityKeywords = {
  bollywood: [
    "alia bhatt fashion",
    "deepika padukone outfits",
    "priyanka chopra style",
    "katrina kaif looks",
    "anushka sharma fashion",
    "kiara advani outfits",
    "sara ali khan style",
    "janhvi kapoor fashion",
    "shraddha kapoor looks",
    "kriti sanon outfits",
    "sonam kapoor fashion",
    "kareena kapoor style",
    "aishwarya rai looks",
    "madhuri dixit fashion",
    "vidya balan style"
  ],
  
  occasions: [
    "wedding lehenga looks",
    "saree styling ideas",
    "airport fashion outfits",
    "red carpet indian looks",
    "festival ethnic wear",
    "casual bollywood style",
    "party wear inspiration",
    "traditional indian outfits",
    "indo western fashion",
    "sangeet ceremony looks"
  ],
  
  categories: [
    "bollywood saree collection",
    "designer lehenga online",
    "kurti styling tips",
    "indian wedding fashion",
    "ethnic wear online",
    "bollywood actress outfits",
    "indian designer wear",
    "traditional indian jewelry",
    "bollywood makeup looks",
    "indian bridal fashion"
  ],
  
  shopping: [
    "myntra celebrity looks",
    "ajio bollywood fashion",
    "nykaa fashion celebrity",
    "flipkart ethnic wear",
    "amazon indian outfits",
    "celebrity look under 2000",
    "affordable bollywood style",
    "designer dupes india",
    "indian fashion under 5000",
    "celebrity inspired ethnic"
  ],
  
  longTail: [
    "alia bhatt wedding guest outfit ideas",
    "deepika padukone saree draping style",
    "kiara advani airport look recreation",
    "anushka sharma casual outfits under 3000",
    "sara ali khan ethnic wear collection",
    "janhvi kapoor party dress inspiration",
    "bollywood actress festival looks 2025",
    "indian celebrity red carpet fashion",
    "affordable bollywood style outfits",
    "recreate celebrity looks india"
  ]
};

export const indianBrands = [
  "Myntra", "Ajio", "Nykaa Fashion", "Flipkart Fashion", "Amazon Fashion",
  "Jabong", "Koovs", "Limeroad", "Stillfeed", "Bewakoof",
  "FabIndia", "Global Desi", "W for Woman", "Biba", "Aurelia",
  "Sabyasachi", "Manish Malhotra", "Anita Dongre", "Masaba", "Payal Singhal"
];

export const priceRanges = {
  budget: "under ₹2,000",
  midRange: "₹2,000 - ₹5,000", 
  premium: "₹5,000 - ₹15,000",
  luxury: "above ₹15,000"
};

// Generate Indian-focused keyword strings
export const getIndianKeywordString = (category?: string, celebrity?: string): string => {
  let keywords: string[] = [];
  
  // Add celebrity-specific keywords
  if (celebrity) {
    const celebrityName = celebrity.toLowerCase().replace(/\s+/g, '-');
    keywords = keywords.concat([
      `${celebrity} fashion`,
      `${celebrity} outfits`,
      `${celebrity} style inspiration`,
      `buy ${celebrity} look online india`,
      `${celebrity} dress collection`
    ]);
  }
  
  // Add category-specific keywords
  if (category) {
    switch (category) {
      case 'sarees':
        keywords = keywords.concat([
          "bollywood saree looks",
          "designer saree online india",
          "celebrity saree draping style",
          "indian actress saree collection"
        ]);
        break;
      case 'ethnic':
        keywords = keywords.concat([
          "ethnic wear inspiration",
          "traditional indian outfits",
          "bollywood ethnic fashion",
          "indian festival wear"
        ]);
        break;
      case 'western':
        keywords = keywords.concat([
          "bollywood western outfits",
          "celebrity casual wear",
          "indian actress western look",
          "western wear india"
        ]);
        break;
      default:
        keywords = keywords.concat(indianCelebrityKeywords.bollywood.slice(0, 3));
    }
  }
  
  // Add general Indian fashion keywords
  keywords = keywords.concat([
    "indian celebrity fashion",
    "bollywood style inspiration",
    "celebrity looks india",
    "affordable celebrity fashion india"
  ]);
  
  return keywords.slice(0, 12).join(", ");
};
