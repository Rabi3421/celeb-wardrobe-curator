// Mock data for development

// Celebrity data
export const celebrities = [
  {
    id: "zendaya",
    name: "Zendaya",
    image:
      "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
    outfitCount: 8,
    bio: "Emmy Award-winning actress and fashion icon known for her bold style choices and statement outfits. From red carpet glamour to street style, Zendaya consistently delivers fashion inspiration.",
    category: "actress",
    styleType: "Avant-garde Elegance",
  },
  {
    id: "harry-styles",
    name: "Harry Styles",
    image:
      "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
    outfitCount: 6,
    bio: "Grammy-winning musician and fashion trendsetter known for breaking gender norms with his eclectic style. From floral suits to pearl necklaces, Harry's fashion choices are always conversation starters.",
    category: "musician",
    styleType: "Gender-fluid Eclectic",
  },
  {
    id: "rihanna",
    name: "Rihanna",
    image:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
    outfitCount: 12,
    bio: "Multi-platinum artist, fashion designer, and entrepreneur known for her boundary-pushing style. Whether it's streetwear or haute couture, Rihanna's fashion influence is undeniable.",
    category: "musician",
    styleType: "Urban Luxe",
  },
  {
    id: "timothee-chalamet",
    name: "Timothée Chalamet",
    image:
      "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
    outfitCount: 5,
    bio: "Award-winning actor and style icon known for his modern take on classic menswear. With his slender frame and European flair, Timothée brings a fresh perspective to men's fashion.",
    category: "actor",
    styleType: "Modern Classic",
  },
];

// Outfit data
export const outfits = [
  {
    id: "outfit-1",
    image: "/images/zendaya_red_carpet_look.avif",
    celebrityId: "zendaya",
    celebrity: "Zendaya",
    title: "Met Gala 2023 Red Carpet Look",
    description:
      "Zendaya stuns in a custom Valentino gown with architectural elements and bold color choices, accessorized with Bulgari jewelry.",
    fullDescription:
      "Zendaya made a statement at the Met Gala 2023 in this custom-made Valentino gown that perfectly embodied this year's theme. The architectural silhouette features dramatic volume balanced by clean lines, while the vibrant color creates an unforgettable visual impact. Her styling team completed the look with Bulgari jewelry pieces and Jimmy Choo heels, demonstrating once again why she's considered one of Hollywood's most influential fashion icons.",
    occasion: "Red Carpet",
    date: "2023-05-01",
    tags: ["gala", "red carpet", "designer", "evening wear"],
  },
  {
    id: "outfit-2",
    image: "/images/Rihanna.jpeg",
    celebrityId: "rihanna",
    celebrity: "Rihanna",
    title: "NYC Street Style in Oversized Coat",
    description:
      "Rihanna showcases her signature street style with an oversized designer coat, distressed jeans, and statement accessories.",
    fullDescription:
      "Rihanna was spotted in NYC wearing her signature oversized styling approach. The focal point of this outfit is the luxurious wool-blend coat with exaggerated proportions, layered over a simple white tee and distressed wide-leg jeans. Her accessory game remains unmatched with chunky gold jewelry, designer sunglasses, and a mini handbag. This look perfectly demonstrates how Rihanna balances high-fashion pieces with casual elements for an effortlessly cool street style moment.",
    occasion: "Street Style",
    date: "2023-11-15",
    tags: ["street style", "casual", "oversized", "denim"],
  },
  {
    id: "outfit-3",
    image: "/images/Harry_Styles.jpeg",
    celebrityId: "harry-styles",
    celebrity: "Harry Styles",
    title: "Grammy Performance Flared Jumpsuit",
    description:
      "Harry Styles performs in a custom Gucci sequined jumpsuit with 70s-inspired flared legs and a daring open chest design.",
    fullDescription:
      "Harry Styles delivered another iconic fashion moment during his Grammy performance in this custom Gucci creation. The all-black sequined jumpsuit features dramatically flared legs reminiscent of 70s glam rock, while the open chest design adorned with a statement feather boa created a perfect balance of masculine and feminine elements. The jumpsuit's tailoring accentuates his silhouette while allowing freedom of movement for his energetic performance. This look continues Harry's tradition of challenging menswear conventions and embracing gender-fluid fashion.",
    occasion: "Performance",
    date: "2023-02-05",
    tags: ["stage outfit", "designer", "sequins", "performance"],
  },
  {
    id: "outfit-4",
    image:
      "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
    celebrityId: "zendaya",
    celebrity: "Zendaya",
    title: "Euphoria Season 2 Premiere Look",
    description:
      "Zendaya channels vintage glamour in a custom Valentino gown with modern cutouts and architectural details.",
    fullDescription:
      "For the highly anticipated Euphoria Season 2 premiere, Zendaya wore a breathtaking custom Valentino creation that perfectly balanced vintage inspiration with contemporary design elements. The column silhouette features strategic cutouts that add modern edge to the classic structure, while the rich jewel tone complements her complexion beautifully. Her styling team completed the look with slicked-back hair and minimal jewelry, allowing the gown's architectural details to take center stage. This appearance demonstrates Zendaya's ability to push fashion boundaries while maintaining sophisticated elegance.",
    occasion: "Premiere",
    date: "2023-01-10",
    tags: ["premiere", "red carpet", "designer", "evening wear"],
  },
  {
    id: "outfit-5",
    image:
      "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
    celebrityId: "timothee-chalamet",
    celebrity: "Timothée Chalamet",
    title: "Cannes Film Festival Suit Moment",
    description:
      "Timothée makes a statement in a custom Haider Ackermann suit with modern proportions and unconventional details.",
    fullDescription:
      "Timothée Chalamet commanded attention at the Cannes Film Festival in this masterfully tailored Haider Ackermann suit. The design features slightly cropped trousers and a reconstructed blazer with subtle asymmetric elements that challenge traditional menswear proportions. The rich texture of the fabric adds depth to the monochromatic palette, while minimal styling lets the impeccable tailoring speak for itself. This appearance reinforces Timothée's position as one of the most exciting figures in men's fashion, consistently bringing a fresh perspective to classic formal wear.",
    occasion: "Film Festival",
    date: "2023-05-20",
    tags: ["film festival", "suit", "designer", "formal"],
  },
  {
    id: "outfit-6",
    image:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
    celebrityId: "rihanna",
    celebrity: "Rihanna",
    title: "Paris Fashion Week Front Row Look",
    description:
      "Rihanna attends Dior show in a completely sheer lace dress layered over logo underwear, creating a bold fashion statement.",
    fullDescription:
      "Rihanna turned heads at Paris Fashion Week with this daring Dior ensemble that perfectly showcases her fearless approach to fashion. The completely sheer lace dress reveals logo underwear beneath, striking the perfect balance between high fashion and provocative styling. Her team completed the look with oversized outerwear, layered necklaces, and statement sunglasses for a truly memorable front row appearance. This outfit demonstrates Rihanna's unmatched ability to take risks and set trends rather than follow them, reinforcing her status as a true fashion innovator.",
    occasion: "Fashion Week",
    date: "2023-09-28",
    tags: ["fashion week", "sheer", "designer", "daring"],
  },
];

