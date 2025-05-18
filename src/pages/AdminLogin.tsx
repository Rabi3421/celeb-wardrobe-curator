import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const AdminLogin: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAdminAuth();
  const navigate = useNavigate();
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Add useEffect to redirect when authentication state changes
  useEffect(() => {
    console.log("AdminLogin - isAuthenticated:", isAuthenticated);
    if (isAuthenticated) {
      console.log("User is authenticated, redirecting to dashboard");
      navigate("/admin/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const createTestUser = async (email: string, password: string) => {
    try {
      // Check if user exists first
      const { data: userExists } = await supabase
        .from('admin_users')
        .select('id')
        .eq('email', email)
        .maybeSingle();
      
      if (!userExists) {
        // Create user through Supabase auth
        const { data: authUser, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: 'Admin User',
              role: 'admin'
            }
          }
        });

        if (signUpError) {
          console.error('Error creating auth user:', signUpError);
          return false;
        }

        if (authUser?.user) {
          // Create entry in admin_users table
          const { error: insertError } = await supabase
            .from('admin_users')
            .insert({
              id: authUser.user.id,
              name: 'Admin User',
              email: email,
              role: 'admin',
              last_login: new Date().toISOString()
            });

          if (insertError) {
            console.error('Error creating admin user record:', insertError);
            return false;
          }

          // Set admin user as confirmed using the admin API directly
          // Note: In a real app, this would be done through the server-side admin API
          const { error: adminUpdateError } = await supabase.auth.admin.updateUserById(
            authUser.user.id,
            { email_confirm: true }
          ).catch(() => {
            // Fallback for when admin API is not available (in development without admin keys)
            console.log('Unable to confirm email via admin API, proceeding anyway');
            return { error: null };
          });

          if (adminUpdateError) {
            console.error('Error confirming user:', adminUpdateError);
          }

          toast({
            title: "Admin user created",
            description: "Test admin user has been created. You can now log in.",
          });
          
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Error creating test user:', error);
      return false;
    }
  };

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      // Try to log in with provided credentials
      const success = await login(data.email, data.password);
      
      if (!success) {
        // If login failed and we're using the default admin credentials, try to create the test user
        if (data.email === "admin@celebritypersona.com" && data.password === "admin123") {
          const userCreated = await createTestUser(data.email, data.password);
          
          if (userCreated) {
            // Attempt login again after creating user
            const retrySuccess = await login(data.email, data.password);
            if (retrySuccess) {
              console.log("Login successful after creating test user");
              navigate("/admin/dashboard");
              return;
            }
          }
        }
        
        toast({
          title: "Login failed",
          description: "Invalid email or password. If using default credentials, try again as the user may have been created.",
          variant: "destructive",
        });
      } else {
        console.log("Login successful, navigating to dashboard");
        navigate("/admin/dashboard");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pastel-lavender to-white p-4">
      <div className="w-full max-w-md">
        <Card className="bg-white rounded-2xl shadow-lg border-none">
          <CardHeader className="text-center space-y-1">
            <CardTitle className="font-serif text-2xl font-medium">CelebrityPersona</CardTitle>
            <CardDescription className="text-muted-foreground">
              Admin Dashboard Login
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="admin@celebritypersona.com"
                          type="email"
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between items-center">
                        <FormLabel>Password</FormLabel>
                        <a
                          href="#"
                          className="text-xs text-primary-foreground hover:underline"
                        >
                          Forgot password?
                        </a>
                      </div>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="••••••••"
                          type="password"
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full btn-primary py-3 font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    "Log In"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          
          <CardFooter className="text-center text-sm text-muted-foreground border-t py-4">
            <p className="w-full">Use admin@celebritypersona.com / admin123</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;
