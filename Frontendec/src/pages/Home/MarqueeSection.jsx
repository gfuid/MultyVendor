"use client";
import React from 'react';
import { Leaf, ShieldCheck, Zap, Globe, Heart, Sparkles } from 'lucide-react';

const MarqueeSection = () => {
    // Har item ke liye uska relevant icon define kiya hai
    const marqueeItems = [
        { name: "Plant-Based", icon: <Leaf size={24} className="text-green-700" /> },
        { name: "Gluten Free", icon: <ShieldCheck size={24} className="text-blue-700" /> },
        { name: "Non-Gmo", icon: <Zap size={24} className="text-orange-600" /> },
        { name: "Organic", icon: <Globe size={24} className="text-emerald-700" /> },
        { name: "Cruelty Free", icon: <Heart size={24} className="text-red-500" /> },
        { name: "Pure Purity", icon: <Sparkles size={24} className="text-purple-600" /> },
    ];

    return (
        <div className="relative py-10 overflow-hidden select-none bg-white">
            {/* Background Ribbon with Tilt & Shadow */}
            <div className="absolute inset-0 bg-[#ffeb3b] -rotate-1 scale-105 shadow-xl border-y-4 border-[#004d2c]/5"></div>

            <style>
                {`
                    @keyframes marquee {
                        0% { transform: translateX(0); }
                        100% { transform: translateX(-50%); }
                    }
                    .animate-scroll {
                        display: flex;
                        width: max-content;
                        animation: marquee 30s linear infinite;
                    }
                    .animate-scroll:hover {
                        animation-play-state: paused;
                    }
                `}
            </style>

            <div className="relative flex items-center">
                {/* Side Gradients for Deep Effect */}
                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#ffeb3b] via-[#ffeb3b]/80 to-transparent z-20"></div>
                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#ffeb3b] via-[#ffeb3b]/80 to-transparent z-20"></div>

                <div className="animate-scroll">
                    {[...Array(2)].map((_, outerIndex) => (
                        <div key={outerIndex} className="flex items-center">
                            {marqueeItems.map((item, index) => (
                                <div key={index} className="flex items-center mx-6 group">
                                    {/* Item Card Wrapper */}
                                    <div className="flex items-center gap-4 bg-white/40 backdrop-blur-md px-6 py-3 rounded-full border-2 border-white/60 shadow-lg transition-all duration-500 group-hover:bg-white group-hover:scale-110 group-hover:-rotate-2">
                                        <div className="p-2 bg-white rounded-full shadow-inner animate-pulse">
                                            {item.icon}
                                        </div>
                                        <span className="text-xl md:text-2xl font-black italic uppercase tracking-tighter text-[#004d2c]">
                                            {item.name}
                                        </span>
                                    </div>

                                    {/* Visual Separator - Sparkle SVG */}
                                    <div className="ml-12 opacity-30 group-hover:opacity-100 transition-opacity duration-500 group-hover:rotate-180">
                                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#004d2c" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M12 3v3m0 12v3M3 12h3m12 0h3M5.6 5.6l2.1 2.1m8.6 8.6l2.1 2.1M5.6 18.4l2.1-2.1m8.6-8.6l2.1-2.1" />
                                        </svg>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MarqueeSection;