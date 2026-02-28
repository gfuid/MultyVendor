"use client";
import React, { useRef, useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, Package, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore.js';
import API from '../../api/axios';
import toast from 'react-hot-toast';

const BestSellers = () => {
    const scrollRef = useRef(null);
    const navigate = useNavigate();
    const { user, updateCart } = useAuthStore();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // 1. Fetch Products from Backend
    useEffect(() => {
        const fetchAllProducts = async () => {
            try {
                const { data } = await API.get('/products');
                setProducts(data.products || data);
                setLoading(false);
            } catch (err) {
                toast.error("Global products load nahi ho paye");
                setLoading(false);
            }
        };
        fetchAllProducts();
    }, []);

    // 2. Add to Cart Logic
    const handleAddToCart = async (product) => {
        if (!user) {
            toast.error("frist login then add to cart");
            return navigate('/login');
        }

        const loadToast = toast.loading(`Adding ${product.name}...`);
        try {
            const { data } = await API.post('/cart/add', {
                productId: product._id,
                quantity: 1
            });

            if (data.success) {
                if (updateCart) {
                    updateCart(data.cart); // Global sync
                }
                toast.success("Added to cart! 🛒", { id: loadToast });
            }
        } catch (err) {
            const errMsg = err.response?.data?.message || "Something went wrong";
            toast.error(errMsg, { id: loadToast });
        }
    };

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollAmount = clientWidth * 0.8;
            const scrollTo = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
            scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    if (loading) return (
        <div className="py-20 text-center font-black italic text-gray-400 animate-pulse uppercase">
            Syncing Marketplace...
        </div>
    );

    return (
        <section className="py-12 bg-white w-full font-sans overflow-hidden">
            <div className="max-w-[1400px] mx-auto px-4 md:px-10">

                {/* Header Section */}
                <div className="flex justify-between items-end mb-8 border-b-4 border-[#e6ffed] pb-4">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-black italic text-[#004d2c] tracking-tighter uppercase leading-none">
                            Best Sellers
                        </h2>
                        <p className="text-xs font-bold text-gray-400 mt-2 uppercase tracking-widest">Trending across all vendors</p>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => scroll('left')} className="p-2 bg-white border border-gray-100 rounded-full hover:bg-gray-50 shadow-sm"><ChevronLeft size={20} /></button>
                        <button onClick={() => scroll('right')} className="p-2 bg-white border border-gray-100 rounded-full hover:bg-gray-50 shadow-sm"><ChevronRight size={20} /></button>
                    </div>
                </div>

                {/* Products Slider */}
                <div ref={scrollRef} className="flex overflow-x-auto gap-6 no-scrollbar snap-x snap-mandatory pb-6">
                    {products.length > 0 ? products.map((product) => (
                        <div key={product._id} className="min-w-[85%] sm:min-w-[45%] lg:min-w-[23%] snap-start bg-white rounded-[2.5rem] border-2 border-gray-50 overflow-hidden group shadow-sm hover:shadow-2xl transition-all duration-500">

                            {/* Clickable Image Section */}
                            <div
                                className="relative h-64 bg-[#fcf9f4] overflow-hidden cursor-pointer"
                                onClick={() => navigate(`/product/${product._id}`)} // Fixed: Backticks
                            >
                                <img
                                    src={product.images && product.images[0]}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-[#004d2c] text-[10px] font-black px-3 py-1 rounded-full shadow-sm uppercase z-10">
                                    {product.category}
                                </span>
                            </div>

                            <div className="p-6">
                                {/* Clickable Name */}
                                <h3
                                    className="font-black text-gray-800 text-xl mb-1 uppercase tracking-tighter italic truncate cursor-pointer hover:text-[#004d2c] transition-colors"
                                    onClick={() => navigate(`/product/${product._id}`)} // Fixed: Backticks
                                >
                                    {product.name}
                                </h3>

                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-1 text-xs font-bold">
                                        <Star size={14} className="fill-yellow-400 text-yellow-400" />
                                        <span className="text-gray-700">4.8</span>
                                    </div>
                                    <div className="text-lg font-black text-[#004d2c] italic uppercase">
                                        ₹{product.price}
                                    </div>
                                </div>

                                {/* Amazon Style Professional Button */}
                                <button
                                    onClick={() => handleAddToCart(product)}
                                    className="w-full bg-[#004d2c] text-white py-4 rounded-2xl font-black text-xs uppercase flex items-center justify-center gap-2 hover:bg-[#4ade80] transition-all transform active:scale-95 shadow-lg shadow-green-50"
                                >
                                    <ShoppingCart size={16} /> Add to Cart
                                </button>
                            </div>
                        </div>
                    )) : (
                        <div className="w-full py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center">
                            <Package size={48} className="text-gray-300 mb-4" />
                            <p className="font-black italic text-gray-400 uppercase tracking-widest">No Products Found</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default BestSellers;