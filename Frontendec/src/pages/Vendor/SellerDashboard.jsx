import React, { useState, useEffect } from 'react';
import useAuthStore from '../../store/authStore.js';
import {
    LayoutDashboard, Package, PlusCircle,
    ShoppingBag, Users, TrendingUp,
    Settings, Store, ArrowUpRight,
    Zap, Clock, CheckCircle, XCircle
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import API from '../../api/axios';

// ─── Status Config ────────────────────────────────────────────
const STATUS_CONFIG = {
    processing: { label: 'Processing', dot: '#f59e0b' },
    shipped: { label: 'Shipped', dot: '#3b82f6' },
    delivered: { label: 'Delivered', dot: '#10b981' },
    cancelled: { label: 'Cancelled', dot: '#ef4444' },
};

// ─── Sidebar Nav Item ─────────────────────────────────────────
const NavItem = ({ to, icon: Icon, label, active }) => (
    <Link
        to={to}
        className={`group flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all duration-200
            ${active
                ? 'bg-[#ff4d6d] text-white shadow-lg shadow-pink-200'
                : 'text-gray-400 hover:text-gray-800 hover:bg-gray-50'
            }`}
    >
        <Icon size={18} strokeWidth={active ? 2.5 : 2} />
        <span className="tracking-tight">{label}</span>
        {active && <ArrowUpRight size={14} className="ml-auto opacity-70" />}
    </Link>
);

// ─── Stat Card ────────────────────────────────────────────────
const StatCard = ({ label, value, icon: Icon, accent, trend }) => (
    <div className="relative bg-white rounded-3xl p-6 border border-gray-100 overflow-hidden group hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
        {/* Background blob */}
        <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-[0.07] ${accent}`} />

        <div className="relative z-10">
            <div className={`inline-flex p-2.5 rounded-2xl mb-4 ${accent} bg-opacity-10`}>
                <Icon size={20} className={`${accent.replace('bg-', 'text-')}`} />
            </div>
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
            <h3 className="text-3xl font-black text-gray-900 tracking-tighter">{value}</h3>
            {trend && (
                <p className="text-[10px] text-green-500 font-bold mt-1 flex items-center gap-1">
                    <TrendingUp size={10} /> {trend}
                </p>
            )}
        </div>
    </div>
);

// ─── Main Component ───────────────────────────────────────────
const SellerDashboard = () => {
    const { user } = useAuthStore();
    const location = useLocation();
    const [orders, setOrders] = useState([]);
    const [stats, setStats] = useState([]);
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [prodRes, orderRes] = await Promise.all([
                    API.get('/products/my-products'),
                    API.get('/orders/seller/dashboard')
                ]);

                const products = prodRes.data || [];
                const sellerOrders = orderRes.data.orders || [];

                setOrders(sellerOrders);
                setRecentOrders(sellerOrders.slice(0, 6));

                const revenue = sellerOrders
                    .filter(o => o.orderStatus !== 'cancelled')
                    .reduce((acc, o) => acc + (o.totalAmount || 0), 0);
                const uniqueCustomers = new Set(sellerOrders.map(o => o.buyer?._id)).size;

                setStats([
                    {
                        label: 'Total Products', value: products.length,
                        icon: Package, accent: 'bg-blue-500', trend: 'In your store'
                    },
                    {
                        label: 'Active Orders', value: sellerOrders.filter(o => o.orderStatus === 'processing' || o.orderStatus === 'shipped').length,
                        icon: ShoppingBag, accent: 'bg-[#ff4d6d]', trend: 'Needs attention'
                    },
                    {
                        label: 'Customers', value: uniqueCustomers,
                        icon: Users, accent: 'bg-purple-500', trend: 'Unique buyers'
                    },
                    {
                        label: 'Revenue', value: `₹${revenue.toLocaleString('en-IN')}`,
                        icon: TrendingUp, accent: 'bg-green-500', trend: 'Excl. cancelled'
                    },
                ]);
            } catch (err) {
                console.error("Dashboard fetch failed", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    // Order status counts for mini chart
    const statusCounts = {
        processing: orders.filter(o => o.orderStatus === 'processing').length,
        shipped: orders.filter(o => o.orderStatus === 'shipped').length,
        delivered: orders.filter(o => o.orderStatus === 'delivered').length,
        cancelled: orders.filter(o => o.orderStatus === 'cancelled').length,
    };

    const filteredRecent = activeTab === 'all'
        ? recentOrders
        : recentOrders.filter(o => o.orderStatus === activeTab);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center space-y-3">
                <div className="w-10 h-10 border-4 border-[#ff4d6d] border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Loading Dashboard...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f8f8f8] flex">

            {/* ── SIDEBAR ──────────────────────────────────────── */}
            <aside className="w-64 bg-white border-r border-gray-100 hidden lg:flex flex-col p-5 sticky top-0 h-screen">
                {/* Logo */}
                <div className="mb-8 px-2">
                    <h2 className="text-lg font-black text-[#ff4d6d] italic uppercase tracking-tighter">
                        Trireme Biz
                    </h2>
                    <div className="flex items-center gap-2 mt-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#ff4d6d] to-[#ff7096] flex items-center justify-center text-white text-[10px] font-black">
                            {user?.name?.[0]?.toUpperCase() || 'S'}
                        </div>
                        <div>
                            <p className="text-xs font-black text-gray-800 truncate max-w-[130px]">
                                {user?.storeName || user?.name}
                            </p>
                            <p className="text-[10px] text-green-500 font-bold flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                                Active Seller
                            </p>
                        </div>
                    </div>
                </div>

                {/* Nav */}
                <nav className="space-y-1 flex-1">
                    <NavItem to="/seller/dashboard" icon={LayoutDashboard} label="Dashboard" active={location.pathname === '/seller/dashboard'} />
                    <NavItem to="/seller/orders" icon={ShoppingBag} label="Orders" active={location.pathname === '/seller/orders'} />
                    <NavItem to="/seller/add-product" icon={PlusCircle} label="Add Product" active={location.pathname === '/seller/add-product'} />
                    <NavItem to="/seller/my-products" icon={Package} label="My Products" active={location.pathname === '/seller/my-products'} />
                    <NavItem to="/seller/settings" icon={Settings} label="Settings" active={location.pathname === '/seller/settings'} />
                </nav>

                {/* Quick tip card */}
                <div className="bg-gradient-to-br from-[#ff4d6d] to-[#c2185b] rounded-2xl p-4 text-white mt-4">
                    <Zap size={16} className="mb-2 text-yellow-300" />
                    <p className="text-[11px] font-black uppercase tracking-wider mb-1">Pro Tip</p>
                    <p className="text-[11px] text-pink-100 leading-relaxed">
                        Ship within 24hrs to boost your seller rating by 20%.
                    </p>
                </div>
            </aside>

            {/* ── MAIN CONTENT ─────────────────────────────────── */}
            <main className="flex-1 p-5 md:p-8 overflow-y-auto min-h-screen">

                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">
                            Welcome back
                        </p>
                        <h1 className="text-3xl font-black text-gray-900 uppercase italic tracking-tighter">
                            {user?.storeName || user?.name}'s Store
                        </h1>
                    </div>
                    <div className="flex gap-3">
                        <Link
                            to="/seller/add-product"
                            className="bg-[#ff4d6d] text-white px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-[#e03458] transition-colors shadow-lg shadow-pink-200"
                        >
                            <PlusCircle size={16} /> Add Product
                        </Link>
                        <Link
                            to="/seller/orders"
                            className="bg-white text-gray-700 px-5 py-2.5 rounded-2xl font-bold text-xs border border-gray-200 flex items-center gap-2 hover:bg-gray-50 transition-colors"
                        >
                            <ShoppingBag size={16} /> All Orders
                        </Link>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {stats.map((item, i) => (
                        <StatCard key={i} {...item} />
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* ── RECENT ORDERS (2/3 width) ─────────────── */}
                    <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                            <h2 className="font-black text-gray-900 uppercase italic tracking-tighter text-base">
                                Recent Orders
                            </h2>
                            <Link
                                to="/seller/orders"
                                className="text-[10px] font-black text-[#ff4d6d] uppercase tracking-widest hover:underline flex items-center gap-1"
                            >
                                See All <ArrowUpRight size={12} />
                            </Link>
                        </div>

                        {/* Tab Filter */}
                        <div className="flex gap-2 px-6 pt-4 pb-2 overflow-x-auto">
                            {['all', 'processing', 'shipped', 'delivered', 'cancelled'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`flex-shrink-0 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all
                                        ${activeTab === tab
                                            ? 'bg-gray-900 text-white'
                                            : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                                        }`}
                                >
                                    {tab === 'all' ? `All (${orders.length})` : `${tab} (${statusCounts[tab]})`}
                                </button>
                            ))}
                        </div>

                        {/* Orders List */}
                        <div className="px-6 pb-6 space-y-2 mt-2">
                            {filteredRecent.length > 0 ? filteredRecent.map((order) => (
                                <div
                                    key={order._id}
                                    className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-2xl border border-gray-100 transition-colors group cursor-pointer"
                                >
                                    {/* Left: Image + Info */}
                                    <div className="flex items-center gap-3 min-w-0">
                                        <img
                                            src={order.items[0]?.product?.images?.[0] || 'https://via.placeholder.com/40'}
                                            className="w-10 h-10 rounded-xl object-cover bg-white border border-gray-200 flex-shrink-0"
                                            alt=""
                                        />
                                        <div className="min-w-0">
                                            <p className="text-xs font-black text-gray-800 tracking-tight truncate">
                                                {order.buyer?.name || 'Customer'}
                                            </p>
                                            <p className="text-[10px] text-gray-400 font-bold">
                                                #{order._id.slice(-6)} · {order.items.length} item{order.items.length > 1 ? 's' : ''}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Right: Amount + Status */}
                                    <div className="flex items-center gap-3 flex-shrink-0">
                                        <p className="font-black text-gray-900 text-sm">₹{order.totalAmount}</p>
                                        <span
                                            className="text-[9px] px-2.5 py-1 rounded-full font-black uppercase tracking-wider border"
                                            style={{
                                                color: STATUS_CONFIG[order.orderStatus]?.dot || '#888',
                                                backgroundColor: STATUS_CONFIG[order.orderStatus]?.dot + '18' || '#f5f5f5',
                                                borderColor: STATUS_CONFIG[order.orderStatus]?.dot + '33' || '#eee',
                                            }}
                                        >
                                            {STATUS_CONFIG[order.orderStatus]?.label || order.orderStatus}
                                        </span>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-12">
                                    <ShoppingBag size={36} className="text-gray-200 mx-auto mb-3" />
                                    <p className="text-gray-300 font-black uppercase italic tracking-widest text-sm">
                                        No orders here
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── RIGHT COLUMN (1/3 width) ──────────────── */}
                    <div className="space-y-5">

                        {/* Order Breakdown */}
                        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                            <h3 className="font-black text-gray-900 uppercase italic tracking-tighter text-sm mb-5">
                                Order Breakdown
                            </h3>
                            <div className="space-y-3">
                                {Object.entries(statusCounts).map(([status, count]) => {
                                    const cfg = STATUS_CONFIG[status];
                                    const percent = orders.length ? Math.round((count / orders.length) * 100) : 0;
                                    return (
                                        <div key={status}>
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                                                    {cfg.label}
                                                </span>
                                                <span className="text-[10px] font-black text-gray-800">
                                                    {count} <span className="text-gray-400">({percent}%)</span>
                                                </span>
                                            </div>
                                            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full rounded-full transition-all duration-700"
                                                    style={{
                                                        width: `${percent}%`,
                                                        backgroundColor: cfg.dot
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                            <h3 className="font-black text-gray-900 uppercase italic tracking-tighter text-sm mb-4">
                                Quick Actions
                            </h3>
                            <div className="space-y-2">
                                {[
                                    { to: '/seller/add-product', icon: PlusCircle, label: 'Add New Product', sub: 'List a new item' },
                                    { to: '/seller/my-products', icon: Package, label: 'Manage Products', sub: 'Edit / delete' },
                                    { to: '/seller/orders', icon: ShoppingBag, label: 'View All Orders', sub: 'Full order list' },
                                    { to: '/seller/settings', icon: Settings, label: 'Store Settings', sub: 'Profile & info' },
                                ].map((action) => (
                                    <Link
                                        key={action.to}
                                        to={action.to}
                                        className="flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 transition-colors group"
                                    >
                                        <div className="p-2 bg-gray-100 group-hover:bg-[#ff4d6d] group-hover:text-white text-gray-500 rounded-xl transition-all">
                                            <action.icon size={14} />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs font-black text-gray-800">{action.label}</p>
                                            <p className="text-[10px] text-gray-400">{action.sub}</p>
                                        </div>
                                        <ArrowUpRight size={14} className="text-gray-300 group-hover:text-[#ff4d6d] transition-colors flex-shrink-0" />
                                    </Link>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
};

export default SellerDashboard;