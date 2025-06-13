import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from '@/App';
import '@/index.css';
import { Toaster } from '@/components/ui/toaster';

// Error handling for development
if (import.meta.env.DEV) {
  window.onerror = (message, source, lineno, colno, error) => {
    console.error('Global error:', { message, source, lineno, colno, error });
  };

  window.onunhandledrejection = (event) => {
    console.error('Unhandled promise rejection:', event.reason);
  };
}

try {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
        <Toaster />
      </BrowserRouter>
    </React.StrictMode>
  );
} catch (error) {
  console.error('Error during app initialization:', error);
  document.body.innerHTML = `
    <div style="
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #0F1729;
      color: white;
      padding: 1rem;
      font-family: system-ui, -apple-system, sans-serif;
    ">
      <div style="max-width: 500px; text-align: center;">
        <h1 style="color: #FF4444; margin-bottom: 1rem;">Application Error</h1>
        <p style="color: #999; margin-bottom: 1rem;">
          The application failed to initialize. Please try refreshing the page.
          If the problem persists, contact support.
        </p>
        <button 
          onclick="window.location.reload()" 
          style="
            background-color: #FFB800;
            color: black;
            padding: 0.5rem 1rem;
            border: none;
            border-radius: 0.375rem;
            cursor: pointer;
          "
        >
          Reload Page
        </button>
      </div>
    </div>
  `;
}
