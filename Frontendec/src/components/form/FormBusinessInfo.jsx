import React from 'react';
import { Store, Tag, AlignLeft, Info } from 'lucide-react';

const FormBusinessInfo = ({ register, errors }) => {
    return (
        <div className="space-y-6">
            {/* Section Header */}
            <div className="text-gray-400 text-[10px] font-black uppercase tracking-widest border-b pb-2 flex items-center gap-2">
                <Store size={14} /> Basic Business Profile
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 1. Store Name with Length Limitation */}
                <div>
                    <label className="block text-[11px] font-black uppercase text-gray-600 mb-1 flex justify-between">
                        Store Name <span>{errors.storeName ? '❌' : '✅'}</span>
                    </label>
                    <input
                        {...register("storeName", {
                            required: "Store name is required",
                            minLength: { value: 3, message: "Too short (Min 3 chars)" },
                            maxLength: { value: 40, message: "Too long (Max 40 chars)" },
                            pattern: {
                                value: /^[a-zA-Z0-9\s&'-]+$/,
                                message: "Only letters, numbers, and (& ' -) allowed"
                            }
                        })}
                        className={`w-full p-4 bg-gray-50 border ${errors.storeName ? 'border-red-500' : 'border-gray-100'} rounded-2xl outline-none focus:ring-2 focus:ring-[#ff4d6d] transition-all`}
                        placeholder="e.g. Punia Healthcare"
                    />
                    {errors.storeName && <p className="text-red-500 text-[10px] mt-1 font-bold italic uppercase">{errors.storeName.message}</p>}
                </div>

                {/* 2. Business Category */}
                <div>
                    <label className="block text-[11px] font-black uppercase text-gray-600 mb-1">Business Category</label>
                    <div className="relative">
                        <Tag className="absolute left-4 top-4 text-gray-400 pointer-events-none" size={16} />
                        <select
                            {...register("category", { required: "Please select a category" })}
                            className={`w-full pl-12 p-4 bg-gray-50 border ${errors.category ? 'border-red-500' : 'border-gray-100'} rounded-2xl outline-none focus:ring-2 focus:ring-[#ff4d6d] appearance-none cursor-pointer`}
                        >
                            <option value="">Select Category</option>
                            <option value="pharmacy">Pharmacy & Medicines</option>
                            <option value="fashion">Fashion & Lifestyle</option>
                            <option value="electronics">Electronics & Gadgets</option>
                            <option value="grocery">Grocery & Essentials</option>
                        </select>
                    </div>
                    {errors.category && <p className="text-red-500 text-[10px] mt-1 font-bold italic uppercase">{errors.category.message}</p>}
                </div>

                {/* 3. Store Description with Strict Limitation */}
                <div className="md:col-span-2">
                    <div className="flex justify-between items-center mb-1">
                        <label className="text-[11px] font-black uppercase text-gray-600 flex items-center gap-1">
                            <AlignLeft size={14} /> Store Description
                        </label>
                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Max 200 Characters</span>
                    </div>
                    <textarea
                        {...register("description", {
                            required: "Description is required",
                            maxLength: { value: 200, message: "Description cannot exceed 200 characters" },
                            minLength: { value: 20, message: "Please provide a more detailed description (Min 20 chars)" }
                        })}
                        className={`w-full p-4 bg-gray-50 border ${errors.description ? 'border-red-500' : 'border-gray-100'} rounded-2xl outline-none h-28 resize-none focus:ring-2 focus:ring-[#ff4d6d] transition-all`}
                        placeholder="Briefly describe your store. This helps customers trust your brand..."
                    ></textarea>
                    {errors.description && <p className="text-red-500 text-[10px] mt-1 font-bold italic uppercase">{errors.description.message}</p>}
                </div>

                {/* 4. Support Email (More Fields) */}
                <div>
                    <label className="block text-[11px] font-black uppercase text-gray-600 mb-1">Customer Support Email</label>
                    <input
                        {...register("supportEmail", {
                            required: "Support email is required",
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Invalid email address"
                            }
                        })}
                        className={`w-full p-4 bg-gray-50 border ${errors.supportEmail ? 'border-red-500' : 'border-gray-100'} rounded-2xl outline-none focus:ring-2 focus:ring-[#ff4d6d]`}
                        placeholder="support@yourstore.com"
                    />
                    {errors.supportEmail && <p className="text-red-500 text-[10px] mt-1 font-bold italic uppercase">{errors.supportEmail.message}</p>}
                </div>

                {/* 5. Experience/Years in Business */}
                <div>
                    <label className="block text-[11px] font-black uppercase text-gray-600 mb-1">Years of Experience</label>
                    <input
                        type="number"
                        {...register("experience", {
                            required: "Experience is required",
                            min: { value: 0, message: "Cannot be negative" },
                            max: { value: 50, message: "Invalid experience" }
                        })}
                        className={`w-full p-4 bg-gray-50 border ${errors.experience ? 'border-red-500' : 'border-gray-100'} rounded-2xl outline-none focus:ring-2 focus:ring-[#ff4d6d]`}
                        placeholder="Years (e.g. 5)"
                    />
                    {errors.experience && <p className="text-red-500 text-[10px] mt-1 font-bold italic uppercase">{errors.experience.message}</p>}
                </div>
            </div>

            {/* Verification Note */}
            <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 flex items-start gap-3">
                <Info size={18} className="text-orange-400 shrink-0" />
                <p className="text-[10px] text-orange-700 font-medium">
                    Note: Store information will be reviewed by the Trireme Admin team. Incorrect details may lead to application rejection.
                </p>
            </div>
        </div>
    );
};

export default FormBusinessInfo;