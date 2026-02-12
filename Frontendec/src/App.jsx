import React, { useEffect } from 'react';
// Navigate ko yahan add kijiye
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/header/Navbar';
import Home from './pages/Home/Home';
import Footer from './components/header/Footer';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import { Toaster } from 'react-hot-toast';
import useAuthStore from './store/authStore.js';
import API from './api/axios';
import ProtectedRoute from './components/common/ProtectedRoute';

// add the user Components
import Orders from './pages/User/Orders';
import Profile from './pages/User/Profile.jsx';

// add the Shops components
import Cart from './pages/Shop/Cart';

// add the vendors components
import BecomeSeller from './pages/Vendor/BecomeSeller.jsx';
import SellerDashboard from './pages/Vendor/SellerDashboard.jsx';
import AddProduct from './pages/Vendor/AddProduct.jsx';
import MyProducts from './pages/Vendor/MyProducts.jsx';

const App = () => {
  const { user, login, logout } = useAuthStore(); // logout ko bhi destructure karlein

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await API.get('/auth/me');
        login(response.data.user, token);
      } catch (err) {
        console.error("Session expired");
        logout();
      }
    };
    initAuth();
  }, [login, logout]);

  return (
    <>
      <Toaster position="top-center" />
      <Router>
        <div className="min-h-screen bg-white">
          <Navbar />
          <main>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/order" element={<Orders />} />

              {/* Protected User Routes */}
              <Route path="/profile" element={
                <ProtectedRoute><Profile /></ProtectedRoute>
              } />
              <Route path="/become-seller" element={
                <ProtectedRoute><BecomeSeller /></ProtectedRoute>
              } />

              {/* Protected Seller Routes */}
              <Route
                path="/seller/dashboard"
                element={
                  <ProtectedRoute>
                    {user?.isSeller ? <SellerDashboard /> : <Navigate to="/profile" />}
                  </ProtectedRoute>
                }
              />

              {/* Add Product Route (Naya Addition) */}
              <Route
                path="/seller/add-product"
                element={
                  <ProtectedRoute>
                    {user?.isSeller ? <AddProduct /> : <Navigate to="/profile" />}
                  </ProtectedRoute>
                }
              />

              <Route
                path="/seller/my-products"
                element={
                  <ProtectedRoute>
                    {user?.isSeller ? <MyProducts /> : <Navigate to="/profile" />}
                  </ProtectedRoute>
                }
              />


            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </>
  );
};

export default App;