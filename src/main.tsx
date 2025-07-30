
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from "react-hot-toast";

// Render the app with HelmetProvider for SEO
createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
    <Toaster position="top-right" />
  </HelmetProvider>
);
