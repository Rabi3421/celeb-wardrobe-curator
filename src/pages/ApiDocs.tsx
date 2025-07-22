import React, { useState } from "react";
import { API_CONFIG } from "../config/api";
import CelebrityProfileSection from "./api-docs/CelebrityProfileSection";
import OutfitSection from "./api-docs/OutfitSection";
import CelebrityDOBSection from "./api-docs/CelebrityDOBSection";
import ApiKeySection from "./api-docs/ApiKeySection";

const sections = [
  { key: "profile", label: "Celebrity Profile API" },
  { key: "outfit", label: "Outfit API" },
  { key: "dob", label: "Celebrity DOB API" },
  { key: "apikey", label: "Get API Key" },
];

const sectionContent: Record<string, React.ReactNode> = {
  profile: <CelebrityProfileSection />,
  outfit: <OutfitSection />,
  dob: <CelebrityDOBSection />,
  apikey: <ApiKeySection />,
};

const ApiDocs = () => {
  const [activeSection, setActiveSection] = useState(sections[0].key);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 border-r border-gray-700 p-6 flex flex-col gap-2">
        <h1 className="text-xl font-bold mb-6 text-purple-300">API Docs</h1>
        {sections.map((section) => (
          <button
            key={section.key}
            className={`text-left px-3 py-2 rounded transition ${activeSection === section.key
              ? "bg-purple-800 text-white font-semibold"
              : "hover:bg-gray-700 text-gray-200"
              }`}
            onClick={() => setActiveSection(section.key)}
          >
            {section.label}
          </button>
        ))}
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-10">
        {sectionContent[activeSection]}
      </main>
    </div>
  );
};

export default ApiDocs;