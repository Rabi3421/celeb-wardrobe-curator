
import React, { useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { 
  LayoutDashboard, 
  Users, 
  ShoppingBag, 
  FileText, 
  BarChart, 
  Tag, 
  Settings, 
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated, authChecked, isLoading } = useAdminAuth();
  
  useEffect(() => {
    // Add console logs to help debug the authentication state
    console.log("AdminLayout - authChecked:", authChecked);
    console.log("AdminLayout - isLoading:", isLoading);
    console.log("AdminLayout - isAuthenticated:", isAuthenticated);
    console.log("AdminLayout - current path:", location.pathname);
    console.log("AdminLayout - user:", user);
    
    // Only redirect if auth has been checked and we're not in a loading state
    if (authChecked && !isLoading) {
      // If not authenticated and not on login page, redirect to login
      if (!isAuthenticated && !location.pathname.includes('/admin/login')) {
        console.log("Redirecting to login page due to no authentication");
        navigate("/admin/login");
      }
    }
  }, [isAuthenticated, navigate, location.pathname, user, authChecked, isLoading]);

  const navItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { path: "/admin/celebrities", label: "Celebrities", icon: <Users size={20} /> },
    { path: "/admin/outfits", label: "Outfits", icon: <ShoppingBag size={20} /> },
    { path: "/admin/blog", label: "Blog", icon: <FileText size={20} /> },
    { path: "/admin/analytics", label: "Analytics", icon: <BarChart size={20} /> },
    { path: "/admin/tags", label: "Tags & Categories", icon: <Tag size={20} /> },
    { path: "/admin/settings", label: "Settings", icon: <Settings size={20} /> },
  ];

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary/50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, don't render admin layout - but don't redirect here
  // We handle redirection in the useEffect instead
  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-secondary/50">
      {/* Top Navigation */}
      <header className="bg-white shadow-sm">
        <div className="container-custom py-4">
          <div className="flex justify-between items-center">
            <Link to="/admin/dashboard" className="font-serif text-xl font-medium">
              CelebrityPersona Admin
            </Link>
            <div className="flex items-center gap-4">
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
                View Site
              </Link>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2 cursor-pointer">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name || "User"} />
                        <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium hidden md:inline">
                        {user?.name}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Logged in as {user?.name}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-1"
              >
                <LogOut size={16} />
                <span className="hidden md:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs Navigation */}
      <div className="bg-white border-b border-border">
        <div className="container-custom">
          <nav className="flex overflow-x-auto py-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`whitespace-nowrap px-5 py-2 text-sm font-medium rounded-full transition-colors flex items-center gap-2 ${
                  location.pathname === item.path
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-secondary"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="container-custom py-8">
        <ScrollArea className="h-full">
          {children}
        </ScrollArea>
      </main>
    </div>
  );
};

export default AdminLayout;
