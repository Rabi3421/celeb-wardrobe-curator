
import React, { createContext, useState, useContext, useEffect } from "react";
import { User, AuthContextType } from "@/types/data";
import { toast } from "@/components/ui/use-toast";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('adminUser');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing saved admin user data:', error);
        localStorage.removeItem('adminUser');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Mock authentication - replace with your backend API call
      console.log("Attempting admin sign in with:", email);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful login for admin@example.com
      if (email === 'admin@example.com' && password === 'admin123') {
        const userData: User = {
          id: 'admin-1',
          email: email,
          name: 'Admin User',
          role: 'admin',
          password: '', // Don't store password
          lastLogin: new Date().toISOString()
        };
        
        setUser(userData);
        setIsAuthenticated(true);
        
        // Save to localStorage
        localStorage.setItem('adminUser', JSON.stringify(userData));
        
        toast({
          title: "Login successful",
          description: `Welcome back, ${userData.name}!`,
        });
        
        return true;
      } else {
        toast({
          title: "Login failed",
          description: "Invalid admin credentials",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('Admin login error:', error);
      toast({
        title: "Login failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    console.log("Logging out admin user");
    
    // Clear localStorage
    localStorage.removeItem('adminUser');
    
    // Clear state
    setUser(null);
    setIsAuthenticated(false);
    
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAuthenticated,
      isLoading,
      authChecked
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAdminAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
};
