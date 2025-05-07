
import React from "react";
import PageLayout from "@/components/layout/PageLayout";
import CelebrityCard from "@/components/ui/CelebrityCard";
import SectionHeader from "@/components/ui/SectionHeader";
import { celebrities } from "@/data/mockData";

const Celebrities: React.FC = () => {
  return (
    <PageLayout>
      <div className="container-custom py-12">
        <SectionHeader title="Browse Celebrities" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {celebrities.map((celebrity) => (
            <CelebrityCard
              key={celebrity.id}
              id={celebrity.id}
              name={celebrity.name}
              image={celebrity.image}
              outfitCount={celebrity.outfitCount}
            />
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default Celebrities;
