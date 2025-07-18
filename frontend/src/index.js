import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import './styles/global.css';
import { I18nextProvider } from 'react-i18next';
import i18n from './utils/i18n';
import { HelmetProvider } from 'react-helmet-async';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <I18nextProvider i18n={i18n}>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <App />
        </Router>
      </I18nextProvider>
    </HelmetProvider>
  </React.StrictMode>
); 