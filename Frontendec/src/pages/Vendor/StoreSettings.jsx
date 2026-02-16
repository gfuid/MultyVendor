import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Store, Phone, MapPin, AlignLeft, Save, ShieldCheck, Edit3, X } from 'lucide-react';
import useAuthStore from '../../store/authStore.js';
import API from '../../api/axios';
import toast from 'react-hot-toast';

const StoreSettings = () => {
    const { user, login } = useAuthStore();
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const [isUpdating, setIsUpdating] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false); // Default: False (Read-only mode)
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStore = async () => {
            try {
                const { data } = await API.get('/vendor/settings');
                // Form fields ko database ke data se bharein
                setValue('storeName', data.storeName);
                setValue('contactPhone', data.phone);
                setValue('storeAddress', data.address);
                setValue('storeDescription', data.description || "");
                setLoading(false);
            } catch (err) {
                toast.error("Store data load nahi hua");
                setLoading(false);
            }
        };
        fetchStore();
    }, [setValue]);

    const onSubmit = async (data) => {
        setIsUpdating(true);
        const toastId = toast.loading("Updating your store profile...");
        try {
            const response = await API.put('/vendor/update-store', data);

            // Agar response success hai toh edit mode band karein
            if (response.data.success) {
                toast.success("Store updated successfully!", { id: toastId });
                setIsEditMode(false);

                // Page ko refresh karein taaki naya data dikhe
                window.location.reload();
            }
        } catch (error) {
            // Isse aapko asli error message dikhega jo backend bhej raha hai
            toast.error(error.response?.data?.message || "Internal Server Error", { id: toastId });
        } finally {
            setIsUpdating(false);
        }
    };
    if (loading) return <div className="p-20 text-center font-black animate-pulse">LOADING PROFILE...</div>;

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="max-w-3xl mx-auto bg-white rounded-[40px] shadow-sm border border-gray-100 p-10">

                {/* Header Section with Side Edit Button */}
                <header className="mb-10 flex items-center justify-between border-b border-gray-50 pb-6">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 italic uppercase tracking-tighter flex items-center gap-3">
                            <Store className="text-[#ff4d6d]" size={32} /> Store Profile
                        </h1>
                        <p className="text-gray-500 font-medium italic">Your public business identity</p>
                    </div>

                    {/* Toggle Button */}
                    {!isEditMode ? (
                        <button
                            onClick={() => setIsEditMode(true)}
                            className="flex items-center gap-2 bg-pink-50 text-[#ff4d6d] px-6 py-3 rounded-2xl font-bold hover:bg-[#ff4d6d] hover:text-white transition-all shadow-sm"
                        >
                            <Edit3 size={18} /> Edit Profile
                        </button>
                    ) : (
                        <button
                            onClick={() => setIsEditMode(false)}
                            className="flex items-center gap-2 bg-gray-100 text-gray-500 px-6 py-3 rounded-2xl font-bold hover:bg-gray-200 transition-all"
                        >
                            <X size={18} /> Cancel
                        </button>
                    )}
                </header>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
                    <div className="space-y-8">
                        {/* Section Label */}
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">General Information</label>
                            <div className="bg-green-50 text-green-600 px-3 py-1 rounded-full flex items-center gap-2 text-[10px] font-bold">
                                <ShieldCheck size={12} /> VERIFIED SELLER
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {/* Shop Name Display/Input */}
                            <div className="space-y-3">
                                <p className="text-xs font-black text-gray-400 uppercase">Shop Name</p>
                                {isEditMode ? (
                                    <div className="relative group">
                                        <Store className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-[#ff4d6d]" size={20} />
                                        <input
                                            {...register("storeName", { required: "Required" })}
                                            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:border-[#ff4d6d] outline-none transition-all font-bold text-gray-800 shadow-inner"
                                        />
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3 text-2xl font-black text-gray-900 tracking-tighter italic">
                                        {user?.storeName || "Not Set"}
                                    </div>
                                )}
                            </div>

                            {/* Official Contact Display/Input */}
                            <div className="space-y-3">
                                <p className="text-xs font-black text-gray-400 uppercase">Official Contact</p>
                                {isEditMode ? (
                                    <div className="relative group">
                                        <Phone className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-[#ff4d6d]" size={20} />
                                        <input
                                            {...register("contactPhone", { required: "Required" })}
                                            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:border-[#ff4d6d] outline-none transition-all font-bold text-gray-800 shadow-inner"
                                        />
                                    </div>
                                ) : (
                                    <div className="text-xl font-bold text-gray-700 flex items-center gap-2">
                                        <Phone size={18} className="text-[#ff4d6d]" /> {user?.contactPhone || "No contact info"}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Address Section */}
                    <div className="space-y-4">
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Logistics & Location</p>
                        {isEditMode ? (
                            <div className="relative group">
                                <MapPin className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-[#ff4d6d]" size={20} />
                                <input
                                    {...register("storeAddress")}
                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:border-[#ff4d6d] outline-none transition-all font-bold text-gray-800 shadow-inner"
                                />
                            </div>
                        ) : (
                            <div className="bg-gray-50 p-5 rounded-[24px] border border-gray-100 flex items-start gap-4">
                                <MapPin size={20} className="text-[#ff4d6d] mt-1" />
                                <p className="text-gray-700 font-bold text-lg">{user?.storeAddress || "Please add your store address"}</p>
                            </div>
                        )}
                    </div>

                    {/* Description Section */}
                    <div className="space-y-4">
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Brand Narrative</p>
                        {isEditMode ? (
                            <div className="relative group">
                                <AlignLeft className="absolute left-4 top-4 text-gray-400 group-focus-within:text-[#ff4d6d]" size={20} />
                                <textarea
                                    {...register("storeDescription")}
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:border-[#ff4d6d] outline-none transition-all font-medium text-gray-600 h-40 shadow-inner"
                                    placeholder="Describe your brand..."
                                />
                            </div>
                        ) : (
                            <div className="p-6 bg-pink-50/30 rounded-[30px] border-2 border-dashed border-pink-100">
                                <p className="text-gray-600 font-medium italic leading-relaxed text-lg">
                                    "{user?.storeDescription || "Add a catchy description to attract more customers to your shop..."}"
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Submit Button (Only shows in Edit Mode) */}
                    {isEditMode && (
                        <button
                            type="submit"
                            disabled={isUpdating}
                            className="w-full bg-[#ff4d6d] text-white py-5 rounded-[24px] font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-pink-100 hover:bg-[#ff7096] transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50"
                        >
                            <Save size={24} /> {isUpdating ? "UPDATING BIZ PROFILE..." : "CONFIRM & SAVE DETAILS"}
                        </button>
                    )}
                </form>
            </div>
        </div>
    );
};

export default StoreSettings;