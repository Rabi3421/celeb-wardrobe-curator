
import { Celebrity, Outfit, BlogPost } from "@/types/data";

export const indianCelebrities: Celebrity[] = [
  {
    id: "alia-bhatt",
    name: "Alia Bhatt",
    image: "https://images.unsplash.com/photo-1594736797933-d0c6e5b6dd12?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    outfitCount: 12,
    bio: "Alia Bhatt is known for her versatile fashion choices, effortlessly switching between traditional ethnic wear and contemporary western outfits.",
    category: "Bollywood Actresses",
    styleType: "Versatile Chic",
    slug: "alia-bhatt",
    birthdate: "1993-03-15",
    birthplace: "Mumbai, Maharashtra",
    height: "5'3\"",
    nationality: "Indian",
    socialMedia: {
      instagram: "@aliaabhatt",
      twitter: "@aliaa08",
      facebook: "Alia Bhatt Official",
      youtube: "",
      tiktok: "",
      website: ""
    },
    signature: {
      look: "Effortless elegance with a modern twist",
      accessories: "Delicate jewelry, designer handbags",
      designers: "Sabyasachi, Manish Malhotra, Masaba",
      perfume: "Tom Ford Oud Wood"
    }
  },
  {
    id: "deepika-padukone",
    name: "Deepika Padukone",
    image: "https://images.unsplash.com/photo-1583341612074-ccea5cd64ea7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    outfitCount: 15,
    bio: "Deepika Padukone is a global fashion icon known for her sophisticated style and stunning red carpet appearances.",
    category: "Bollywood Actresses",
    styleType: "Sophisticated Glamour",
    slug: "deepika-padukone",
    birthdate: "1986-01-05",
    birthplace: "Copenhagen, Denmark",
    height: "5'9\"",
    nationality: "Indian",
    socialMedia: {
      instagram: "@deepikapadukone",
      twitter: "@deepikapadukone",
      facebook: "Deepika Padukone",
      youtube: "",
      tiktok: "",
      website: ""
    },
    signature: {
      look: "Minimalist elegance with statement pieces",
      accessories: "Bold earrings, classic clutches",
      designers: "Sabyasachi, Rohit Bal, Anamika Khanna",
      perfume: "Chanel No. 5"
    }
  },
  {
    id: "kiara-advani",
    name: "Kiara Advani",
    image: "https://images.unsplash.com/photo-1590736969955-71cc94901144?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    outfitCount: 10,
    bio: "Kiara Advani's fashion choices reflect her youthful energy, often mixing traditional and contemporary styles.",
    category: "Bollywood Actresses",
    styleType: "Young & Trendy",
    slug: "kiara-advani",
    birthdate: "1992-07-31",
    birthplace: "Mumbai, Maharashtra",
    height: "5'5\"",
    nationality: "Indian",
    socialMedia: {
      instagram: "@kiaraaliaadvani",
      twitter: "@advani_kiara",
      facebook: "Kiara Advani",
      youtube: "",
      tiktok: "",
      website: ""
    },
    signature: {
      look: "Playful chic with vibrant colors",
      accessories: "Trendy sunglasses, statement jewelry",
      designers: "Manish Malhotra, Payal Singhal, Ridhi Mehra",
      perfume: "Viktor & Rolf Flowerbomb"
    }
  }
];

