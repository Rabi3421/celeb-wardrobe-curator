
import React, { useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    const adminUser = localStorage.getItem("adminUser");
    if (!adminUser) {
      navigate("/admin/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminUser");
    navigate("/admin/login");
  };

  const navItems = [
    { path: "/admin/dashboard", label: "Dashboard" },
    { path: "/admin/outfits", label: "Outfits" },
    { path: "/admin/celebrities", label: "Celebrities" },
    { path: "/admin/blog", label: "Blog" },
    { path: "/admin/analytics", label: "Analytics" },
    { path: "/admin/tags", label: "Tags & Categories" },
  ];

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
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-primary-foreground hover:underline"
              >
                Logout
              </button>
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
                className={`whitespace-nowrap px-5 py-2 text-sm font-medium rounded-full transition-colors ${
                  location.pathname === item.path
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-secondary"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="container-custom py-8">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
