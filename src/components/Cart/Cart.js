import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import CartItem from './CartItem';

function Cart({ cart, onRemove, onQuantityChange }) {
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    dni: '',
    email: '',
    additionalNotes: ''
  });
  const [mercadopago, setMercadopago] = useState(null);
  const [preferenceId, setPreferenceId] = useState(null);
  const [orderSaved, setOrderSaved] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const loadMercadoPago = useCallback(async () => {
    const script = document.createElement('script');
    script.src = "https://sdk.mercadopago.com/js/v2";
    script.async = true;
    script.onload = () => {
      const mp = new window.MercadoPago('TEST-39b72eae-048a-4888-9401-6910724b5b7c', {
        locale: 'es-AR'
      });
      setMercadopago(mp);
    };
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    loadMercadoPago();
  }, [loadMercadoPago]);

  useEffect(() => {
    if (mercadopago && preferenceId) {
      const renderCheckoutButton = async () => {
        await mercadopago.checkout({
          preference: {
            id: preferenceId
          },
          render: {
            container: '#mercadopago-button',
            label: 'Pagar con Mercado Pago'
          }
        });
      };
      renderCheckoutButton();
    }
  }, [mercadopago, preferenceId]);

  const handleInputChange = (e) => {
    setCustomerInfo({ ...customerInfo, [e.target.name]: e.target.value });
  };

  const handleShowPaymentForm = () => {
    setShowPaymentForm(true);
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (isProcessing || orderSaved) return;

    setIsProcessing(true);

    try {
      const response = await axios.post('http://localhost:8000/create_preference', {
        items: cart.map(item => ({
          title: item.name,
          unit_price: item.price,
          quantity: item.quantity,
        })),
        payer: {
          name: customerInfo.name,
          email: customerInfo.email,
          identification: {
            type: 'DNI',
            number: customerInfo.dni
          }
        },
        additionalNotes: customerInfo.additionalNotes
      });

      const { id } = response.data;

      if (id) {
        const orderData = {
          id: uuidv4(),
          paymentId: id,
          customerInfo,
          cart,
          total,
          status: 'pending',
          createdAt: new Date().toISOString()
        };

        const orderResponse = await axios.post('http://localhost:3001/orders', orderData);
        
        if (orderResponse.status === 201) {
          setOrderSaved(true);
          setPreferenceId(id);
          console.log('Orden guardada exitosamente');
        } else {
          console.error('Error al guardar la orden');
        }
      } else {
        console.error('No se pudo crear la preferencia de pago');
      }
    } catch (error) {
      console.error('Error al procesar el pago:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="cart-container">
      <h2 className="cart-title">Mi carrito</h2>
      <ul className="cart-items">
        {cart.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            onRemove={onRemove}
            onQuantityChange={onQuantityChange}
          />
        ))}
      </ul>
      <div className="cart-summary">
        <h3 className="summary-title">Resumen de la Compra</h3>
        <p className="total">Total a pagar: ${total.toFixed(2)}</p>
        {!showPaymentForm ? (
          <button className="payment-button" onClick={handleShowPaymentForm}>Proceder al pago</button>
        ) : (
          <form onSubmit={handlePayment} className="payment-form">
            <input
              type="text"
              name="name"
              value={customerInfo.name}
              onChange={handleInputChange}
              placeholder="Nombre completo"
              required
            />
            <input
              type="tel"
              name="phone"
              value={customerInfo.phone}
              onChange={handleInputChange}
              placeholder="Número de teléfono"
              required
            />
            <input
              type="text"
              name="dni"
              value={customerInfo.dni}
              onChange={handleInputChange}
              placeholder="DNI"
              required
            />
            <input
              type="email"
              name="email"
              value={customerInfo.email}
              onChange={handleInputChange}
              placeholder="Correo electrónico"
              required
            />
            <textarea
              name="additionalNotes"
              value={customerInfo.additionalNotes}
              onChange={handleInputChange}
              placeholder="Notas adicionales"
            />
            <p className="pickup-info">Punto de retiro: Colon 1358 de Lunes a Viernes de 8 am a 15 pm</p>
            
            {!orderSaved ? (
              <button 
                type="submit" 
                className="mercadopago-button" 
                disabled={isProcessing}
              >
                {isProcessing ? 'Procesando...' : 'Siguiente'}
              </button>
            ) : (
              <div id="mercadopago-button"></div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}

export default Cart;
/*import React from 'react';
import CartItem from './CartItem';
import { useNavigate } from 'react-router-dom';

function Cart({ cart, onRemove, onQuantityChange, showAlert }) {
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const navigate = useNavigate();

  const handlePayment = () => {
    window.open('https://www.mercadopago.com', '_blank');
  };

  const handleRemove = (item) => {
    onRemove(item);
  };

  const handleQuantityChange = (item, newQuantity) => {
    onQuantityChange(item, newQuantity);
  };
  return (
    <div className="cart-container">
      <div className="cart-items">
        {cart.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            onRemove={handleRemove}
            onQuantityChange={handleQuantityChange}
          />
        ))}
      </div>
      <div className="cart-summary">
        <h2>Resumen de compra</h2>
        <div className="total">
        
        </div>
        <div className="total">
          <p>Total</p>
          <p>${total.toFixed(2)}</p>
        </div>
        <button className="payment-button" onClick={handlePayment}> Pagar</button>
      </div>
    </div>
  );
}

export default Cart;

*/