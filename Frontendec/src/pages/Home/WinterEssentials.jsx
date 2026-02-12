"use client";
import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const winterProducts = [
    { id: 1, name: "Flaxseed Ultra Smooth Serum", price: 499, oldPrice: 550, rating: 4.7, img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=400", discount: "-9%" },
    { id: 2, name: "Avocado Ceramide Body Butter", price: 599, oldPrice: 650, rating: 4.5, img: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=400", discount: "-7%" },
    { id: 3, name: "Guava Body Lotion", price: 299, oldPrice: 400, rating: 4.7, img: "https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?q=80&w=400", discount: "-25%" },
    { id: 4, name: "Guava Glowy Lip Tinted Balm", price: 299, oldPrice: 350, rating: 4.4, img: "https://images.unsplash.com/photo-1594434228916-0560fd30349a?q=80&w=400", discount: "-14%" },
];

const WinterEssentials = () => {
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollAmount = clientWidth * 0.8;
            const scrollTo = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
            scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    return (
        <section className="py-12 bg-white w-full">
            <div className="max-w-[1400px] mx-auto px-6 md:px-10">
                <div className="flex justify-between items-end mb-6">
                    <h2 className="text-3xl md:text-5xl font-black italic text-[#004d2c] tracking-tighter uppercase leading-none">
                        Winter Essentials
                    </h2>
                    <button className="text-[#4ade80] font-bold text-xs flex items-center gap-1 uppercase">
                        SHOP ALL <ChevronRight size={14} />
                    </button>
                </div>

                <div className="flex gap-8 border-b border-gray-100 mb-10">
                    <button className="text-sm font-black pb-3 border-b-4 border-[#4ade80] text-[#004d2c] tracking-widest">
                        TOP PICK
                    </button>
                </div>

                <div className="relative group">
                    <button onClick={() => scroll('left')} className="absolute -left-5 top-1/2 -translate-y-1/2 z-30 bg-white shadow-xl rounded-full p-2 border border-gray-100 hidden md:flex">
                        <ChevronLeft className="text-[#4ade80]" size={24} />
                    </button>

                    <div ref={scrollRef} className="flex overflow-x-auto gap-4 md:gap-6 no-scrollbar snap-x pb-4">
                        {winterProducts.map((product) => (
                            <div key={product.id} className="min-w-[85%] sm:min-w-[45%] lg:min-w-[23.5%] snap-start border border-gray-100 rounded-2xl overflow-hidden bg-white group/card">
                                <div className="relative aspect-square">
                                    <span className="absolute top-3 left-3 bg-[#fde6d2] text-[#854d0e] text-[9px] font-black px-2 py-1 rounded">Top Pick</span>
                                    <span className="absolute top-3 right-3 bg-[#dcfce7] text-[#166534] text-[9px] font-black px-2 py-1 rounded">{product.discount}</span>
                                    <img src={product.img} className="w-full h-full object-cover group-hover/card:scale-105 transition-transform" alt={product.name} />
                                </div>
                                <div className="p-4 text-center">
                                    <h3 className="text-sm font-bold text-gray-800 mb-1 truncate">{product.name}</h3>
                                    <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-gray-400 mb-3">
                                        <Star size={12} className="fill-yellow-400 text-yellow-400" /> {product.rating} | Top Pick
                                    </div>
                                    <div className="flex items-center justify-center gap-2 mb-4">
                                        <span className="text-gray-400 line-through text-xs">₹{product.oldPrice}</span>
                                        <span className="text-lg font-black">₹{product.price}</span>
                                    </div>
                                    <button className="w-full bg-[#e6ffed] text-[#004d2c] py-2 rounded-lg font-black text-xs uppercase hover:bg-[#4ade80] hover:text-white transition-all">
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button onClick={() => scroll('right')} className="absolute -right-5 top-1/2 -translate-y-1/2 z-30 bg-white shadow-xl rounded-full p-2 border border-gray-100 hidden md:flex">
                        <ChevronRight className="text-[#4ade80]" size={24} />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default WinterEssentials;