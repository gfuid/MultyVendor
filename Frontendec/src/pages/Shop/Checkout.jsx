import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle2, CreditCard, Banknote, ArrowLeft } from 'lucide-react';
import API from '../../api/axios';
import useAuthStore from '../../store/authStore.js';
import toast from 'react-hot-toast';

const Checkout = () => {
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const navigate = useNavigate();
    const location = useLocation();
    const { updateCart } = useAuthStore();

    // Cart page se aaya hua data
    const { addressData, cart, totalBill } = location.state || {};

    // Agar koi direct URL se aaya toh cart page pe wapas bhejo
    if (!addressData || !cart) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <p className="text-gray-500 font-bold text-lg">Checkout data missing!</p>
                <button
                    onClick={() => navigate('/cart')}
                    className="bg-[#ff4d6d] text-white px-6 py-3 rounded-xl font-bold"
                >
                    Go Back to Cart
                </button>
            </div>
        );
    }

    const subtotal = totalBill || 0;
    // UPI discount only if Online payment select   ed
    const upiDiscount = paymentMethod === 'Online' ? 20 : 0;
    const total = subtotal - upiDiscount;

    const handlePlaceOrder = async () => {

        if (paymentMethod === "COD") {

            // COD existing flow

            const fullAddress = `${addressData.houseNo}, ${addressData.street}, ${addressData.city}`;

            const { data } = await API.post("/orders", {

                shippingAddress: fullAddress,
                paymentMethod: "COD",
                paymentStatus: "pending"

            });

            if (data.success) {

                toast.success("Order placed");

                updateCart({ items: [] });

                navigate("/orders");

            }

            return;
        }


        // ONLINE PAYMENT FLOW


        // 1. create razorpay order

        const { data } = await API.post("/orders/razorpay", {
            amount: total
        });


        const razorOrder = data.razorOrder;


        // 2. load razorpay

        const options = {

            key: import.meta.env.VITE_RAZORPAY_KEY,

            amount: razorOrder.amount,

            currency: "INR",

            order_id: razorOrder.id,


            handler: async function (response) {

                const fullAddress = `${addressData.houseNo}, ${addressData.street}, ${addressData.city}`;

                // verify payment

                const verifyRes = await API.post(
                    "/orders/verify-payment",
                    {
                        ...response,
                        shippingAddress: fullAddress
                    }
                );


                if (verifyRes.data.success) {

                    toast.success("Payment successful");

                    updateCart({ items: [] });

                    navigate("/orders");

                }

            }

        };


        const rzp = new window.Razorpay(options);

        rzp.open();

    };

    return (
        <div className="min-h-screen bg-[#f9f9f9] pt-28 pb-10 px-4">
            <div className="max-w-6xl mx-auto">

                {/* Back Button */}
                <button
                    onClick={() => navigate('/cart')}
                    className="flex items-center gap-2 text-gray-500 hover:text-[#ff4d6d] font-bold mb-8 transition-colors"
                >
                    <ArrowLeft size={18} />
                    Back to Cart
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* LEFT: PAYMENT METHODS */}
                    <div className="lg:col-span-8 space-y-6">

                        {/* Delivery Address Summary */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-3">
                                Delivering To
                            </h2>
                            <p className="font-bold text-gray-800">
                                {addressData.houseNo}, {addressData.street}, {addressData.city} - {addressData.pincode}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">📞 {addressData.phone}</p>
                        </div>

                        {/* Payment Method Selection */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold mb-6 text-gray-800">Select Payment Method</h2>

                            <div className="space-y-4">
                                {/* COD Option */}
                                <div
                                    onClick={() => setPaymentMethod('COD')}
                                    className={`p-5 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between
                                        ${paymentMethod === 'COD'
                                            ? 'border-pink-500 bg-pink-50/30'
                                            : 'border-gray-100 hover:border-gray-200'
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <Banknote
                                            size={28}
                                            className={paymentMethod === 'COD' ? 'text-pink-500' : 'text-gray-400'}
                                        />
                                        <div>
                                            <p className="font-bold text-gray-800">Cash on Delivery</p>
                                            <p className="text-xs text-gray-500">Pay when you receive your order</p>
                                        </div>
                                    </div>
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center
                                        ${paymentMethod === 'COD' ? 'border-pink-500 bg-pink-500' : 'border-gray-300'}`}>
                                        {paymentMethod === 'COD' && <div className="w-2 h-2 bg-white rounded-full" />}
                                    </div>
                                </div>

                                {/* Online Option */}
                                <div
                                    onClick={() => setPaymentMethod('Online')}
                                    className={`p-5 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between
                                        ${paymentMethod === 'Online'
                                            ? 'border-pink-500 bg-pink-50/30'
                                            : 'border-gray-100 hover:border-gray-200'
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <CreditCard
                                            size={28}
                                            className={paymentMethod === 'Online' ? 'text-pink-500' : 'text-gray-400'}
                                        />
                                        <div>
                                            <p className="font-bold text-gray-800">Pay Online (UPI / Card)</p>
                                            <p className="text-xs text-green-600 font-semibold">🎉 Extra ₹20 discount on UPI</p>
                                        </div>
                                    </div>
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center
                                        ${paymentMethod === 'Online' ? 'border-pink-500 bg-pink-500' : 'border-gray-300'}`}>
                                        {paymentMethod === 'Online' && <div className="w-2 h-2 bg-white rounded-full" />}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: PRICE DETAILS */}
                    <div className="lg:col-span-4">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-32">
                            <h3 className="font-bold text-gray-500 text-sm uppercase tracking-wider mb-4">
                                Price Details
                            </h3>

                            <div className="space-y-3 border-b pb-4">
                                <div className="flex justify-between text-gray-700">
                                    <span>Subtotal ({cart?.items?.length} items)</span>
                                    <span>₹{subtotal}</span>
                                </div>
                                <div className="flex justify-between text-gray-700">
                                    <span>Shipping</span>
                                    <span className="text-green-600 font-bold">FREE</span>
                                </div>
                                {paymentMethod === 'Online' && (
                                    <div className="flex justify-between text-green-600 font-medium">
                                        <span>UPI Discount</span>
                                        <span>- ₹20</span>
                                    </div>
                                )}
                            </div>

                            <div className="pt-4 mb-6">
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-lg">Total Payable</span>
                                    <span className="font-bold text-xl text-pink-600">₹{total}</span>
                                </div>
                                {paymentMethod === 'Online' && (
                                    <div className="mt-2 bg-green-50 p-2 rounded-lg flex items-center gap-2">
                                        <CheckCircle2 size={16} className="text-green-600" />
                                        <span className="text-xs text-green-700 font-bold">
                                            You save ₹20 with UPI!
                                        </span>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={handlePlaceOrder}
                                className="w-full bg-[#ff4d6d] hover:bg-[#e0344f] text-white py-4 rounded-xl font-black text-lg transition-all shadow-md active:scale-95 uppercase tracking-wider"
                            >
                                Place Order →
                            </button>

                            <p className="text-[10px] text-center text-gray-400 mt-3 uppercase font-bold tracking-tighter">
                                Safe & Secure Payment
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Checkout;