"use client";
import React from 'react';
// Assets import
// Assets import (Corrected Paths)
import img1 from "../../assets/img1.png"; // ACV Tube (Left)
import img2 from "../../assets/img2.png"; // Collagen Jar (Center)
import img3 from "../../assets/img3.png"; // Wellness Product (Right)
import img4 from "../../assets/img4.png"; // Clean Label Award Logo (Center)

const PurityBanner = () => {
    return (
        <section className="bg-[#fdfdf0] py-16 px-6 md:px-12 mt-10 border-y border-green-50 overflow-hidden relative">

            {/* Background Texture/Blob for depth */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-100/30 rounded-full blur-3xl -z-10"></div>

            <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">

                {/* Left Side: Stats */}
                <div className="flex flex-col gap-10 text-center md:text-left">
                    <div className="group cursor-default">
                        <h2 className="text-6xl md:text-8xl font-black text-[#1ca66b] leading-none tracking-tighter italic transition-transform group-hover:scale-110 duration-300">
                            0%
                        </h2>
                        <p className="text-2xl md:text-4xl font-black text-[#1ca66b] uppercase tracking-tight italic">
                            Contamination
                        </p>
                    </div>
                    <div className="group cursor-default">
                        <h2 className="text-6xl md:text-8xl font-black text-[#1ca66b] leading-none tracking-tighter italic transition-transform group-hover:scale-110 duration-300">
                            100%
                        </h2>
                        <p className="text-2xl md:text-4xl font-black text-[#1ca66b] uppercase tracking-tight italic">
                            Clean
                        </p>
                    </div>
                </div>

                {/* Center: Award Logo (Using img4) */}
                <div className="flex flex-col items-center text-center">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-green-200 blur-2xl opacity-0 group-hover:opacity-40 transition-opacity"></div>
                        <img
                            src={img4}
                            alt="Clean Label Project Award"
                            className="w-56 md:w-72 grayscale contrast-125 mb-6 relative z-10 hover:grayscale-0 transition-all duration-500 object-contain"
                        />
                    </div>
                    <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-black italic leading-none">
                        Purity <br /> Award
                    </h3>
                </div>

                {/* Right Side: Product Showcase (Using img1, img2, img3) */}
                <div className="relative flex items-center justify-center h-[350px] md:h-[450px] w-full md:w-[450px]">
                    <style>
                        {`
                            @keyframes float-left {
                                0%, 100% { transform: translateY(0px) rotate(-15deg); }
                                50% { transform: translateY(-20px) rotate(-10deg); }
                            }
                            @keyframes float-center {
                                0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
                                50% { transform: translateY(-30px) rotate(2deg) scale(1.05); }
                            }
                            @keyframes float-right {
                                0%, 100% { transform: translateY(0px) rotate(15deg); }
                                50% { transform: translateY(-15px) rotate(10deg); }
                            }
                            .animate-float-1 { animation: float-left 4s ease-in-out infinite; }
                            .animate-float-2 { animation: float-center 5s ease-in-out infinite; }
                            .animate-float-3 { animation: float-right 3.5s ease-in-out infinite; }
                        `}
                    </style>

                    {/* Left Product (img1) */}
                    <img
                        src={img1}
                        className="absolute left-0 w-28 md:w-36 drop-shadow-[0_20px_50px_rgba(0,0,0,0.2)] z-10 animate-float-1 object-contain"
                        alt="ACV Effervescent"
                    />

                    {/* Center Main Product (img2) */}
                    <img
                        src={img2}
                        className="absolute w-48 md:w-72 z-20 drop-shadow-[0_40px_80px_rgba(0,0,0,0.3)] animate-float-2 object-contain"
                        alt="Collagen Booster"
                    />

                    {/* Right Product (img3) */}
                    <img
                        src={img3}
                        className="absolute right-0 w-28 md:w-36 drop-shadow-[0_20px_50px_rgba(0,0,0,0.2)] z-10 animate-float-3 object-contain"
                        alt="Wellness Product"
                    />
                </div>
            </div>
        </section>
    );
};

export default PurityBanner;