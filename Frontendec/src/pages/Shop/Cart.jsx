import React from 'react';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const Cart = () => {
    // Mock data: In real app, get this from your Zustand 'useCartStore'
    const cartItems = [
        { id: 1, name: "Glow Skin Serum", price: 599, qty: 1, seller: "BeautyStore", img: "https://via.placeholder.com/100" },
        { id: 2, name: "Kids Protein Mix", price: 1200, qty: 2, seller: "NutriKids", img: "https://via.placeholder.com/100" }
    ];

    const total = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="max-w-6xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-2">
                    <ShoppingBag className="text-[#ff4d6d]" /> YOUR BAG
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Items List */}
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map((item) => (
                            <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex gap-6">
                                <img src={item.img} alt={item.name} className="w-24 h-24 rounded-xl object-cover" />

                                <div className="flex-1">
                                    <div className="flex justify-between">
                                        <h3 className="font-bold text-lg text-gray-800">{item.name}</h3>
                                        <button className="text-gray-400 hover:text-red-500 transition">
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <p className="text-xs text-[#ff4d6d] font-bold uppercase tracking-wider mb-2">
                                        Seller: {item.seller}
                                    </p>

                                    <div className="flex justify-between items-center mt-4">
                                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                                            <button className="p-2 hover:bg-gray-50"><Minus className="w-4 h-4" /></button>
                                            <span className="px-4 font-bold">{item.qty}</span>
                                            <button className="p-2 hover:bg-gray-50"><Plus className="w-4 h-4" /></button>
                                        </div>
                                        <p className="text-xl font-black text-gray-900">₹{item.price * item.qty}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right: Order Summary */}
                    <div className="bg-white p-8 rounded-2xl shadow-lg border border-pink-100 h-fit sticky top-24">
                        <h2 className="text-xl font-bold mb-6">Order Summary</h2>
                        <div className="space-y-4 border-b pb-6">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>₹{total}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Shipping</span>
                                <span className="text-green-600 font-bold">FREE</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center py-6">
                            <span className="text-lg font-bold">Total Amount</span>
                            <span className="text-2xl font-black text-[#ff4d6d]">₹{total}</span>
                        </div>
                        <Link to="/checkout">
                            <button className="w-full bg-[#ff4d6d] text-white py-4 rounded-xl font-black uppercase flex items-center justify-center gap-2 hover:bg-[#ff7096] transition-all shadow-lg shadow-pink-100">
                                Checkout Now <ArrowRight className="w-5 h-5" />
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;