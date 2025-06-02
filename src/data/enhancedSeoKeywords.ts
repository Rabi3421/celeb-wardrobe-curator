
// Enhanced SEO keywords with long-tail phrases and trending topics
export const enhancedSeoKeywords = {
  // Long-tail keywords for better targeting
  longTail: [
    "celebrity red carpet dress dupes",
    "affordable celebrity style alternatives",
    "how to dress like celebrities on a budget",
    "celebrity fashion inspiration for less",
    "recreate celebrity outfits cheap",
    "celebrity style on a budget",
    "designer dress alternatives affordable",
    "celebrity fashion trends 2025",
    "shop celebrity looks for less",
    "celebrity outfit inspiration ideas",
    "celebrity fashion dupes under $50",
    "affordable celebrity inspired clothing",
  ],
  
  // Event-specific keywords
  events: [
    "met gala fashion looks",
    "oscar red carpet fashion",
    "cannes film festival outfits",
    "golden globes celebrity fashion",
    "emmys red carpet looks",
    "grammy awards fashion",
    "venice film festival style",
    "tony awards celebrity outfits",
    "sag awards fashion looks",
    "bafta red carpet style",
  ],
  
  // Trending and seasonal keywords
  trending: [
    "sustainable celebrity fashion",
    "eco friendly celebrity style",
    "celebrity thrift fashion",
    "vintage celebrity looks",
    "celebrity street style 2025",
    "celebrity festival fashion",
    "celebrity vacation outfits",
    "celebrity workout clothes",
    "celebrity maternity fashion",
    "celebrity winter coats",
    "celebrity summer dresses",
    "celebrity fall fashion trends",
  ],
  
  // Brand and designer specific
  brands: [
    "zara celebrity style",
    "h&m celebrity looks",
    "target celebrity fashion",
    "asos celebrity dupes",
    "shein celebrity style",
    "forever 21 celebrity looks",
    "uniqlo celebrity fashion",
    "mango celebrity style",
    "cos celebrity looks",
    "celebrity gucci alternatives",
    "celebrity prada dupes",
    "celebrity versace alternatives",
  ],
  
  // Comparison and alternative keywords
  comparisons: [
    "celebrity fashion vs affordable",
    "designer vs high street celebrity",
    "expensive vs cheap celebrity looks",
    "celebrity fashion alternatives",
    "similar to celebrity style",
    "celebrity look alternatives",
    "budget friendly celebrity fashion",
    "celebrity style comparison",
  ],
  
  // How-to and tutorial keywords
  howTo: [
    "how to recreate celebrity looks",
    "celebrity makeup tutorial",
    "celebrity hair tutorial",
    "how to style like celebrities",
    "celebrity fashion guide",
    "recreate celebrity red carpet look",
    "celebrity style tutorial",
    "how to get celebrity style",
    "celebrity fashion tips",
    "celebrity styling secrets",
  ],
  
  // Location-based keywords
  location: [
    "celebrity fashion inspiration nyc",
    "celebrity style los angeles",
    "celebrity fashion london",
    "celebrity street style paris",
    "celebrity fashion milan",
    "celebrity style inspiration worldwide",
  ]
};

// Celebrity-specific long-tail keywords
export const celebritySpecificKeywords = {
  zendaya: [
    "zendaya red carpet looks",
    "zendaya street style outfits",
    "zendaya fashion evolution",
    "zendaya best dressed moments",
    "zendaya met gala looks",
    "zendaya spider-man outfits",
    "zendaya dune fashion",
    "how to dress like zendaya",
    "zendaya style inspiration",
    "zendaya affordable alternatives",
  ],
  rihanna: [
    "rihanna street style looks",
    "rihanna pregnancy fashion",
    "rihanna fenty fashion",
    "rihanna casual outfits",
    "rihanna red carpet style",
    "rihanna fashion evolution",
    "how to dress like rihanna",
    "rihanna style inspiration",
    "rihanna affordable dupes",
    "rihanna fashion trends",
  ],
  "harry-styles": [
    "harry styles fashion outfits",
    "harry styles gender fluid fashion",
    "harry styles red carpet looks",
    "harry styles street style",
    "harry styles fashion evolution",
    "harry styles nail art fashion",
    "how to dress like harry styles",
    "harry styles style inspiration",
    "harry styles affordable alternatives",
    "harry styles fashion trends",
  ],
  "timothee-chalamet": [
    "timothee chalamet fashion style",
    "timothee chalamet red carpet",
    "timothee chalamet street style",
    "timothee chalamet suit style",
    "timothee chalamet casual outfits",
    "how to dress like timothee chalamet",
    "timothee chalamet style inspiration",
    "timothee chalamet fashion evolution",
    "timothee chalamet affordable alternatives",
  ],
};

