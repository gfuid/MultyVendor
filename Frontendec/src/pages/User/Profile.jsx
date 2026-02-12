import React, { useEffect } from 'react';
import useAuthStore from '../../store/authStore.js';
import API from '../../api/axios'; // Axios instance
import { User, Mail, Shield, ShoppingBag, Store, ChevronRight, LayoutDashboard } from 'lucide-react';
import { Link } from 'react-router-dom';

const Profile = () => {
    const { user, login } = useAuthStore();
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;

    // Industry Standard: Fetch latest user status on mount
    useEffect(() => {
        const fetchLatestStatus = async () => {
            try {
                const response = await API.get('/auth/me'); // Backend route to get current user info
                // Update Zustand and LocalStorage with fresh data from DB
                login(response.data, localStorage.getItem('token'));
            } catch (error) {
                console.error("Status sync failed", error);
            }
        };
        fetchLatestStatus();
    }, []);

    if (!user) return <div className="text-center mt-20">Loading profile...</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header Card */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-6 mb-8">
                    <div className="w-24 h-24 bg-[#ff4d6d] rounded-full flex items-center justify-center text-white text-3xl font-black overflow-hidden">
                        {/* Dynamic Profile Pic or Initial */}
                        {user?.logo ? (
                            <img src={`${BASE_URL}${user.logo}`} alt="Logo" className="w-full h-full object-cover" />
                        ) : (
                            user?.name?.charAt(0).toUpperCase()
                        )}
                    </div>
                    <div className="text-center md:text-left flex-1">
                        <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
                        <p className="text-gray-500 flex items-center justify-center md:justify-start gap-2">
                            <Mail className="w-4 h-4" /> {user?.email}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                            <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-600 uppercase">
                                {user?.role}
                            </span>
                            {/* Check both flags to be sure */}
                            {user?.isSeller && user?.sellerStatus === 'approved' && (
                                <span className="px-3 py-1 bg-green-100 rounded-full text-xs font-bold text-green-600 uppercase flex items-center gap-1">
                                    <Shield className="w-3 h-3" /> Verified Seller
                                </span>
                            )}
                        </div>
                    </div>
                    <button className="px-6 py-2 border-2 border-[#ff4d6d] text-[#ff4d6d] rounded-xl font-bold hover:bg-[#ff4d6d] hover:text-white transition-all">
                        Edit Profile
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Shopping Activity */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-bold text-gray-800 px-2">Shopping Activity</h2>
                        <Link to="/cart" className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow group border border-transparent hover:border-pink-100">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-pink-50 rounded-xl text-[#ff4d6d]">
                                    <ShoppingBag className="w-6 h-6" />
                                </div>
                                <span className="font-semibold text-gray-700">My Orders</span>
                            </div>
                            <ChevronRight className="text-gray-300 group-hover:text-[#ff4d6d] transition-colors" />
                        </Link>
                    </div>

                    {/* Account Settings */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-bold text-gray-800 px-2">Account Settings</h2>

                        {/* FINAL LOGIC SYNC */}
                        {user?.isSeller && user?.sellerStatus === 'approved' ? (
                            <Link to="/seller/dashboard" className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow group border-2 border-green-500">
                                <div className="flex items-center gap-4 text-green-600">
                                    <div className="p-3 bg-green-50 rounded-xl">
                                        <LayoutDashboard className="w-6 h-6" />
                                    </div>
                                    <span className="font-bold">Seller Dashboard</span>
                                </div>
                                <ChevronRight className="text-green-300 group-hover:text-green-600 transition-colors" />
                            </Link>
                        ) : user?.sellerStatus === 'pending' ? (
                            <div className="flex items-center justify-between p-4 bg-orange-50 rounded-2xl border-2 border-orange-200 shadow-sm">
                                <div className="flex items-center gap-4 text-orange-600">
                                    <div className="p-3 bg-white rounded-xl shadow-inner">
                                        <Shield className="w-6 h-6 animate-pulse" />
                                    </div>
                                    <div>
                                        <span className="block font-bold">Store Under Review</span>
                                        <span className="text-xs opacity-80">Admin is verifying your details</span>
                                    </div>
                                </div>
                                <span className="text-[10px] font-black uppercase bg-orange-200 px-2 py-1 rounded-md">Pending</span>
                            </div>
                        ) : (
                            <Link to="/become-seller" className="flex items-center justify-between p-4 bg-gradient-to-r from-[#ff4d6d] to-[#ff7096] rounded-2xl shadow-sm hover:shadow-lg transition-all group">
                                <div className="flex items-center gap-4 text-white">
                                    <div className="p-3 bg-white/20 rounded-xl">
                                        <Store className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <span className="block font-bold">Become a Seller</span>
                                        <span className="text-xs opacity-80">Start selling on Trireme</span>
                                    </div>
                                </div>
                                <ChevronRight className="text-white/50 group-hover:text-white transition-colors" />
                            </Link>
                        )}


                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;