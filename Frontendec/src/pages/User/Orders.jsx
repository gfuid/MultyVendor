import React from 'react';
import { Package, ChevronRight, Truck } from 'lucide-react';

const Orders = () => {
    const orders = [
        { id: "ORD-9921", date: "Feb 10, 2026", total: 1200, status: "Shipped", items: 2 },
        { id: "ORD-8854", date: "Jan 25, 2026", total: 599, status: "Delivered", items: 1 }
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-900 mb-8">My Orders</h1>

                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:border-[#ff4d6d] transition-all group">
                            <div className="flex flex-wrap justify-between items-center gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="bg-pink-50 p-3 rounded-full">
                                        <Package className="text-[#ff4d6d] w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">Order #{order.id}</h4>
                                        <p className="text-sm text-gray-500">{order.date}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-8">
                                    <div className="text-right">
                                        <p className="text-xs text-gray-400 uppercase font-bold">Total</p>
                                        <p className="font-black text-gray-900">₹{order.total}</p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                            }`}>
                                            {order.status}
                                        </span>
                                        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#ff4d6d] transition-transform group-hover:translate-x-1" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Orders;