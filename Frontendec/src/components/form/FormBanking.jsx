// Galti: { Landmark, MapPin, Phone, User, Building, Hash, GitBranch, wallet }
// Sahi: { Landmark, MapPin, Phone, User, Building, Hash, GitBranch, Wallet }

import React from 'react';
import { Landmark, MapPin, Phone, User, Building, Hash, GitBranch, Wallet } from 'lucide-react';
const FormBanking = ({ register, errors }) => {
    return (
        <div className="space-y-6">
            {/* Section Header */}
            <div className="text-gray-400 text-[10px] font-black uppercase tracking-widest border-b pb-2 flex items-center gap-2">
                <Landmark size={14} /> Settlement & Logistics
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* 1. Account Holder Name */}
                <div className="md:col-span-2">
                    <label className="block text-[11px] font-black uppercase text-gray-600 mb-1">Account Holder Name</label>
                    <div className="relative">
                        <User className="absolute left-4 top-4 text-gray-400" size={16} />
                        <input
                            {...register("accountHolderName", { required: "Account holder name is required" })}
                            className={`w-full pl-12 p-4 bg-gray-50 border ${errors.accountHolderName ? 'border-red-500' : 'border-gray-100'} rounded-2xl outline-none focus:ring-2 focus:ring-[#ff4d6d] transition-all`}
                            placeholder="Full name as per bank records"
                        />
                    </div>
                    {errors.accountHolderName && <p className="text-red-500 text-[10px] mt-1 font-bold italic uppercase">{errors.accountHolderName.message}</p>}
                </div>

                {/* 2. Bank Name */}
                <div>
                    <label className="block text-[11px] font-black uppercase text-gray-600 mb-1">Bank Name</label>
                    <div className="relative">
                        <Building className="absolute left-4 top-4 text-gray-400" size={16} />
                        <input
                            {...register("bankName", { required: "Bank name is required" })}
                            className={`w-full pl-12 p-4 bg-gray-50 border ${errors.bankName ? 'border-red-500' : 'border-gray-100'} rounded-2xl outline-none focus:ring-2 focus:ring-[#ff4d6d]`}
                            placeholder="e.g. ICICI Bank"
                        />
                    </div>
                    {errors.bankName && <p className="text-red-500 text-[10px] mt-1 font-bold italic uppercase">{errors.bankName.message}</p>}
                </div>

                {/* 3. Branch Name (NEW FIELD) */}
                <div>
                    <label className="block text-[11px] font-black uppercase text-gray-600 mb-1">Branch Name</label>
                    <div className="relative">
                        <GitBranch className="absolute left-4 top-4 text-gray-400" size={16} />
                        <input
                            {...register("branchName", { required: "Branch name is required" })}
                            className={`w-full pl-12 p-4 bg-gray-50 border ${errors.branchName ? 'border-red-500' : 'border-gray-100'} rounded-2xl outline-none focus:ring-2 focus:ring-[#ff4d6d]`}
                            placeholder="e.g. Connaught Place Branch"
                        />
                    </div>
                    {errors.branchName && <p className="text-red-500 text-[10px] mt-1 font-bold italic uppercase">{errors.branchName.message}</p>}
                </div>

                {/* 4. Account Number */}
                <div>
                    <label className="block text-[11px] font-black uppercase text-gray-600 mb-1">Bank Account Number</label>
                    <div className="relative">
                        <Hash className="absolute left-4 top-4 text-gray-400" size={16} />
                        <input
                            {...register("bankAccount", { required: "Account number is required" })}
                            className={`w-full pl-12 p-4 bg-gray-50 border ${errors.bankAccount ? 'border-red-500' : 'border-gray-100'} rounded-2xl outline-none focus:ring-2 focus:ring-[#ff4d6d]`}
                            placeholder="0000 0000 0000"
                        />
                    </div>
                    {errors.bankAccount && <p className="text-red-500 text-[10px] mt-1 font-bold italic uppercase">{errors.bankAccount.message}</p>}
                </div>

                {/* 5. Account Type (NEW FIELD) */}
                <div>
                    <label className="block text-[11px] font-black uppercase text-gray-600 mb-1">Account Type</label>
                    <select
                        {...register("accountType", { required: "Select account type" })}
                        className={`w-full p-4 bg-gray-50 border ${errors.accountType ? 'border-red-500' : 'border-gray-100'} rounded-2xl outline-none focus:ring-2 focus:ring-[#ff4d6d]`}
                    >
                        <option value="">Select Type</option>
                        <option value="savings">Savings Account</option>
                        <option value="current">Current Account</option>
                    </select>
                    {errors.accountType && <p className="text-red-500 text-[10px] mt-1 font-bold italic uppercase">{errors.accountType.message}</p>}
                </div>

                {/* 6. IFSC Code */}
                <div>
                    <label className="block text-[11px] font-black uppercase text-gray-600 mb-1">IFSC Code</label>
                    <input
                        {...register("ifscCode", {
                            required: "IFSC Code is required",
                            pattern: {
                                value: /^[A-Z]{4}0[A-Z0-9]{6}$/,
                                message: "Format: ABCD0123456"
                            }
                        })}
                        className={`w-full p-4 bg-gray-50 border ${errors.ifscCode ? 'border-red-500' : 'border-gray-100'} rounded-2xl outline-none focus:ring-2 focus:ring-[#ff4d6d] uppercase`}
                        placeholder="ICIC0001234"
                    />
                    {errors.ifscCode && <p className="text-red-500 text-[10px] mt-1 font-bold italic uppercase">{errors.ifscCode.message}</p>}
                </div>

                {/* 7. Business Phone */}
                <div>
                    <label className="block text-[11px] font-black uppercase text-gray-600 mb-1">Business Contact Phone</label>
                    <div className="relative">
                        <Phone className="absolute left-4 top-4 text-gray-400" size={16} />
                        <input
                            {...register("phone", {
                                required: "Phone number is required",
                                minLength: { value: 10, message: "Enter 10-digit number" }
                            })}
                            className={`w-full pl-12 p-4 bg-gray-50 border ${errors.phone ? 'border-red-500' : 'border-gray-100'} rounded-2xl outline-none focus:ring-2 focus:ring-[#ff4d6d]`}
                            placeholder="+91"
                        />
                    </div>
                    {errors.phone && <p className="text-red-500 text-[10px] mt-1 font-bold italic uppercase">{errors.phone.message}</p>}
                </div>

                {/* 8. Warehouse / Pickup Address */}
                <div className="md:col-span-2">
                    <label className="block text-[11px] font-black uppercase text-gray-600 mb-1 flex items-center gap-2">
                        <MapPin size={14} /> Warehouse / Pickup Address
                    </label>
                    <textarea
                        {...register("address", { required: "Pickup address is required" })}
                        className={`w-full p-4 bg-gray-50 border ${errors.address ? 'border-red-500' : 'border-gray-100'} rounded-2xl outline-none h-24 resize-none focus:ring-2 focus:ring-[#ff4d6d]`}
                        placeholder="Enter full address for logistics coordination"
                    ></textarea>
                    {errors.address && <p className="text-red-500 text-[10px] mt-1 font-bold italic uppercase">{errors.address.message}</p>}
                </div>
            </div>
        </div>
    );
};

export default FormBanking;