import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import './Login.css';

const LoginForm = () => {
  const [isRegister, setIsRegister] = useState(false); // Modo login/register
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isRegister) {
        // Registro
        await axios.post('http://localhost:3000/api/auth/register', {
          name,
          email,
          password,
        });

        // Luego del registro, vuelve al login
        setIsRegister(false);
      } else {
        // Login
        const response = await axios.post('http://localhost:3000/api/auth/login', {
          email,
          password,
        });

        const { token, role } = response.data;
        login(token, role);
        navigate('/');
      }
    } catch (err) {
      setError('Error en el servidor o credenciales inválidas.');
    }
  };

  return (
    <div className="bodyLogin">
      <h2>{isRegister ? 'Registrarse' : 'Iniciar sesión'}</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        {isRegister && (
          <div>
            <label>Nombre:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        )}
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">{isRegister ? 'Registrarse' : 'Iniciar sesión'}</button>
      </form>
      <div style={{ marginTop: '1rem' }}>
        <p>{isRegister ? '¿Ya tenés una cuenta?' : '¿No tenés cuenta?'}</p>
        <button onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? 'Iniciar sesión' : 'Registrarse'}
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
