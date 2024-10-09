import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import './admin.css';
import { Image } from 'cloudinary-react';

function AdminCrud({handleLogout}) {
  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState('');
  const uploadPreset = 'munecas';
  const cloudName = 'barbibibi';
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3001/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:3001/orders');
      const sortedOrders = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(sortedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleInputChange = (e, field) => {
    switch (field) {
      case 'name':
        setProductName(e.target.value);
        break;
      case 'price':
        setProductPrice(e.target.value);
        break;
      default:
        break;
    }
  };

  const handleAddProduct = async () => {
    try {
      const newProduct = {
        name: productName,
        price: parseFloat(productPrice),
        image: imageUrl,
      };

      const response = await axios.post('http://localhost:3001/products', newProduct);
      setProducts([...products, response.data]);
      toast.success('Producto añadido con éxito', { toastId: 'add-product' });
      clearFields();
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Error al añadir el producto', { toastId: 'add-product-error' });
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    try {
      const res = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, formData);
      setImageUrl(res.data.secure_url);
    } catch (err) {
      console.error('Error al subir la imagen:', err);
      toast.error('Error al subir la imagen', { toastId: 'upload-image-error' });
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/products/${id}`);
      toast.success('Producto eliminado', { toastId: 'delete-product' });
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Error al eliminar el producto', { toastId: 'delete-product-error' });
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductName(product.name);
    setProductPrice(product.price.toString());
  };

  const handleUpdateProduct = async () => {
    try {
      const updatedProduct = {
        name: productName,
        price: parseFloat(productPrice),
        image: imageUrl || editingProduct.image,
      };

      await axios.put(`http://localhost:3001/products/${editingProduct.id}`, updatedProduct);
      toast.success('Producto actualizado con éxito', { toastId: 'update-product' });
      setEditingProduct(null);
      clearFields();
      fetchProducts();
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Error al actualizar el producto', { toastId: 'update-product-error' });
    }
  };

  const clearFields = () => {
    setProductName('');
    setImageUrl('');
    setProductPrice('');
  };

  const handleFinishChanges = () => {
    handleLogout();
    navigate('/');
    toast.success('Sesión cerrada y cambios guardados', { toastId: 'logout-success' });
  };

  const handleDeleteOrder = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/orders/${id}`);
      toast.success('Cliente eliminado', { toastId: 'delete-order' });
      fetchOrders();
    } catch (error) {
      console.error('Error deleting order:', error);
      toast.error('Error al eliminar el cliente', { toastId: 'delete-order-error' });
    }
  };
  const groupCartItems = (cart) => {
    return cart.reduce((acc, item) => {
      const existingItem = acc.find(i => i.id === item.id);
      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        acc.push({...item});
      }
      return acc;
    }, []);
  };


  return (
    <div className="crud-container">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      <h2>{editingProduct ? 'Editar Producto' : 'Agregar Nuevo Producto'}</h2>
      <div className="form-group">
        <label>Nombre:</label>
        <input
          type="text"
          value={productName}
          onChange={(e) => handleInputChange(e, 'name')}
        />
      </div>
      <div className="form-group">
        <label>Precio:</label>
        <input
          type="text"
          value={productPrice}
          onChange={(e) => handleInputChange(e, 'price')}
        />
      </div>
      <div className="form-group">
        <label>Imagen:</label>
        <input
          type="file"
          onChange={handleImageUpload}
        />
        {imageUrl && (
          <div>
            <Image cloudName={cloudName} publicId={imageUrl} />
            <button onClick={() => setImageUrl('')}>Eliminar imagen</button>
          </div>
        )}
      </div>
      {editingProduct ? (
        <button className="btn btn-update" onClick={handleUpdateProduct}>
          Actualizar
        </button>
      ) : (
        <button className="añadir" onClick={handleAddProduct}>
          Añadir
        </button>
      )}
      <button className="btn btn-finish" onClick={handleFinishChanges}>
        Guardar cambios y cerrar sesión
      </button>

      <h3 className="product-list-title">Mis productos</h3>
      <ul>
        {products.map((product) => (
          <div className="product-item" key={product.id}>
            <li>
              {product.image.startsWith('http') ? (
                <img src={product.image} alt={product.name} />
              ) : (
                <img src={`/images/${product.image}`} alt={product.name} />
              )}
              <p>Precio: {product.price}</p>
              <p>{product.name}</p>
              <button className="btn-eliminar" onClick={() => handleDeleteProduct(product.id)}>
                Eliminar
              </button>
              <button className="btn-modificar" onClick={() => handleEditProduct(product)}>
                Modificar
              </button>
            </li>
          </div>
        ))}
      </ul>

      <h3 className="order-list-title">Ultimos clientes</h3>
      <ul>
      {orders.map((order) => {
          const groupedCart = groupCartItems(order.cart);
          return (
            <div className="order-item" key={order.id}>
              <li>
                <p>Nombre: {order.customerInfo.name}</p>
                <p>DNI: {order.customerInfo.dni}</p>
                <p>Teléfono: {order.customerInfo.phone}</p>
                <p>Email: {order.customerInfo.email}</p>
                <p>Notas adicionales: {order.customerInfo.additionalNotes || 'N/A'}</p>
                <p>Compra:</p>
                <ul>
                  {groupedCart.map((item, index) => (
                    <li key={index}>{item.name} - Cantidad: {item.quantity}</li>
                  ))}
                </ul>
                <p>Total: ${order.total.toFixed(2)}</p>
                <p>Fecha: {new Date(order.createdAt).toLocaleString()}</p>
                <button className="btn-eliminar" onClick={() => handleDeleteOrder(order.id)}>
                  Eliminar Cliente
                </button>
              </li>
            </div>
          );
        })}
      </ul>
    </div>
  );
}

export default AdminCrud;

/*import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import './admin.css';
import { Image } from 'cloudinary-react';

function AdminCrud({handleLogout}) {
  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState('');
  const uploadPreset = 'munecas';
  const cloudName = 'barbibibi';
  
  
  

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3001/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleInputChange = (e, field) => {
    switch (field) {
      case 'name':
        setProductName(e.target.value);
        break;
      case 'price':
        setProductPrice(e.target.value);
        break;
      default:
        break;
    }
  };

  const handleAddProduct = async () => {
    try {
      const newProduct = {
        name: productName,
        price: parseFloat(productPrice),
        image: imageUrl,
      };

      const response = await axios.post('http://localhost:3001/products', newProduct);
      setProducts([...products, response.data]);
      toast.success('Producto añadido con éxito', { toastId: 'add-product' });
      clearFields();
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Error al añadir el producto', { toastId: 'add-product-error' });
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    try {
      const res = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, formData);
      setImageUrl(res.data.secure_url);
    } catch (err) {
      console.error('Error al subir la imagen:', err);
      toast.error('Error al subir la imagen', { toastId: 'upload-image-error' });
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/products/${id}`);
      toast.success('Producto eliminado', { toastId: 'delete-product' });
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Error al eliminar el producto', { toastId: 'delete-product-error' });
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductName(product.name);
    setProductPrice(product.price.toString());
  };

  const handleUpdateProduct = async () => {
    try {
      const updatedProduct = {
        name: productName,
        price: parseFloat(productPrice),
        image: imageUrl || editingProduct.image,
      };

      await axios.put(`http://localhost:3001/products/${editingProduct.id}`, updatedProduct);
      toast.success('Producto actualizado con éxito', { toastId: 'update-product' });
      setEditingProduct(null);
      clearFields();
      fetchProducts();
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Error al actualizar el producto', { toastId: 'update-product-error' });
    }
  };

  const clearFields = () => {
    setProductName('');
    setImageUrl('');
    setProductPrice('');
  };

  const handleFinishChanges = () => {
    handleLogout();
    navigate('/');
    toast.success('Sesión cerrada y cambios guardados', { toastId: 'logout-success' });
    setTimeout(() => {
    }, 2000);
  };

  return (
    <div className="crud-container">
      <h2>{editingProduct ? 'Editar Producto' : 'Agregar Nuevo Producto'}</h2>
      <div className="form-group">
        <label>Nombre:</label>
        <input
          type="text"
          value={productName}
          onChange={(e) => handleInputChange(e, 'name')}
        />
      </div>
      <div className="form-group">
        <label>Precio:</label>
        <input
          type="text"
          value={productPrice}
          onChange={(e) => handleInputChange(e, 'price')}
        />
      </div>
      <div className="form-group">
        <label>Imagen:</label>
        <input
          type="file"
          onChange={handleImageUpload}
        />
        {imageUrl && (
          <div>
            <Image cloudName={cloudName} publicId={imageUrl} />
            <button onClick={() => setImageUrl('')}>Eliminar imagen</button>
          </div>
        )}
      </div>
      {editingProduct ? (
        <button className="btn btn-update" onClick={handleUpdateProduct}>
          Actualizar
        </button>
      ) : (
        <button className="añadir" onClick={handleAddProduct}>
          Añadir
        </button>
      )}
      <button className="btn btn-finish" onClick={handleFinishChanges}>
        Guardar cambios y cerrar sesión
      </button>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        toastStyle={{ backgroundColor: '#ffc0cb', color: '#000' }}
      />
      <h3 className="product-list-title">Mis productos</h3>
      <ul>
        {products.map((product) => (
          <div className="product-item" key={product.id}>
            <li>
              {}
        {product.image.startsWith('http') ? (
          // Si la imagen proviene de Cloudinary
          <img src={product.image} alt={product.name} />
        ) : (
          // Si la imagen proviene del JSON
          <img src={`/images/${product.image}`} alt={product.name} />
        )}
              <p>Precio: {product.price}</p>
              <p> {product.name}</p>
              <button className="btn-eliminar" onClick={() => handleDeleteProduct(product.id)}>
                Eliminar
              </button>
              <button className="btn-modificar" onClick={() => handleEditProduct(product)}>
                Modificar
              </button>
            </li>
          </div>
        ))}
      </ul>
    </div>
  );
}

