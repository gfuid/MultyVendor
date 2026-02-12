import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Store, MapPin, Phone, ArrowRight, Camera, CreditCard, Tag } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../../api/axios';

const BecomeSeller = () => {
    const [logoPreview, setLogoPreview] = useState(null);
    const { register, handleSubmit, formState: { errors }, watch } = useForm();

    // Image preview logic
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const onSubmit = async (data) => {
        try {
            // Important: Use FormData for images
            const formData = new FormData();
            formData.append("storeName", data.storeName);
            formData.append("phone", data.phone);
            formData.append("address", data.address);
            formData.append("category", data.category);
            formData.append("taxId", data.taxId);
            if (data.logo[0]) formData.append("logo", data.logo[0]);

            const response = await API.post('/vendor/apply', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            toast.success("Application submitted! Redirecting to profile...");
            // Redirect after delay
            setTimeout(() => window.location.href = '/profile', 2000);
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 shadow-xl border border-pink-100">
                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-pink-50 text-[#ff4d6d] rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-[#ff4d6d]">
                        <Store size={40} />
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 italic uppercase">Seller Registration</h1>
                    <p className="text-gray-500 mt-2">Professional details for your Trireme store</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Logo Upload Section */}
                    <div className="flex flex-col items-center justify-center mb-8">
                        <div className="relative group">
                            <div className="w-32 h-32 bg-gray-100 rounded-2xl overflow-hidden border-2 border-gray-200 flex items-center justify-center">
                                {logoPreview ? (
                                    <img src={logoPreview} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <Camera className="text-gray-400 w-10 h-10" />
                                )}
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                {...register("logo", { required: "Store logo is required" })}
                                onChange={handleImageChange}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                            <div className="mt-2 text-center text-xs font-bold text-[#ff4d6d] uppercase">Upload Store Logo</div>
                        </div>
                        {errors.logo && <p className="text-red-500 text-xs mt-1">{errors.logo.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Store Name */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-tighter">Store Name</label>
                            <div className="relative">
                                <Store className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                                <input
                                    {...register("storeName", { required: "Required" })}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff4d6d] outline-none"
                                    placeholder="e.g. Punia Organics"
                                />
                            </div>
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-tighter">Category</label>
                            <div className="relative">
                                <Tag className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                                <select
                                    {...register("category", { required: "Required" })}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff4d6d] outline-none appearance-none"
                                >
                                    <option value="">Select Category</option>
                                    <option value="fashion">Fashion</option>
                                    <option value="electronics">Electronics</option>
                                    <option value="beauty">Beauty & Care</option>
                                    <option value="home">Home & Kitchen</option>
                                </select>
                            </div>
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-tighter">Business Phone</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                                <input
                                    {...register("phone", { required: "Required" })}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff4d6d] outline-none"
                                    placeholder="+91 XXXXX XXXXX"
                                />
                            </div>
                        </div>

                        {/* Tax ID / GST */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-tighter">GSTIN / Tax ID</label>
                            <div className="relative">
                                <CreditCard className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                                <input
                                    {...register("taxId", { required: "Required" })}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff4d6d] outline-none"
                                    placeholder="22AAAAA0000A1Z5"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Address */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-tighter">Warehouse Address</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                            <textarea
                                {...register("address", { required: "Required" })}
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff4d6d] outline-none h-24"
                                placeholder="Full pickup address for logistics"
                            ></textarea>
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-[#ff4d6d] text-white py-4 rounded-xl font-black uppercase flex items-center justify-center gap-2 hover:bg-[#ff7096] transition-all shadow-lg shadow-pink-100">
                        Launch My Store <ArrowRight className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BecomeSeller;