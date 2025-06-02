
// Social Proof and Review Schema Generation
export interface ReviewData {
  author: string;
  rating: number;
  reviewBody: string;
  datePublished: string;
  itemReviewed: string;
}

export interface SocialProofMetrics {
  totalViews?: number;
  likes?: number;
  shares?: number;
  comments?: number;
  saves?: number;
}

// Generate review schema markup
export const generateReviewSchema = (reviews: ReviewData[]) => {
  if (!reviews.length) return null;
  
  const aggregateRating = {
    ratingValue: reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length,
    reviewCount: reviews.length,
    bestRating: 5,
    worstRating: 1
  };
  
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": reviews[0].itemReviewed,
    "aggregateRating": {
      "@type": "AggregateRating",
      ...aggregateRating
    },
    "review": reviews.map(review => ({
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": review.author
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": review.rating,
        "bestRating": 5,
        "worstRating": 1
      },
      "reviewBody": review.reviewBody,
      "datePublished": review.datePublished
    }))
  };
};

// Generate social interaction schema
export const generateSocialInteractionSchema = (
  itemName: string,
  itemUrl: string,
  metrics: SocialProofMetrics
) => {
  const interactions = [];
  
  if (metrics.likes) {
    interactions.push({
      "@type": "LikeAction",
      "agent": {
        "@type": "Person",
        "name": "Users"
      },
      "object": itemUrl,
      "result": {
        "@type": "Result",
        "name": `${metrics.likes} likes`
      }
    });
  }
  
  if (metrics.shares) {
    interactions.push({
      "@type": "ShareAction",
      "agent": {
        "@type": "Person", 
        "name": "Users"
      },
      "object": itemUrl,
      "result": {
        "@type": "Result",
        "name": `${metrics.shares} shares`
      }
    });
  }
  
  return interactions.length ? {
    "@context": "https://schema.org",
    "@type": "SocialMediaPosting",
    "headline": itemName,
    "url": itemUrl,
    "interactionStatistic": interactions
  } : null;
};

// Generate trending/popularity indicators
export const generateTrendingSchema = (
  itemName: string,
  trendScore: number,
  category: string
) => {
  return {
    "@context": "https://schema.org",
    "@type": "Thing",
    "name": itemName,
    "category": category,
    "additionalProperty": [
      {
        "@type": "PropertyValue",
        "name": "Trending Score",
        "value": trendScore,
        "description": "Popularity score based on user engagement and search trends"
      }
    ]
  };
};

// Mock review data for celebrity outfits (can be replaced with real data)
export const generateMockReviews = (itemName: string, celebrity: string): ReviewData[] => {
  return [
    {
      author: "StyleLover23",
      rating: 5,
      reviewBody: `Love this ${celebrity} inspired look! Found amazing dupes and recreated it perfectly for my event.`,
      datePublished: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      itemReviewed: itemName
    },
    {
      author: "FashionFanatic",
      rating: 4,
      reviewBody: `Great style inspiration! The affordable alternatives listed are spot on. Highly recommend.`,
      datePublished: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      itemReviewed: itemName
    },
    {
      author: "TrendSetter101",
      rating: 5,
      reviewBody: `This outfit guide saved me so much money! Got the look for less than $100. Amazing!`,
      datePublished: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
      itemReviewed: itemName
    }
  ];
};
