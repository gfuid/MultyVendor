import React, { useState, useEffect } from 'react'; // Fixed: Added useState & useEffect imports
import useAuthStore from '../../store/authStore.js';
import {
    LayoutDashboard,
    Package,
    PlusCircle,
    ShoppingBag,
    Users,
    TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';

const SellerDashboard = () => {
    const { user } = useAuthStore();
    const [productsCount, setProductsCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await API.get('/products/my-products');
                setProductsCount(response.data.length);
            } catch (err) {
                console.error("Fetch failed", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    // Fixed: stats array ab productsCount ka real data dikhayega
    const stats = [
        { label: 'Total Products', value: productsCount, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Active Orders', value: '0', icon: ShoppingBag, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Total Customers', value: '0', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: 'Total Revenue', value: '₹0', icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50' },
    ];

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <p className="text-[#ff4d6d] font-black animate-pulse">LOADING DASHBOARD...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-100 hidden lg:block p-6">
                <h2 className="text-xl font-black text-[#ff4d6d] italic mb-10 uppercase tracking-tighter">Trireme Biz</h2>
                <nav className="space-y-2">
                    <Link to="/seller/dashboard" className="flex items-center gap-3 p-3 bg-pink-50 text-[#ff4d6d] rounded-xl font-bold transition-all">
                        <LayoutDashboard size={20} /> Dashboard
                    </Link>
                    <Link to="/seller/add-product" className="flex items-center gap-3 p-3 text-gray-500 hover:bg-gray-50 rounded-xl font-medium transition-all">
                        <PlusCircle size={20} /> Add Product
                    </Link>
                    <Link to="/seller/my-products" className="flex items-center gap-3 p-3 text-gray-500 hover:bg-gray-50 rounded-xl font-medium transition-all">
                        <Package size={20} /> My Products
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8">
                <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 uppercase italic">Control Center</h1>
                        <p className="text-gray-500 font-medium">Store: <span className="text-[#ff4d6d]">{user?.name}</span></p>
                    </div>
                    <Link
                        to="/seller/add-product"
                        className="bg-[#ff4d6d] text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#ff7096] transition-all shadow-lg shadow-pink-100"
                    >
                        <PlusCircle size={20} /> Add New Product
                    </Link>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {stats.map((item, index) => (
                        <div key={index} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 hover:scale-105 transition-transform">
                            <div className={`p-4 ${item.bg} ${item.color} rounded-2xl`}>
                                <item.icon size={24} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{item.label}</p>
                                <h3 className="text-2xl font-black text-gray-800">{item.value}</h3>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Conditional UI: Placeholder or Activity */}
                {productsCount === 0 ? (
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center py-20">
                        <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Package size={40} className="text-gray-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">No products yet</h3>
                        <p className="text-gray-500 mt-2 mb-6 text-sm max-w-xs mx-auto">
                            Abhi tak aapne koi product add nahi kiya hai. Aaj hi shuru karein!
                        </p>
                        <Link to="/seller/add-product" className="text-[#ff4d6d] font-bold hover:underline">
                            Start Selling Now
                        </Link>
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl p-6 border border-gray-100">
                        <h2 className="text-lg font-bold mb-4">Recent Performance</h2>
                        <div className="h-32 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center">
                            <p className="text-gray-400 text-sm">Analytics graphs will appear here</p>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default SellerDashboard;