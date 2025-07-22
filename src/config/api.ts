
// API configuration
export const API_CONFIG = {
  baseUrl: 'http://localhost:5000/api',
  websiteApiKey:"c2134352b0ae669cff7496c79db4db96"
} as const;

export const API_ENDPOINTS = {
  admin: {
    login: `${API_CONFIG.baseUrl}/admin/login`,
  },
} as const;