export default AdminCrud;

/*import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./admin.css";
import axios from 'axios';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

const AdminCrud = ({ products, updateProducts }) => {
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productImage, setProductImage] = useState(null);

  const navigate = useNavigate();



  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setProductImage(reader.result);
    };
  };

  const handleAddProduct = async () => {
    const formData = new FormData();
    formData.append("name", productName);
    formData.append("price", productPrice);
    formData.append("image", productImage);
  
    try {
      const response = await axios.post("http://localhost:3001/products", formData, {
        headers: {
          "Content-Type": 'multipart/form-data'
        }
      });
      
      updateProducts([...products, response.data]);
      setProductName("");
      setProductPrice("");
      setProductImage(null);
      Toastify({
        text: "El nuevo producto ha sido agregado",
        duration: 3000,
        gravity: "top",
        position: "right",
        style: {
          background: "green",
      },}).showToast();
    } catch (error) {
      console.error("Error al agregar producto:", error);
    }
  };
  const handleFinishChanges = () => {
    navigate("/");
  };

  const handleDeleteProduct = (productId) => {
    fetch(`http://localhost:3001/products/${productId}`, {
      method: "DELETE",
    })
      .then(() => {
        updateProducts(products.filter((product) => product.id !== productId));
        Toastify({
          text: "Producto eliminado",
          duration: 3000,
          gravity: "top",
          position: "right",
          backgroundColor: "red",
        }).showToast();
      })
      .catch((error) => console.error("Error al eliminar el producto:", error));
  };

  const handleUpdateProduct = (productId, updatedProduct) => {
    fetch(`http://localhost:3001/products/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedProduct),
    })
      .then((response) => response.json())
      .then((data) => {
        updateProducts(
          products.map((product) => (product.id === productId ? data : product))
        );
      })
      .catch((error) => console.error("Error al modificar el producto:", error));
  };
  

  return (
    <div className="crud-container">
      <h2 className= 'nuevo'>Agrega un nuevo producto</h2>
      <div className="form-group">
        <label>Nombre:</label>
        <input
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Precio:</label>
        <input
          type="text"
          value={productPrice}
          onChange={(e) => setProductPrice(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Imagen:</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />
      </div>
      <button className="añadir" onClick={handleAddProduct}>
        Añadir
      </button>
      <button className="btn btn-finish" onClick={handleFinishChanges}>
        Guardar cambios y cerrar sesión
      </button>
      <h2 className= 'lista'>Lista de productos</h2>
      <ul className="product-list">
        {products.map((product) => (
      <li key={product.id} className="product-item">
      <img src={`/images/${product.image}`} alt={product.name} />
      <span>{product.name}</span>
      <span>{product.price}</span>
      <button onClick={() => handleDeleteProduct(product.id)}>
        Eliminar
      </button>
      <button
        onClick={() =>
          handleUpdateProduct(product.id, {
            ...product,
            name: prompt("Nuevo nombre", product.name),
            price: prompt("Nuevo precio", product.price),
            image: productImage || product.image,
          })
        }
      >
        Modificar
      </button>
    </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminCrud;
*/


