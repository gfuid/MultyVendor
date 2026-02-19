import React from 'react';

const StatCard = ({ title, value, color }) => (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
        <h3 className={`text-2xl font-black ${color}`}>{value}</h3>
    </div>
);

const Dashboard = () => {
    return (
        <div className="p-8 space-y-8">
            <div>
                <h1 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Admin Overview</h1>
                <p className="text-gray-500 text-sm">Monitor your marketplace performance.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Revenue" value="₹1,24,500" color="text-[#ff4d6d]" />
                <StatCard title="Active Vendors" value="12" color="text-blue-500" />
                <StatCard title="Pending Approvals" value="5" color="text-orange-500" />
                <StatCard title="Total Customers" value="850" color="text-green-500" />
            </div>

            {/* Placeholder for Recent Activities or Charts */}
            <div className="bg-white p-6 rounded-3xl border border-pink-50 min-h-[400px]">
                <h2 className="font-bold text-gray-700 mb-4">Recent Vendor Applications</h2>
                <p className="text-gray-400 text-sm italic">New vendor requests will appear here...</p>
            </div>
        </div>
    );
};

export default Dashboard;