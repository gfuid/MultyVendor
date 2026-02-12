"use client";
import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';

const reels = [
    { id: 1, title: "Weight Loss Journey", thumbnail: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=500", vendor: "Trireme" },
    { id: 2, title: "Morning Routine", thumbnail: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=500", vendor: "HealthFix" },
    { id: 3, title: "Skin Transformation", thumbnail: "https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?q=80&w=500", vendor: "GlowUp" },
    { id: 4, title: "New Plant Protein", thumbnail: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?q=80&w=500", vendor: "PureVeg" },
    { id: 5, title: "Workout Hack", thumbnail: "https://images.unsplash.com/photo-1517838276518-2dd027aa4099?q=80&w=500", vendor: "FitLife" },
    { id: 6, title: "Daily Wellness", thumbnail: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=500", vendor: "Trireme" },
];

const ShortReels = () => {
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollAmount = clientWidth * 0.5;
            const scrollTo = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
            scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    return (
        <section className="py-16 bg-white w-full overflow-hidden">
            <div className="max-w-[1400px] mx-auto px-6 md:px-10">

                {/* Header with Custom Buttons */}
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-3xl md:text-5xl font-black italic text-[#004d2c] tracking-tighter uppercase leading-none">
                            Customer Stories
                        </h2>
                        <p className="text-gray-400 font-bold text-xs uppercase mt-2 tracking-widest">Real Results, Real People</p>
                    </div>

                    <div className="flex gap-3 hidden md:flex">
                        <button onClick={() => scroll('left')} className="w-10 h-10 flex items-center justify-center border-2 border-[#e6ffed] rounded-full hover:bg-[#4ade80] hover:border-[#4ade80] transition-all group">
                            <ChevronLeft size={20} className="text-[#004d2c] group-hover:text-white" />
                        </button>
                        <button onClick={() => scroll('right')} className="w-10 h-10 flex items-center justify-center border-2 border-[#e6ffed] rounded-full hover:bg-[#4ade80] hover:border-[#4ade80] transition-all group">
                            <ChevronRight size={20} className="text-[#004d2c] group-hover:text-white" />
                        </button>
                    </div>
                </div>

                {/* Reels Container */}
                <div
                    ref={scrollRef}
                    className="flex gap-4 md:gap-8 overflow-x-auto no-scrollbar scroll-smooth snap-x pb-8"
                >
                    {reels.map((reel) => (
                        <div
                            key={reel.id}
                            className="min-w-[160px] md:min-w-[240px] aspect-[9/16] relative rounded-[2rem] overflow-hidden snap-start group cursor-pointer border-4 border-transparent hover:border-[#4ade80] transition-all duration-300 shadow-lg hover:shadow-[#4ade80]/20"
                        >
                            {/* Thumbnail */}
                            <img
                                src={reel.thumbnail}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                alt={reel.title}
                            />

                            {/* Play Icon Glow */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="w-14 h-14 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center border border-white/50">
                                    <Play size={24} className="text-white fill-white ml-1" />
                                </div>
                            </div>

                            {/* Info Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-5 flex flex-col justify-end translate-y-2 group-hover:translate-y-0 transition-transform">
                                <h3 className="text-white text-sm md:text-base font-black leading-tight uppercase italic tracking-tighter">
                                    {reel.title}
                                </h3>
                                <div className="flex items-center gap-2 mt-2">
                                    <div className="w-4 h-4 bg-[#4ade80] rounded-full flex items-center justify-center">
                                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                                    </div>
                                    <span className="text-[#4ade80] text-[10px] font-black uppercase tracking-widest">
                                        @{reel.vendor}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ShortReels;