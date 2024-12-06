// src/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = ({ setIsLoggedIn, translations }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const loginUser = async () => {
    try {
      const response = await axios.post('http://localhost:3001/login', {
        username,
        password,
      });

      const { token, color } = response.data;
      setMessage(translations.loginSuccess);
      localStorage.setItem('token', token);
      localStorage.setItem('username', username);
      localStorage.setItem('color', color); // Guardar el color en Local Storage
      setIsLoggedIn(true);
      navigate('/task-board');
    } catch (error) {
      setMessage(translations.loginError);
    }
  };

  return (
    <div className="container mt-5">
      <h1>{translations.login}</h1>
      <div className="mb-3">
        <label className="form-label">{translations.username}</label>
        <input
          type="text"
          className="form-control"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">{translations.password}</label>
        <input
          type="password"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button className="btn btn-primary" onClick={loginUser}>
        {translations.login}
      </button>
      <p className="mt-3">
        {translations.noAccount} <Link to="/register">{translations.register}</Link>
      </p>
      {message && <p className="mt-3">{message}</p>}
    </div>
  );
};

export default Login;
