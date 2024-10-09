import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await onLogin(username, password);
    alert(result.message);
    if (result.success) {
      login();
      navigate(result.redirectTo);
    }
  };

  return (
    <div className="overlay">
      <form onSubmit={handleSubmit} className="login-form">
        <div className="con">
          <header className="head-form">
            <h3>Iniciar Sesión</h3>
            <p>Coloca tu usuario y contraseña</p>
          </header>
          <br />
          <div className="field-set">
            <span className="input-item">
              <i className="fa fa-user-circle"></i>
              

            </span>
            <input
              className="form-input"
              id="username" // Agrega un id
              type="text"
              placeholder="@usuario"
              value={username}
              onChange={handleUsernameChange}
              required
            />
            <br />
            <span className="input-item">
              <i className="fa fa-key"></i>
            </span>
            <input
              className="form-input"
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Contraseña"
              value={password}
              onChange={handlePasswordChange}
              required
            />
            <span className="emojis" onClick={togglePasswordVisibility}>
              {showPassword ? '🙈 Ocultar' : '👀 Mostrar'}
            </span>
            <br />
            <button type="submit" className="log-in">
              Ingresar
            </button>
          </div>
          <div className="other">
            <span className="new-user">¿Nuevo? Regístrate aquí!</span>
            <Link to="/register" className="btn submits sign-up">
              Registrarse
              <i className="fa fa-user-plus" aria-hidden="true"></i>
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
/*import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <div className="overlay">
      <form onSubmit={handleSubmit} className="login-form">
        <div className="con">
          <header className="head-form">
            <h2>Iniciar Sesión</h2>
            <p>Coloca tu usuario y contraseña</p>
          </header>
          <br />
          <div className="field-set">
            <span className="input-item">
              <i className="fa fa-user-circle"></i>
            </span>
            <input
              className="form-input"
              id="txt-input"
              type="text"
              placeholder="@usuario"
              value={username}
              onChange={handleUsernameChange}
              required
            />
            <br />
            <span className="input-item">
              <i className="fa fa-key"></i>
            </span>
            <input
              className="form-input"
              type={showPassword ? 'text' : 'password'}
              placeholder="Contraseña"
              id="pwd"
              name="password"
              value={password}
              onChange={handlePasswordChange}
              required
            />
            <span className="emojis" onClick={togglePasswordVisibility}>
            {showPassword ? '🙈 Ocultar' : '👀 Mostrar'}
          </span>
            <br />
            <button type="submit" className="log-in">
              Ingresar
            </button>
          </div>
          <div className="other">
            <span className="new-user">¿Nuevo? Regístrate aquí!</span>
            <Link to="/register" className="btn submits sign-up">
              Registrarse
              <i className="fa fa-user-plus" aria-hidden="true"></i>
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login; */