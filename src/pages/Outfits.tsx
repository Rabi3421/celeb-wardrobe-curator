
import React from "react";
import PageLayout from "@/components/layout/PageLayout";
import OutfitCard from "@/components/ui/OutfitCard";
import SectionHeader from "@/components/ui/SectionHeader";
import { outfits } from "@/data/mockData";

const Outfits: React.FC = () => {
  return (
    <PageLayout>
      <div className="container-custom py-12">
        <SectionHeader title="Celebrity Outfits" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {outfits.map((outfit) => (
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
      </div>
    </PageLayout>
  );
};

export default Outfits;
