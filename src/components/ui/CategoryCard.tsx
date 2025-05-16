
import React from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, ShirtIcon, Palette, Briefcase, Car, Bike } from "lucide-react";

interface CategoryCardProps {
  title: string;
  icon: string;
  link: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ title, icon, link }) => {
  const renderIcon = () => {
    switch (icon) {
      case "dress":
        return <ShirtIcon className="h-8 w-8" />;
      case "shoe":
        return <ShoppingBag className="h-8 w-8" />;
      case "makeup":
        return <Palette className="h-8 w-8" />;
      case "handbag":
        return <Briefcase className="h-8 w-8" />;
      case "car":
        return <Car className="h-8 w-8" />;
      case "bike":
        return <Bike className="h-8 w-8" />;
      default:
        return <ShirtIcon className="h-8 w-8" />;
    }
  };

  // Update the link to point to the CategoryDetail page
  const categoryPath = `/category/${title.toLowerCase()}`;

  return (
    <Link to={categoryPath} className="block">
      <div className="category-card bg-white rounded-xl p-6 text-center shadow-md hover:shadow-lg transition-all duration-300 h-full">
        <div className="bg-pastel-lavender rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          {renderIcon()}
        </div>
        <h3 className="font-serif text-lg font-medium">{title}</h3>
      </div>
    </Link>
  );
};

export default CategoryCard;
