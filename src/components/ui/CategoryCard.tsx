
import React from "react";
import { Link } from "react-router-dom";
import { Dress, Shoe, Mail, Handbag, Car, Bike } from "lucide-react";

interface CategoryCardProps {
  title: string;
  icon: string;
  link: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ title, icon, link }) => {
  const renderIcon = () => {
    switch (icon) {
      case "dress":
        return <Dress className="h-8 w-8" />;
      case "shoe":
        return <Shoe className="h-8 w-8" />;
      case "makeup":
        return <Mail className="h-8 w-8" />;
      case "handbag":
        return <Handbag className="h-8 w-8" />;
      case "car":
        return <Car className="h-8 w-8" />;
      case "bike":
        return <Bike className="h-8 w-8" />;
      default:
        return <Dress className="h-8 w-8" />;
    }
  };

  return (
    <Link to={link} className="block">
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
