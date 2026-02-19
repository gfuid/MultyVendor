import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle, XCircle, Trash2 } from 'lucide-react';

const VendorTable = () => {
    const [vendors, setVendors] = useState([]);

    const fetchVendors = async () => {
        try {
            const { data } = await axios.get('/api/admin/vendors');
            // Handle both cases: direct array OR object with vendor property
            const actualData = Array.isArray(data) ? data : data.vendors;
            setVendors(actualData || []);
        } catch (error) {
            console.error("Fetch failed", error);
            setVendors([]); // Fallback to empty array on error
        }
    };

    const handleStatusChange = async (id, status) => {
        await axios.put(`/api/admin/vendor/${id}/status`, { isApproved: status });
        fetchVendors(); // Refresh UI
    };

    useEffect(() => { fetchVendors(); }, []);

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-pink-50 overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-[#fff5f7] text-[#ff4d6d] font-bold text-sm uppercase">
                    <tr>
                        <th className="p-5">Store Name</th>
                        <th className="p-5">Email</th>
                        <th className="p-5">Status</th>
                        <th className="p-5">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-pink-50">
                    {vendors.map((vendor) => (
                        <tr key={vendor._id} className="hover:bg-pink-50/30 transition-colors">
                            <td className="p-5 font-bold text-gray-700">{vendor.storeName}</td>
                            <td className="p-5 text-gray-500">{vendor.email}</td>
                            <td className="p-5">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${vendor.isApproved ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                                    }`}>
                                    {vendor.isApproved ? 'Live' : 'Pending'}
                                </span>
                            </td>
                            <td className="p-5 flex gap-3">
                                <button onClick={() => handleStatusChange(vendor._id, !vendor.isApproved)}
                                    className="text-gray-400 hover:text-[#ff4d6d]">
                                    {vendor.isApproved ? <XCircle size={20} /> : <CheckCircle size={20} />}
                                </button>
                                <button className="text-gray-400 hover:text-red-500">
                                    <Trash2 size={20} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default VendorTable;