export const indianOutfits: Outfit[] = [
  {
    id: "alia-bhatt-wedding-saree",
    title: "Alia Bhatt's Ivory Wedding Saree Look",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    celebrityId: "alia-bhatt",
    celebrity: "Alia Bhatt",
    description: "Recreate Alia's stunning ivory saree look from her wedding with affordable alternatives available on Myntra and Ajio.",
    fullDescription: "Alia Bhatt's wedding saree was a masterpiece of traditional elegance. This ivory silk saree with gold border and intricate embroidery can be recreated with similar pieces from Indian brands. Perfect for wedding functions and special occasions.",
    occasion: "Wedding",
    date: "2022-04-14",
    tags: ["wedding", "saree", "traditional", "ivory", "gold"],
    slug: "alia-bhatt-wedding-saree-look"
  },
  {
    id: "deepika-cannes-lehenga",
    title: "Deepika Padukone's Royal Blue Lehenga",
    image: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    celebrityId: "deepika-padukone",
    celebrity: "Deepika Padukone",
    description: "Get Deepika's regal blue lehenga look for your next festive occasion with budget-friendly options under ₹5,000.",
    fullDescription: "Deepika's royal blue lehenga with heavy embroidery and matching dupatta is perfect for sangeet ceremonies and festive celebrations. Shop similar styles on Nykaa Fashion and Amazon Fashion.",
    occasion: "Festival",
    date: "2023-05-20",
    tags: ["lehenga", "blue", "festival", "embroidery", "royal"],
    slug: "deepika-padukone-royal-blue-lehenga"
  },
  {
    id: "kiara-airport-casual",
    title: "Kiara Advani's Chic Airport Look",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    celebrityId: "kiara-advani",
    celebrity: "Kiara Advani", 
    description: "Copy Kiara's effortless airport style with comfortable yet stylish pieces available on Flipkart Fashion.",
    fullDescription: "Kiara's airport look featuring wide-leg pants, crop top, and denim jacket is perfect for travel and casual outings. Get the complete look for under ₹3,000 from Indian fashion brands.",
    occasion: "Casual",
    date: "2024-03-10",
    tags: ["airport", "casual", "comfortable", "denim", "travel"],
    slug: "kiara-advani-airport-casual-look"
  }
];

export const indianBlogPosts: BlogPost[] = [
  {
    id: "alia-bhatt-style-guide",
    title: "Alia Bhatt Style Guide: 10 Looks You Can Recreate Under ₹5,000",
    excerpt: "Discover how to recreate Alia Bhatt's most iconic looks with affordable alternatives from Indian brands like Myntra, Ajio, and Nykaa Fashion.",
    content: `
      <h2>Introduction</h2>
      <p>Alia Bhatt has become a style icon for young Indian women, known for her versatile fashion choices that seamlessly blend traditional and contemporary elements. In this comprehensive guide, we'll show you how to recreate her most stunning looks without breaking the bank.</p>
      
      <h2>Alia's Signature Style Elements</h2>
      <p>What makes Alia's style so appealing is her ability to mix high-end designer pieces with accessible fashion. Her go-to elements include:</p>
      <ul>
        <li>Flowy ethnic wear with modern cuts</li>
        <li>Minimalist jewelry that makes a statement</li>
        <li>Comfortable yet chic casual wear</li>
        <li>Bold colors balanced with neutrals</li>
      </ul>
      
      <h2>Get the Look: Outfit Breakdown</h2>
      <h3>1. The Ivory Wedding Saree</h3>
      <p>Alia's wedding saree can be recreated with these affordable alternatives:</p>
      <ul>
        <li>Ivory silk saree with gold border - ₹2,500 (Myntra)</li>
        <li>Gold temple jewelry set - ₹1,200 (Ajio)</li>
        <li>Traditional gold clutch - ₹800 (Nykaa Fashion)</li>
      </ul>
      
      <h2>Why These Looks Are Trending</h2>
      <p>Alia's fashion choices resonate with Indian women because they're practical, elegant, and culturally relevant. Her ability to make traditional wear look contemporary has inspired a new generation of fashion enthusiasts.</p>
      
      <h2>Conclusion</h2>
      <p>Recreating celebrity looks doesn't have to be expensive. With the right pieces from Indian fashion retailers, you can achieve Alia Bhatt's signature style while staying within your budget.</p>
    `,
    image: "https://images.unsplash.com/photo-1594736797933-d0c6e5b6dd12?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    date: "2024-12-25",
    category: "Style Guide",
    author: "CelebrityPersona Editorial Team",
    created_at: "2024-12-25T00:00:00Z",
    updated_at: "2024-12-25T00:00:00Z",
    slug: "alia-bhatt-style-guide-affordable-looks",
    meta_description: "Learn how to recreate Alia Bhatt's iconic looks with affordable alternatives from Myntra, Ajio, and Nykaa Fashion. Get her complete style guide under ₹5,000.",
    structured_data: "",
    keywords: "alia bhatt fashion, alia bhatt outfits, bollywood style guide, affordable celebrity looks india, myntra celebrity fashion"
  }
];
