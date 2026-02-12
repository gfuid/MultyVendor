"use client";
import React from 'react';
import { ChevronRight, ShoppingCart, Sparkles } from 'lucide-react';

const budgetProducts = [
    { id: 1, name: "Mini Face Wash", price: 199, oldPrice: 249, img: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=400", tag: "NEW" },
    { id: 2, name: "Travel Serum", price: 299, oldPrice: 399, img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=400", tag: "HOT" },
    { id: 3, name: "Protein Sachet", price: 99, oldPrice: 149, img: "https://images.unsplash.com/photo-1593095191071-82b0fdf983a1?q=80&w=400", tag: "SALE" },
    { id: 4, name: "Sample Kit", price: 249, oldPrice: 299, img: "https://images.unsplash.com/photo-1549049950-48d5887197a0?q=80&w=400", tag: "BEST" },
];

const BudgetStore = () => {
    const addToCart = (product) => {
        console.log("Added to cart:", product.name);
    };

    return (
        <section className="py-8 md:py-12 bg-white w-full overflow-hidden">
            <div className="max-w-[1300px] mx-auto px-4 md:px-6">

                {/* 1. Slim & Fixed Hero Banner */}
                <div className="relative bg-[#004d2c] rounded-[2rem] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between mb-10 shadow-xl overflow-hidden border-2 border-[#4ade80]/10 min-h-[180px] md:min-h-[220px]">

                    {/* Decorative Elements (Size Reduced for Layout) */}
                    <Sparkles className="absolute top-5 right-10 text-[#4ade80]/10 animate-pulse" size={60} />
                    <div className="absolute -bottom-5 -left-5 w-24 h-24 bg-[#4ade80] rounded-full blur-[50px] opacity-20"></div>

                    <div className="z-10 text-center md:text-left">
                        <span className="bg-[#4ade80] text-[#004d2c] px-3 py-0.5 rounded-full text-[10px] font-black uppercase mb-2 inline-block">
                            Budget Deals
                        </span>
                        <h2 className="text-3xl md:text-5xl font-black italic text-white tracking-tighter uppercase leading-none">
                            UNDER <span className="text-[#4ade80]">₹299</span>
                        </h2>
                        <p className="mt-2 text-white/60 font-medium text-xs md:text-sm uppercase tracking-widest">
                            Premium Care. Budget Prices.
                        </p>
                    </div>

                    <button className="mt-4 md:mt-0 z-10 bg-[#4ade80] text-[#004d2c] px-6 py-3 rounded-xl font-black uppercase text-xs shadow-lg hover:bg-white transition-all flex items-center gap-2 group">
                        SHOP DEALS <ChevronRight size={16} />
                    </button>
                </div>

                {/* 2. Compact Product Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {budgetProducts.map((product) => (
                        <div key={product.id} className="group flex flex-col h-full">
                            <div className="relative aspect-square rounded-[1.5rem] overflow-hidden bg-[#f8f9fa] border border-gray-100 shadow-sm transition-all duration-300 group-hover:shadow-md">

                                {/* Small Sticker */}
                                <div className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-md text-[9px] font-black text-[#004d2c] shadow-sm">
                                    {product.tag}
                                </div>

                                <img
                                    src={product.img}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />

                                {/* Compact Add Button */}
                                <div className="absolute inset-x-0 bottom-3 px-3 translate-y-12 group-hover:translate-y-0 transition-transform duration-300">
                                    <button
                                        onClick={() => addToCart(product)}
                                        className="w-full bg-[#004d2c] text-white py-2.5 rounded-xl font-bold text-[10px] uppercase shadow-lg flex items-center justify-center gap-2"
                                    >
                                        <ShoppingCart size={12} /> Add
                                    </button>
                                </div>
                            </div>

                            {/* Aligned Info Section */}
                            <div className="mt-3 text-center flex-grow">
                                <h3 className="font-bold text-[#004d2c] text-xs md:text-sm uppercase truncate px-2">
                                    {product.name}
                                </h3>
                                <div className="flex items-center justify-center gap-2 mt-1">
                                    <span className="text-sm md:text-lg font-black text-black">₹{product.price}</span>
                                    <span className="text-[10px] text-gray-400 line-through">₹{product.oldPrice}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BudgetStore;