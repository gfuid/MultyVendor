import React, { useState } from 'react';
import { Camera } from 'lucide-react';

const FormBranding = ({ register, errors }) => {
    const [logoPreview, setLogoPreview] = useState(null);

    const handlePreview = (e) => {
        const file = e.target.files[0];
        if (file) setLogoPreview(URL.createObjectURL(file));
    };

    return (
        <div className="flex flex-col items-center py-8 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
            <div className="relative group w-36 h-36 mb-4">
                <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden border-4 border-white shadow-xl flex items-center justify-center">
                    {logoPreview ? (
                        <img src={logoPreview} className="w-full h-full object-cover" alt="Preview" />
                    ) : (
                        <Camera className="text-gray-300" size={48} />
                    )}
                </div>
                <input
                    type="file"
                    {...register("logo", { required: "Store logo is required" })}
                    onChange={handlePreview}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                />
            </div>
            <p className="text-[11px] font-black text-[#ff4d6d] uppercase tracking-widest">Official Store Logo</p>
            {errors.logo && <p className="text-red-500 text-[10px] mt-2 font-bold">{errors.logo.message}</p>}
        </div>
    );
};

export default FormBranding;