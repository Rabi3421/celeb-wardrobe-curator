
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Instagram, Pinterest, Twitter, Youtube } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const Footer: React.FC = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically handle the subscription logic
    console.log("Subscribed with:", email);
    setEmail("");
    // You could add toast notification here
  };

  // Categories for the footer
  const categories = [
    { name: "Dresses", link: "/category/dresses" },
    { name: "Shoes", link: "/category/shoes" },
    { name: "Makeup", link: "/category/makeup" },
    { name: "Handbags", link: "/category/handbags" },
    { name: "Cars", link: "/category/cars" },
    { name: "Bikes", link: "/category/bikes" }
  ];

  // Quick links for the footer
  const quickLinks = [
    { name: "Home", link: "/" },
    { name: "Celebrities", link: "/celebrities" },
    { name: "Outfits", link: "/outfits" },
    { name: "Blog", link: "/blog" }
  ];

  // Legal links for the footer
  const legalLinks = [
    { name: "Privacy Policy", link: "/privacy" },
    { name: "Terms of Service", link: "/terms" },
    { name: "Affiliate Disclosure", link: "/affiliate-disclosure" }
  ];

  // Social media links
  const socialLinks = [
    { name: "Instagram", icon: Instagram, link: "https://instagram.com" },
    { name: "Pinterest", icon: Pinterest, link: "https://pinterest.com" },
    { name: "Twitter", icon: Twitter, link: "https://twitter.com" },
    { name: "Youtube", icon: Youtube, link: "https://youtube.com" }
  ];

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container-custom">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="space-y-6">
            <div>
              <h2 className="font-serif text-2xl font-bold tracking-tight">
                CelebrityPersona
              </h2>
              <p className="text-sm text-gray-300 italic mt-1">
                Get the Celebrity Look
              </p>
            </div>
            
            <p className="text-sm text-gray-300">
              Your premier destination for celebrity fashion inspiration, 
              outfit breakdowns, and curated shopping experiences.
            </p>
            
            {/* Social Icons */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a 
                  key={social.name} 
                  href={social.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-gray-800 hover:bg-pastel-pink hover:text-gray-900 transition-all duration-300"
                  aria-label={social.name}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="font-medium text-lg mb-4 font-serif">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.link} 
                    className="text-sm text-gray-300 hover:text-pastel-pink hover:underline transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories Column */}
          <div>
            <h3 className="font-medium text-lg mb-4 font-serif">
              Popular Categories
            </h3>
            <ul className="space-y-3">
              {categories.map((category) => (
                <li key={category.name}>
                  <Link 
                    to={category.link} 
                    className="text-sm text-gray-300 hover:text-pastel-pink hover:underline transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h3 className="font-medium text-lg mb-4 font-serif">
              Join the Style Squad
            </h3>
            <p className="text-sm text-gray-300 mb-4">
              Get exclusive celebrity style updates and fashion insights directly to your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="relative">
                <Input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={cn(
                    "bg-gray-800 border-gray-700 text-white placeholder:text-gray-400",
                    "focus:border-pastel-pink focus:ring-pastel-pink"
                  )}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-pastel-pink hover:bg-pastel-pink/90 text-primary-foreground"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* Separator */}
        <Separator className="bg-gray-700" />

        {/* Bottom Footer */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} celebritypersona.com. All rights reserved.
          </p>
          
          <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2">
            {legalLinks.map((link) => (
              <li key={link.name}>
                <Link 
                  to={link.link} 
                  className="text-xs text-gray-400 hover:text-pastel-pink hover:underline transition-colors"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
