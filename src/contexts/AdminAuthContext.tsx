
import React, { createContext, useState, useContext, useEffect } from "react";
import { User, AuthContextType } from "@/types/data";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed:", event, currentSession);
        setSession(currentSession);
        
        if (currentSession?.user) {
          // Format user data to match our User type
          const userData: User = {
            id: currentSession.user.id,
            email: currentSession.user.email || '',
            name: currentSession.user.user_metadata?.name || currentSession.user.email?.split('@')[0] || 'Admin User',
            role: 'admin',
            password: '', // We don't store password in state
            lastLogin: new Date().toISOString()
          };
          
          console.log("Setting user data:", userData);
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          console.log("No session or user, clearing auth state");
          setUser(null);
          setIsAuthenticated(false);
        }
        
        setIsLoading(false);
      }
    );

    // Check for existing session on mount
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      console.log("Initial session check:", session);
      
      if (session) {
        setSession(session);
        
        // Format user data to match our User type
        const userData: User = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Admin User',
          role: 'admin',
          password: '', // We don't store password in state
          lastLogin: new Date().toISOString()
        };
        
        console.log("Setting initial user data:", userData);
        setUser(userData);
        setIsAuthenticated(true);
      }
      
      setIsLoading(false);
    };

    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log("Attempting to sign in with:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Login error:', error);
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      if (data.user) {
        console.log("Login successful, user data:", data.user);
        
        // Check if user exists in admin_users table or create a new entry
        const { data: adminUser, error: adminError } = await supabase
          .from('admin_users')
          .select('*')
          .eq('id', data.user.id)
          .maybeSingle();

        if (adminError) {
          console.error('Error checking admin user:', adminError);
        }

        // If not exists, create a new admin user record
        if (!adminUser) {
          const { error: insertError } = await supabase
            .from('admin_users')
            .insert({
              id: data.user.id,
              name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'Admin User',
              email: data.user.email || '',
              role: 'admin',
              last_login: new Date().toISOString()
            });

          if (insertError) {
            console.error('Error creating admin user record:', insertError);
          }
        } else {
          // Update last login time
          const { error: updateError } = await supabase
            .from('admin_users')
            .update({ last_login: new Date().toISOString() })
            .eq('id', data.user.id);

          if (updateError) {
            console.error('Error updating last login:', updateError);
          }
        }

        toast({
          title: "Login successful",
          description: `Welcome back, ${data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'Admin'}!`,
        });
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      console.log("User logged out successfully");
      setUser(null);
      setIsAuthenticated(false);
      setSession(null);
      
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {!isLoading && children}
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
