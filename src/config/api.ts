
// API configuration
export const API_CONFIG = {
  baseUrl: 'http://localhost:5000/api',
} as const;

export const API_ENDPOINTS = {
  admin: {
    login: `${API_CONFIG.baseUrl}/admin/login`,
  },
} as const;
