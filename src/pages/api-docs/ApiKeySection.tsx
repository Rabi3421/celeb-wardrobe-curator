import React, { useState } from "react";
import { API_CONFIG } from "../../config/api";
import axios from "axios";

const ApiKeySection: React.FC = () => {
  const [email, setEmail] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [plan, setPlan] = useState("");
  const [usage, setUsage] = useState(0);
  const [usageLimit, setUsageLimit] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [resetDate, setResetDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setApiKey("");
    try {
      const response = await axios.get(
        `${API_CONFIG.baseUrl}/api-keys/dashboard?email=${encodeURIComponent(email)}`,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = response.data;
      if (response.status === 200 && data.apiKey) {
        setApiKey(data.apiKey);
        setPlan(data.plan || "");
        setUsage(data.usage || 0);
        setUsageLimit(data.usageLimit || 0);
        setRemaining(data.remaining || 0);
        setResetDate(data.resetDate || "");
      } else {
        setError(data.message || "Failed to get API key.");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        "Network error. Please try again."
      );
    }
    setLoading(false);
  };

  const handleCopy = () => {
    if (apiKey) {
      navigator.clipboard.writeText(apiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Get Your API Key</h2>
      <p className="mb-4 text-gray-300">
        Register with your email to get an API key. If you already have one, it will be shown below.
      </p>
      {apiKey ? (
        <div className="bg-gray-800 rounded p-4 mb-2 flex flex-col gap-2">
          <span className="block text-purple-300 font-mono mb-2">Your API Key:</span>
          <div className="flex items-center gap-2">
            <span className="block text-green-400 font-mono text-lg break-all bg-gray-900 px-3 py-2 rounded">{apiKey}</span>
            <button
              onClick={handleCopy}
              className="bg-purple-700 hover:bg-purple-800 text-white px-3 py-2 rounded transition font-semibold"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-400">Plan:</span>
              <span className="ml-2 text-gray-100 font-semibold">{plan}</span>
            </div>
            <div>
              <span className="text-gray-400">Usage:</span>
              <span className="ml-2 text-gray-100 font-semibold">{usage} / {usageLimit}</span>
            </div>
            <div>
              <span className="text-gray-400">Remaining:</span>
              <span className="ml-2 text-gray-100 font-semibold">{remaining}</span>
            </div>
            <div>
              <span className="text-gray-400">Reset Date:</span>
              <span className="ml-2 text-gray-100 font-semibold">{resetDate ? new Date(resetDate).toLocaleString() : ""}</span>
            </div>
          </div>
          <span className="text-xs text-gray-400 mt-2">Keep your API key secret. Use it in your requests as shown in docs.</span>
        </div>
      ) : (
        <form onSubmit={handleRegister} className="flex flex-col gap-3 max-w-sm">
          <input
            type="email"
            className="px-3 py-2 rounded bg-gray-900 border border-gray-700 text-gray-100"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-purple-800 hover:bg-purple-900 text-white font-semibold py-2 px-4 rounded"
            disabled={loading}
          >
            {loading ? "Registering..." : "Get API Key"}
          </button>
          {error && <span className="text-red-400">{error}</span>}
        </form>
      )}
    </div>
  );
};

export default ApiKeySection;