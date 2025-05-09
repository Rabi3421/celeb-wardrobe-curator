
import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.29.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Create a Supabase client with the service role key
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const supabase = createClient(supabaseUrl, supabaseKey);

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Clear existing data
    await supabase.from("affiliate_products").delete().not("id", "is", null);
    await supabase.from("outfits").delete().not("id", "is", null);
    await supabase.from("blog_posts").delete().not("id", "is", null);
    await supabase.from("celebrities").delete().not("id", "is", null);

    // Import celebrities
    const celebrities = [
      {
        name: "Zendaya",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        bio: "Zendaya is known for her bold fashion choices and has become a style icon on and off the red carpet.",
        category: "Actors",
        style_type: "Avant-garde",
      },
      {
        name: "Harry Styles",
        image: "/images/Harry_Styles.jpeg",
        bio: "Harry Styles has become known for his gender-fluid fashion and unique personal style.",
        category: "Musicians",
        style_type: "Eclectic",
      },
      {
        name: "Timothée Chalamet",
        image: "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        bio: "Timothée has made a name for himself with his elegant yet unconventional red carpet choices.",
        category: "Actors",
        style_type: "Elegant",
      },
      {
        name: "Rihanna",
        image: "/images/Rihanna.jpeg",
        bio: "Rihanna is a fashion icon known for her daring and innovative style choices.",
        category: "Musicians",
        style_type: "Bold",
      },
      {
        name: "Emma Watson",
        image: "https://images.unsplash.com/photo-1605405748313-a416a1b84491?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        bio: "Emma Watson is known for her sophisticated style and advocacy for sustainable fashion.",
        category: "Actors",
        style_type: "Elegant",
      },
      {
        name: "Dua Lipa",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        bio: "Dua Lipa combines retro influences with modern trends in her distinctive style.",
        category: "Musicians",
        style_type: "Retro-modern",
      },
      {
        name: "Beyoncé",
        image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        bio: "Beyoncé is known for her glamorous and powerful fashion statements.",
        category: "Musicians",
        style_type: "Glamorous",
      },
      {
        name: "Lupita Nyong'o",
        image: "https://images.unsplash.com/photo-1589156191108-c762ff4b96ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        bio: "Lupita Nyong'o is celebrated for her elegant and colorful red carpet looks.",
        category: "Actors",
        style_type: "Elegant",
      }
    ];

    const { data: celebritiesData } = await supabase
      .from("celebrities")
      .insert(celebrities)
      .select();

    // Map celebrity IDs
    const celebrityMap = {};
    if (celebritiesData) {
      celebritiesData.forEach((celeb) => {
        celebrityMap[celeb.name] = celeb.id;
      });
    }

    // Import outfits
    const outfits = [
      {
        title: "Met Gala Statement Look",
        image: "/images/zendaya_red_carpet_look.avif",
        celebrity_id: celebrityMap["Zendaya"],
        description: "Zendaya's stunning outfit from the Met Gala that turned heads.",
        full_description: "This elaborate ensemble designed by a top fashion house perfectly embodied the gala's theme while showcasing Zendaya's fashion-forward sensibilities.",
        occasion: "Red Carpet",
        date: new Date().toISOString().split("T")[0],
        tags: ["gala", "designer", "couture"]
      },
      {
        title: "Concert Tour Opening Night",
        image: "https://images.unsplash.com/photo-1588117305388-c2631a279f82?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        celebrity_id: celebrityMap["Harry Styles"],
        description: "Harry's vibrant outfit from his latest tour opening show.",
        full_description: "This custom outfit designed for the opening night showcased Harry's unique style while allowing for maximum movement during performances.",
        occasion: "Concert",
        date: new Date().toISOString().split("T")[0],
        tags: ["concert", "bold", "sequins"]
      },
      {
        title: "Film Festival Arrival",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        celebrity_id: celebrityMap["Timothée Chalamet"],
        description: "Timothée's sophisticated yet edgy look at the Venice Film Festival.",
        full_description: "This boundary-pushing outfit was both elegant and unconventional, perfectly matching Timothée's reputation for fashion risk-taking.",
        occasion: "Film Festival",
        date: new Date().toISOString().split("T")[0],
        tags: ["festival", "formal", "designer"]
      },
      {
        title: "Fashion Week Front Row",
        image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        celebrity_id: celebrityMap["Rihanna"],
        description: "Rihanna's statement outfit that stole the show at Paris Fashion Week.",
        full_description: "This bold ensemble from Rihanna's own fashion line combined elements of streetwear and haute couture.",
        occasion: "Fashion Week",
        date: new Date().toISOString().split("T")[0],
        tags: ["paris", "designer", "streetwear"]
      },
      {
        title: "Charity Gala Appearance",
        image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        celebrity_id: celebrityMap["Emma Watson"],
        description: "Emma's sustainable fashion statement at a climate action gala.",
        full_description: "This gown was made entirely from recycled materials, demonstrating Emma's commitment to sustainable fashion choices.",
        occasion: "Gala",
        date: new Date().toISOString().split("T")[0],
        tags: ["sustainable", "elegant", "eco-friendly"]
      },
      {
        title: "Award Show Performance",
        image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        celebrity_id: celebrityMap["Dua Lipa"],
        description: "Dua's eye-catching stage outfit from her Grammy performance.",
        full_description: "This custom-designed stage outfit featured holographic elements and allowed for the dynamic movement needed for her energetic performance.",
        occasion: "Performance",
        date: new Date().toISOString().split("T")[0],
        tags: ["stage", "performance", "holographic"]
      },
      {
        title: "Album Release Party",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        celebrity_id: celebrityMap["Beyoncé"],
        description: "Beyoncé's powerful ensemble from her album release party.",
        full_description: "This outfit was specially designed to reflect the themes and aesthetics of her new album while making a powerful fashion statement.",
        occasion: "Party",
        date: new Date().toISOString().split("T")[0],
        tags: ["album", "statement", "designer"]
      },
      {
        title: "Oscar Ceremony Look",
        image: "https://images.unsplash.com/photo-1496440737103-cd596325d314?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        celebrity_id: celebrityMap["Lupita Nyong'o"],
        description: "Lupita's breathtaking gown from this year's Oscar ceremony.",
        full_description: "This custom haute couture gown took over 500 hours to create, with hand-embroidered details and a silhouette designed specifically for Lupita.",
        occasion: "Awards",
        date: new Date().toISOString().split("T")[0],
        tags: ["oscars", "gown", "couture"]
      }
    ];

    const { data: outfitsData } = await supabase
      .from("outfits")
      .insert(outfits)
      .select();

    // Map outfit IDs
    const outfitMap = {};
    if (outfitsData) {
      outfitsData.forEach((outfit) => {
        outfitMap[outfit.title] = outfit.id;
      });
    }

    // Import blog posts
    const blogPosts = [
      {
        title: "How Zendaya Revolutionized Red Carpet Fashion",
        excerpt: "Exploring how Zendaya has changed the landscape of celebrity fashion in recent years.",
        content: "Zendaya has consistently pushed boundaries with her red carpet choices, working closely with stylist Law Roach to create memorable fashion moments that combine high fashion with personal expression. From her Joan of Arc-inspired Met Gala look to her recent vintage couture revival, she has become a fashion icon who influences both high fashion and streetwear trends.",
        image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        date: "2025-04-25",
        category: "Style Analysis",
        author: "Fashion Editor"
      },
      {
        title: "The Rise of Gender-Fluid Fashion in Hollywood",
        excerpt: "How celebrities like Harry Styles are breaking down traditional fashion boundaries.",
        content: "The rigid boundaries of gendered fashion are being dismantled by celebrities who choose to express themselves through clothing without conforming to traditional expectations. Harry Styles' Vogue cover in a dress sparked conversations about masculinity and fashion freedom, while others like Billy Porter and Janelle Monáe continue to challenge norms with their red carpet choices.",
        image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        date: "2025-04-20",
        category: "Fashion Trends",
        author: "Style Correspondent"
      },
      {
        title: "Sustainable Fashion: Emma Watson's Eco-Conscious Choices",
        excerpt: "Examining how Emma Watson champions sustainability in her fashion choices.",
        content: "Emma Watson has become a pioneer for sustainable fashion in Hollywood, making conscious choices about the environmental and ethical impact of her wardrobe. From wearing custom sustainable gowns on red carpets to launching the Good On You app that rates fashion brands on their ethical practices, Watson demonstrates that style and sustainability can coexist.",
        image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        date: "2025-04-15",
        category: "Sustainable Fashion",
        author: "Environmental Fashion Writer"
      },
      {
        title: "The Impact of Hip-Hop Artists on Luxury Fashion",
        excerpt: "How music artists are reshaping luxury brand collaborations and aesthetics.",
        content: "The relationship between hip-hop culture and luxury fashion has evolved dramatically, with artists now sitting front row at fashion weeks, securing major brand partnerships, and even taking creative director positions. This symbiotic relationship has transformed both industries, introducing streetwear elements into haute couture while elevating hip-hop's visual aesthetics.",
        image: "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        date: "2025-04-10",
        category: "Fashion Industry",
        author: "Music & Fashion Analyst"
      },
      {
        title: "The Art of Celebrity Styling: Behind the Scenes",
        excerpt: "An inside look at how celebrity stylists create iconic fashion moments.",
        content: "Behind every memorable celebrity outfit is a stylist who understands both fashion and storytelling. This article takes readers behind the scenes of celebrity styling, from mood board creation to last-minute alterations, revealing how professionals like Law Roach and Jason Bolden craft visual narratives through clothing choices.",
        image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        date: "2025-04-05",
        category: "Industry Insights",
        author: "Celebrity Fashion Insider"
      },
      {
        title: "Met Gala Through the Years: Evolution of Fashion's Biggest Night",
        excerpt: "Tracking how the Met Gala has transformed from society fundraiser to global fashion spectacle.",
        content: "The Metropolitan Museum of Art's Costume Institute Benefit, commonly known as the Met Gala, has evolved from a local fundraising event to fashion's most photographed night. This retrospective examines key moments, iconic outfits, and how the event has become a cultural touchstone that both reflects and influences the fashion industry's direction.",
        image: "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        date: "2025-03-28",
        category: "Fashion History",
        author: "Fashion Historian"
      }
    ];

    await supabase
      .from("blog_posts")
      .insert(blogPosts);

    // Import affiliate products
    const affiliateProducts = [
      {
        outfit_id: outfitMap["Met Gala Statement Look"],
        image: "https://images.unsplash.com/photo-1619096252214-ef06c45683e3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        title: "Designer Evening Gown - Similar Style",
        price: "$499.99",
        retailer: "LuxeFashion",
        affiliate_link: "https://example.com/product1",
        description: "A stunning evening gown inspired by Zendaya's Met Gala look, featuring similar silhouette and details at a more accessible price point."
      },
      {
        outfit_id: outfitMap["Met Gala Statement Look"],
        image: "https://images.unsplash.com/photo-1615397349754-cfa2066a298e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        title: "Statement Earrings",
        price: "$89.99",
        retailer: "JewelryEmporium",
        affiliate_link: "https://example.com/product2",
        description: "Dramatic chandelier earrings that capture the essence of Zendaya's red carpet accessories."
      },
      {
        outfit_id: outfitMap["Concert Tour Opening Night"],
        image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        title: "Sequined Performance Jacket",
        price: "$259.99",
        retailer: "StageStyle",
        affiliate_link: "https://example.com/product3",
        description: "A bold sequined jacket inspired by Harry's tour wardrobe, perfect for making a statement."
      },
      {
        outfit_id: outfitMap["Concert Tour Opening Night"],
        image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        title: "High-Waisted Flared Trousers",
        price: "$129.99",
        retailer: "RetroRevival",
        affiliate_link: "https://example.com/product4",
        description: "70s-inspired flared trousers similar to those worn by Harry Styles on stage."
      },
      {
        outfit_id: outfitMap["Film Festival Arrival"],
        image: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        title: "Modern Slim-Fit Blazer",
        price: "$189.99",
        retailer: "ModernMenswear",
        affiliate_link: "https://example.com/product5",
        description: "A tailored blazer with contemporary details inspired by Timothée's festival look."
      },
      {
        outfit_id: outfitMap["Fashion Week Front Row"],
        image: "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        title: "Oversized Fashion Sunglasses",
        price: "$149.99",
        retailer: "LuxeAccessories",
        affiliate_link: "https://example.com/product6",
        description: "Statement sunglasses similar to those worn by Rihanna at Paris Fashion Week."
      },
      {
        outfit_id: outfitMap["Charity Gala Appearance"],
        image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        title: "Sustainable Evening Dress",
        price: "$329.99",
        retailer: "EcoChic",
        affiliate_link: "https://example.com/product7",
        description: "An eco-friendly gown made from recycled materials, inspired by Emma Watson's sustainable fashion choices."
      },
      {
        outfit_id: outfitMap["Award Show Performance"],
        image: "https://images.unsplash.com/photo-1629374029669-aab2f060553b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        title: "Holographic Performance Top",
        price: "$79.99",
        retailer: "StageFashion",
        affiliate_link: "https://example.com/product8",
        description: "A shimmering top with holographic details inspired by Dua Lipa's performance outfit."
      }
    ];

    await supabase
      .from("affiliate_products")
      .insert(affiliateProducts);

    // Update outfit count for celebrities
    if (outfitsData && celebritiesData) {
      for (const celebrity of celebritiesData) {
        const outfitCount = outfitsData.filter(outfit => outfit.celebrity_id === celebrity.id).length;
        await supabase
          .from("celebrities")
          .update({ outfitcount: outfitCount })
          .eq("id", celebrity.id);
      }
    }

    // Return stats
    return new Response(
      JSON.stringify({
        success: true,
        message: "Mock data imported successfully",
        stats: {
          celebrities: celebrities.length,
          outfits: outfits.length,
          blogPosts: blogPosts.length,
          affiliateProducts: affiliateProducts.length,
        },
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    console.error("Error importing mock data:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
