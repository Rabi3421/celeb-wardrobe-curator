
import React from "react";
import PageLayout from "@/components/layout/PageLayout";
import SEO from "@/components/SEO/SEO";

const Terms: React.FC = () => {
  // Create structured data for the page
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Terms of Service - CelebrityPersona",
    "description": "Read the terms and conditions that govern your use of the CelebrityPersona website.",
    "url": `${window.location.origin}/terms-of-service`,
    "mainEntity": {
      "@type": "WebPageElement",
      "mainContentOfPage": "Terms of Service"
    }
  };

  return (
    <PageLayout>
      <SEO 
        title="Terms of Service - CelebrityPersona"
        description="Read the terms and conditions that govern your use of the CelebrityPersona website."
        canonical={`${window.location.origin}/terms-of-service`}
        jsonLd={jsonLd}
      />
      <div className="container-custom py-12">
        <h1 className="font-serif text-3xl font-medium mb-8">Terms of Service</h1>
        <div className="prose max-w-none">
          <p className="mb-4">Last updated: May 7, 2025</p>
          
          <p className="mb-4">
            Please read these Terms of Service carefully before using CelebrityPersona.
          </p>
          
          <h2 className="text-xl font-medium mt-8 mb-4">1. Agreement to Terms</h2>
          
          <p className="mb-4">
            By accessing or using our website, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the website.
          </p>
          
          <h2 className="text-xl font-medium mt-8 mb-4">2. Intellectual Property</h2>
          
          <p className="mb-4">
            The website and its original content, features, and functionality are owned by CelebrityPersona and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
          </p>
          
          <h2 className="text-xl font-medium mt-8 mb-4">3. User Content</h2>
          
          <p className="mb-4">
            You retain any and all rights to any content you submit, post, or display on or through the website. By posting content, you grant us a non-exclusive, royalty-free license to use, modify, publicly perform, publicly display, reproduce, and distribute such content on and through the website.
          </p>
          
          <h2 className="text-xl font-medium mt-8 mb-4">4. Affiliate Links</h2>
          
          <p className="mb-4">
            Our website contains affiliate links to products. We may earn a commission for purchases made through these links. This does not affect the price you pay for products.
          </p>
          
          <h2 className="text-xl font-medium mt-8 mb-4">5. Limitation of Liability</h2>
          
          <p className="mb-4">
            In no event shall CelebrityPersona, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
          </p>
          
          <h2 className="text-xl font-medium mt-8 mb-4">6. Changes to Terms</h2>
          
          <p className="mb-4">
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect.
          </p>
          
          <h2 className="text-xl font-medium mt-8 mb-4">7. Contact Us</h2>
          
          <p className="mb-4">
            If you have any questions about these Terms, please contact us at terms@celebritypersona.com.
          </p>
        </div>
      </div>
    </PageLayout>
  );
};

export default Terms;
