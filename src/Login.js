import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = ({ setIsLoggedIn }) => {
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
      setMessage('¡Inicio de sesión exitoso!');
      localStorage.setItem('token', response.data.token); // Guardar el token en localStorage
      setIsLoggedIn(true); // Cambiar el estado a "logeado"
      navigate('/task-board'); // Redirigir al tablero de tareas
    } catch (error) {
      setMessage('Error al iniciar sesión. Verifica tus credenciales.');
    }
  };

  return (
    <div className="container mt-5">
      <h1>Iniciar Sesión</h1>
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
      <button className="btn btn-primary" onClick={loginUser}>
        Iniciar Sesión
      </button>
      {message && <p className="mt-3">{message}</p>}
    </div>
  );
};

export default Login;
