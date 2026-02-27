import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getStats, getVendors } from '../redux/slices/adminSlice';
import { TrendingUp, Users, Clock, ShoppingBag, ArrowRight } from 'lucide-react';

const StatCard = ({ title, value, color, icon: Icon }) => (
    <div className="group bg-white p-6 rounded-[2rem] border border-gray-50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{title}</p>
                <h3 className={`text-3xl font-black italic ${color}`}>{value}</h3>
            </div>
            <div className={`p-3 rounded-2xl ${color.replace('text-', 'bg-')}/10`}>
                <Icon className={color} size={24} />
            </div>
        </div>
    </div>
);

const Dashboard = () => {
    const dispatch = useDispatch();
    const { stats, vendors, loading, error } = useSelector((state) => state.admin);

    useEffect(() => {
        // Sirf tabhi fetch karein jab data na ho (Optimization)
        if (!stats) dispatch(getStats());
        if (vendors.length === 0) dispatch(getVendors());
    }, [dispatch, stats, vendors.length]);

    // 1. Loading State
    if (loading && !stats) {
        return <div className="p-20 text-center font-bold text-[#ff4d6d] animate-pulse">TERMINAL SYNCING...</div>;
    }
    return (
        <div className="p-8 space-y-10 bg-[#fff5f7] min-h-screen">
            {/* Header Section */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 italic tracking-tighter uppercase">
                        Admin <span className="text-[#ff4d6d]">Terminal</span>
                    </h1>
                    <p className="text-gray-400 font-bold text-sm tracking-wide mt-1">Real-time Marketplace Surveillance</p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-black text-gray-300 uppercase">System Status</p>
                    <p className="text-green-500 font-bold text-sm flex items-center justify-end gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span> Live Database Connected
                    </p>
                </div>
            </div>

            {/* Stats Grid - Now using Dynamic Data */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Gross Revenue" value={stats?.totalRevenue || "₹0"} color="text-[#ff4d6d]" icon={TrendingUp} />
                <StatCard title="Verified Stores" value={stats?.totalVendors || 0} color="text-blue-600" icon={Users} />
                <StatCard title="Pending Queue" value={stats?.pendingApprovals || 0} color="text-amber-500" icon={Clock} />
                <StatCard title="Live Catalog" value={stats?.totalProducts || 0} color="text-indigo-600" icon={ShoppingBag} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Applications Table */}
                <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-50">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-xl font-black text-gray-800 italic uppercase">Recent Onboarding</h2>
                        <button className="text-[#ff4d6d] font-bold text-xs flex items-center gap-1 hover:gap-2 transition-all">
                            VIEW ALL <ArrowRight size={14} />
                        </button>
                    </div>

                    <div className="space-y-4">
                        {vendors?.filter(v => v.status === 'pending').slice(0, 5).map(vendor => (
                            <div key={vendor._id} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 hover:bg-[#fff5f7] transition-colors border border-transparent hover:border-pink-100">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center font-black text-[#ff4d6d]">
                                        {vendor.storeName?.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">{vendor.storeName}</p>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase">{vendor.owner?.email}</p>
                                    </div>
                                </div>
                                <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-[10px] font-black">PENDING</span>
                            </div>
                        ))}
                        {(!vendors || vendors.filter(v => v.status === 'pending').length === 0) && (
                            <p className="text-center text-gray-300 py-10 italic">No pending applications found.</p>
                        )}
                    </div>
                </div>

                {/* System Activity / Insights */}
                <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-50">
                    <h2 className="text-xl font-black text-gray-800 italic uppercase mb-6">Market Health</h2>
                    <div className="space-y-6">
                        <div className="p-5 rounded-3xl bg-blue-50 border border-blue-100">
                            <p className="text-blue-400 text-[10px] font-black uppercase mb-1">Customer Base</p>
                            <h4 className="text-2xl font-black text-blue-700">{stats?.totalCustomers || 0}</h4>
                            <p className="text-blue-500/60 text-[10px] mt-1 font-bold">Total Registered Users</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;