// ============================================
// ENTRY POINT - Start of the app
// This file initializes React and renders App
// ============================================

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Get the root HTML element where we'll put the React app
const rootElement = document.getElementById('root');

// Check if root element exists
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Create React root
const root = ReactDOM.createRoot(rootElement);

// Render the App component
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

