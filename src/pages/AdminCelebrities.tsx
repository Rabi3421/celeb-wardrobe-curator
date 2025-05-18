
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Loader2, UserPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Celebrity } from "@/types/data";

const AdminCelebrities: React.FC = () => {
  // Fetch all celebrities from Supabase
  const { data: celebrities = [], isLoading } = useQuery({
    queryKey: ['celebrities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('celebrities')
        .select(`
          *,
          outfits:outfits(count)
        `)
        .order('name');
      
      if (error) {
        console.error('Error fetching celebrities:', error);
        throw error;
      }

      return data.map(celebrity => ({
        id: celebrity.id,
        name: celebrity.name,
        image: celebrity.image || '',
        bio: celebrity.bio || '',
        category: celebrity.category || '',
        styleType: celebrity.style_type || '',
        outfitCount: celebrity.outfits?.[0]?.count || 0,
        // Only include social media if it exists and is an object
        socialMedia: typeof celebrity.social_media === 'object' && celebrity.social_media !== null 
          ? celebrity.social_media 
          : {},
      })) as Celebrity[];
    }
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-serif text-2xl font-medium">Celebrities</h1>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Celebrity
        </Button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : celebrities.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-lg text-gray-500">No celebrities found</p>
            <p className="text-sm text-gray-400">Add your first celebrity to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {celebrities.map(celebrity => (
              <div key={celebrity.id} className="p-4 border rounded-lg">
                <h2 className="font-medium">{celebrity.name}</h2>
                <p className="text-sm text-gray-500">{celebrity.category}</p>
                <p className="text-sm text-gray-500">Outfits: {celebrity.outfitCount}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCelebrities;
