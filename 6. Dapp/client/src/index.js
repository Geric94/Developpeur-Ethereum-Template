import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  //EGA à commenter si cela gène console.log
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
