import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
    ArrowLeft, MapPin, Phone, Calendar, Mail, ShieldCheck,
    Landmark, Building, Hash, Activity, Briefcase, Award
} from 'lucide-react';

const VendorDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { vendors } = useSelector((state) => state.admin);

    // Find vendor from state
    const vendor = vendors.find(v => v._id === id);

    if (!vendor) return (
        <div className="min-h-screen flex items-center justify-center bg-[#fff5f7]">
            <div className="text-center font-black italic text-gray-400 animate-pulse uppercase tracking-tighter">
                VENDOR RECORD NOT FOUND
            </div>
        </div>
    );

    // Helper component for detail rows
    const DetailRow = ({ icon: Icon, label, value, color = "text-gray-700" }) => (
        <div className="space-y-1">
            <p className="text-[10px] font-black text-gray-400 uppercase italic flex items-center gap-2">
                <Icon size={12} /> {label}
            </p>
            <p className={`text-sm font-bold ${color} break-words`}>{value || "N/A"}</p>
        </div>
    );

    return (
        <div className="p-8 bg-[#fff5f7] min-h-screen">
            {/* Header Control */}
            <button
                onClick={() => navigate(-1)}
                className="mb-8 flex items-center gap-2 font-black italic text-xs uppercase tracking-widest text-gray-500 hover:text-[#ff4d6d] transition-all"
            >
                <ArrowLeft size={16} /> Back to Terminal
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                {/* 1. LEFT COLUMN: STORE IDENTITY */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-pink-50 text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-[#fff5f7] rounded-bl-full -z-0 opacity-50" />
                        <div className="relative z-10">
                            <div className="flex justify-center mb-6">
                                <img
                                    src={vendor.businessInfo?.logo || "https://placehold.co/400x400?text=No+Logo"}
                                    className="w-40 h-40 rounded-[3rem] border-8 border-[#fff5f7] shadow-xl object-cover"
                                    alt="Store Logo"
                                />
                            </div>
                            <h1 className="text-2xl font-black text-gray-800 italic uppercase tracking-tighter leading-tight">
                                {vendor.businessInfo?.storeName}
                            </h1>
                            <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 bg-green-50 text-green-600 rounded-full border border-green-100">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                <span className="text-[9px] font-black uppercase tracking-widest">{vendor.status}</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white">
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-4 text-center">Business Metadata</p>
                        <div className="space-y-4">
                            <DetailRow icon={Briefcase} label="Category" value={vendor.businessInfo?.category} color="text-pink-400 uppercase" />
                            <DetailRow icon={Award} label="Experience" value={`${vendor.businessInfo?.experience} Years`} color="text-white" />
                            <DetailRow icon={Mail} label="Support" value={vendor.businessInfo?.supportEmail} color="text-white text-xs" />
                        </div>
                    </div>
                </div>

                {/* 2. RIGHT COLUMN: DEEP VERIFICATION DATA */}
                <div className="lg:col-span-3 space-y-8">

                    {/* SECTION: LEGAL & COMPLIANCE */}
                    <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-pink-50">
                        <h2 className="text-lg font-black text-gray-800 italic uppercase mb-8 flex items-center gap-3">
                            <ShieldCheck className="text-[#ff4d6d]" size={24} /> Compliance & Taxation
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <DetailRow icon={ShieldCheck} label="GSTIN Number" value={vendor.legalInfo?.taxId} />
                            <DetailRow icon={Briefcase} label="PAN Card" value={vendor.legalInfo?.panCard} />
                            <DetailRow icon={Activity} label="Gen. Drug License" value={vendor.legalInfo?.drugLicenseGeneral} />
                        </div>

                        {/* PHARMACY SECTION (IF APPLICABLE) */}
                        {vendor.businessInfo?.category === 'pharmacy' && (
                            <div className="mt-10 p-6 bg-blue-50/50 rounded-3xl border border-blue-100 border-dashed">
                                <h3 className="text-blue-700 text-[11px] font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <Activity size={16} /> Medical Regulatory Status (Form 20/21)
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <DetailRow icon={Hash} label="Pharmacy License No" value={vendor.legalInfo?.pharmacySpecific?.licenseNumber} color="text-blue-700" />
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase italic mb-2">License Proof</p>
                                        <a
                                            href={vendor.legalInfo?.pharmacySpecific?.licenseProof}
                                            target="_blank"
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-blue-200 text-blue-600 rounded-xl text-[10px] font-bold hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                        >
                                            View Documentation PDF
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* SECTION: BANKING & SETTLEMENT */}
                    <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-pink-50">
                        <h2 className="text-lg font-black text-gray-800 italic uppercase mb-8 flex items-center gap-3">
                            <Landmark className="text-[#ff4d6d]" size={24} /> Settlement & Payout Info
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                            <DetailRow icon={User} label="Account Holder" value={vendor.bankingInfo?.accountHolderName} />
                            <DetailRow icon={Building} label="Bank Name" value={vendor.bankingInfo?.bankName} />
                            <DetailRow icon={GitBranch} label="Branch" value={vendor.bankingInfo?.branchName} />
                            <DetailRow icon={Hash} label="Account Number" value={vendor.bankingInfo?.bankAccount} />
                            <DetailRow icon={ShieldCheck} label="Account Type" value={vendor.bankingInfo?.accountType} color="uppercase" />
                            <DetailRow icon={Hash} label="IFSC Code" value={vendor.bankingInfo?.ifscCode} color="text-pink-600" />
                        </div>

                        <div className="border-t pt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                            <DetailRow icon={Phone} label="Business Contact" value={vendor.bankingInfo?.phone} />
                            <DetailRow icon={MapPin} label="Pickup / Warehouse Address" value={vendor.bankingInfo?.pickupAddress} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorDetails;