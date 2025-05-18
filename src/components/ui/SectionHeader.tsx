
import React from "react";
import { Link } from "react-router-dom";

interface SectionHeaderProps {
  title: string;
  viewAllLink?: string;
  viewAllText?: string;
  className?: string;
  subtitle?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  viewAllLink,
  viewAllText = "View All",
  className = "",
  subtitle,
}) => {
  return (
    <div className={`flex flex-col mb-6 ${className}`}>
      <div className="flex items-center justify-between">
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
      {subtitle && (
        <p className="text-muted-foreground mt-1">{subtitle}</p>
      )}
    </div>
  );
};

export default SectionHeader;
