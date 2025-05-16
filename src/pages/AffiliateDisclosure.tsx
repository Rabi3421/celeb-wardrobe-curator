
import React from "react";
import PageLayout from "@/components/layout/PageLayout";
import SEO from "@/components/SEO/SEO";

const AffiliateDisclosure: React.FC = () => {
  // Create structured data for the page
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Affiliate Disclosure - CelebrityPersona",
    "description": "Learn about how we use affiliate links and our relationships with retailers and brands on CelebrityPersona.",
    "url": `${window.location.origin}/affiliate-disclosure`,
    "mainEntity": {
      "@type": "WebPageElement",
      "mainContentOfPage": "Affiliate Disclosure"
    }
  };

  return (
    <PageLayout>
      <SEO 
        title="Affiliate Disclosure - CelebrityPersona"
        description="Learn about how we use affiliate links and our relationships with retailers and brands on CelebrityPersona."
        canonical={`${window.location.origin}/affiliate-disclosure`}
        jsonLd={jsonLd}
      />
      <div className="container-custom py-12">
        <h1 className="font-serif text-3xl font-medium mb-8">Affiliate Disclosure</h1>
        <div className="prose max-w-none">
          <p className="mb-4">Last updated: May 7, 2025</p>
          
          <p className="mb-4">
            This website contains affiliate links, which means that if you click on one of the product links and make a purchase, I may receive a small commission at no extra cost to you. This helps support the site and allows us to continue to create content like this.
          </p>
          
          <p className="mb-4">
            CelebrityPersona is a participant in the following affiliate programs:
          </p>
          
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-2">Amazon Associates Program</li>
            <li className="mb-2">ShopStyle Collective</li>
            <li className="mb-2">RewardStyle</li>
            <li className="mb-2">Commission Junction</li>
            <li className="mb-2">ShareASale</li>
          </ul>
          
          <p className="mb-4">
            We only recommend products that we believe will be valuable to our readers. We carefully select all products featured on our site and never allow an affiliate partnership to influence our opinions or recommendations.
          </p>
          
          <p className="mb-4">
            All recommendations are based on our genuine belief in the product's quality. We always disclose when a post contains affiliate links. If you have any questions about this, please feel free to contact us.
          </p>
          
          <h2 className="text-xl font-medium mt-8 mb-4">How to Identify Affiliate Links</h2>
          
          <p className="mb-4">
            Affiliate links on our site are typically identified with text such as "Shop Similar," "Buy Now," or similar language that indicates a purchasing opportunity. In some cases, text links within articles may also be affiliate links.
          </p>
          
          <h2 className="text-xl font-medium mt-8 mb-4">Your Support</h2>
          
          <p className="mb-4">
            When you purchase products through our affiliate links, you're supporting our work at no additional cost to you. These commissions help us maintain the website, create new content, and continue providing valuable information about celebrity fashion and style.
          </p>
          
          <p className="mb-4">
            Thank you for your support!
          </p>
          
          <h2 className="text-xl font-medium mt-8 mb-4">Questions?</h2>
          
          <p className="mb-4">
            If you have any questions about our affiliate relationships or how we use affiliate links, please contact us at affiliates@celebritypersona.com.
          </p>
        </div>
      </div>
    </PageLayout>
  );
};

export default AffiliateDisclosure;
