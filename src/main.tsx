
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Render the app directly without double strict mode
createRoot(document.getElementById("root")!).render(<App />);
