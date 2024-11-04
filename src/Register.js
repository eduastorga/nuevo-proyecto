// src/Register.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Register = ({ translations }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [color, setColor] = useState('#000000'); // Estado para el color
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const registerUser = async () => {
    try {
      const response = await axios.post('http://localhost:3001/register', {
        username,
        password,
        color, // Enviar el color seleccionado al backend
      });
      setMessage(translations.registerSuccess);
      navigate('/login'); // Redirigir al usuario a la página de inicio de sesión después de registrarse
    } catch (error) {
      setMessage(translations.registerError);
    }
  };

  return (
    <div className="container mt-5">
      <h1>{translations.register}</h1>
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
      <div className="mb-3">
        <label htmlFor="color" className="form-label">{translations.chooseColor || "Elige tu color:"}</label>
        <input
          type="color"
          id="color"
          name="color"
          className="form-control form-control-color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
      </div>
      <button className="btn btn-primary" onClick={registerUser}>
        {translations.registerButton}
      </button>
      {message && <p className="mt-3">{message}</p>}
    </div>
  );
};

export default Register;
