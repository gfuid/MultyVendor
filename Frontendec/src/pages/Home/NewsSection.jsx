"use client";
import React from 'react';

const NewsSection = () => {
    const newsLogos = [
        { name: "The Times of India", url: "https://upload.wikimedia.org/wikipedia/commons/8/8b/The_Times_of_India_logo.png" },
        { name: "YourStory", url: "https://yourstory.com/logo.png" },
        { name: "The Economic Times", url: "https://upload.wikimedia.org/wikipedia/commons/9/98/The_Economic_Times_logo.png" },
        { name: "Business Standard", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Business_Standard_logo.svg/1200px-Business_Standard_logo.svg.png" },
        { name: "Femina", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Femina_logo.svg/2560px-Femina_logo.svg.png" }
    ];

    return (
        <section className="py-20 bg-white overflow-hidden border-t border-gray-50">
            <div className="max-w-[1400px] mx-auto px-6 text-center">
                <h2 className="text-4xl md:text-5xl font-black text-[#004d2c] mb-8 tracking-tighter italic">
                    Trireme In News
                </h2>

                {/* Brand Mission Statement */}
                <div className="max-w-3xl mx-auto mb-16 relative">
                    <span className="text-6xl text-[#4ade80] opacity-40 absolute -top-8 left-1/2 -translate-x-1/2 font-serif">“</span>
                    <p className="text-lg md:text-xl text-gray-600 font-medium leading-relaxed italic px-4">
                        Our goal of empowering your health starts with our extraordinary ingredients. We use clinically backed wholefood ingredients to create blends which empower your body, mind and soul.
                    </p>
                </div>

                {/* Infinite Scrolling News Marquee */}
                <div className="flex whitespace-nowrap animate-marquee items-center gap-16 md:gap-24 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                    {[...Array(2)].map((_, i) => (
                        <React.Fragment key={i}>
                            {newsLogos.map((logo, index) => (
                                <img
                                    key={`${i}-${index}`}
                                    src={logo.url}
                                    alt={logo.name}
                                    className="h-8 md:h-12 object-contain"
                                />
                            ))}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default NewsSection;