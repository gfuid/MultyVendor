"use client";
import React, { useRef, useState } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

const categories = ["WEIGHT", "NEW LAUNCHES", "KIDS", "SKIN", "HAIR", "DAILY WELLNESS", "PERFORMANCE"];

const BestSellers = () => {
    // Pure JS: Ref and state without TS annotations
    const scrollRef = useRef(null);
    const [activeTab, setActiveTab] = useState("WEIGHT");

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollAmount = clientWidth * 0.8;
            const scrollTo = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
            scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    return (
        <section className="py-12 bg-white w-full font-sans overflow-hidden">
            <div className="max-w-[1400px] mx-auto px-4 md:px-10">

                {/* Title & Shop All */}
                <div className="flex justify-between items-end mb-8">
                    <h2 className="text-4xl md:text-5xl font-black italic text-[#004d2c] tracking-tighter uppercase leading-none">
                        Best Sellers
                    </h2>
                    <button className="text-[#4ade80] font-bold text-xs flex items-center gap-1 hover:opacity-80 transition-opacity uppercase">
                        SHOP ALL <ChevronRight size={14} strokeWidth={3} />
                    </button>
                </div>

                {/* Tabs with no-scrollbar */}
                <div className="flex gap-8 border-b border-gray-100 mb-10 overflow-x-auto no-scrollbar scroll-smooth">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveTab(cat)}
                            className={`text-xs font-black pb-3 transition-all whitespace-nowrap tracking-wider ${activeTab === cat
                                    ? "text-[#004d2c] border-b-4 border-[#4ade80]"
                                    : "text-gray-300 hover:text-gray-500"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Slider Wrapper */}
                <div className="relative group">
                    {/* Left Nav */}
                    <button
                        onClick={() => scroll('left')}
                        className="absolute -left-2 md:-left-5 top-1/2 -translate-y-1/2 z-30 bg-white shadow-xl rounded-full p-2 border border-gray-100 hover:scale-110 transition-transform hidden md:flex items-center justify-center group-hover:bg-white"
                    >
                        <ChevronLeft className="text-[#4ade80]" size={24} strokeWidth={3} />
                    </button>

                    {/* Product Grid (Horizontal Scroll) */}
                    <div
                        ref={scrollRef}
                        className="flex overflow-x-auto gap-4 md:gap-6 no-scrollbar snap-x snap-mandatory pb-4"
                    >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <div
                                key={i}
                                className="min-w-[85%] sm:min-w-[45%] lg:min-w-[23%] snap-start bg-white rounded-[2rem] border border-gray-100 overflow-hidden group/card shadow-sm hover:shadow-lg transition-all duration-300"
                            >
                                {/* Image Holder */}
                                <div className="relative h-64 md:h-72 bg-[#fcf9f4] p-6 flex items-center justify-center overflow-hidden">
                                    <span className="absolute top-4 left-4 bg-[#fde6d2] text-[#854d0e] text-[10px] font-black px-2 py-1 rounded shadow-sm uppercase z-10">Best Seller</span>
                                    <span className="absolute top-4 right-4 bg-[#dcfce7] text-[#166534] text-[10px] font-black px-2 py-1 rounded shadow-sm z-10">-15%</span>

                                    {/* Placeholder Image with Hover Effect */}
                                    <div className="w-full h-full bg-zinc-200 rounded-xl flex items-center justify-center text-zinc-400 font-bold group-hover/card:scale-105 transition-transform duration-500">
                                        Product Img
                                    </div>
                                </div>

                                {/* Product Details */}
                                <div className="p-5 text-center">
                                    <h3 className="font-extrabold text-gray-800 text-lg mb-2 leading-tight uppercase tracking-tight">
                                        Plant Protein Gold
                                    </h3>
                                    <div className="flex items-center justify-center gap-1.5 mb-5 text-xs font-bold">
                                        <Star size={14} className="fill-yellow-400 text-yellow-400" />
                                        <span className="text-gray-700">4.9</span>
                                        <span className="text-gray-200 mx-1">|</span>
                                        <span className="text-gray-400 uppercase tracking-tighter">{activeTab}</span>
                                    </div>
                                    <button className="w-full bg-[#e6ffed] text-[#004d2c] py-3 rounded-2xl font-black text-xs uppercase hover:bg-[#4ade80] hover:text-white transition-all shadow-sm active:scale-95">
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right Nav */}
                    <button
                        onClick={() => scroll('right')}
                        className="absolute -right-2 md:-right-5 top-1/2 -translate-y-1/2 z-30 bg-white shadow-xl rounded-full p-2 border border-gray-100 hover:scale-110 transition-transform hidden md:flex items-center justify-center group-hover:bg-white"
                    >
                        <ChevronRight className="text-[#4ade80]" size={24} strokeWidth={3} />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default BestSellers;