/*
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./admin.css";
import axios from 'axios';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

const AdminCrud = ({ products, updateProducts }) => {
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productImage, setProductImage] = useState(null);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setProductImage(reader.result);
    };
  };

  const handleAddProduct = async () => {
    const formData = new FormData();
    formData.append("name", productName);
    formData.append("price", productPrice);
    formData.append("image", productImage);
  
    try {
        const response = await axios.post("http://localhost:3001/products", formData);
        updateProducts([...products, response.data]);
        setProductName("");
        setProductPrice("");
        setProductImage(null);
        Toastify({
          text: "El nuevo producto ha sido agregado",
          duration: 3000,
          gravity: "top",
          position: "right",
          backgroundColor: "green",
        }).showToast();
      } catch (error) {
        console.error("Error al agregar producto:", error);
      }
    };
  const handleFinishChanges = () => {
    navigate("/");
  };

  const handleDeleteProduct = (productId) => {
    fetch(`http://localhost:3001/products/${productId}`, {
      method: "DELETE",
    })
      .then(() => {
        updateProducts(products.filter((product) => product.id !== productId));
        Toastify({
          text: "Producto eliminado",
          duration: 3000,
          gravity: "top",
          position: "right",
          backgroundColor: "red",
        }).showToast();
      })
      .catch((error) => console.error("Error al eliminar el producto:", error));
  };

  const handleUpdateProduct = (productId, updatedProduct) => {
    fetch(`http://localhost:3001/products/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedProduct),
    })
      .then((response) => response.json())
      .then((data) => {
        updateProducts(
          products.map((product) => (product.id === productId ? data : product))
        );
      })
      .catch((error) => console.error("Error al modificar el producto:", error));
  };

  return (
    <div className="crud-container">
      <h2 className= 'nuevo'>Agrega un nuevo producto</h2>
      <div className="form-group">
        <label>Nombre:</label>
        <input
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Precio:</label>
        <input
          type="text"
          value={productPrice}
          onChange={(e) => setProductPrice(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Imagen:</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />
      </div>
      <button className="añadir" onClick={handleAddProduct}>
        Añadir
      </button>
      <button className="btn btn-finish" onClick={handleFinishChanges}>
        Guardar cambios y cerrar sesión
      </button>
      <h2 className= 'lista'>Lista de productos</h2>
      <ul className="product-list">
        {products.map((product) => (
          <li key={product.id} className="product-item">
            <img src={product.image} alt={product.name} />
            <span>{product.name}</span>
            <span>{product.price}</span>
            <button onClick={() => handleDeleteProduct(product.id)}>
              Eliminar
            </button>
            <button
              onClick={() =>
                handleUpdateProduct(product.id, {
                  ...product,
                  name: prompt("Nuevo nombre", product.name),
                  price: prompt("Nuevo precio", product.price),
                  image: productImage || product.image,
                })
              }
            >
              Modificar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminCrud; */