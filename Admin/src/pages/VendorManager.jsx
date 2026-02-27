import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getVendors, updateVendorStatusAction, approveStoreAction } from '../redux/slices/adminSlice';
import { CheckCircle, XCircle, Eye, Store as StoreIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const VendorManager = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { vendors, loading } = useSelector((state) => state.admin);

    useEffect(() => {
        dispatch(getVendors());
    }, [dispatch]);

    // Unified Approval/Toggle Handler
    const handleStatusToggle = (id, currentStatus) => {
        const loadToast = toast.loading("Updating Market Status...");

        // Agar status 'pending' hai toh 'approveStoreAction' use karein
        // Agar pehle se approved/suspended hai toh 'updateVendorStatusAction' use karein
        const actionToDispatch = currentStatus === 'pending'
            ? approveStoreAction(id)
            : updateVendorStatusAction({ id, isApproved: currentStatus !== 'approved' });

        dispatch(actionToDispatch)
            .unwrap()
            .then(() => {
                toast.success("Terminal Updated Successfully", { id: loadToast });
            })
            .catch((err) => {
                toast.error(err || "Update Failed", { id: loadToast });
            });
    };

    if (loading && vendors.length === 0) return (
        <div className="p-20 text-center font-bold text-[#ff4d6d] animate-pulse italic uppercase tracking-widest">
            Syncing Terminal Data...
        </div>
    );

    return (
        <div className="p-8 bg-[#fff5f7] min-h-screen">
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-pink-50 overflow-hidden">
                {/* Header Section */}
                <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-white">
                    <div>
                        <h2 className="text-2xl font-black text-gray-800 italic uppercase">Vendor Terminal</h2>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-tighter">Centralized Seller Governance</p>
                    </div>
                    <div className="bg-pink-50 px-6 py-2 rounded-2xl border border-pink-100">
                        <span className="text-[#ff4d6d] font-black text-sm uppercase">{vendors?.length || 0} Units Detected</span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 uppercase text-[9px] font-black text-gray-400 tracking-widest">
                                <th className="p-6">Entity Identity</th>
                                <th className="p-6">Classification</th>
                                <th className="p-6">Market Status</th>
                                <th className="p-6 text-center">Operational Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {vendors?.length > 0 ? vendors.map((vendor) => (
                                <tr key={vendor._id} className="hover:bg-[#fff5f7]/30 transition-all group">
                                    <td className="p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden border border-gray-50">
                                                {vendor.businessInfo?.logo ? (
                                                    <img src={vendor.businessInfo.logo} className="w-full h-full object-cover" alt="Logo" />
                                                ) : <StoreIcon size={20} className="text-gray-300" />}
                                            </div>
                                            <div>
                                                <p className="font-black text-gray-800 italic uppercase tracking-tight">
                                                    {vendor.businessInfo?.storeName || "Unknown Unit"}
                                                </p>
                                                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">UID: {vendor._id.slice(-8)}</p>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="p-6">
                                        <p className="text-[10px] font-black text-[#ff4d6d] uppercase tracking-widest">{vendor.businessInfo?.category || 'General'}</p>
                                        <p className="text-xs font-medium text-gray-500">{vendor.owner?.email || vendor.email}</p>
                                    </td>

                                    <td className="p-6">
                                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${vendor.status === 'approved'
                                                ? 'bg-green-50 text-green-600 border-green-100'
                                                : vendor.status === 'suspended'
                                                    ? 'bg-red-50 text-red-600 border-red-100'
                                                    : 'bg-amber-50 text-amber-600 border-amber-100'
                                            }`}>
                                            {vendor.status || 'Pending'}
                                        </span>
                                    </td>

                                    <td className="p-6 text-center">
                                        <div className="flex justify-center gap-3">
                                            <button
                                                onClick={() => handleStatusToggle(vendor._id, vendor.status)}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black transition-all ${vendor.status === 'approved'
                                                        ? 'bg-red-50 text-red-500 hover:bg-red-500 hover:text-white'
                                                        : 'bg-green-50 text-green-600 hover:bg-green-600 hover:text-white'
                                                    }`}
                                            >
                                                {vendor.status === 'approved' ? <XCircle size={14} /> : <CheckCircle size={14} />}
                                                {vendor.status === 'approved' ? 'SUSPEND' : 'APPROVE'}
                                            </button>

                                            <button
                                                onClick={() => navigate(`/admin/vendors/${vendor._id}`)}
                                                className="p-2 bg-gray-900 text-white rounded-xl hover:bg-[#ff4d6d] transition-all shadow-lg shadow-gray-200"
                                            >
                                                <Eye size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" className="p-32 text-center text-gray-300 font-black italic uppercase tracking-widest text-xl">
                                        Operational Queue Empty
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default VendorManager;