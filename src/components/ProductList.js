import React, { useState, useEffect, useContext } from 'react';
import ProductCard from './ProductCard';
import layout1 from '../layout1.jpg';
import layout2 from '../layout2.jpg';
import portada from '../portada.gif';
import { useAuth } from './AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

function ProductList({ onAddToCart }) {
  const [products, setProducts] = useState([]);
  const [currentImage, setCurrentImage] = useState(layout1);
  const [autoSlide, setAutoSlide] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchProducts();
    const interval = setInterval(() => {
      if (autoSlide) {
        handleImageChange();
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [autoSlide]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3001/products');
      const updatedProducts = response.data.map((product) => {
        if (product.image.startsWith('http')) {
          return product;
        } else {
          return { ...product, image: `/images/${product.image}` };
        }
      });
      setProducts(updatedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleAddToCart = (product) => {
    if (isAuthenticated) {
      onAddToCart(product, isAuthenticated);
      toast.success('Producto agregado al carrito', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: { backgroundColor: 'pink', color: 'black' },
      });
    } else {
      toast.error("Por favor, inicia sesión para agregar productos al carrito.", {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: { backgroundColor: 'pink', color: 'black' },
      });
      
    }
  };

  const handleImageChange = () => {
    setCurrentImage(currentImage === layout1 ? layout2 : layout1);
  };

  const handlePrevImage = () => {
    setAutoSlide(false);
    setCurrentImage(currentImage === layout1 ? layout2 : layout1);
  };

  const handleNextImage = () => {
    setAutoSlide(false);
    setCurrentImage(currentImage === layout1 ? layout2 : layout1);
  };

  return (
    <div>
      <ToastContainer />
      <img src={portada} alt="Portada" className="portada-gif" />
      <div className="layout-container">
        <div className="slider-container">
          <img
            src={currentImage}
            alt={currentImage === layout1 ? 'Layout 1' : 'Layout 2'}
            className="layout-image"
          />
          <button onClick={handlePrevImage}>&#8249;</button>
          <button onClick={handleNextImage}>&#8250;</button>
        </div>
      </div>
      <div className="container-productos">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={() => handleAddToCart(product)}
          />
       
        ))}
      </div>
    </div>
  );
}

export default ProductList;
/*import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import layout1 from '../layout1.jpg';
import layout2 from '../layout2.jpg';
import portada from '../portada.gif';
import { AuthContext } from './AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

function ProductList({ onAddToCart }) {
  const [products, setProducts] = useState([]);
  const [currentImage, setCurrentImage] = useState(layout1);
  const [autoSlide, setAutoSlide] = useState(true);
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    fetchProducts();
    const interval = setInterval(() => {
      handleImageChange();
    }, 3000);
    return () => clearInterval(interval);
  }, []);
 
  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3001/products');
      const updatedProducts = response.data.map((product) => {
        if (product.image.startsWith('http')) {
          // La propiedad image es una URL, no se requiere cambio
          return product;
        } else {
          // La propiedad image es un nombre de archivo local, prepara la URL
          return { ...product, image: `/images/${product.image}` };
        }
      });
      setProducts(updatedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  const handleAddToCart = (product) => {
    if (isAuthenticated) {
      addToCart(product);
    } else {
      alert("Por favor, inicia sesión para agregar productos al carrito.");
      // Aquí podrías redirigir al usuario a la página de login
    }
  };

  const handleImageChange = () => {
    setCurrentImage(currentImage === layout1 ? layout2 : layout1);
  };
  const handlePrevImage = () => {
    setAutoSlide(false);
    setCurrentImage(currentImage === layout1 ? layout2 : layout1);
  };

  const handleNextImage = () => {
    setAutoSlide(false);
    setCurrentImage(currentImage === layout1 ? layout2 : layout1);
  };
  const handleAddToCart = (product) => {
    onAddToCart(product);
    toast.success('Producto agregado al carrito', {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      style: { backgroundColor: 'pink', color: 'black' },
    });
  };

  return (
      <div>
      <ToastContainer />
      
      <img src={portada} alt="Portada" className="portada-gif" />
      <div className="layout-container">
      <div className="slider-container">
        <img
          src={currentImage}
          alt={currentImage === layout1 ? 'Layout 1' : 'Layout 2'}
          className="layout-image"
        />
        <button onClick={handlePrevImage}>&#8249;</button>
        <button onClick={handleNextImage}>&#8250;</button>
          </div>
      </div>
      <div className="container-productos">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={() => handleAddToCart(product)}
          />
        ))}
      </div>
    </div>
  );
}

export default ProductList; 
*/