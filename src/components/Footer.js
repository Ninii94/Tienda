import React from 'react';
import './footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; 2024 Mattel. Todos los derechos reservados</p>
        <nav>
          <ul>
            <li><a href="/terminos">Términos de Servicio</a></li>
            <li><a href="/privacidad">Política de Privacidad</a></li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;