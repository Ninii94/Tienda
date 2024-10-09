
import { Link, useLocation} from 'react-router-dom';
import logobarb from './Logobarb.png'
import React, { useState } from 'react';



function Navbar({ isLoggedIn, cart, handleLogout }) {
  const location = useLocation();
  const isAdminPage = location.pathname === '/admin';
  const [isHovered, setIsHovered] = useState(false);
  const buttonStyle = {
    background: isHovered 
      ? '#FF1493' // Rosa oscuro cuando está hover
      : 'linear-gradient(to right, #FF69B4, #40E0D0)', 
    color: isHovered ? 'black' : 'white', 
    border: 'none',
    cursor: 'pointer',
    padding: '8px 15px',
    borderRadius: '5px',
    transition: 'all 0.3s ease',
    fontWeight: 'bold',
    backgroundSize: '200% 100%',
    backgroundPosition: isHovered ? 'right bottom' : 'left bottom'
  };


  return (
    <nav className="navbar" style={{ backgroundColor: 'pink' }}>
      <Link to="/" className="navbar-brand">
        <img src={logobarb} alt="Logo" />
      </Link>
      {!isAdminPage && (
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link to="/" className="nav-link">
              Inicio
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/cart" className="nav-link">
              Carrito ({cart.length})
            </Link>
          </li>
          {!isLoggedIn ? (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-link">
                  Iniciar sesión
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-link">
                  Registrarse
                </Link>
              </li>
            </>
          ) : (
            <li className="nav-item">
              <button
                onClick={handleLogout}
                className="nav-link"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={buttonStyle}
          
                
                           >
                Cerrar sesión
              </button>
            </li>
          )}
        </ul>
      )}
      {isAdminPage && isLoggedIn && (
       <button
       onClick={handleLogout}
       className="nav-link"
       onMouseEnter={() => setIsHovered(true)}
       onMouseLeave={() => setIsHovered(false)}
     
     >
          Cerrar sesión
        </button>
      )}
    </nav>
  );
}

export default Navbar;