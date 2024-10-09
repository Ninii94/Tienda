import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [usernames, setUsernames] = useState([]); // Estado para almacenar los nombres de usuario existentes
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch de los nombres de usuario existentes desde el servidor
    axios
      .get('http://localhost:3001/users')
      .then((response) => {
        const existingUsernames = response.data.map((user) => user.username);
        setUsernames(existingUsernames);
      })
      .catch((error) => {
        console.error('Error al obtener los nombres de usuario:', error);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden');
      return;
    }

    // Verificar si el nombre de usuario ya existe
    if (usernames.includes(username)) {
      setErrorMessage('El nombre de usuario ya está en uso');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/users', {
        username,
        password,
      });
      console.log('Usuario registrado:', response.data);
      setSuccessMessage('Bienvenid@');
      navigate('/login');
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      setErrorMessage('Error al registrar usuario');
    }
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  return (
    <div className="overlay">
      <div className="register-container">
        <h2 className="titulo-registro">Se parte de Barbieland</h2>
        <h5 className="bienvenida"> Crea un usuario y contraseña</h5>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <input
              className="form-input"
              id="username"
              type="text"
              placeholder="Usuario"
              value={username}
              onChange={handleUsernameChange}
            />
          </div>
          <div className="form-group">
            <input
              className="form-input"
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Contraseña"
              value={password}
              onChange={handlePasswordChange}
            />
          </div>
          <div className="form-group">
            <input
              className="form-input"
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              placeholder="Confirmar contraseña"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
            />
          </div>
          <button type="submit" className="register-btn">
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;

/*import React, { useState } from 'react';
import axios from 'axios';
const handleSubmit = async (e) => {
  e.preventDefault();

  if (password !== confirmPassword) {
    // Manejar el caso cuando las contraseñas no coinciden
    return;
  }

  try {
    const response = await axios.post('http://localhost:3000/users', {
      username,
      password,
    });
    console.log('Usuario registrado:', response.data);
    // Aquí puedes redirigir al usuario o hacer cualquier otra acción después del registro exitoso
  } catch (error) {
    console.error('Error al registrar usuario:', error);
  }
};


function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  

  return (
    <div className="overlay">
    <div className="register-container">
      <h2 className="titulo-registro">Se parte de Barbieland</h2>
      <h5 className= "bienvenida"> Crea un usuario y contraseña</h5>
      <form onSubmit={handleSubmit} className="register-form">
        <div className="form-group">
          <input
            className="form-input"
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        <div className="form-group">
          <input
            className="form-input"
            type={showPassword ? 'text' : 'password'}
            placeholder="Contraseña"
            value={password}
            onChange={handlePasswordChange}
          />
         
        </div>

        <button type="submit" className="register-btn">
          Registrarse
        </button>
      </form>
    </div>
    </div>
  );
}

export default Register; */