
import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="bg-secondary mt-16 py-12">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-serif text-xl font-medium mb-4">CelebrityPersona</h3>
            <p className="text-muted-foreground text-sm">
              Your daily dose of fashion inspiration from your favorite celebrities.
              Discover the latest trends and shop similar styles.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-base mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-primary-foreground">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/celebrities" className="text-sm text-muted-foreground hover:text-primary-foreground">
                  Celebrities
                </Link>
              </li>
              <li>
                <Link to="/outfits" className="text-sm text-muted-foreground hover:text-primary-foreground">
                  Outfits
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-sm text-muted-foreground hover:text-primary-foreground">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-base mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary-foreground">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/affiliate-disclosure" className="text-sm text-muted-foreground hover:text-primary-foreground">
                  Affiliate Disclosure
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} CelebrityPersona. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
