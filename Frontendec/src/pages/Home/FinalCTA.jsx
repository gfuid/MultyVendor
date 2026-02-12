"use client";
import React from 'react';

const FinalCTA = () => {
    return (
        <section className="relative w-full py-20 bg-[#d1fae5] overflow-hidden flex flex-col items-center justify-center text-center px-6">

            {/* Organic Decorative Shapes (Matching image_0336b9.png) */}
            <div className="absolute left-[-2rem] bottom-[-2rem] w-48 h-48 bg-[#3b82f6] rounded-full mix-blend-multiply opacity-80"
                style={{ borderRadius: '40% 60% 70% 30% / 40% 50% 60% 70%' }}></div>
            <div className="absolute right-[-2rem] top-[-1rem] w-40 h-56 bg-[#f472b6] opacity-80"
                style={{ borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' }}></div>
            <div className="absolute left-[10%] top-[-2rem] w-24 h-24 bg-[#a855f7] opacity-80"
                style={{ borderRadius: '50% 50% 20% 80% / 30% 40% 60% 70%' }}></div>
            <div className="absolute right-[20%] bottom-[-3rem] w-32 h-32 bg-[#ef4444] opacity-90"
                style={{ borderRadius: '70% 30% 50% 50% / 30% 30% 70% 70%' }}></div>

            {/* Content Area */}
            <div className="relative z-10">
                <p className="text-[#065f46] font-bold text-sm md:text-lg mb-4 tracking-tight">
                    Hey, you made it to the end of the page!
                </p>
                <h2 className="text-4xl md:text-6xl font-black italic text-[#064e3b] leading-tight tracking-tighter uppercase">
                    Don't forget to <br /> take care, have fun!
                </h2>
            </div>
        </section>
    );
};

export default FinalCTA;