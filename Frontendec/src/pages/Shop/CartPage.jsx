import React, { useEffect, useState, useMemo } from 'react';
import { ShoppingBag, ArrowRight, Trash2, Plus, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import useAuthStore from '../../store/authStore.js';
import toast from 'react-hot-toast';
import AddressSection from './AddressSection';

const CartPage = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);

    const [addressData, setAddressData] = useState({
        phone: "",
        houseNo: "",
        street: "",
        city: "",
        pincode: ""
    });

    const navigate = useNavigate();
    const { updateCart } = useAuthStore();

    // Total Bill Calculation
    const totalBill = useMemo(() => {
        return cart?.items?.reduce((acc, item) =>
            acc + (Number(item.product?.price || 0) * Number(item.quantity || 0)), 0) || 0;
    }, [cart]);

    // 1. Fetch Cart
    const fetchCart = async () => {
        try {
            const { data } = await API.get('/cart');
            setCart(data);
            if (updateCart) updateCart(data);
        } catch (err) {
            toast.error("Cart load nahi hua!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCart(); }, []);

    // 2. Update Quantity
    const updateQuantity = async (productId, currentQty, delta) => {
        const newQty = currentQty + delta;
        if (newQty < 1) return;
        try {
            const { data } = await API.put('/cart/update', { productId, quantity: newQty, action: 'update' });
            setCart(data.cart);
            if (updateCart) updateCart(data.cart);
        } catch (err) {
            toast.error("Update fail!");
        }
    };

    // 3. Remove Item
    const removeItem = async (productId) => {
        try {
            const { data } = await API.put('/cart/update', { productId, action: 'delete' });
            setCart(data.cart);
            if (updateCart) updateCart(data.cart);
            toast.success("Item hata diya!");
        } catch (err) {
            toast.error("Remove fail!");
        }
    };

    // 4. Proceed to Checkout — address validate karke checkout page pe le jaao
    const handleProceedToCheckout = () => {
        const { phone, houseNo, street, city, pincode } = addressData;
        if (!phone || !houseNo || !street || !city || !pincode) {
            return toast.error("Pehle saare delivery details bhariye!");
        }
        // Cart aur address data checkout page pe bhej rahe hain
        navigate('/checkout', {
            state: {
                addressData,
                cart,
                totalBill
            }
        });
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center font-black animate-pulse text-[#ff4d6d] text-2xl">
            SYNCING BAG...
        </div>
    );

    const isAddressIncomplete = !addressData.phone || !addressData.houseNo || !addressData.city || !addressData.pincode;

    return (
        <div className="p-4 md:p-10 bg-[#fafafa] min-h-screen">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

                {/* LEFT: CART ITEMS */}
                <div className="lg:col-span-8 space-y-6">
                    <header className="flex items-center justify-between border-b border-gray-100 pb-6">
                        <h1 className="text-3xl md:text-4xl font-black italic text-gray-800 flex items-center gap-4">
                            <ShoppingBag className="text-[#ff4d6d]" size={36} />
                            YOUR BAG
                        </h1>
                        <span className="bg-pink-50 text-[#ff4d6d] px-4 py-1 rounded-full font-black text-xs uppercase">
                            {cart?.items?.length || 0} ITEMS
                        </span>
                    </header>

                    {cart?.items?.length > 0 ? (
                        cart.items.map((item) => (
                            <div
                                key={item.product?._id}
                                className="bg-white p-5 rounded-[2.5rem] border border-gray-100 flex items-center gap-6 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <img
                                    src={item.product?.images?.[0] || 'https://via.placeholder.com/150'}
                                    className="w-24 h-24 rounded-3xl object-cover bg-gray-50"
                                    alt={item.product?.name}
                                />
                                <div className="flex-1">
                                    <h3 className="font-black text-gray-800 uppercase italic text-lg leading-tight">
                                        {item.product?.name}
                                    </h3>
                                    <p className="text-[#ff4d6d] font-black text-xl mt-1">
                                        ₹{item.product?.price}
                                    </p>
                                </div>
                                <div className="flex items-center gap-4 bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100 font-bold">
                                    <button
                                        className="hover:text-[#ff4d6d] transition-colors"
                                        onClick={() => updateQuantity(item.product?._id, item.quantity, -1)}
                                    >
                                        <Minus size={18} strokeWidth={3} />
                                    </button>
                                    <span className="text-xl w-8 text-center">{item.quantity}</span>
                                    <button
                                        className="hover:text-[#ff4d6d] transition-colors"
                                        onClick={() => updateQuantity(item.product?._id, item.quantity, 1)}
                                    >
                                        <Plus size={18} strokeWidth={3} />
                                    </button>
                                </div>
                                <button
                                    onClick={() => removeItem(item.product?._id)}
                                    className="text-gray-300 hover:text-red-500 p-2 transition-colors"
                                >
                                    <Trash2 size={24} />
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 bg-white rounded-[3rem] border-4 border-dashed border-gray-100 font-black text-gray-300 uppercase tracking-widest italic">
                            Your bag is empty!
                        </div>
                    )}
                </div>

                {/* RIGHT: ADDRESS + ORDER SUMMARY */}
                <div className="lg:col-span-4 space-y-6 sticky top-28">

                    {/* Address Section */}
                    <AddressSection addressData={addressData} setAddressData={setAddressData} />

                    {/* Order Summary */}
                    <div className="bg-black text-white p-8 rounded-[3rem] shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff4d6d] opacity-10 rounded-full -mr-16 -mt-16" />

                        <div className="space-y-4 relative z-10">
                            <div className="flex justify-between font-bold text-gray-400 text-[10px] tracking-widest uppercase">
                                <span>Subtotal</span>
                                <span>₹{totalBill}</span>
                            </div>
                            <div className="flex justify-between font-bold text-gray-400 text-[10px] tracking-widest uppercase">
                                <span>Shipping</span>
                                <span className="text-green-400 font-black">FREE</span>
                            </div>
                            <div className="flex justify-between items-end pt-6 border-t border-white/10">
                                <span className="font-black uppercase italic text-sm text-gray-400">Total Bill</span>
                                <span className="text-4xl font-black text-[#ff4d6d] italic tracking-tighter">
                                    ₹{totalBill}
                                </span>
                            </div>
                        </div>

                        {/* Proceed to Checkout Button */}
                        <button
                            onClick={handleProceedToCheckout}
                            disabled={!cart?.items?.length || isAddressIncomplete}
                            className={`w-full mt-8 py-5 rounded-3xl font-black uppercase tracking-widest italic flex items-center justify-center gap-3 transition-all transform active:scale-95 shadow-xl
                                ${!cart?.items?.length || isAddressIncomplete
                                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                    : 'bg-[#ff4d6d] text-white hover:bg-white hover:text-black'
                                }`}
                        >
                            {isAddressIncomplete && cart?.items?.length > 0
                                ? "Fill Address First"
                                : "Proceed to Checkout"
                            }
                            <ArrowRight size={22} />
                        </button>

                        <p className="text-[9px] text-center text-gray-600 mt-4 uppercase font-bold tracking-tighter">
                            Secure Cash on Delivery
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CartPage;