import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import VendorTable from './pages/VendorTable';
import AdminProductList from './pages/AdminProductList';

// Note: AdminProvider ko yahan se hata diya gaya hai kyunki hum Redux use kar rahe hain.

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-[#fff5f7]">
        {/* Sidebar fixed on the left */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/vendors" element={<VendorTable />} />
            <Route path="/products" element={<AdminProductList />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;