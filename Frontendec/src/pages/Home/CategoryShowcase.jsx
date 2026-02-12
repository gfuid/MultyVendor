"use client";
import React from 'react';
import { Star, Plus } from 'lucide-react';

const categoryData = [
    {
        id: "weight",
        title: "weight",
        bannerImg: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=600",
        bgColor: "bg-[#fde2e4]",
        products: [
            { id: 101, name: "Apple Cider Vinegar", price: 1149, oldPrice: 1245, rating: 4.8, pack: "Pack Of 4 Tubes" },
            { id: 102, name: "Apple Cider Vinegar COR Plus", price: 1375, oldPrice: 1500, rating: 4.6, pack: "Pack Of 2" },
            { id: 103, name: "ACV Hot Brew Effervescent", price: 1245, oldPrice: 1400, rating: 4.6, pack: "Pack Of 4" },
        ]
    },
    {
        id: "skin",
        title: "skin",
        bannerImg: "https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?q=80&w=600",
        bgColor: "bg-[#fde2e4]",
        products: [
            { id: 201, name: "Guava Glow Dewy Serum", price: 549, oldPrice: 650, rating: 4.7, discount: "-26%" },
            { id: 202, name: "Pineapple Depigmentation", price: 499, oldPrice: 599, rating: 4.8, discount: "-31%" },
            { id: 203, name: "Vitamin C Brightening", price: 599, oldPrice: 750, rating: 4.5, discount: "-32%" },
        ]
    },
    {
        id: "hair",
        title: "Hair",
        bannerImg: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=600",
        bgColor: "bg-[#f3e8ff]", // Light purple theme for Hair
        products: [
            { id: 301, name: "Flaxseed Keratin Smoothening...", price: 399, oldPrice: 450, rating: 4.7, discount: "-11%" },
            { id: 302, name: "Flaxseed Ultra Smooth Advanced Duo", price: 699, oldPrice: 900, rating: 4.8, discount: "-22%" },
            { id: 303, name: "Rosemary Hair Growth Serum", price: 699, oldPrice: 750, rating: 4.3, discount: "-6%" },
        ]
    },
    {
        id: "performance",
        title: "Performance",
        bannerImg: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=600",
        bgColor: "bg-[#f0fdf4]", // Light green theme for Performance
        products: [
            { id: 401, name: "Super Strength Protein", price: 1899, oldPrice: 2200, rating: 4.9, discount: "-18%" },
            { id: 402, name: "Pre-Workout Energy", price: 749, oldPrice: 899, rating: 4.7, discount: "-16%" },
        ]
    }
];

const CategoryShowcase = () => {
    return (
        <section className="py-12 bg-white">
            <div className="max-w-[1400px] mx-auto px-4 md:px-10 space-y-20">
                {categoryData.map((cat) => (
                    <div key={cat.id} className="flex flex-col lg:flex-row gap-6">

                        {/* 1. Large Promo Banner (Left Side) */}
                        <div className={`relative flex-shrink-0 w-full lg:w-[450px] h-[400px] md:h-[500px] rounded-[2.5rem] overflow-hidden ${cat.bgColor}`}>
                            <div className="absolute top-10 left-10 z-10">
                                <h2 className="text-6xl md:text-7xl font-black italic text-[#e11d48] tracking-tighter uppercase leading-none">
                                    {cat.title}
                                </h2>
                            </div>
                            <img src={cat.bannerImg} alt={cat.title} className="w-full h-full object-cover mix-blend-multiply opacity-90" />
                            <div className="absolute bottom-10 left-10">
                                <button className="bg-white text-[#004d2c] px-8 py-3 rounded-xl font-black text-sm uppercase shadow-xl hover:scale-105 transition-transform">
                                    SHOP ALL
                                </button>
                            </div>
                        </div>

                        {/* 2. Product Grid (Right Side) */}
                        <div className="flex-1 overflow-x-auto no-scrollbar">
                            <div className="flex gap-6 pb-4">
                                {cat.products.map((product) => (
                                    <div key={product.id} className="min-w-[250px] md:min-w-[280px] flex flex-col">
                                        <div className="relative aspect-square rounded-3xl overflow-hidden bg-gray-50 border border-gray-100 group">
                                            {product.discount && (
                                                <span className="absolute top-3 right-3 bg-[#dcfce7] text-[#166534] text-[10px] font-bold px-2 py-1 rounded-md z-10">
                                                    {product.discount}
                                                </span>
                                            )}
                                            <div className="w-full h-full bg-zinc-200 flex items-center justify-center text-zinc-400 font-bold group-hover:scale-105 transition-transform">
                                                Product Image
                                            </div>
                                        </div>

                                        <div className="mt-4 text-center px-2">
                                            <h3 className="font-bold text-gray-800 text-sm md:text-base truncate mb-1">
                                                {product.name}
                                            </h3>
                                            <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-gray-400 mb-2">
                                                <Star size={12} className="fill-yellow-400 text-yellow-400" />
                                                {product.rating} | {cat.title.charAt(0).toUpperCase() + cat.title.slice(1)}
                                            </div>
                                            {product.pack && <p className="text-[10px] text-gray-400 uppercase font-bold mb-2">{product.pack}</p>}
                                            <div className="flex items-center justify-center gap-2 mb-4">
                                                <span className="text-gray-400 line-through text-xs">₹{product.oldPrice}</span>
                                                <span className="text-lg font-black text-black">₹{product.price}</span>
                                            </div>
                                            <button className="w-full bg-[#4ade80] text-white py-3 rounded-xl font-black text-xs uppercase flex items-center justify-center gap-2 hover:bg-[#004d2c] transition-colors">
                                                <Plus size={16} /> ADD
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default CategoryShowcase;