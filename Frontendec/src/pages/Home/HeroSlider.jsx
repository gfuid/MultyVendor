"use client";
import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=2000",
    title: "Back on popular demand!!",
    subtitle: "50% OFF",
    cta: "Shop Now"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=2000",
    title: "Play, Learn, Grow Together!",
    subtitle: "Engaging kids supplements",
    cta: "Discover More"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?q=80&w=2000",
    title: "Unlock Your Potential",
    subtitle: "Premium plant-based nutrition",
    cta: "Shop Now"
  }
];

export default function HeroSlider() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 4000, stopOnInteraction: false })]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Scroll logic
  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  // Update active dot index
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className="relative w-full h-[350px] md:h-[550px] overflow-hidden group bg-gray-100">
      {/* Viewport */}
      <div className="overflow-hidden h-full" ref={emblaRef}>
        <div className="flex h-full">
          {slides.map((slide) => (
            <div key={slide.id} className="relative flex-[0_0_100%] min-w-0 h-full">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              {/* Creative Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent flex flex-col justify-center px-10 md:px-24 text-white">
                <h2 className="text-4xl md:text-7xl font-black mb-2 drop-shadow-2xl uppercase italic tracking-tighter leading-tight animate-in slide-in-from-left duration-700">
                  {slide.title.split(' ').map((word, i) => (
                    <span key={i} className={i % 2 !== 0 ? "text-[#ff4d6d]" : ""}>{word} </span>
                  ))}
                </h2>
                <p className="text-xl md:text-3xl font-bold mb-8 drop-shadow-md opacity-90">
                  {slide.subtitle}
                </p>
                <button className="w-fit bg-[#ff4d6d] text-white px-10 py-4 rounded-xl font-black uppercase text-sm hover:bg-white transition-all shadow-xl active:scale-95">
                  {slide.cta}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons (Desktop Only for cleaner look) */}
      <button
        onClick={scrollPrev}
        className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-[#4ade80] p-3 rounded-full backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 z-10 hidden md:block"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-[#4ade80] p-3 rounded-full backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 z-10 hidden md:block"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      {/* Interactive Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => emblaApi && emblaApi.scrollTo(i)}
            className={`transition-all duration-300 rounded-full ${selectedIndex === i ? "w-8 h-2 bg-[#4ade80]" : "w-2 h-2 bg-white/50"
              }`}
          />
        ))}
      </div>
    </div>
  );
}