
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { fetchCelebrities } from "@/services/api";
import ThemeToggle from "@/components/theme/ThemeToggle";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    try {
      // Fetch celebrities to search among them
      const celebrities = await fetchCelebrities();
      
      // Check if the search term matches a celebrity name
      const matchedCelebrity = celebrities.find(celeb => 
        celeb.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      if (matchedCelebrity) {
        // If match found, navigate directly to the celebrity profile
        navigate(`/celebrity/${matchedCelebrity.id}`);
      } else {
        // Otherwise, navigate to the search results page
        navigate(`/celebrities?search=${encodeURIComponent(searchTerm.trim())}`);
      }
      
      setSearchTerm("");
    } catch (error) {
      console.error("Error during search:", error);
      // Fallback to the regular search page if there's an error
      navigate(`/celebrities?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
    }
  };

  return (
    <nav className="sticky top-0 bg-background/80 backdrop-blur-md z-50 shadow-sm dark:shadow-gray-800/10">
      <div className="container-custom py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img src="/logo.svg" alt="Celebrity Persona" className="h-10 w-auto" />
            <span className="sr-only">Celebrity Persona</span>
          </Link>
          
          <div className="hidden md:block">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link to="/">
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Home
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/celebrities">
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Celebrities
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/outfits">
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Outfits
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/blog">
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Blog
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative hidden sm:block w-64">
              <form onSubmit={handleSearch}>
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search celebrities, styles..."
                  className="pl-9 rounded-full bg-secondary dark:bg-gray-800"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </form>
            </div>
            
            <ThemeToggle />
            
            <div className="flex md:hidden">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t mt-4 dark:border-gray-800">
            <div className="flex flex-col space-y-3">
              <Link 
                to="/" 
                className="px-2 py-1 hover:bg-secondary dark:hover:bg-gray-800 rounded-md text-sm font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/celebrities" 
                className="px-2 py-1 hover:bg-secondary dark:hover:bg-gray-800 rounded-md text-sm font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Celebrities
              </Link>
              <Link 
                to="/outfits" 
                className="px-2 py-1 hover:bg-secondary dark:hover:bg-gray-800 rounded-md text-sm font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Outfits
              </Link>
              <Link 
                to="/blog" 
                className="px-2 py-1 hover:bg-secondary dark:hover:bg-gray-800 rounded-md text-sm font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
              <div className="relative pt-2">
                <form onSubmit={handleSearch}>
                  <Search className="absolute left-2.5 top-5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search celebrities, styles..."
                    className="pl-9 rounded-full bg-secondary dark:bg-gray-800"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
