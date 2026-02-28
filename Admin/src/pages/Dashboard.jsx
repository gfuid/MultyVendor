import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getStats, getVendors } from '../redux/slices/adminSlice';
import { useNavigate } from 'react-router-dom';
import {
    TrendingUp, Users, Clock, ShoppingBag,
    ArrowRight, Activity, Zap, Store,
    ChevronUp, ChevronDown, Circle
} from 'lucide-react';

// ─── Stat Card ────────────────────────────────────────────────
const StatCard = ({ title, value, icon: Icon, accent, trend, sub }) => (
    <div className={`relative overflow-hidden rounded-3xl p-6 border transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl group cursor-default`}
        style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}>

        {/* Glow blob */}
        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-20 blur-2xl transition-all duration-500 group-hover:opacity-40 group-hover:scale-125"
            style={{ background: accent }} />

        <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
                <div className="p-2.5 rounded-2xl" style={{ background: `${accent}20` }}>
                    <Icon size={18} style={{ color: accent }} />
                </div>
                {trend !== undefined && (
                    <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-full ${trend >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                        {trend >= 0 ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
                        {Math.abs(trend)}%
                    </div>
                )}
            </div>

            <p className="text-[10px] font-black uppercase tracking-[0.25em] mb-1"
                style={{ color: 'rgba(255,255,255,0.4)' }}>
                {title}
            </p>
            <h3 className="text-3xl font-black tracking-tighter text-white">{value}</h3>
            {sub && <p className="text-[10px] mt-1 font-bold" style={{ color: 'rgba(255,255,255,0.3)' }}>{sub}</p>}
        </div>
    </div>
);

// ─── Vendor Row ───────────────────────────────────────────────
const VendorRow = ({ vendor, navigate }) => {
    const initial = vendor.businessInfo?.storeName?.charAt(0)?.toUpperCase() || '?';
    const status = vendor.status || 'pending';
    const statusColors = {
        pending: { bg: 'rgba(245,158,11,0.15)', text: '#f59e0b' },
        approved: { bg: 'rgba(16,185,129,0.15)', text: '#10b981' },
        rejected: { bg: 'rgba(239,68,68,0.15)', text: '#ef4444' },
    };
    const sc = statusColors[status] || statusColors.pending;

    return (
        <div
            onClick={() => navigate(`/vendors/${vendor._id}`)}
            className="flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all duration-200 group"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,77,109,0.08)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
        >
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm flex-shrink-0"
                    style={{ background: 'rgba(255,77,109,0.2)', color: '#ff4d6d' }}>
                    {initial}
                </div>
                <div>
                    <p className="font-black text-white text-sm">{vendor.businessInfo?.storeName || 'Unnamed Store'}</p>
                    <p className="text-[10px] font-bold" style={{ color: 'rgba(255,255,255,0.35)' }}>
                        {vendor.owner?.email || '—'}
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest"
                    style={{ background: sc.bg, color: sc.text }}>
                    {status}
                </span>
                <ArrowRight size={14} style={{ color: 'rgba(255,255,255,0.2)' }}
                    className="group-hover:translate-x-1 transition-transform" />
            </div>
        </div>
    );
};