// Affiliate product data
export const affiliateProducts = [
  {
    id: "product-1",
    outfitId: "outfit-1",
    image:
      "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
    title: "Designer Inspired Red Carpet Gown",
    price: "$299.99",
    retailer: "Amazon",
    affiliateLink: "https://amazon.com",
    description:
      "Channel Zendaya's red carpet glamour with this stunning designer-inspired gown.",
  },
  {
    id: "product-2",
    outfitId: "outfit-1",
    image:
      "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
    title: "Crystal Statement Earrings",
    price: "$49.99",
    retailer: "Myntra",
    affiliateLink: "https://myntra.com",
    description:
      "Complete your red carpet look with these dazzling statement earrings.",
  },
  {
    id: "product-3",
    outfitId: "outfit-1",
    image:
      "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
    title: "Metallic Strappy Heels",
    price: "$79.99",
    retailer: "Flipkart",
    affiliateLink: "https://flipkart.com",
    description: "These metallic heels will elevate any formal ensemble.",
  },
  {
    id: "product-4",
    outfitId: "outfit-2",
    image:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
    title: "Oversized Wool Blend Coat",
    price: "$159.99",
    retailer: "Amazon",
    affiliateLink: "https://amazon.com",
    description:
      "Stay warm and stylish with this Rihanna-inspired oversized coat.",
  },
  {
    id: "product-5",
    outfitId: "outfit-2",
    image:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
    title: "Distressed Wide-Leg Jeans",
    price: "$89.99",
    retailer: "Myntra",
    affiliateLink: "https://myntra.com",
    description:
      "These trendy wide-leg jeans are perfect for an off-duty look.",
  },
  {
    id: "product-6",
    outfitId: "outfit-3",
    image:
      "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
    title: "Men's Sequin Blazer",
    price: "$129.99",
    retailer: "Flipkart",
    affiliateLink: "https://flipkart.com",
    description:
      "Make a statement with this Harry Styles-inspired sequin blazer.",
  },
];

