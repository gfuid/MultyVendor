import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Package, IndianRupee, Tag, Image as ImageIcon, Plus, X, ArrowRight } from 'lucide-react';
import API from '../../api/axios';
import toast from 'react-hot-toast';

const AddProduct = () => {
    const [images, setImages] = useState([]);
    const [previews, setPreviews] = useState([]);
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        // Check if total images (existing + new) exceed 5
        if (images.length + files.length > 5) {
            toast.error(" maximum 5 images allowed!");
            return;
        }

        // New files ko purani files ke saath merge karein
        const updatedImages = [...images, ...files];
        setImages(updatedImages);

        // Previews generate karein
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviews([...previews, ...newPreviews]);
    };

    // individual image delete karne ka feature (Best Practice)
    const removeImage = (index) => {
        const filteredImages = images.filter((_, i) => i !== index);
        const filteredPreviews = previews.filter((_, i) => i !== index);
        setImages(filteredImages);
        setPreviews(filteredPreviews);
    };

    const onSubmit = async (data) => {
        if (images.length === 0) {
            toast.error("Atleast one image required!");
            return;
        }

        const toastId = toast.loading("Uploading product...");
        try {
            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("description", data.description);
            formData.append("price", data.price);
            formData.append("category", data.category);
            formData.append("stock", data.stock);

            // Backend array expect karta hai, isliye loop chalayein
            images.forEach((image) => {
                formData.append("images", image);
            });

            await API.post('/products/add', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            toast.success("Product added successfully!", { id: toastId });

            // Clear everything after success
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
                    <h1 className="text-3xl font-black text-gray-900 italic flex items-center gap-3 uppercase">
                        <Plus className="bg-[#ff4d6d] text-white rounded-lg p-1" /> Add New Product
                    </h1>
                    <p className="text-gray-500 font-medium mt-1">Apne product ki details bharein (Max 5 images).</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Product Name</label>
                                <div className="relative text-gray-400 focus-within:text-[#ff4d6d] transition-colors">
                                    <Package className="absolute left-3 top-3.5 w-5 h-5" />
                                    <input
                                        {...register("name", { required: "Product name is required" })}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff4d6d] outline-none text-gray-700"
                                        placeholder="e.g. Cotton Summer T-Shirt"
                                    />
                                </div>
                                {errors.name && <p className="text-red-500 text-xs mt-1 font-bold">{errors.name.message}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Price (₹)</label>
                                    <div className="relative text-gray-400 focus-within:text-[#ff4d6d]">
                                        <IndianRupee className="absolute left-3 top-3.5 w-5 h-5" />
                                        <input
                                            type="number"
                                            {...register("price", { required: "Required" })}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff4d6d] outline-none text-gray-700"
                                            placeholder="999"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Stock</label>
                                    <input
                                        type="number"
                                        {...register("stock", { required: "Required" })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff4d6d] outline-none text-gray-700"
                                        placeholder="50"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Category</label>
                                <div className="relative text-gray-400 focus-within:text-[#ff4d6d]">
                                    <Tag className="absolute left-3 top-3.5 w-5 h-5" />
                                    <select
                                        {...register("category", { required: "Select category" })}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff4d6d] outline-none appearance-none text-gray-700 bg-white"
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

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Description</label>
                                <textarea
                                    {...register("description", { required: "Required" })}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff4d6d] outline-none h-32 text-gray-700"
                                    placeholder="Describe your product..."
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">
                                    Images ({images.length}/5)
                                </label>
                                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center relative hover:border-[#ff4d6d] transition-all bg-gray-50 group">
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        disabled={images.length >= 5}
                                        className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
                                    />
                                    <div className="flex flex-col items-center">
                                        <ImageIcon className={`w-10 h-10 mb-2 ${images.length >= 5 ? 'text-gray-300' : 'text-gray-400 group-hover:text-[#ff4d6d]'}`} />
                                        <p className="text-xs font-bold text-gray-500 uppercase">
                                            {images.length >= 5 ? "Limit Reached" : "Select up to 5 images"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-3 mt-4">
                                    {previews.map((src, i) => (
                                        <div key={i} className="relative w-20 h-20 group">
                                            <img src={src} className="w-full h-full object-cover rounded-xl border border-gray-200 shadow-sm" alt="" />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(i)}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:scale-110 transition-transform opacity-0 group-hover:opacity-100"
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={images.length === 0}
                        className="w-full bg-[#ff4d6d] text-white py-4 rounded-2xl font-black uppercase text-lg shadow-lg shadow-pink-100 hover:bg-[#ff7096] transition-all flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:shadow-none"
                    >
                        Post Product Now <ArrowRight size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;