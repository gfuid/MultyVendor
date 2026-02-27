import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import VendorManager from './pages/VendorManager';
import AdminProductList from './pages/AdminProductList';
import VendorDetails from './pages/VendorDetails';
import AdminProductDetail from './pages/AdminProductDetail';
import Login from './pages/Login';
import Users from './pages/Users';

function App() {
  // Redux state se token aur user dono uthana zaroori hai
  const { token, user } = useSelector((state) => state.auth);

  return (
    <Router>
      <div className="flex min-h-screen bg-[#fff5f7]">
        {/* Agar token hai tabhi Sidebar dikhao */}
        {token && <Sidebar />}

        <div className="flex-1 overflow-y-auto">
          <Routes>
            {/* LOGIN ROUTE */}
            <Route
              path="/login"
              element={!token ? <Login /> : <Navigate to="/" />}
            />

            {/* DASHBOARD */}
            <Route
              path="/"
              element={token ? <Dashboard /> : <Navigate to="/login" />}
            />

            {/* VENDORS LIST */}
            <Route
              path="/vendors"
              element={token ? <VendorManager /> : <Navigate to="/login" />}
            />

            {/* PRODUCTS LIST */}
            <Route
              path="/products"
              element={token ? <AdminProductList /> : <Navigate to="/login" />}
            />

            {/* USERS MANAGEMENT - Fix: Token aur Admin Role dono check kiye */}
            <Route
              path="/usersdetails"
              element={token ? <Users /> : <Navigate to="/login" />}
            />

            {/* PRODUCT DETAIL */}
            <Route
              path="/product-detail/:id"
              element={token ? <AdminProductDetail /> : <Navigate to="/login" />}
            />

            {/* VENDOR DETAIL */}
            <Route
              path="/vendors/:id"
              element={token ? <VendorDetails /> : <Navigate to="/login" />}
            />

            {/* Fallback for any random URL */}
            <Route path="*" element={<Navigate to={token ? "/" : "/login"} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;