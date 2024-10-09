import React from 'react';


const LogoutButton = ({ handleLogout }) => {
  return (
    <button onClick={handleLogout} className="logout-button">
      Cerrar sesión
    </button>
  );
};

export default LogoutButton;