// Generate enhanced keyword strings for meta tags
export const getEnhancedKeywordString = (category?: string, celebrity?: string): string => {
  let keywordsArray: string[] = [];
  
  // Add basic keywords
  keywordsArray = keywordsArray.concat(enhancedSeoKeywords.longTail.slice(0, 5));
  
  // Add category-specific keywords
  if (category) {
    switch (category) {
      case 'red-carpet':
        keywordsArray = keywordsArray.concat(enhancedSeoKeywords.events.slice(0, 3));
        break;
      case 'street-style':
        keywordsArray = keywordsArray.concat([
          "celebrity street style 2025",
          "celebrity casual outfits",
          "celebrity everyday fashion"
        ]);
        break;
      case 'sustainable':
        keywordsArray = keywordsArray.concat(enhancedSeoKeywords.trending.slice(0, 3));
        break;
      default:
        keywordsArray = keywordsArray.concat(enhancedSeoKeywords.trending.slice(0, 2));
    }
  }
  
  // Add celebrity-specific keywords
  if (celebrity && celebritySpecificKeywords[celebrity as keyof typeof celebritySpecificKeywords]) {
    keywordsArray = keywordsArray.concat(
      celebritySpecificKeywords[celebrity as keyof typeof celebritySpecificKeywords].slice(0, 3)
    );
  }
  
  // Add how-to keywords for better featured snippets
  keywordsArray = keywordsArray.concat(enhancedSeoKeywords.howTo.slice(0, 2));
  
  // Remove duplicates and limit to 15 keywords to avoid keyword stuffing
  const uniqueKeywords = [...new Set(keywordsArray)];
  return uniqueKeywords.slice(0, 15).join(", ");
};

// FAQ data for rich snippets
export const seoFaqData = {
  general: [
    {
      question: "How can I recreate celebrity outfits on a budget?",
      answer: "Look for affordable alternatives at fast fashion retailers like H&M, Zara, ASOS, and Target. Focus on similar silhouettes, colors, and styling rather than exact designer pieces. Use our shopping guides to find specific dupes."
    },
    {
      question: "Where do celebrities get their outfits from?",
      answer: "Celebrities work with stylists who source from luxury designers, emerging brands, vintage pieces, and custom-made garments. Many red carpet looks are borrowed or gifted by designers for publicity."
    },
    {
      question: "What are the most popular celebrity fashion trends in 2025?",
      answer: "Top trends include oversized silhouettes, bold neon colors, sustainable fashion, vintage-inspired pieces, and gender-fluid fashion. Celebrities like Zendaya, Harry Styles, and Rihanna are leading these trends."
    },
    {
      question: "How much do celebrity outfits actually cost?",
      answer: "Red carpet outfits can cost anywhere from $10,000 to $500,000+ for custom designer pieces. However, you can recreate similar looks for under $100 using our affordable alternatives and shopping guides."
    },
    {
      question: "Can I buy the exact outfits celebrities wear?",
      answer: "Sometimes! Many celebrities wear pieces from mainstream brands that are available for purchase. We provide direct shopping links when possible and affordable alternatives when the original is too expensive."
    }
  ],
  
  outfits: [
    {
      question: "How do I find affordable dupes for expensive celebrity outfits?",
      answer: "Use reverse image search, check fast fashion websites, look for similar colors and silhouettes, and follow fashion bloggers who specialize in celebrity dupes. Our shopping guides provide curated alternatives."
    },
    {
      question: "What should I look for when recreating a celebrity look?",
      answer: "Focus on the overall silhouette, color palette, styling details, and proportions rather than exact pieces. Pay attention to how items are styled together and the overall vibe of the outfit."
    },
    {
      question: "Are celebrity fashion dupes good quality?",
      answer: "Quality varies by retailer. Higher-end high street brands like Zara and COS offer better quality dupes, while ultra-fast fashion may have lower quality. Read reviews and check return policies."
    }
  ]
};