// Blog post data
export const blogPosts = [
  {
    id: "post-1",
    title: "Spring Fashion Trends From Celebrity Closets",
    excerpt:
      "Discover the hottest spring fashion trends as seen on your favorite stars. From pastel colors to statement accessories, these celebrity-inspired looks will refresh your wardrobe.",
    content:
      "As the flowers bloom and temperatures rise, celebrities are showcasing the season's most exciting fashion trends. This spring, we're seeing a resurgence of pastel colors across red carpets and street style looks alike. Zendaya recently demonstrated how to wear lavender for daytime, while Harry Styles continues to champion gender-fluid fashion with his collection of pearl accessories and flowing silhouettes.\n\nStatement accessories are having a major moment, with oversized sunglasses, chunky jewelry, and architectural handbags completing many celebrity ensembles. Rihanna's recent street style look paired simple basics with show-stopping accessories, proving that the right finishing touches can elevate even the most casual outfit.\n\nAs for footwear, platform shoes are making a dramatic comeback. From Timothée Chalamet's subtle height-boosting dress shoes to Dua Lipa's towering disco-inspired boots, added height is definitely in this season.\n\nThe 70s revival continues with flared silhouettes, crochet details, and earthy tones dominating celebrity wardrobes. Modern interpretations of these retro elements feel fresh and contemporary when styled with current pieces.\n\nTo incorporate these trends into your own wardrobe, start with one statement piece and build a look around it. A pastel blazer, platform sandals, or a crochet top can instantly update your spring style while channeling your favorite celebrity's fashion sense.",
    image:
      "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
    date: "April 12, 2023",
    category: "Fashion Trends",
    author: "Emma Style",
  },
  {
    id: "post-2",
    title: "How to Recreate Red Carpet Looks on a Budget",
    excerpt:
      "You don't need a celebrity budget to look like a star. Learn how to recreate iconic red carpet moments with affordable alternatives that capture the same essence.",
    content:
      "Red carpet fashion often seems unattainable with designer gowns easily costing thousands of dollars, but creating similar looks on a budget is entirely possible with some smart shopping strategies.\n\nFirst, focus on silhouette rather than exact details. The overall shape and cut of a garment contributes significantly to its impact. For example, Zendaya's recent column gown with a dramatic train can be mimicked by seeking out similar silhouettes at formal wear retailers like ASOS, Lulus, or even rental services like Rent the Runway.\n\nFabric choice makes a major difference in how luxurious a garment appears. Look for pieces with substantial weight and good drape, even if they're not the exact same material as the designer original. Polyester blends have come a long way and can often convincingly mimic silk or other high-end fabrics at a fraction of the cost.\n\nAccessorizing strategically can elevate budget-friendly outfits. Statement jewelry, elegant clutches, and well-chosen shoes can create the illusion of a more expensive ensemble. Consider investing in one quality accessory that you'll wear repeatedly rather than several cheaper pieces.\n\nTailoring is non-negotiable when recreating red carpet looks. Even inexpensive garments appear more luxurious when they fit perfectly. Set aside part of your budget for alterations to ensure your outfit looks customized to your body, just like the original designer pieces are for celebrities.\n\nFinally, hair and makeup play crucial roles in completing any red carpet recreation. Study photos of your inspiration look and practice achieving similar styling at home with products in your price range. A polished beauty look can tie together your entire homage to celebrity style.",
    image:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
    date: "March 28, 2023",
    category: "Budget Fashion",
    author: "Alex Thrift",
  },
  {
    id: "post-3",
    title: "The Evolution of Celebrity Street Style",
    excerpt:
      "From casual errands to airport fashion, explore how celebrity street style has transformed over the decades and continues to influence everyday fashion trends.",
    content:
      "Celebrity street style has undergone a fascinating evolution from being merely paparazzi afterthoughts to carefully cultivated fashion moments that often rival red carpet appearances in terms of influence and attention.\n\nIn the 1990s, street style was genuinely casual, with celebrities often photographed in relaxed, unplanned outfits that reflected personal comfort rather than fashion statements. Think Julia Roberts in oversized suits or Brad Pitt in simple tees and jeans. There was an authenticity to these moments that fashion enthusiasts now often romanticize.\n\nThe early 2000s marked a shift as celebrities began recognizing the power of street style photographs. Paris Hilton and Nicole Richie pioneered the idea of treating everyday outings as fashion opportunities, with recognizable aesthetics that fans eagerly copied. This era saw the rise of designer handbags as status symbols and statement pieces.\n\nBy the 2010s, street style had become a full-fledged fashion category with its own rules and stars. Models like Gigi Hadid and Kendall Jenner became as famous for their off-duty looks as their runway appearances. The concept of the 'model-off-duty' look became aspirational for fashion followers worldwide.\n\nToday's celebrity street style exists in a complex relationship with social media. With Instagram offering celebrities direct control over their image, paparazzi shots compete with curated self-documentation. Stars like Rihanna and Harry Styles have turned everyday outings into fashion moments, with street style outfits that generate as much discussion as formal appearances.\n\nThe democratization of fashion through social media has also elevated 'regular' street style stars, creating a feedback loop where celebrities and non-celebrities alike influence each other's fashion choices. This has led to more diverse and experimental street style, with personal expression valued alongside designer endorsements.\n\nAs we move forward, celebrity street style continues to blur the lines between casual and formal, planned and spontaneous. Its evolution reflects broader shifts in how we perceive authenticity, aspiration, and self-expression through fashion in an increasingly connected world.",
    image:
      "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
    date: "February 15, 2023",
    category: "Fashion History",
    author: "Jordan Chic",
  },
];