// ─── Main Dashboard ───────────────────────────────────────────
const Dashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { stats, vendors, loading } = useSelector((state) => state.admin);

    useEffect(() => {
        if (!stats) dispatch(getStats());
        if (!vendors || vendors.length === 0) dispatch(getVendors());
    }, [dispatch, stats, vendors?.length]);

    const pendingVendors = useMemo(() =>
        (vendors || []).filter(v => v.status === 'pending').slice(0, 5),
        [vendors]);

    const approvedCount = useMemo(() =>
        (vendors || []).filter(v => v.status === 'approved').length,
        [vendors]);

    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });

    if (loading && !stats) return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a0f' }}>
            <div className="text-center space-y-4">
                <div className="w-12 h-12 border-2 border-t-transparent rounded-full animate-spin mx-auto"
                    style={{ borderColor: 'rgba(255,77,109,0.4)', borderTopColor: '#ff4d6d' }} />
                <p className="font-black text-xs uppercase tracking-[0.3em]" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    Syncing Terminal...
                </p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen p-6 md:p-10" style={{ background: '#0a0a0f', color: 'white' }}>

            {/* ── TOP BAR ──────────────────────────────────── */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
                <div>
                    {/* Live indicator */}
                    <div className="flex items-center gap-2 mb-3">
                        <Circle size={6} fill="#10b981" className="text-emerald-400 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]"
                            style={{ color: '#10b981' }}>Live • All Systems Operational</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-none">
                        Admin{' '}
                        <span style={{
                            background: 'linear-gradient(135deg, #ff4d6d, #ff8fa3)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>Terminal</span>
                    </h1>
                    <p className="mt-2 font-bold text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>
                        {dateStr}
                    </p>
                </div>

                {/* Clock widget */}
                <div className="flex-shrink-0 px-6 py-4 rounded-2xl"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <p className="text-[10px] font-black uppercase tracking-widest mb-0.5"
                        style={{ color: 'rgba(255,255,255,0.3)' }}>IST</p>
                    <p className="text-2xl font-black tracking-tight tabular-nums">{timeStr}</p>
                </div>
            </div>

            {/* ── STAT CARDS ───────────────────────────────── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard title="Gross Revenue" value={stats?.totalRevenue || '₹0'} icon={TrendingUp} accent="#ff4d6d" trend={12} sub="All time" />
                <StatCard title="Verified Stores" value={stats?.totalVendors || approvedCount || 0} icon={Store} accent="#6366f1" trend={5} sub="Active sellers" />
                <StatCard title="Pending Review" value={stats?.pendingApprovals || pendingVendors.length || 0} icon={Clock} accent="#f59e0b" sub="Awaiting approval" />
                <StatCard title="Live Products" value={stats?.totalProducts || 0} icon={ShoppingBag} accent="#10b981" trend={8} sub="In catalog" />
            </div>

            {/* ── SECONDARY ROW ────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

                {/* Mini stats */}
                <div className="grid grid-cols-1 gap-4">
                    {[
                        { label: 'Customer Base', value: stats?.totalCustomers || 0, icon: Users, color: '#a78bfa' },
                        { label: 'Platform Health', value: '99.8%', icon: Activity, color: '#10b981' },
                        { label: 'Active Sessions', value: '—', icon: Zap, color: '#f59e0b' },
                    ].map(({ label, value, icon: Icon, color }) => (
                        <div key={label} className="flex items-center gap-4 p-4 rounded-2xl"
                            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                            <div className="p-2.5 rounded-xl" style={{ background: `${color}20` }}>
                                <Icon size={16} style={{ color }} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest"
                                    style={{ color: 'rgba(255,255,255,0.35)' }}>{label}</p>
                                <p className="font-black text-lg text-white">{value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Vendor status breakdown */}
                <div className="lg:col-span-2 rounded-3xl p-6"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <h2 className="font-black uppercase tracking-widest text-xs mb-5"
                        style={{ color: 'rgba(255,255,255,0.4)' }}>
                        Store Pipeline
                    </h2>
                    <div className="space-y-4">
                        {[
                            { label: 'Approved', count: (vendors || []).filter(v => v.status === 'approved').length, color: '#10b981', total: vendors?.length || 1 },
                            { label: 'Pending', count: (vendors || []).filter(v => v.status === 'pending').length, color: '#f59e0b', total: vendors?.length || 1 },
                            { label: 'Rejected', count: (vendors || []).filter(v => v.status === 'rejected').length, color: '#ef4444', total: vendors?.length || 1 },
                        ].map(({ label, count, color, total }) => {
                            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                            return (
                                <div key={label}>
                                    <div className="flex justify-between mb-1.5">
                                        <span className="text-xs font-black uppercase tracking-widest"
                                            style={{ color: 'rgba(255,255,255,0.5)' }}>{label}</span>
                                        <span className="text-xs font-black" style={{ color }}>{count} · {pct}%</span>
                                    </div>
                                    <div className="h-2 rounded-full overflow-hidden"
                                        style={{ background: 'rgba(255,255,255,0.06)' }}>
                                        <div className="h-full rounded-full transition-all duration-700"
                                            style={{ width: `${pct}%`, background: color }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ── RECENT ONBOARDING ────────────────────────── */}
            <div className="rounded-3xl p-6"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>

                <div className="flex items-center justify-between mb-6">
                    <h2 className="font-black uppercase tracking-widest text-xs"
                        style={{ color: 'rgba(255,255,255,0.4)' }}>
                        Recent Onboarding — Pending
                        <span className="ml-3 px-2 py-0.5 rounded-full text-[#f59e0b]"
                            style={{ background: 'rgba(245,158,11,0.15)' }}>
                            {pendingVendors.length}
                        </span>
                    </h2>
                    <button
                        onClick={() => navigate('/vendors')}
                        className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest transition-all hover:gap-3"
                        style={{ color: '#ff4d6d' }}
                    >
                        View All <ArrowRight size={12} />
                    </button>
                </div>

                <div className="space-y-2">
                    {pendingVendors.length > 0
                        ? pendingVendors.map(vendor => (
                            <VendorRow key={vendor._id} vendor={vendor} navigate={navigate} />
                        ))
                        : (
                            <div className="py-12 text-center">
                                <p className="font-black text-sm uppercase tracking-widest"
                                    style={{ color: 'rgba(255,255,255,0.15)' }}>
                                    No pending applications
                                </p>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    );
};

export default Dashboard;