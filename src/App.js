// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import Login from './Login';
import TaskBoard from './TaskBoard';
import Register from './Register';
import TaskStats from './TaskStats';
import translations from './translations';
import ChatGPTInteraction from './ChatGPTInteraction';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'es');

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLanguageChange = (e) => {
    const selectedLanguage = e.target.value;
    setLanguage(selectedLanguage);
    localStorage.setItem('language', selectedLanguage);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('color');
    setIsLoggedIn(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Router>
        <header className="p-3">
          <div>
            <label>
              Language:
              <select value={language} onChange={handleLanguageChange}>
                <option value="en">English</option>
                <option value="es">Español</option>
              </select>
            </label>
          </div>
          {isLoggedIn && (
            <nav className="mt-2">
              <Link to="/task-board" style={{ marginRight: '10px' }}>
                {translations[language]?.taskBoard || 'Task Board'}
              </Link>
              <Link to="/stats" style={{ marginRight: '10px' }}>
                {translations[language]?.statistics || 'Statistics'}
              </Link>
              <Link to="/chatgpt" style={{ marginRight: '10px' }}>
                {translations[language]?.chat || 'ChatGPT'}
              </Link>
              <button onClick={handleLogout} style={{ marginLeft: '10px' }}>
                {translations[language]?.logout || 'Logout'}
              </button>
            </nav>
          )}
        </header>

        <Routes>
          <Route
            path="/login"
            element={<Login setIsLoggedIn={setIsLoggedIn} translations={translations[language]} />}
          />
          <Route
            path="/register"
            element={<Register translations={translations[language]} />}
          />
          <Route
            path="/task-board"
            element={
              isLoggedIn ? (
                <TaskBoard translations={translations[language]} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/stats"
            element={
              isLoggedIn ? (
                <TaskStats translations={translations[language]} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/chatgpt"
            element={
              isLoggedIn ? (
                <ChatGPTInteraction translations={translations[language]} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
