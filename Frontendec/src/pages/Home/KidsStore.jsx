"use client";
import React, { useState } from 'react';
import { ChevronRight, Star } from 'lucide-react';

const kidsData = {
    "NUTRITION": [
        { id: 1, name: "Grow Buddy Powermix", price: 599, rating: 4.6, img: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=400" },
        { id: 2, name: "SuperTots Gummies", price: 499, rating: 4.6, img: "https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?q=80&w=400" },
        { id: 3, name: "Immuno Fizz", price: 399, rating: 4.6, img: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=400" },
    ],
    "PERSONAL CARE": [
        { id: 4, name: "Gentle Kids Wash", price: 299, rating: 4.8, img: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=400" },
    ]
};

const KidsStore = () => {
    const [activeTab, setActiveTab] = useState("NUTRITION");

    return (
        <section className="py-16 bg-white w-full">
            <div className="max-w-[1400px] mx-auto px-6 md:px-10">
                <div className="flex justify-between items-end mb-6">
                    <h2 className="text-3xl md:text-5xl font-black italic text-[#004d2c] tracking-tighter uppercase leading-none">
                        Thoughtfully Crafted For Kids
                    </h2>
                    <button className="text-[#4ade80] font-bold text-xs flex items-center gap-1 uppercase">
                        SHOP ALL <ChevronRight size={14} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-8 border-b border-gray-100 mb-10">
                    {Object.keys(kidsData).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`text-sm font-black pb-4 transition-all tracking-widest ${activeTab === tab ? "text-[#004d2c] border-b-4 border-[#4ade80]" : "text-gray-300"}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {kidsData[activeTab].map(product => (
                        <div key={product.id} className="group">
                            <div className="relative aspect-square rounded-3xl overflow-hidden bg-gray-50 border border-gray-100">
                                <img src={product.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            </div>
                            <div className="p-4 text-center">
                                <h3 className="font-extrabold text-[#004d2c] text-sm uppercase mb-1">{product.name}</h3>
                                <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-gray-500">
                                    <Star size={12} className="fill-yellow-400 text-yellow-400" /> {product.rating} | Nutrition
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default KidsStore;