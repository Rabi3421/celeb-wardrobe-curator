
import React from "react";
import PageLayout from "@/components/layout/PageLayout";

const Privacy: React.FC = () => {
  return (
    <PageLayout>
      <div className="container-custom py-12">
        <h1 className="font-serif text-3xl font-medium mb-8">Privacy Policy</h1>
        <div className="prose max-w-none">
          <p className="mb-4">Last updated: May 7, 2025</p>
          
          <p className="mb-4">
            At CelebrityPersona, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website celebritypersona.com.
          </p>
          
          <h2 className="text-xl font-medium mt-8 mb-4">Information We Collect</h2>
          
          <p className="mb-4">
            We collect information that you provide directly to us when you register for an account, subscribe to our newsletter, or interact with our content.
          </p>
          
          <h2 className="text-xl font-medium mt-8 mb-4">How We Use Your Information</h2>
          
          <p className="mb-4">
            We use the information we collect to:
          </p>
          
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-2">Provide, maintain, and improve our services</li>
            <li className="mb-2">Send you technical notices, updates, and administrative messages</li>
            <li className="mb-2">Respond to your comments, questions, and requests</li>
            <li className="mb-2">Personalize your experience on our website</li>
            <li className="mb-2">Monitor and analyze trends, usage, and activities</li>
          </ul>
          
          <h2 className="text-xl font-medium mt-8 mb-4">Cookies and Tracking Technologies</h2>
          
          <p className="mb-4">
            We use cookies and similar tracking technologies to track the activity on our website and store certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
          </p>
          
          <h2 className="text-xl font-medium mt-8 mb-4">Third-Party Links</h2>
          
          <p className="mb-4">
            Our website contains affiliate links to products on third-party websites. We are not responsible for the privacy practices of such other sites and advise you to read their privacy statements.
          </p>
          
          <h2 className="text-xl font-medium mt-8 mb-4">Contact Us</h2>
          
          <p className="mb-4">
            If you have questions about this Privacy Policy, please contact us at privacy@celebritypersona.com.
          </p>
        </div>
      </div>
    </PageLayout>
  );
};

export default Privacy;
