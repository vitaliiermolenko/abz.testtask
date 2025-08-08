// index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';  // імпорт глобальних стилів
import App from './App';

import '@fontsource/nunito';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
