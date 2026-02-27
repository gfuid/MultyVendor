import React, { useEffect, useState } from 'react';
import { Users as UsersIcon, Mail, Shield, UserCheck, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../api/index';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch All Users
    const fetchUsers = async () => {
        try {
            // Console karke dekhein ki request ja kahan rahi hai
            console.log("Fetching from: /admin/users");
            const response = await API.get('/admin/users');
            console.log("Full Response:", response.data);

            // Agar response.data direct array hai toh setUsers(response.data)
            if (response.data && response.data.users) {
                setUsers(response.data.users);
            } else {
                setUsers(response.data); // Fallback agar array direct aa raha ho
            }
        } catch (error) {
            console.error("API Error Details:", error.response);
            toast.error("Data load nahi ho pa raha");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);




    const handleDelete = async (id) => {
        // Confirmation Dialog
        if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
            return;
        }

        // Notification start
        const loadToast = toast.loading("Processing request...");

        try {
            // Backend API call
            const response = await API.delete(`/admin/users/${id}`);

            if (response.data.success) {
                // Success Notification in English
                toast.success("User successfully removed from the system.", { id: loadToast });

                // UI state update (Flicker-free removal)
                setUsers(prevUsers => prevUsers.filter((u) => u._id !== id));
            }
        } catch (error) {
            console.error("Delete Error:", error.response);

            // Error Notification in English
            const errorMessage = error.response?.data?.message || "Failed to delete user. Please try again.";
            toast.error(errorMessage, { id: loadToast });
        }
    };

    if (loading) return <div className="p-10 text-center font-bold animate-pulse">Loading Users Terminal...</div>;

    return (
        <div className="p-6 lg:p-10 bg-[#fff5f7] min-h-screen">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 uppercase italic flex items-center gap-3">
                        <UsersIcon className="text-[#ff4d6d]" size={32} /> User Management
                    </h1>
                    <p className="text-gray-500 font-medium">Total registered users: {users.length}</p>
                </div>
                <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-pink-100 flex items-center gap-4">
                    <div className="text-center">
                        <p className="text-[10px] font-black text-gray-400 uppercase">Active Base</p>
                        <p className="text-xl font-black text-[#ff4d6d]">{users.length}</p>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-pink-50">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-[11px] font-black uppercase text-gray-400">User Details</th>
                                <th className="px-6 py-4 text-[11px] font-black uppercase text-gray-400">Role</th>
                                <th className="px-6 py-4 text-[11px] font-black uppercase text-gray-400">Seller Status</th>
                                <th className="px-6 py-4 text-[11px] font-black uppercase text-gray-400">Joined</th>
                                <th className="px-6 py-4 text-[11px] font-black uppercase text-gray-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {users.map((user) => (
                                <tr key={user._id} className="hover:bg-pink-50/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-[#ff4d6d] font-bold">
                                                {user.name?.charAt(0) || 'U'}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">{user.name || 'N/A'}</p>
                                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                                    <Mail size={12} /> {user.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center w-fit gap-1 ${user.role === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                                            }`}>
                                            <Shield size={10} /> {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            <span className={`text-[10px] font-bold uppercase ${user.isSeller ? 'text-green-500' : 'text-gray-400'}`}>
                                                {user.isSeller ? 'Verified Seller' : 'Regular Buyer'}
                                            </span>
                                            {user.sellerStatus && user.sellerStatus !== 'none' && (
                                                <span className="text-[9px] bg-gray-100 px-2 py-0.5 rounded italic w-fit">
                                                    Status: {user.sellerStatus}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                                        {new Date(user.createdAt).toLocaleDateString('en-GB')}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleDelete(user._id)}
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Users;