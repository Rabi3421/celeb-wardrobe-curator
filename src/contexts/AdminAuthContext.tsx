
import React, { createContext, useContext, useEffect } from "react";
import { User, AuthContextType } from "@/types/data";
import { toast } from "@/components/ui/use-toast";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { loginUser, logoutUser, checkAuthStatus, clearError } from "@/store/slices/authSlice";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading, error } = useAppSelector((state) => state.auth);
  const authChecked = true; // Redux handles the checking

  // Check for existing session on mount
  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast({
        title: "Authentication Error",
        description: error,
        variant: "destructive",
      });
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const result = await dispatch(loginUser({ email, password })).unwrap();
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${result.name}!`,
      });
      
      return true;
    } catch (error) {
      console.error('Admin login error:', error);
      return false;
    }
  };

  const logout = async () => {
    console.log("Logging out admin user");
    
    await dispatch(logoutUser());
    
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
