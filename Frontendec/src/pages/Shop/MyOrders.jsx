import React, { useEffect, useState } from 'react';
import { Package, Clock, CheckCircle, Truck, MapPin, ShoppingBag, Download, FileText } from 'lucide-react';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { generateInvoice } from '../../utils/generateInvoice'; // ✅ Invoice util

const STATUS_CONFIG = {
    processing: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200', icon: Clock },
    shipped: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200', icon: Truck },
    delivered: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200', icon: CheckCircle },
    cancelled: { bg: 'bg-red-50', text: 'text-red-500', border: 'border-red-200', icon: Package },
};
const getStatusStyle = (s) => STATUS_CONFIG[s?.toLowerCase()] || STATUS_CONFIG.processing;

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        API.get('/orders/myorders')
            .then(({ data }) => { if (data.success) setOrders(data.orders); })
            .catch(() => toast.error('Orders load nahi hue!'))
            .finally(() => setLoading(false));
    }, []);

    const handleInvoice = (order) => {
        try {
            generateInvoice(order);
            toast.success('Invoice download ho rahi hai!');
        } catch (e) {
            console.error(e);
            toast.error('Invoice generate nahi hui!');
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
            <div className="text-center space-y-3">
                <div className="w-10 h-10 border-4 border-[#ff4d6d] border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Loading your orders...</p>
            </div>
        </div>
    );

    return (
        <div className="p-4 md:p-8 bg-[#fafafa] min-h-screen">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8 flex items-center justify-between border-b border-gray-100 pb-6">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black text-gray-900 italic uppercase tracking-tighter flex items-center gap-3">
                            <Package className="text-[#ff4d6d]" size={32} /> My Orders
                        </h1>
                        <p className="text-gray-400 font-bold mt-1 uppercase text-xs tracking-widest">Track and manage your purchases</p>
                    </div>
                    <div className="bg-white px-5 py-3 rounded-2xl shadow-sm border border-gray-100 text-center">
                        <p className="text-[#ff4d6d] font-black text-2xl">{orders.length}</p>
                        <p className="text-gray-400 font-black text-[10px] uppercase tracking-widest">Orders</p>
                    </div>
                </header>

                <div className="space-y-5">
                    {orders.length > 0 ? orders.map((order) => {
                        const style = getStatusStyle(order.orderStatus);
                        const StatusIcon = style.icon;
                        const isDelivered = order.orderStatus?.toLowerCase() === 'delivered';

                        return (
                            <div key={order._id} className={`bg-white rounded-[2rem] border overflow-hidden hover:shadow-lg transition-all duration-300 ${isDelivered ? 'border-green-100' : 'border-gray-100'}`}>

                                {/* Meta Bar */}
                                <div className={`px-6 py-4 flex flex-wrap justify-between items-center gap-3 border-b ${isDelivered ? 'bg-green-50/40 border-green-100' : 'bg-gray-50/60 border-gray-100'}`}>
                                    <div className="flex flex-wrap gap-5">
                                        <div>
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Order Placed</p>
                                            <p className="font-bold text-gray-700 text-sm">
                                                {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Total</p>
                                            <p className="font-black text-[#ff4d6d] text-sm">₹{order.totalAmount?.toLocaleString('en-IN')}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Order ID</p>
                                            <p className="font-bold text-gray-500 text-sm">#{order._id.slice(-8).toUpperCase()}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Payment</p>
                                            <p className={`font-black text-xs uppercase ${order.paymentStatus === 'Completed' ? 'text-green-600' : order.paymentStatus === 'Cancelled' ? 'text-red-500' : 'text-amber-600'}`}>
                                                {order.paymentMethod} · {order.paymentStatus}
                                            </p>
                                        </div>
                                    </div>
                                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${style.bg} ${style.text} ${style.border}`}>
                                        <StatusIcon size={13} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">{order.orderStatus}</span>
                                    </div>
                                </div>

                                {/* Items */}
                                <div className="p-6">
                                    <div className="space-y-4">
                                        {order.items?.map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-4">
                                                <div className="w-16 h-16 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 flex-shrink-0">
                                                    {item.product?.images?.[0]
                                                        ? <img src={item.product.images[0]} className="w-full h-full object-cover" alt={item.product?.name} onError={(e) => { e.target.style.display = 'none'; }} />
                                                        : <div className="w-full h-full flex items-center justify-center"><ShoppingBag size={20} className="text-gray-300" /></div>
                                                    }
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-black text-gray-800 italic uppercase text-sm leading-tight truncate">{item.product?.name || 'Product'}</h3>
                                                    <p className="text-xs font-bold text-gray-400 uppercase mt-0.5">Qty: {item.quantity}</p>
                                                </div>
                                                <div className="text-right flex-shrink-0">
                                                    <p className="font-black text-gray-800">₹{item.price}</p>
                                                    <p className="text-[10px] text-gray-400 font-bold">× {item.quantity} = ₹{item.price * item.quantity}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Footer */}
                                    <div className="mt-6 pt-5 border-t border-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                                        <div className="flex items-start gap-3 max-w-xs">
                                            <MapPin size={16} className="text-[#ff4d6d] flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Delivering To</p>
                                                <p className="text-sm font-bold leading-relaxed text-gray-600">{order.shippingAddress || 'N/A'}</p>
                                            </div>
                                        </div>

                                        {/* ✅ Invoice button — sirf delivered orders pe */}
                                        {isDelivered ? (
                                            <button
                                                onClick={() => handleInvoice(order)}
                                                className="group flex-shrink-0 flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-3 rounded-2xl font-black text-[11px] uppercase tracking-wider transition-all active:scale-95 shadow-lg shadow-green-200 whitespace-nowrap"
                                            >
                                                <Download size={14} className="group-hover:animate-bounce" />
                                                Download Invoice
                                            </button>
                                        ) : (
                                            <div className="flex-shrink-0 flex items-center gap-2 bg-gray-100 text-gray-400 px-5 py-3 rounded-2xl font-black text-[11px] uppercase tracking-wider whitespace-nowrap cursor-not-allowed">
                                                <FileText size={14} />
                                                Invoice on Delivery
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Delivered bottom banner */}
                                {isDelivered && (
                                    <div className="bg-green-500 px-6 py-2 flex items-center justify-center gap-2">
                                        <CheckCircle size={13} className="text-white" />
                                        <span className="text-white font-black text-[10px] uppercase tracking-widest">
                                            Order Delivered — Invoice Ready to Download
                                        </span>
                                    </div>
                                )}
                            </div>
                        );
                    }) : (
                        <div className="py-24 bg-white rounded-[3rem] border-4 border-dashed border-gray-100 flex flex-col items-center justify-center gap-4">
                            <Package size={56} className="text-gray-200" />
                            <h3 className="text-xl font-black text-gray-300 italic uppercase tracking-widest">No Orders Yet</h3>
                            <p className="text-gray-300 text-sm font-bold">Kuch order karo! 🛍️</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyOrders;