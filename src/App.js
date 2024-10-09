import React, { useState, useEffect} from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import ProductList from './components/ProductList';
import AdminCrud from './components/PanelAdmin';
import Cart from './components/Cart/Cart';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Testimonials from './components/Testimonials';
import { useNavigate } from 'react-router-dom';
import Footer from './components/Footer';
import { AuthProvider, useAuth } from './components/AuthContext';
import SuccessPage from '../src/components/SuccessPage';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cart, setCart] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [products, setProducts] = useState([]);
  const [showLogoutMessage, setShowLogoutMessage] = useState(false);
  const { isAuthenticated, login, logout } = useAuth();

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (loggedIn) {
      setIsLoggedIn(true);
    }

    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3001/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error al obtener los productos:', error);
      }
    };
    fetchProducts();
  }, []);

  const handleLogin = async (username, password) => {
    console.log('Iniciando sesión...'); 
    try {
      const response = await axios.get('http://localhost:3001/users');
      const users = response.data;
      const user = users.find(
        (u) => u.username === username && u.password === password
      );
      if (username === "admin" && password === "123") {
        setIsLoggedIn(true);
        
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('user', JSON.stringify({ username, isAdmin: true }));
        return { success: true, message: "Seras redirigido a la pagina de administrador", redirectTo: "/admin" };
      } else if (user) {
        setIsLoggedIn(true);
        login();
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('user', JSON.stringify(user));
        return { success: true, message: "bienvenida/o a BarbieLand", redirectTo: "/" };
      } else {
        return { success: false, message: "usuario o contraseña incorrecto" };
      }
    } catch (error) {
      console.error('Error al iniciar sesión', error);
      return { success: false, message: 'Error al iniciar sesión.' };
    }
  };
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    setCart([]);
    setShowLogoutMessage(true);
    setTimeout(() => {
      setShowLogoutMessage(false);
    }, 3000);
  };

  const handleAddToCart = (product, isAuthenticated) => {
    if (isAuthenticated) {
    const existingProductIndex = cart.findIndex((item) => item.id === product.id);

    if (existingProductIndex !== -1) {
      const updatedCart = [...cart];
      updatedCart[existingProductIndex].quantity += 1;
      setCart(updatedCart);
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }

    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  } else {
    console.log("Por favor, inicia sesión para añadir productos al carrito");
  }
};

  const handleRemove = (item) => {
    const updatedCart = cart.filter((cartItem) => cartItem.id !== item.id);
    setCart(updatedCart);
  };

  const handleQuantityChange = (item, newQuantity) => {
    const updatedCart = cart.map((cartItem) =>
      cartItem.id === item.id ? { ...cartItem, quantity: newQuantity } : cartItem
    );
    setCart(updatedCart);
  };

  return (
    <AuthProvider>
    <Router>
      <div className="App">
        <Navbar isLoggedIn={isLoggedIn} cart={cart} handleLogout={handleLogout} />
        {showLogoutMessage && (
      <div className="logout-message">
        Sesión cerrada. Hasta luego.
      </div>
       )}
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <>
                <ProductList products={products} onAddToCart={handleAddToCart} />
                <Testimonials />
              </>
            }
          />
          <Route
            path="/cart"
            element={
              <Cart
                cart={cart}
                onRemove={handleRemove}
                onQuantityChange={handleQuantityChange}
                showAlert={showAlert}
              />
            }
          />
          <Route
            path="/admin"
            element={
              <AdminCrud products={products} 
              updateProducts={setProducts} 
              handleLogout={handleLogout} />
            }
          />
          <Route path="/success" element={<SuccessPage />} />
        </Routes>
      </div>
      <Footer />
    </Router>
    
    </AuthProvider>
  );
}

export default App;