// User data (for admin authentication)
export const users = [
  {
    id: "admin-user",
    email: "admin@celebritypersona.com",
    // In a real app, this would be a hashed password
    password: "admin123",
    name: "Admin User",
    role: "admin",
  },
];

// Analytics data (for admin dashboard)
export const analyticsData = {
  topPosts: [
    {
      id: "outfit-2",
      title: "NYC Street Style in Oversized Coat",
      views: 1243,
      clicks: 89,
      revenue: 156.78,
    },
    {
      id: "outfit-1",
      title: "Met Gala 2023 Red Carpet Look",
      views: 1056,
      clicks: 72,
      revenue: 127.35,
    },
    {
      id: "outfit-3",
      title: "Grammy Performance Flared Jumpsuit",
      views: 987,
      clicks: 68,
      revenue: 102.45,
    },
    {
      id: "outfit-6",
      title: "Paris Fashion Week Front Row Look",
      views: 856,
      clicks: 61,
      revenue: 95.2,
    },
    {
      id: "outfit-5",
      title: "Cannes Film Festival Suit Moment",
      views: 712,
      clicks: 48,
      revenue: 75.6,
    },
  ],
  monthlyStats: [
    { month: "Jan", views: 5200, clicks: 312, revenue: 415.75 },
    { month: "Feb", views: 6100, clicks: 385, revenue: 520.3 },
    { month: "Mar", views: 7300, clicks: 462, revenue: 615.89 },
    { month: "Apr", views: 6800, clicks: 429, revenue: 575.45 },
    { month: "May", views: 7500, clicks: 487, revenue: 645.2 },
    { month: "Jun", views: 8200, clicks: 531, revenue: 710.35 },
  ],
  retailerPerformance: [
    { retailer: "Amazon", clicks: 523, revenue: 875.45 },
    { retailer: "Myntra", clicks: 387, revenue: 625.3 },
    { retailer: "Flipkart", clicks: 291, revenue: 435.75 },
    { retailer: "Other", clicks: 145, revenue: 215.25 },
  ],
};

// Tags and categories
export const tags = [
  "red carpet",
  "street style",
  "casual",
  "formal",
  "designer",
  "performance",
  "gala",
  "awards",
  "fashion week",
  "premiere",
  "interview",
  "vacation",
  "airport",
  "party",
  "daytime",
  "evening wear",
  "accessories",
  "vintage",
  "sustainable",
  "custom",
];

export const categories = [
  "Fashion Trends",
  "Celebrity Style",
  "Budget Fashion",
  "Fashion History",
  "Shopping Guides",
  "Style Tips",
  "Seasonal Fashion",
  "Fashion News",
];

export const occasions = [
  "Red Carpet",
  "Street Style",
  "Performance",
  "Interview",
  "Travel",
  "Film Festival",
  "Fashion Week",
  "Premiere",
  "Award Show",
  "Party",
];

export const demo = [
  {
    _id: "68811bcaaa4249675fa6ccf5",
    name: "sdsd",
    birthDate: null,
    occupation: "",
    nationality: "",
    infoboxImage:
      "https://firebasestorage.googleapis.com/v0/b/celebritypersona-918fc.firebasestorage.app/o/celebrities%2Fsdsd.png?alt=media&token=e2482bc4-9757-4033-afd4-2e2b80bc6606",
    facts: [],
    type: "",
    matches: [],
    medals: [],
    metaTitle: "",
    metaDescription: "",
    slug: "dfdf-df",
    coverImage:
      "https://firebasestorage.googleapis.com/v0/b/celebritypersona-918fc.firebasestorage.app/o/celebrities%2Fsdsd.png?alt=media&token=2093d2cc-a4bb-4d11-b755-6a34d1329870",
    sections: [
      {
        title: "Biography",
        content: "&lt;p>sdsds&lt;/p>",
      },
      {
        title: "Early Life",
        content: "sdsd",
      },
      {
        title: "Career",
        content: "sdsd",
      },
      {
        title: "Awards",
        content: "sdsd",
      },
    ],
    trending: false,
    trendingScore: 0,
    isDraft: false,
    films: [],
    awards: [],
    trophies: [],
    albums: [],
    books: [],
    positions: [],
    achievements: [],
    events: [],
    createdAt: "2025-07-23T17:28:42.559Z",
    updatedAt: "2025-07-23T17:28:42.559Z",
    __v: 0,
  },
];
