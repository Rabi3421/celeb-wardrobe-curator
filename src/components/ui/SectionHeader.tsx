
import React from "react";
import { Link } from "react-router-dom";

interface SectionHeaderProps {
  title: string;
  viewAllLink?: string;
  viewAllText?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  viewAllLink,
  viewAllText = "View All",
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="section-title">{title}</h2>
      {viewAllLink && (
        <Link
          to={viewAllLink}
          className="text-sm font-medium text-primary-foreground hover:underline"
        >
          {viewAllText} →
        </Link>
      )}
    </div>
  );
};

export default SectionHeader;
