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
import Profile from './pages/User/Profile.jsx';
// Add this line with your other imports
import ProductDetail from './pages/User/ProductDetail.jsx';


// add the Shops components
import CartPage from './pages/Shop/CartPage.jsx';
import MyOrders from './pages/Shop/MyOrders.jsx';
import Checkout from './pages/Shop/Checkout';

// add the vendors components
import BecomeSeller from './pages/Vendor/BecomeSeller.jsx';
import SellerDashboard from './pages/Vendor/SellerDashboard.jsx';
import AddProduct from './pages/Vendor/AddProduct.jsx';
import MyProducts from './pages/Vendor/MyProducts.jsx';
import EditProduct from './pages/Vendor/EditProduct.jsx'
import StoreSettings from './pages/Vendor/StoreSettings.jsx';
import SellerOrders from './pages/Vendor/SellerOrders.jsx'


const App = () => {
  const { user, login, logout } = useAuthStore(); // logout ko bhi destructure karlein

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await API.get('/users/me');
        // Sirf tabhi login update karein agar data sahi mila ho
        if (response.data && response.data.user) {
          login(response.data.user, token);
        }
      } catch (err) {
        console.error("Auth verification failed:", err);
        // Sirf tab logout karein agar backend kahe ki token expire ho gaya hai (401 error)
        if (err.response && err.response.status === 401) {
          logout();
        }
      }
    };
    initAuth();
  }, []);


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
              <Route path="/cart" element={<CartPage />} />
              <Route path="/orders" element={<MyOrders />} />

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

              <Route
                path="/seller/edit-product/:id"
                element={
                  <ProtectedRoute>
                    {user?.isSeller ? <EditProduct /> : <Navigate to="/profile" />}
                  </ProtectedRoute>
                }
              />

              <Route path="/seller/settings" element={
                <ProtectedRoute>
                  {user?.isSeller ? <StoreSettings /> : <Navigate to="/profile" />}
                </ProtectedRoute>
              }

              />
              <Route path="/checkout" element={
                <ProtectedRoute><Checkout /></ProtectedRoute>
              } />

              <Route path="/seller/orders" element={
                <ProtectedRoute><SellerOrders /></ProtectedRoute>
              } />


              <Route path="/product/:id" element={<ProductDetail />} />


            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </>
  );
};

export default App;