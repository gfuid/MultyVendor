"use client";
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart, User, Truck, LogOut, LayoutDashboard } from 'lucide-react';
import CategoryBar from './CategoryBar';
import useAuthStore from '../../store/authStore.js';

const Navbar = () => {
    const [placeholder, setPlaceholder] = useState("");
    const [index, setIndex] = useState(0);
    const [subIndex, setSubIndex] = useState(0);
    const [reverse, setReverse] = useState(false);

    // Get auth state from your Zustand store
    const { isAuthenticated, user, logout } = useAuthStore();

    const words = ["Nutrition", "Weight Loss", "Skincare", "Hair Care", "Best Sellers"];

    // Typing effect for search bar
    useEffect(() => {
        if (subIndex === words[index].length + 1 && !reverse) {
            setReverse(true);
            return;
        }
        if (subIndex === 0 && reverse) {
            setReverse(false);
            setIndex((prev) => (prev + 1) % words.length);
            return;
        }
        const timeout = setTimeout(() => {
            setSubIndex((prev) => prev + (reverse ? -1 : 1));
        }, reverse ? 75 : 150);
        return () => clearTimeout(timeout);
    }, [subIndex, index, reverse]);

    useEffect(() => {
        setPlaceholder(`Search for ${words[index].substring(0, subIndex)}${subIndex === words[index].length ? '' : '|'}`);
    }, [subIndex, index]);

    return (
        <nav className="w-full font-sans sticky top-0 z-[100] shadow-md">
            {/* 1. Announcement Bar */}
            <div className="bg-[#ff7096] text-white py-2 px-4 flex justify-between items-center text-sm font-semibold">
                <div className="flex-1 text-center md:ml-24">
                    Get Our Exclusive Best Sellers!
                </div>
                <button className="bg-white text-[#ff4d6d] px-4 py-1 rounded-md text-xs font-bold uppercase hover:bg-gray-100 transition">
                    Shop Now
                </button>
            </div>

            {/* 2. Main Navigation */}
            <div className="bg-[#ff4d6d] py-3 px-6 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    {/* Hamburger Menu Icon */}
                    <div className="space-y-1 cursor-pointer group">
                        <div className="w-6 h-0.5 bg-white transition-all group-hover:w-4"></div>
                        <div className="w-6 h-0.5 bg-white"></div>
                        <div className="w-6 h-0.5 bg-white transition-all group-hover:w-4"></div>
                    </div>

                    {/* Logo Section */}
                    <Link to="/" className="flex bg-white/30 rounded-full p-1 items-center border border-white/20">
                        <div className="bg-[#ff4d6d] text-white px-6 py-1 rounded-full font-black italic text-xl shadow-sm">
                            TRIREME
                        </div>
                        <div className="px-4 text-white font-bold text-sm opacity-80 uppercase tracking-tighter hidden sm:block">
                            kids
                        </div>
                    </Link>
                </div>

                {/* Search Bar */}
                <div className="hidden md:flex flex-1 max-w-md relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70 w-4 h-4" />
                    <input
                        type="text"
                        placeholder={placeholder}
                        className="w-full bg-white/20 border border-white/30 rounded-md py-2 pl-10 pr-4 text-white placeholder:text-white/90 focus:outline-none focus:bg-white/40 transition-all font-medium"
                    />
                </div>

                {/* Right Side Icons & Auth */}
                <div className="flex items-center gap-6">
                    <div className="flex gap-4 text-white items-center">
                        <Link to="/order">
                            <div className="relative cursor-pointer hover:scale-110 transition-transform">
                                <Truck className="w-6 h-6" />
                            </div>
                        </Link>

                        <Link to="/cart">
                            <div className="relative cursor-pointer hover:scale-110 transition-transform">
                                <ShoppingCart className="w-6 h-6" />
                                <span className="absolute -top-1 -right-1 bg-white text-[#ff4d6d] text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">0</span>
                            </div>
                        </Link>

                        {/* AUTHENTICATION LOGIC */}
                        {isAuthenticated ? (
                            <div className="group relative">
                                {/* User Info Trigger */}
                                <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition py-1">
                                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center border border-white/40 shadow-sm">
                                        <User className="w-5 h-5 text-white" />
                                    </div>
                                    {/* Added text-white to make "Hi, Name" visible */}
                                    <span className="hidden lg:block text-xs font-bold uppercase tracking-wide text-white">
                                        Hi, {user?.name?.split(' ')[0] || 'User'}
                                    </span>
                                </div>

                                {/* Dropdown Menu - Added z-[110] and better positioning */}
                                <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-2xl py-2 text-gray-800 
            invisible opacity-0 group-hover:visible group-hover:opacity-100 
            transition-all duration-300 z-[110] border border-gray-100 overflow-hidden">

                                    <div className="px-4 py-2 border-b border-gray-50 mb-1">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">My Account</p>
                                    </div>

                                    <Link to="/profile" className="block px-4 py-2 hover:bg-pink-50 hover:text-[#ff4d6d] transition-colors">
                                        My Profile
                                    </Link>

                                    {/* Multi-Vendor Seller Link */}
                                    {user?.isSeller && (
                                        <Link to="/seller/dashboard" className="flex items-center gap-2 px-4 py-2 bg-pink-50 text-[#ff4d6d] font-bold hover:bg-pink-100 transition-colors">
                                            <LayoutDashboard className="w-4 h-4" /> Seller Dashboard
                                        </Link>
                                    )}

                                    <hr className="my-1 border-gray-100" />

                                    <button
                                        onClick={logout}
                                        className="w-full flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 transition-colors font-medium text-sm"
                                    >
                                        <LogOut className="w-4 h-4" /> Sign Out
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <Link to="/login" className="hover:scale-110 transition-transform flex items-center gap-1 text-white">
                                <User className="w-6 h-6" />
                                <span className="hidden lg:block text-xs font-bold uppercase">Login</span>
                            </Link>
                        )}
                    </div>

                    <button className="hidden lg:block bg-white text-[#ff4d6d] px-6 py-2 rounded-md font-black text-sm uppercase shadow-sm hover:bg-gray-50 transition-colors">
                        SHOP ALL
                    </button>
                </div>
            </div>

            {/* 3. Category Bar Component */}
            <CategoryBar />
        </nav>
    );
};

export default Navbar;