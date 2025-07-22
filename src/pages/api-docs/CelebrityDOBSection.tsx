import React from "react";

const CelebrityDOBSection: React.FC = () => (
  <div>
    <h2 className="text-2xl font-bold mb-2">Celebrity DOB API</h2>
    <p className="mb-4 text-gray-300">Get date of birth for any celebrity.</p>
    <div className="mb-2">
      <span className="font-mono bg-gray-800 px-2 py-1 rounded text-purple-300">GET /api/celebrities/:slug/dob</span>
    </div>
    <pre className="bg-gray-900 rounded p-4 text-sm text-gray-200 mb-2">{`
curl https://yourdomain.com/api/celebrities/alia-bhatt/dob
    `}</pre>
    <p className="text-gray-400">Returns JSON with date of birth.</p>
  </div>
);

export default CelebrityDOBSection;