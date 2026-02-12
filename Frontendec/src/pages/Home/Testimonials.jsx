"use client";
import React from 'react';

const testimonials = [
    {
        id: 1,
        name: "Hardik Pandya",
        category: "Weight",
        title: "Go to fitness drink",
        quote: "Plix Apple Cider Vinegar Effervescent has been a total game-changer for me! I needed something to support my metabolism and keep my energy levels up.",
        img: "https://plixlife.com/cdn/shop/files/Hardik_Pandya.png",
        bgColor: "bg-[#ffeb3b]" // Yellow for Weight
    },
    {
        id: 2,
        name: "Shraddha Kapoor",
        category: "Hair",
        title: "New baby hair growth",
        quote: "Plix Rosemary Hair Serum really impressed me. After consistent use, I noticed less hair fall and even started spotting baby hairs! It's so lightweight.",
        img: "https://plixlife.com/cdn/shop/files/Shraddha_Kapoor.png",
        bgColor: "bg-[#b2ff59]" // Light Green for Hair
    },
    {
        id: 3,
        name: "Customer",
        category: "Skin",
        title: "Gave Visible Results",
        quote: "I struggled with pigmentation around my mouth and forehead, but the Plix Pineapple Depigmentation Regime truly transformed my skin.",
        img: "https://plixlife.com/cdn/shop/files/Skin_Testimonial.png",
        bgColor: "bg-[#81d4fa]" // Light Blue for Skin
    }
];

const Testimonials = () => {
    return (
        <section className="py-16 bg-[#1ca66b] overflow-hidden">
            <h2 className="text-center text-white text-4xl md:text-5xl font-black italic mb-12 tracking-tighter uppercase">
                Real People, Real Results
            </h2>

            <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.map((t) => (
                    <div key={t.id} className={`${t.bgColor} rounded-[2rem] p-8 flex flex-col items-center text-center shadow-xl`}>
                        <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white mb-6 bg-red-500">
                            <img src={t.img} alt={t.name} className="w-full h-full object-cover" />
                        </div>
                        <span className="text-4xl text-[#004d2c] mb-4">“</span>
                        <h3 className="text-xl font-black italic text-[#004d2c] mb-4 uppercase tracking-tighter">
                            {t.title}
                        </h3>
                        <p className="text-[#004d2c] text-sm font-medium leading-relaxed mb-6 italic">
                            {t.quote}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Testimonials;