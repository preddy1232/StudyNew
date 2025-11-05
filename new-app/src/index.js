// src/index.js - StudySmart v2
import React from 'react';
import ReactDOM from 'react-dom/client';
import AppV2 from './AppV2';
import './styles/App.css';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppV2 />
  </React.StrictMode>
);
