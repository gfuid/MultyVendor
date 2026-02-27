import React, { useState } from 'react';
import { ShieldCheck, FilePlus, Activity, FileText } from 'lucide-react';

const FormLegal = ({ register, errors, selectedCategory }) => {
    const [fileName, setFileName] = useState("");

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="text-gray-400 text-[10px] font-black uppercase tracking-widest border-b pb-2 flex items-center gap-2">
                <ShieldCheck size={14} /> Compliance & Taxation
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* GSTIN Field */}
                <div>
                    <label className="block text-[11px] font-black uppercase text-gray-600 mb-1">GSTIN Number</label>
                    <input
                        {...register("taxId", { required: "GSTIN is required" })}
                        className={`w-full p-4 bg-gray-50 border ${errors.taxId ? 'border-red-500' : 'border-gray-100'} rounded-2xl outline-none focus:ring-2 focus:ring-[#ff4d6d]`}
                        placeholder="GSTIN Number"
                    />
                    {errors.taxId && <p className="text-red-500 text-[10px] mt-1 font-bold italic uppercase">{errors.taxId.message}</p>}
                </div>

                {/* PAN Card Field */}
                <div>
                    <label className="block text-[11px] font-black uppercase text-gray-600 mb-1">PAN Card Number</label>
                    <input
                        {...register("panCard", { required: "PAN Card is required" })}
                        className={`w-full p-4 bg-gray-50 border ${errors.panCard ? 'border-red-500' : 'border-gray-100'} rounded-2xl outline-none focus:ring-2 focus:ring-[#ff4d6d]`}
                        placeholder="ABCDE1234F"
                    />
                    {errors.panCard && <p className="text-red-500 text-[10px] mt-1 font-bold italic uppercase">{errors.panCard.message}</p>}
                </div>

                {/* General Drug License Field (Sabke liye required) */}
                <div className="md:col-span-2">
                    <label className="block text-[11px] font-black uppercase text-gray-600 mb-1">Drug License (General/Retail)</label>
                    <div className="relative">
                        <FileText className="absolute left-4 top-4 text-gray-400" size={18} />
                        <input
                            {...register("drug", { required: "Drug License is mandatory for all sellers" })}
                            className={`w-full pl-12 pr-4 p-4 bg-gray-50 border ${errors.drug ? 'border-red-500' : 'border-gray-100'} rounded-2xl outline-none focus:ring-2 focus:ring-[#ff4d6d]`}
                            placeholder="Enter Drug License Number"
                        />
                    </div>
                    {errors.drug && <p className="text-red-500 text-[10px] mt-1 font-bold italic uppercase">{errors.drug.message}</p>}
                </div>

                {/* PHARMACY SPECIFIC DEEP VERIFICATION (Sirf Pharmacy category ke liye extra section) */}
                {selectedCategory === "pharmacy" && (
                    <div className="md:col-span-2 bg-blue-50/50 p-6 rounded-[2rem] border border-blue-100 animate-in fade-in zoom-in duration-300">
                        <h4 className="text-blue-600 text-[10px] font-black uppercase mb-4 flex items-center gap-2">
                            <Activity size={14} /> Pharmacy Regulatory Verification (Form 20/21)
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* License Number Input */}
                            <div>
                                <input
                                    {...register("drugLicenseNumber", { required: "Pharmacy license number is required" })}
                                    className="w-full p-3 bg-white border border-blue-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="License No. (Form 20/21)"
                                />
                                {errors.drugLicenseNumber && <p className="text-red-500 text-[9px] mt-1 font-bold uppercase">{errors.drugLicenseNumber.message}</p>}
                            </div>

                            {/* File Upload */}
                            <div>
                                <div className="relative bg-white border border-blue-100 rounded-xl p-3 text-center hover:bg-blue-50 transition-colors">
                                    <span className="text-xs text-blue-400 font-bold flex items-center justify-center gap-2">
                                        <FilePlus size={14} /> {fileName || "Upload License PDF/Image"}
                                    </span>
                                    <input
                                        type="file"
                                        accept=".pdf,image/*"
                                        {...register("drugLicenseFile", { required: "License document is required for pharmacy" })}
                                        onChange={(e) => setFileName(e.target.files[0]?.name)}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                </div>
                                {errors.drugLicenseFile && <p className="text-red-500 text-[9px] mt-1 font-bold uppercase">{errors.drugLicenseFile.message}</p>}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FormLegal;