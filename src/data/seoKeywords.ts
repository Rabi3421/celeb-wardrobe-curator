
// High-volume, lower-difficulty keywords for celebrity fashion
export const seoKeywords = {
  general: [
    "celebrity outfits",
    "celebrity fashion",
    "celebrity style inspiration",
    "affordable celebrity looks",
    "celebrity look for less",
    "celebrity inspired outfits",
    "celebrity street style",
    "how to dress like celebrities",
    "celebrity red carpet looks",
  ],
  dresses: [
    "celebrity dress styles",
    "celebrity party dresses",
    "celebrity red carpet dresses",
    "celebrity wedding guest dresses",
    "celebrity cocktail dresses",
    "affordable celebrity dresses",
  ],
  accessories: [
    "celebrity accessories",
    "celebrity handbags",
    "celebrity jewelry",
    "celebrity sunglasses",
    "celebrity shoes",
    "affordable celebrity accessories",
  ],
  seasonal: [
    "celebrity summer outfits",
    "celebrity winter fashion",
    "celebrity spring style",
    "celebrity fall looks",
  ],
  events: [
    "celebrity party wear",
    "celebrity festival outfits",
    "celebrity award show looks",
    "celebrity gala outfits",
    "celebrity premiere style",
  ]
};

// Category-specific keywords
export const categoryKeywords = {
  dresses: [
    "celebrity dresses",
    "red carpet dresses",
    "celebrity party dresses",
    "celebrity cocktail dresses",
    "celebrity evening gowns",
    "affordable celebrity dress styles"
  ],
  shoes: [
    "celebrity shoes",
    "red carpet footwear",
    "celebrity heels",
    "celebrity sneaker style",
    "celebrity boots",
    "affordable celebrity shoes"
  ],
  makeup: [
    "celebrity makeup looks",
    "celebrity beauty routine",
    "celebrity makeup products",
    "celebrity beauty secrets",
    "celebrity red carpet makeup",
    "affordable celebrity makeup dupes"
  ],
  handbags: [
    "celebrity handbags",
    "designer bags celebrities carry",
    "celebrity purse collection",
    "celebrity bag trends",
    "affordable celebrity handbag dupes",
    "celebrity clutch bags"
  ]
};

// Generate a comma-separated keyword string for meta tags
export const getKeywordString = (category?: string): string => {
  let keywordsArray: string[] = [];
  
  // Add general keywords
  keywordsArray = keywordsArray.concat(seoKeywords.general);
  
  // Add category-specific keywords if a category is provided
  if (category && categoryKeywords[category as keyof typeof categoryKeywords]) {
    keywordsArray = keywordsArray.concat(categoryKeywords[category as keyof typeof categoryKeywords]);
  }
  
  // Take top 10 keywords to avoid keyword stuffing
  return keywordsArray.slice(0, 10).join(", ");
};
