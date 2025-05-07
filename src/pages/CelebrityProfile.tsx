
import React from "react";
import { useParams } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import OutfitCard from "@/components/ui/OutfitCard";
import SectionHeader from "@/components/ui/SectionHeader";
import { celebrities, outfits } from "@/data/mockData";

const CelebrityProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const celebrity = celebrities.find(celeb => celeb.id === id);
  const celebrityOutfits = outfits.filter(outfit => outfit.celebrityId === id);

  if (!celebrity) {
    return (
      <PageLayout>
        <div className="container-custom py-16 text-center">
          <h2 className="font-serif text-2xl mb-4">Celebrity not found</h2>
          <p className="text-muted-foreground">The celebrity you're looking for doesn't exist or has been removed.</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {/* Celebrity Header */}
      <section className="bg-pastel-lavender py-12">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center">
            <div className="mb-8 md:mb-0 md:mr-10">
              <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-lg">
                <img
                  src={celebrity.image}
                  alt={celebrity.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="text-center md:text-left">
              <h1 className="font-serif text-3xl md:text-4xl font-medium mb-4">
                {celebrity.name}
              </h1>
              <p className="text-muted-foreground md:text-lg mb-5 max-w-2xl">
                {celebrity.bio}
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                  <span className="text-sm text-muted-foreground">Outfits</span>
                  <p className="font-medium">{celebrityOutfits.length}</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                  <span className="text-sm text-muted-foreground">Style</span>
                  <p className="font-medium">Trendsetter</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                  <span className="text-sm text-muted-foreground">Followers</span>
                  <p className="font-medium">3.2M</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Celebrity Outfits */}
      <section className="container-custom py-16">
        <SectionHeader title={`${celebrity.name}'s Outfits`} />
        
        {celebrityOutfits.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {celebrityOutfits.map((outfit) => (
              <OutfitCard
                key={outfit.id}
                id={outfit.id}
                image={outfit.image}
                celebrity={outfit.celebrity}
                celebrityId={outfit.celebrityId}
                title={outfit.title}
                description={outfit.description}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No outfits found for this celebrity.</p>
          </div>
        )}
      </section>
    </PageLayout>
  );
};

export default CelebrityProfile;
