import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const registerUser = async () => {
    try {
      const response = await axios.post('http://localhost:3001/register', {
        username,
        password,
      });
      setMessage('¡Usuario registrado exitosamente!');
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setMessage('El nombre de usuario ya está en uso.');
      } else {
        setMessage('Error al registrar usuario.');
      }
    }
  };

  return (
    <div className="container mt-5">
      <h1>¡Bienvenido a mi Proyecto React!</h1>
      <div className="mb-3">
        <label className="form-label">Nombre de Usuario</label>
        <input
          type="text"
          className="form-control"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Contraseña</label>
        <input
          type="password"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button className="btn btn-primary" onClick={registerUser}>
        Registrar Usuario
      </button>
      {message && <p className="mt-3">{message}</p>}
    </div>
  );
};

export default Register;
