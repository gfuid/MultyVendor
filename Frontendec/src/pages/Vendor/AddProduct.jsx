import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Package, IndianRupee, Tag, AlignLeft, Image as ImageIcon, Plus, X, ArrowRight } from 'lucide-react';
import API from '../../api/axios';
import toast from 'react-hot-toast';

const AddProduct = () => {
    const [images, setImages] = useState([]);
    const [previews, setPreviews] = useState([]);
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    // Image preview handler
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(files);

        const filePreviews = files.map(file => URL.createObjectURL(file));
        setPreviews(filePreviews);
    };

    const onSubmit = async (data) => {
        const toastId = toast.loading("Uploading product...");
        try {
            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("description", data.description);
            formData.append("price", data.price);
            formData.append("category", data.category);
            formData.append("stock", data.stock);

            // Append multiple images
            images.forEach((image) => {
                formData.append("images", image);
            });

            await API.post('/products/add', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            toast.success("Product added successfully!", { id: toastId });
            reset();
            setPreviews([]);
            setImages([]);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add product", { id: toastId });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
                <div className="mb-8 border-b border-gray-50 pb-6">
                    <h1 className="text-3xl font-black text-gray-900 italic flex items-center gap-3">
                        <Plus className="bg-[#ff4d6d] text-white rounded-lg p-1" /> ADD NEW PRODUCT
                    </h1>
                    <p className="text-gray-500 font-medium mt-1">Apne product ki details bharein aur selling shuru karein.</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left Side: Basic Info */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-tighter">Product Name</label>
                                <div className="relative">
                                    <Package className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                                    <input
                                        {...register("name", { required: "Product name is required" })}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff4d6d] outline-none"
                                        placeholder="e.g. Cotton Summer T-Shirt"
                                    />
                                </div>
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-tighter">Price (₹)</label>
                                    <div className="relative">
                                        <IndianRupee className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                                        <input
                                            type="number"
                                            {...register("price", { required: "Price is required" })}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff4d6d] outline-none"
                                            placeholder="999"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-tighter">Stock Count</label>
                                    <input
                                        type="number"
                                        {...register("stock", { required: "Stock is required" })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff4d6d] outline-none"
                                        placeholder="50"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-tighter">Category</label>
                                <div className="relative">
                                    <Tag className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                                    <select
                                        {...register("category", { required: "Select a category" })}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff4d6d] outline-none appearance-none"
                                    >
                                        <option value="">Choose Category</option>
                                        <option value="fashion">Fashion</option>
                                        <option value="electronics">Electronics</option>
                                        <option value="beauty">Beauty & Care</option>
                                        <option value="home">Home & Kitchen</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Description & Images */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-tighter">Product Description</label>
                                <div className="relative">
                                    <AlignLeft className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                                    <textarea
                                        {...register("description", { required: "Description is required" })}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff4d6d] outline-none h-32"
                                        placeholder="Describe your product features..."
                                    ></textarea>
                                </div>
                            </div>

                            {/* Multi-Image Upload */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-tighter">Product Images</label>
                                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-4 text-center relative hover:border-[#ff4d6d] transition-colors">
                                    <input
                                        type="file"
                                        multiple
                                        onChange={handleImageChange}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                    <div className="flex flex-col items-center">
                                        <ImageIcon className="text-gray-400 w-8 h-8 mb-2" />
                                        <p className="text-xs font-bold text-gray-500 uppercase">Click to upload multiple images</p>
                                    </div>
                                </div>
                                {/* Image Previews */}
                                <div className="flex flex-wrap gap-2 mt-4">
                                    {previews.map((src, i) => (
                                        <div key={i} className="w-16 h-16 rounded-lg overflow-hidden border border-gray-100">
                                            <img src={src} className="w-full h-full object-cover" alt="Preview" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-[#ff4d6d] text-white py-4 rounded-xl font-black uppercase text-lg shadow-lg shadow-pink-100 hover:bg-[#ff7096] transition-all flex items-center justify-center gap-2">
                        Post Product Now <ArrowRight />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;