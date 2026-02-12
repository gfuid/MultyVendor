import React from 'react';

const PledgeSection = () => {
    return (
        <section className="bg-[#fdfdf0] py-16 px-6 md:px-12 relative overflow-hidden border-t border-green-50">
            {/* Decorative Leaves (Simulated with absolute divs/emojis) */}
            <div className="absolute left-0 bottom-0 text-9xl opacity-20 transform -translate-x-10 translate-y-10">🌿</div>
            <div className="absolute right-0 top-0 text-9xl opacity-20 transform translate-x-10 -translate-y-10 rotate-180">🌿</div>

            <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center gap-10 md:gap-20">

                {/* Badge Logo */}
                <div className="relative w-48 h-48 md:w-64 md:h-64 flex-shrink-0">
                    <div className="w-full h-full border-4 border-[#004d2c] rounded-full border-dashed p-4 flex items-center justify-center animate-spin-slow">
                        <div className="bg-white w-full h-full rounded-full flex flex-col items-center justify-center text-center p-4 shadow-inner">
                            <span className="text-4xl md:text-5xl">👐</span>
                            <span className="text-[10px] md:text-xs font-black uppercase mt-2 text-[#004d2c]">#PledgeATree</span>
                        </div>
                    </div>
                    {/* Fixed text on top of rotating border */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="font-black text-[10px] uppercase text-[#004d2c] tracking-widest bg-white px-2">Make a difference</span>
                    </div>
                </div>

                {/* Content Area */}
                <div className="text-center md:text-left z-10">
                    <h2 className="text-5xl md:text-7xl font-black italic text-[#004d2c] tracking-tighter uppercase leading-[0.9] mb-6">
                        Pledge A Tree!
                    </h2>
                    <p className="text-gray-600 font-bold text-sm md:text-base max-w-xl leading-relaxed mb-8">
                        For every order placed, we plant more trees! With your help, we can now achieve our goal of planting millions of trees in the next couple of years.
                    </p>
                    <button className="text-[#004d2c] font-black text-sm uppercase border-b-2 border-[#004d2c] hover:text-[#4ade80] hover:border-[#4ade80] transition-colors tracking-widest">
                        Learn More
                    </button>
                </div>
            </div>
        </section>
    );
};

export default PledgeSection;