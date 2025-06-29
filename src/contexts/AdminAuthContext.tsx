
import React, { createContext, useContext, useEffect } from "react";
import { User, AuthContextType } from "@/types/data";
import { toast } from "@/components/ui/use-toast";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { loginAsync, logoutAsync, setUser } from "@/store/slices/authSlice";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
  const authChecked = true; // Since we're using Redux, we can consider auth always checked

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('adminUser');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        dispatch(setUser(userData));
      } catch (error) {
        console.error('Error parsing saved admin user data:', error);
        localStorage.removeItem('adminUser');
      }
    }
  }, [dispatch]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      await dispatch(loginAsync({ email, password })).unwrap();
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${user?.name || 'Admin'}!`,
      });
      
      return true;
    } catch (error) {
      console.error('Admin login error:', error);
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = async () => {
    console.log("Logging out admin user");
    
    await dispatch(logoutAsync());
    
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
