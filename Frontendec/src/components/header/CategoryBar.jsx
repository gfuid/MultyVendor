"use client";
import React, { useState } from 'react';

const CategoryBar = () => {
    // Pure JS: No TypeScript types here
    const [activeMenu, setActiveMenu] = useState(null);

    const menuData = {
        //"Build Your Own Box": ["Box Of 5 At ₹ 1400", "Box Of 4 At ₹ 1200", "Gift Box Of 4 At ₹ 1300", "Box Of 4 Mini At ₹ 499", "3 Hair Products At ₹ 1099"],
        "Product Category": ["Weight", "Dull & Frizz", "Pre-Workout", "Post-Workout", "Performance", "Hair Growth", "Daily Wellness", "Dry & Dull Skin", "Acne Care"],
        // "Shop By Plant": ["Pineapple", "Rosemary", "Jamun", "Guava", "Pomegranate", "Neem", "Avocado", "Watermelon"],
        "Trireme Kids": ["Nutrition", "Personal Care"],
        "Blogs": ["Nutrition Tips", "Skincare Routines", "Hair Care Advice", "Fitness Guides", "Customer Stories"],
        "Best Sellers": ["Weight", "Skin & Hair", "Performance", "Plant Proteins", "Daily Wellness"],

    };

    return (
        <div className="relative w-full bg-[#ffc2d4] py-3 border-b border-green-100 shadow-sm hidden md:block">
            <ul className="flex justify-center items-center gap-8 text-white text-sm font-bold whitespace-nowrap px-6">

                {Object.keys(menuData).map((item) => (
                    <li
                        key={item}
                        className="relative group cursor-pointer py-1"
                        onMouseEnter={() => setActiveMenu(item)}
                        onMouseLeave={() => setActiveMenu(null)}
                    >
                        <span className="flex items-center gap-1 hover:text-[#ff4d6d] transition-colors">
                            {item === "Build Your Own Box" && "🎁 "}
                            {item}
                        </span>

                        {activeMenu === item && (
                            <div className="absolute top-full left-0 mt-2 w-64 bg-white shadow-2xl border border-gray-100 z-[100] animate-in fade-in slide-in-from-top-2 duration-200 rounded-lg overflow-hidden">
                                <div className="flex flex-col py-2">
                                    {menuData[item].map((subItem) => (
                                        <button
                                            key={subItem}
                                            className="text-left px-6 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 border-b border-gray-50 last:border-0 transition-all font-medium text-xs"
                                        >
                                            {subItem}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </li>
                ))}

                <li
                    className="relative group cursor-pointer py-1"
                    onMouseEnter={() => setActiveMenu("category")}
                    onMouseLeave={() => setActiveMenu(null)}
                >
                    <span className="hover:text-green-600 transition-colors">About</span>
                    {activeMenu === "category" && <MegaMenuContent />}
                </li>

                {/* <li className="flex items-center gap-1 cursor-pointer hover:text-green-600 transition-colors">🤩 Mini Store</li> */}
                <li className="flex items-center gap-1 cursor-pointer hover:text-green-600 transition-colors">🥳 Contact-us</li>
            </ul>
        </div>
    );
};

const MegaMenuContent = () => {
    const sections = [
        { title: "Nutrition", items: ["Weight", "Skin & Hair", "Performance", "Plant Proteins", "Daily Wellness"] },
        { title: "SkinCare", items: ["Facewash", "Toner", "Under Eye Care", "Face Serum", "Moisturizer"] },
        { title: "Accessories", items: ["Gua Sha", "Sustainable Mug", "Derma Roller"] },
        { title: "Body Care", items: ["Bodywash", "Intimate Care"] },
        { title: "Hair", items: ["Hairfall & Thinning", "Dull & Frizz", "Damage Repair"] }
    ];

    return (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-screen max-w-6xl bg-white shadow-2xl border border-gray-100 p-8 z-[100] grid grid-cols-6 gap-6 animate-in fade-in slide-in-from-top-2 rounded-xl">
            {sections.map((sec) => (
                <div key={sec.title} className="flex flex-col">
                    <h3 className="text-green-800 font-black uppercase text-[10px] mb-4 tracking-widest border-b border-green-50 pb-2">{sec.title}</h3>
                    {sec.items.map(item => (
                        <button key={item} className="text-left py-1.5 text-gray-600 hover:text-green-600 text-[13px] font-medium transition-colors">
                            {item}
                        </button>
                    ))}
                    <button className="text-left py-2 text-pink-500 font-bold text-[10px] mt-2 italic hover:underline">💯 VIEW ALL</button>
                </div>
            ))}

            <div className="col-span-1 flex flex-col gap-4">
                <div className="relative h-32 w-full rounded-xl overflow-hidden shadow-md group/img cursor-pointer">
                    <img src="https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?q=80&w=200" alt="Skin" className="object-cover w-full h-full group-hover/img:scale-110 transition-transform" />
                    <div className="absolute inset-0 bg-black/5"></div>
                    <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[9px] font-black">SKIN</div>
                </div>
                <div className="relative h-32 w-full rounded-xl overflow-hidden shadow-md group/img cursor-pointer">
                    <img src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=200" alt="Weight" className="object-cover w-full h-full group-hover/img:scale-110 transition-transform" />
                    <div className="absolute inset-0 bg-black/5"></div>
                    <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[9px] font-black">WEIGHT</div>
                </div>
            </div>
        </div>
    );
};

export default CategoryBar;