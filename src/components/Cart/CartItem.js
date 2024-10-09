import React from 'react';
import { Image } from 'cloudinary-react';

const cloudName = 'barbibibi';
const uploadPreset = 'munecas';

function CartItem({ item, onRemove, onQuantityChange }) {
  const { id, name, price, image, quantity, cloudinaryUrl } = item;

  const handleQuantityChange = (newQuantity) => {
    onQuantityChange(item, newQuantity);
  };

  const handleQuantityDecrement = () => {
    handleQuantityChange(Math.max(quantity - 1, 1));
  };

  const handleQuantityIncrement = () => {
    handleQuantityChange(quantity + 1);
  };

  const getImageSource = () => {
    if (cloudinaryUrl) {
      return (
        <Image
          cloud_name={cloudName}
          upload_preset={uploadPreset}
          public_id={cloudinaryUrl}
          secure={true}
        />
      );
    } else if (image) {
      return image.startsWith('http') ? (
        <img src={image} alt={name} className="cart-item-image" />
      ) : (
        <img src={`${image}`} alt={name} className="cart-item-image" /> 
      );
    } else {
      return null;
    }
  };

  return (
    <li className="cart-item">
      <div className="cart-item-image-container">{getImageSource()}</div>
      <div className="cart-item-details">
        <h5>{name}</h5>
        <p>Precio: ${price}</p>
        <div className="quantity-control">
          <button onClick={handleQuantityDecrement}>-</button>
          <input type="number" value={quantity} min="1" onChange={(e) => handleQuantityChange(parseInt(e.target.value))} />
          <button onClick={handleQuantityIncrement}>+</button>
        </div>
        <p className="subtotal">Subtotal: ${(price * quantity).toFixed(2)}</p>
        <button className="remove-button" onClick={() => onRemove(item)}>
          Eliminar
        </button>
      </div>
    </li>
  );
}

export default CartItem;