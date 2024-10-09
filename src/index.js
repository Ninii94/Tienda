import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './style.css';
import '../src/register.css';
import '../src/login.css'
import { AuthProvider } from './components/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

function renderApp() {
  root.render(
    <React.StrictMode>
      <AuthProvider>
        <App />
      </AuthProvider>
    </React.StrictMode>
  );
}

if (document.readyState === 'complete') {
  renderApp();
} else {
  window.addEventListener('load', renderApp);
}