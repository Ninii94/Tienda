import React from 'react';


function ProductCard({ product, onAddToCart }) {
  const { id, name, price, image } = product;

  const handleAddToCart = () => {
    onAddToCart(product);
  };

  return (
    <div className="card">
      <img src={product.image}  className="card-img-top" alt={product.name} />
      <div className="card-body">
        <h3 className="card-title">{name}</h3>
        <p className="card-text">Precio: ${price}</p>
        <button className="btn btn-primary" onClick={handleAddToCart}>
          Agregar al carrito
        </button>
      </div>
    </div>
  );
}
export default ProductCard; 