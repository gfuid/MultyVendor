"use client";
import React from 'react';

const concerns = [
    { id: 1, name: "Weight Loss", icon: "⚖️", color: "bg-[#fefce8]", border: "group-hover:border-yellow-200" },
    { id: 2, name: "Dull Skin", icon: "✨", color: "bg-[#fff1f2]", border: "group-hover:border-rose-200" },
    { id: 3, name: "Hair Fall", icon: "💇", color: "bg-[#f0f9ff]", border: "group-hover:border-blue-200" },
    { id: 4, name: "Acne Care", icon: "🧼", color: "bg-[#f0fdf4]", border: "group-hover:border-green-200" },
    { id: 5, name: "Performance", icon: "⚡", color: "bg-[#faf5ff]", border: "group-hover:border-purple-200" },
    { id: 6, name: "Wellness", icon: "🧘", color: "bg-[#ecfdf5]", border: "group-hover:border-emerald-200" },
];

const ShopByConcern = () => {
    return (
        <section className="py-16 bg-[#fcf9f4]">
            <div className="max-w-[1400px] mx-auto px-6 md:px-10">
                {/* Section Title */}
                <div className="flex items-center gap-4 mb-10">
                    <h2 className="text-3xl md:text-4xl font-black italic text-[#004d2c] tracking-tighter uppercase leading-none">
                        Product Category
                    </h2>
                    <div className="h-[2px] flex-1 bg-gradient-to-r from-[#4ade80]/40 to-transparent"></div>
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-3 md:grid-cols-6 gap-6 md:gap-10">
                    {concerns.map((item) => (
                        <div key={item.id} className="flex flex-col items-center group cursor-pointer">
                            {/* Icon Container */}
                            <div className={`w-20 h-20 md:w-28 md:h-28 ${item.color} rounded-full flex items-center justify-center text-3xl md:text-5xl shadow-sm border-2 border-white transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-xl ${item.border}`}>
                                <span className="drop-shadow-sm">{item.icon}</span>
                            </div>

                            {/* Label */}
                            <span className="mt-5 text-[10px] md:text-xs font-black text-[#004d2c] uppercase tracking-[0.15em] text-center transition-colors group-hover:text-[#4ade80]">
                                {item.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ShopByConcern;