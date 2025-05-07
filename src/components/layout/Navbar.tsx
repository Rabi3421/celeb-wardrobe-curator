
import React from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const Navbar: React.FC = () => {
  return (
    <nav className="sticky top-0 bg-white/80 backdrop-blur-md z-50 shadow-sm">
      <div className="container-custom py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="font-serif text-2xl font-bold">
            CelebrityPersona
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-sm font-medium hover:text-primary-foreground">
              Home
            </Link>
            <Link to="/celebrities" className="text-sm font-medium hover:text-primary-foreground">
              Celebrities
            </Link>
            <Link to="/outfits" className="text-sm font-medium hover:text-primary-foreground">
              Outfits
            </Link>
            <Link to="/blog" className="text-sm font-medium hover:text-primary-foreground">
              Blog
            </Link>
          </div>
          
          <div className="relative hidden sm:block w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search celebrities, styles..."
              className="pl-9 rounded-full bg-secondary"
            />
          </div>
          
          <button className="md:hidden">
            <Search className="h-5 w-5" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
