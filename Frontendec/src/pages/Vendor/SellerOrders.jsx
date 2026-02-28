import React, { useEffect, useState, useMemo } from 'react';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import {
    Package, Search, ChevronDown, Loader2,
    Eye, X, MapPin, User, ShoppingBag,
    TrendingUp, Clock, CheckCircle, XCircle, Truck
} from 'lucide-react';

// ─── Status Config ───────────────────────────────────────────
const STATUS_CONFIG = {
    processing: { label: 'Processing', color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200', icon: Clock },
    shipped: { label: 'Shipped', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', icon: Truck },
    delivered: { label: 'Delivered', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', icon: CheckCircle },
    cancelled: { label: 'Cancelled', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', icon: XCircle },
};

// ─── Status Badge Component ───────────────────────────────────
const StatusBadge = ({ status }) => {
    const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.processing;
    const Icon = cfg.icon;
    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${cfg.color} ${cfg.bg} ${cfg.border}`}>
            <Icon size={11} strokeWidth={3} />
            {cfg.label}
        </span>
    );
};

// ─── Stats Card Component ─────────────────────────────────────
const StatsCard = ({ label, value, icon: Icon, color }) => (
    <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
        <div className={`p-3 rounded-2xl ${color}`}>
            <Icon size={22} className="text-white" />
        </div>
        <div>
            <p className="text-2xl font-black text-gray-800">{value}</p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
        </div>
    </div>
);

// ─── Main Component ───────────────────────────────────────────
const SellerOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [updatingId, setUpdatingId] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);

    // ── Fetch Orders ──────────────────────────────────────────
    const fetchOrders = async () => {
        try {
            const { data } = await API.get('/orders/seller/dashboard');
            setOrders(data.orders || []);
        } catch (err) {
            toast.error('Orders load failed!');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchOrders(); }, []);

    // ── Status Update ─────────────────────────────────────────
    const handleStatusChange = async (orderId, newStatus) => {
        setUpdatingId(orderId);
        try {
            await API.put(`/orders/${orderId}/status`, { status: newStatus });
            toast.success(`Order ${STATUS_CONFIG[newStatus]?.label || newStatus} ho gaya!`);
            setOrders(prev =>
                prev.map(o => o._id === orderId ? { ...o, orderStatus: newStatus } : o)
            );
            // Agar modal open hai toh woh bhi update karo
            if (selectedOrder?._id === orderId) {
                setSelectedOrder(prev => ({ ...prev, orderStatus: newStatus }));
            }
        } catch (err) {
            toast.error('Status update fail! Check the permission.');
        } finally {
            setUpdatingId(null);
        }
    };

    // ── Stats Calculation ─────────────────────────────────────
    const stats = useMemo(() => ({
        total: orders.length,
        processing: orders.filter(o => o.orderStatus === 'processing').length,
        shipped: orders.filter(o => o.orderStatus === 'shipped').length,
        delivered: orders.filter(o => o.orderStatus === 'delivered').length,
        cancelled: orders.filter(o => o.orderStatus === 'cancelled').length,
        revenue: orders
            .filter(o => o.orderStatus !== 'cancelled')
            .reduce((acc, o) => acc + (o.totalAmount || 0), 0),
    }), [orders]);

    // ── Filter + Search ───────────────────────────────────────
    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            const matchesFilter = filter === 'all' || order.orderStatus === filter;
            const term = searchTerm.toLowerCase();
            const matchesSearch =
                order._id.toLowerCase().includes(term) ||
                order.buyer?.name?.toLowerCase().includes(term) ||
                order.buyer?.email?.toLowerCase().includes(term);
            return matchesFilter && matchesSearch;
        });
    }, [orders, filter, searchTerm]);

    // ── Loading Screen ────────────────────────────────────────
    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="flex items-center gap-3 text-[#ff4d6d] font-black text-lg animate-pulse">
                <Loader2 className="animate-spin" size={28} />
                Loading Orders...
            </div>
        </div>
    );

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen mt-20">

            {/* ── HEADER ─────────────────────────────────────── */}
            <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
                <div>
                    <h1 className="text-3xl font-black italic uppercase tracking-tighter text-gray-900 flex items-center gap-3">
                        <Package className="text-[#ff4d6d]" size={32} />
                        Seller Dashboard
                    </h1>
                    <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-1">
                        Manage your orders & track revenue
                    </p>
                </div>

                {/* Search + Filter */}
                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                    <div className="relative flex-1 sm:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search by Order ID or Buyer name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 focus:border-black outline-none font-bold text-sm transition-all bg-white"
                        />
                    </div>
                    <div className="relative">
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="appearance-none w-full sm:w-44 pl-5 pr-10 py-3 rounded-2xl border border-gray-200 bg-white font-black uppercase text-xs outline-none cursor-pointer"
                        >
                            <option value="all">All Orders</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                    </div>
                </div>
            </header>

            {/* ── STATS CARDS ────────────────────────────────── */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
                <StatsCard label="Total Orders" value={stats.total} icon={ShoppingBag} color="bg-gray-800" />
                <StatsCard label="Processing" value={stats.processing} icon={Clock} color="bg-yellow-400" />
                <StatsCard label="Shipped" value={stats.shipped} icon={Truck} color="bg-blue-500" />
                <StatsCard label="Delivered" value={stats.delivered} icon={CheckCircle} color="bg-green-500" />
                <StatsCard label="Cancelled" value={stats.cancelled} icon={XCircle} color="bg-red-400" />
                <StatsCard label="Revenue" value={`₹${stats.revenue.toLocaleString()}`} icon={TrendingUp} color="bg-[#ff4d6d]" />
            </div>

            {/* ── ORDERS LIST ────────────────────────────────── */}
            <div className="grid gap-4">
                {filteredOrders.length > 0 ? filteredOrders.map(order => (
                    <div
                        key={order._id}
                        className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-5">

                            {/* Product Image + Basic Info */}
                            <div className="flex items-center gap-4 min-w-0">
                                <img
                                    src={order.items[0]?.product?.images?.[0] || 'https://via.placeholder.com/80'}
                                    className="w-16 h-16 rounded-2xl object-cover bg-gray-50 border border-gray-100 flex-shrink-0"
                                    alt="product"
                                />
                                <div className="min-w-0">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        #{order._id.slice(-8)}
                                    </p>
                                    <p className="font-black text-gray-800 text-base truncate">
                                        {order.buyer?.name || 'Customer'}
                                    </p>
                                    <p className="text-[11px] text-gray-400 font-medium truncate">
                                        {order.buyer?.email}
                                    </p>
                                    <p className="text-[#ff4d6d] font-black text-sm mt-0.5">
                                        ₹{order.totalAmount}
                                    </p>
                                </div>
                            </div>

                            {/* Product Chips */}
                            <div className="flex flex-wrap gap-2 flex-1">
                                {order.items.map((item, idx) => (
                                    <span
                                        key={idx}
                                        className="bg-gray-50 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase text-gray-500 border border-gray-100 flex items-center gap-1"
                                    >
                                        {item.product?.name?.slice(0, 18) || 'Product'}
                                        <span className="text-[#ff4d6d]">×{item.quantity}</span>
                                    </span>
                                ))}
                            </div>

                            {/* Status + Actions */}
                            <div className="flex items-center gap-3 flex-shrink-0">
                                {/* Current Status Badge */}
                                <StatusBadge status={order.orderStatus} />

                                {/* Status Update Dropdown */}
                                <div className="relative w-40">
                                    {updatingId === order._id ? (
                                        <div className="flex items-center justify-center py-2.5 bg-gray-50 rounded-xl border border-gray-100">
                                            <Loader2 className="animate-spin text-[#ff4d6d]" size={16} />
                                        </div>
                                    ) : (
                                        <>
                                            <select
                                                value={order.orderStatus}
                                                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                className="w-full pl-4 pr-8 py-2.5 rounded-xl border-2 border-gray-100 bg-white font-black uppercase text-[10px] tracking-widest outline-none cursor-pointer transition-all appearance-none hover:border-gray-300"
                                            >
                                                <option value="processing">Processing</option>
                                                <option value="shipped">Shipped</option>
                                                <option value="delivered">Delivered</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={13} />
                                        </>
                                    )}
                                </div>

                                {/* View Details Button */}
                                <button
                                    onClick={() => setSelectedOrder(order)}
                                    className="p-2.5 bg-gray-100 hover:bg-black hover:text-white text-gray-500 rounded-xl transition-all"
                                    title="View Details"
                                >
                                    <Eye size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="text-center py-24 bg-white rounded-[3rem] border-4 border-dashed border-gray-100">
                        <Package size={48} className="text-gray-200 mx-auto mb-4" />
                        <p className="font-black text-gray-300 uppercase tracking-widest text-lg italic">
                            No orders found
                        </p>
                        <p className="text-gray-400 text-sm mt-2">Try changing your filter or search term</p>
                    </div>
                )}
            </div>

            {/* ── ORDER DETAILS MODAL ────────────────────────── */}
            {selectedOrder && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
                    onClick={(e) => e.target === e.currentTarget && setSelectedOrder(null)}
                >
                    <div className="bg-white w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl">

                        {/* Modal Header */}
                        <div className="p-6 flex justify-between items-center border-b border-gray-100">
                            <div>
                                <h2 className="text-xl font-black italic uppercase tracking-tighter">
                                    Order Details
                                </h2>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                                    #{selectedOrder._id}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <StatusBadge status={selectedOrder.orderStatus} />
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[60vh] overflow-y-auto">

                            {/* Customer Info */}
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    Customer Info
                                </h4>
                                <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white rounded-xl shadow-sm">
                                            <User size={16} className="text-[#ff4d6d]" />
                                        </div>
                                        <div>
                                            <p className="font-black text-sm text-gray-800">
                                                {selectedOrder.buyer?.name}
                                            </p>
                                            <p className="text-[11px] text-gray-400">
                                                {selectedOrder.buyer?.email}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-white rounded-xl shadow-sm mt-0.5">
                                            <MapPin size={16} className="text-[#ff4d6d]" />
                                        </div>
                                        <p className="text-xs font-medium text-gray-600 leading-relaxed">
                                            {selectedOrder.shippingAddress}
                                        </p>
                                    </div>
                                </div>

                                {/* Payment Info */}
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    Payment
                                </h4>
                                <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-xs text-gray-500 font-bold">Method</span>
                                        <span className="text-xs font-black uppercase text-gray-800">
                                            {selectedOrder.paymentMethod}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-xs text-gray-500 font-bold">Status</span>
                                        <span className={`text-xs font-black uppercase ${selectedOrder.paymentStatus === 'Completed' ? 'text-green-600' :
                                            selectedOrder.paymentStatus === 'Cancelled' ? 'text-red-500' : 'text-yellow-600'
                                            }`}>
                                            {selectedOrder.paymentStatus}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Items + Status Update */}
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    Order Items
                                </h4>
                                <div className="space-y-3">
                                    {selectedOrder.items.map((item, i) => (
                                        <div key={i} className="flex gap-3 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                                            <img
                                                src={item.product?.images?.[0] || 'https://via.placeholder.com/50'}
                                                className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                                                alt={item.product?.name}
                                            />
                                            <div className="min-w-0">
                                                <p className="text-xs font-black uppercase tracking-tight truncate">
                                                    {item.product?.name}
                                                </p>
                                                <p className="text-[11px] font-bold text-[#ff4d6d]">
                                                    ₹{item.price} × {item.quantity}
                                                </p>
                                                <p className="text-[11px] text-gray-400 font-bold">
                                                    Subtotal: ₹{item.price * item.quantity}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Update Status from Modal */}
                                <div>
                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                                        Update Status
                                    </h4>
                                    <div className="relative">
                                        {updatingId === selectedOrder._id ? (
                                            <div className="flex items-center justify-center py-3 bg-gray-50 rounded-xl">
                                                <Loader2 className="animate-spin text-[#ff4d6d]" size={18} />
                                            </div>
                                        ) : (
                                            <>
                                                <select
                                                    value={selectedOrder.orderStatus}
                                                    onChange={(e) => handleStatusChange(selectedOrder._id, e.target.value)}
                                                    className="w-full pl-4 pr-10 py-3 rounded-xl border-2 border-gray-200 bg-white font-black uppercase text-xs tracking-widest outline-none cursor-pointer appearance-none hover:border-gray-400 transition-all"
                                                >
                                                    <option value="processing">Processing</option>
                                                    <option value="shipped">Shipped</option>
                                                    <option value="delivered">Delivered</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-t border-gray-100">
                            <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                    Order Placed
                                </p>
                                <p className="text-xs font-black text-gray-700">
                                    {new Date(selectedOrder.createdAt).toLocaleDateString('en-IN', {
                                        day: 'numeric', month: 'short', year: 'numeric'
                                    })}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] text-gray-400 font-bold uppercase">Total Amount</p>
                                <p className="text-2xl font-black text-[#ff4d6d]">₹{selectedOrder.totalAmount}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SellerOrders;