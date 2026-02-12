"use client";
import React from 'react';

const MissionSection = () => {
    const badges = [
        { title: "Vegan Friendly", icon: "🍃", bgColor: "bg-[#52c47d]" },
        { title: "Clean Label Certified", icon: "🏆", bgColor: "bg-[#2879bd]" }, // Blue tone from reference
        { title: "100% Reusable Packaging", icon: "♻️", bgColor: "bg-[#96d7f2]" }, // Light blue from reference
        { title: "Gluten Free", icon: "🧪", bgColor: "bg-[#ffeb69]" } // Yellow from reference
    ];

    return (
        <section className="bg-[#1ca66b] py-20 px-6 md:px-20 text-white rounded-[4rem] mx-4 md:mx-10 mb-20 overflow-hidden relative border-b-8 border-[#15803d]">

            {/* Background Decorative Shapes (Reference style) */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-500/20 rounded-full -ml-10 -mb-10 blur-2xl"></div>

            <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                {/* Left Content */}
                <div className="relative z-10">
                    <div className="relative inline-block">
                        <h2 className="text-6xl md:text-8xl font-black italic mb-6 leading-[0.85] tracking-tighter">
                            Take Care, <br />
                            <span className="text-white">Have Fun!</span>
                        </h2>
                        {/* Curved Arrow Decor (Simulated with SVG) */}
                        <div className="absolute -right-16 top-0 hidden md:block">
                            <svg width="100" height="60" viewBox="0 0 100 60" fill="none" className="rotate-12 opacity-60">
                                <path d="M10 50C30 10 70 10 90 50" stroke="white" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 4" />
                                <path d="M85 45L90 50L85 55" stroke="white" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </div>
                    </div>

                    <p className="text-lg md:text-xl opacity-90 mb-10 max-w-md font-bold leading-relaxed">
                        We are on a mission to make nutrition fun! Taking care of yourself and having fun need not be mutually exclusive.
                    </p>

                    <button className="bg-[#fffdf0] text-[#1ca66b] px-12 py-4 rounded-xl font-black uppercase text-sm shadow-2xl hover:bg-white hover:scale-105 transition-all duration-300">
                        LEARN MORE
                    </button>
                </div>

                {/* Right Badges Grid */}
                <div className="grid grid-cols-2 gap-x-8 gap-y-12 relative z-10">
                    {badges.map((badge, i) => (
                        <div key={i} className="flex flex-col md:flex-row items-center md:items-start gap-5 group">
                            {/* Icon Circle */}
                            <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full ${badge.bgColor} flex items-center justify-center text-4xl shadow-lg transform group-hover:rotate-12 transition-transform duration-500 border-4 border-white/20`}>
                                {badge.icon}
                            </div>

                            {/* Badge Text */}
                            <div className="flex flex-col justify-center">
                                <span className="font-black uppercase text-[13px] md:text-[15px] tracking-tight leading-tight max-w-[120px] text-center md:text-left">
                                    {badge.title}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Corner Graphic (Like the purple leaf in reference) */}
            <div className="absolute bottom-4 left-4 opacity-40">
                <span className="text-6xl">🌿</span>
            </div>
        </section>
    );
};

export default MissionSection;