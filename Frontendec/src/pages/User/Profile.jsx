import React, { useEffect } from 'react';
import useAuthStore from '../../store/authStore.js';
import API from '../../api/axios';
import { User, Mail, Shield, ShoppingBag, Store, ChevronRight, LayoutDashboard, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const Profile = () => {
    const { user, login } = useAuthStore();
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        const fetchLatestStatus = async () => {
            try {
                const response = await API.get('/users/me');
                login(response.data, localStorage.getItem('token'));
            } catch (error) {
                console.error("Status sync failed network issues", error);
            }
        };
        fetchLatestStatus();
    }, []);

    if (!user) return <div className="text-center mt-20 font-bold animate-pulse uppercase tracking-widest text-gray-400">Loading profile...</div>;

    return (
        <div className="min-h-screen bg-[#fff5f7] py-10 px-4 font-sans">
            <div className="max-w-4xl mx-auto">

                {/* 1. Header Card (Identity) */}
                <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-pink-50 flex flex-col md:flex-row items-center gap-8 mb-10 transition-all hover:shadow-md">
                    <div className="w-28 h-28 bg-[#ff4d6d] rounded-[2rem] flex items-center justify-center text-white text-4xl font-black shadow-lg overflow-hidden border-4 border-white">
                        {user?.logo ? (
                            <img src={`${BASE_URL}${user.logo}`} alt="Logo" className="w-full h-full object-cover" />
                        ) : (
                            user?.name?.charAt(0).toUpperCase()
                        )}
                    </div>

                    <div className="text-center md:text-left flex-1 space-y-2">
                        <h1 className="text-3xl font-black text-gray-900 italic uppercase tracking-tighter">{user?.name}</h1>
                        <p className="text-gray-400 font-bold flex items-center justify-center md:justify-start gap-2 text-sm uppercase">
                            <Mail className="w-4 h-4 text-[#ff4d6d]" /> {user?.email}
                        </p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
                            <span className="px-4 py-1.5 bg-gray-100 rounded-xl text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                {user?.role}
                            </span>
                            {/* Verified Badge only for Approved Sellers */}
                            {user?.sellerStatus === 'approved' && (
                                <span className="px-4 py-1.5 bg-green-100 rounded-xl text-[10px] font-black text-green-600 uppercase tracking-widest flex items-center gap-2">
                                    <Shield className="w-3 h-3" /> Partner Verified
                                </span>
                            )}
                        </div>
                    </div>

                    <button className="px-8 py-3 bg-gray-900 text-white rounded-2xl font-black italic uppercase text-xs tracking-widest hover:bg-[#ff4d6d] transition-all shadow-lg active:scale-95">
                        Edit Profile
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* 2. Left Column: Shopping Activity */}
                    <div className="space-y-6">
                        <h2 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] px-2 italic">Shopping Operations</h2>
                        <Link to="/cart" className="flex items-center justify-between p-6 bg-white rounded-[2rem] shadow-sm hover:shadow-xl transition-all group border border-transparent hover:border-pink-100">
                            <div className="flex items-center gap-5">
                                <div className="p-4 bg-pink-50 rounded-2xl text-[#ff4d6d] group-hover:scale-110 transition-transform">
                                    <ShoppingBag className="w-6 h-6" />
                                </div>
                                <div>
                                    <span className="block font-black text-gray-800 uppercase italic tracking-tighter">My Orders</span>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase">Track your packages</span>
                                </div>
                            </div>
                            <ChevronRight className="text-gray-300 group-hover:text-[#ff4d6d] transition-colors" />
                        </Link>
                    </div>

                    {/* 3. Right Column: Account & Seller Logic */}
                    <div className="space-y-6">
                        <h2 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] px-2 italic">Account Governance</h2>

                        {/* --- STRICT SELLER LOGIC --- */}
                        {/* CASE 1: User is an Approved Seller */}
                        {user?.sellerStatus === 'approved' ? (
                            <Link to="/seller/dashboard" className="flex items-center justify-between p-6 bg-white rounded-[2rem] shadow-sm hover:shadow-xl transition-all group border-2 border-green-500">
                                <div className="flex items-center gap-5 text-green-600">
                                    <div className="p-4 bg-green-50 rounded-2xl group-hover:rotate-12 transition-transform">
                                        <LayoutDashboard className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <span className="block font-black uppercase italic tracking-tighter">Seller Terminal</span>
                                        <span className="text-[10px] font-black uppercase opacity-70">Manage Inventory & Sales</span>
                                    </div>
                                </div>
                                <ChevronRight className="text-green-300 group-hover:text-green-600 transition-colors" />
                            </Link>
                        ) :

                            /* CASE 2: Application is under review */
                            user?.sellerStatus === 'pending' ? (
                                <div className="flex items-center justify-between p-6 bg-orange-50 rounded-[2rem] border-2 border-orange-200 shadow-inner">
                                    <div className="flex items-center gap-5 text-orange-600">
                                        <div className="p-4 bg-white rounded-2xl shadow-sm">
                                            <Clock className="w-6 h-6 animate-spin-slow" />
                                        </div>
                                        <div>
                                            <span className="block font-black uppercase italic tracking-tighter">Under Surveillance</span>
                                            <span className="text-[10px] font-bold opacity-80 uppercase">Admin is verifying your store</span>
                                        </div>
                                    </div>
                                    <span className="text-[9px] font-black uppercase bg-orange-200 text-orange-700 px-3 py-1 rounded-lg tracking-widest">Pending</span>
                                </div>
                            ) :

                                /* CASE 3: Not a seller at all (Show become seller) */
                                (
                                    <Link to="/become-seller" className="flex items-center justify-between p-6 bg-gradient-to-br from-[#ff4d6d] to-[#ff85a1] rounded-[2rem] shadow-lg hover:shadow-pink-200 transition-all group scale-100 active:scale-95">
                                        <div className="flex items-center gap-5 text-white">
                                            <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-md group-hover:-translate-y-1 transition-transform">
                                                <Store className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <span className="block font-black uppercase italic tracking-tighter">Become a Merchant</span>
                                                <span className="text-[10px] font-bold text-white/80 uppercase">Start selling your products</span>
                                            </div>
                                        </div>
                                        <ChevronRight className="text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all" />
                                    </Link>
                                )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;