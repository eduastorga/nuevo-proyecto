// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Login';
import TaskBoard from './TaskBoard';
import Register from './Register'; // Importa el componente de registro
import translations from './translations';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'es');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLanguageChange = (e) => {
    const selectedLanguage = e.target.value;
    setLanguage(selectedLanguage);
    localStorage.setItem('language', selectedLanguage);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      
      <header className="p-3">
        <label>
          Language:
          <select value={language} onChange={handleLanguageChange}>
            <option value="en">English</option>
            <option value="es">Español</option>
          </select>
        </label>
      </header>

      <Router>
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
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
