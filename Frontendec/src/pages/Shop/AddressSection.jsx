import React from 'react';
import { MapPin, Home, Building2, Hash, Phone } from 'lucide-react';

const AddressSection = ({ addressData, setAddressData }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        // Phone number validation: Sirf numbers allow karne ke liye
        if (name === "phone") {
            const re = /^[0-9\b]+$/;
            if (value !== '' && !re.test(value)) return;
            if (value.length > 10) return; // Max 10 digits
        }
        setAddressData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="bg-white p-6 md:p-8 rounded-[3rem] border border-gray-100 shadow-xl sticky top-24">
            <h2 className="text-xl font-black uppercase italic text-gray-800 mb-6 border-b border-gray-50 pb-4 tracking-tight text-center">
                Delivery Details
            </h2>

            <div className="space-y-4">
                {/* Mobile Number - Critical for Delivery */}
                <div className="relative">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-1 ml-2">
                        <Phone size={12} className="text-[#ff4d6d]" /> Contact Number
                    </label>
                    <input
                        name="phone"
                        type="tel"
                        value={addressData.phone}
                        onChange={handleChange}
                        className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:border-[#ff4d6d] outline-none font-bold text-sm transition-all"
                        placeholder="10-digit mobile number"
                    />
                </div>

                {/* House/Flat No */}
                <div className="relative">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-1 ml-2">
                        <Home size={12} className="text-[#ff4d6d]" /> House / Flat No.
                    </label>
                    <input
                        name="houseNo"
                        value={addressData.houseNo}
                        onChange={handleChange}
                        className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:border-[#ff4d6d] outline-none font-bold text-sm transition-all"
                        placeholder="e.g. Flat 402, Royal Residency"
                    />
                </div>

                {/* Area / Street */}
                <div className="relative">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-1 ml-2">
                        <MapPin size={12} className="text-[#ff4d6d]" /> Area / Street / Landmark
                    </label>
                    <textarea
                        name="street"
                        value={addressData.street}
                        onChange={handleChange}
                        className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:border-[#ff4d6d] outline-none font-bold text-sm h-20 transition-all resize-none"
                        placeholder="e.g. Near Hanuman Temple, Sector 15"
                    />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    {/* City */}
                    <div className="relative">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-1 ml-2">
                            <Building2 size={12} className="text-[#ff4d6d]" /> City
                        </label>
                        <input
                            name="city"
                            value={addressData.city}
                            onChange={handleChange}
                            className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:border-[#ff4d6d] outline-none font-bold text-sm transition-all"
                            placeholder="City"
                        />
                    </div>
                    {/* Pincode */}
                    <div className="relative">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-1 ml-2">
                            <Hash size={12} className="text-[#ff4d6d]" /> Pincode
                        </label>
                        <input
                            name="pincode"
                            value={addressData.pincode}
                            onChange={handleChange}
                            className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:border-[#ff4d6d] outline-none font-bold text-sm transition-all"
                            placeholder="6-digits"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddressSection;