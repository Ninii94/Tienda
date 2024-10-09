import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/succespage.css';

function SuccessPage() {
  const navigate = useNavigate();

  const handleContinueShopping = () => {
    navigate('/');
  };

  return (
    <div className="success-container">
      <div className="success-content">
        <h1 className="success-title">¡Pago Exitoso!</h1>
        <div className="success-icon">💗</div>
        <p className="success-message">
          Gracias por tu compra. Nos contactaremos a la brevedad.
          ¿Tuviste un problema? cuéntanos: 📞3816591850
        </p>
        <button className="continue-shopping-btn" onClick={handleContinueShopping}>
          Seguir Comprando
        </button>
      </div>
    </div>
  );
}

export default SuccessPage;

