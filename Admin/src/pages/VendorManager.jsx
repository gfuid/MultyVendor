import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Check, X, Trash2, Eye } from 'lucide-react';

const VendorManager = () => {
    const [vendors, setVendors] = useState([]);

    const fetchVendors = async () => {
        const res = await axios.get('/api/admin/all-vendors'); // Linked to your adminController
        setVendors(res.data);
    };

    const toggleApproval = async (id, currentStatus) => {
        await axios.put(`/api/admin/vendor-status/${id}`, { isApproved: !currentStatus });
        fetchVendors(); // Refresh list
    };

    const deleteVendor = async (id) => {
        if (window.confirm("Are you sure? This removes their store and products.")) {
            await axios.delete(`/api/admin/vendor/${id}`);
            fetchVendors();
        }
    };

    useEffect(() => { fetchVendors(); }, []);

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-pink-50 text-[#ff4d6d] uppercase text-sm">
                        <th className="p-4">Store Name</th>
                        <th className="p-4">Owner</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {vendors.map(v => (
                        <tr key={v._id} className="border-b border-gray-50 hover:bg-gray-50">
                            <td className="p-4 font-bold">{v.storeName}</td>
                            <td className="p-4 text-gray-600">{v.email}</td>
                            <td className="p-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${v.isApproved ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                                    {v.isApproved ? 'Approved' : 'Pending'}
                                </span>
                            </td>
                            <td className="p-4 flex justify-center gap-2">
                                <button onClick={() => toggleApproval(v._id, v.isApproved)} className="p-2 hover:bg-green-50 text-green-500 rounded-lg">
                                    {v.isApproved ? <X size={18} /> : <Check size={18} />}
                                </button>
                                <button onClick={() => deleteVendor(v._id)} className="p-2 hover:bg-red-50 text-red-500 rounded-lg">
                                    <Trash2 size={18} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default VendorManager;