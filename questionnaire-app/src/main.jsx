// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )



import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// --- ADD THIS LINE ---
import './i18n'; // Initializes i18next
import mixpanel from 'mixpanel-browser';
// --- END ADDITION ---

mixpanel.init("1b5ae67adbef3181991d97bbe6ae2d46", {
    debug: true,
    track_pageview: true,
    persistence: "localStorage",
    autocapture: true,
    record_sessions_percent: 100,
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* --- WRAP APP IN SUSPENSE --- */}
    {/* This shows a simple "Loading..." text while language files are fetched */}
    <Suspense fallback={<div>Loading...</div>}>
      <App />
    </Suspense>
    {/* --- END WRAPPER --- */}
  </React.StrictMode>,
);
