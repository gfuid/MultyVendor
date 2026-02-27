import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../../api/axios';
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore.js'; // ✅ Add this (Check path carefully)
// Corrected Section Components
import FormBranding from '../../components/form/FormBranding';
import FormBusinessInfo from '../../components/form/FormBusinessInfo';
import FormLegal from '../../components/form/FormLegal';
import FormBanking from '../../components/form/FormBanking';

const BecomeSeller = () => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const selectedCategory = watch("category");

    const navigate = useNavigate();

    // Zustand store ya Redux se user aur update function nikalna
    const { user, updateUserLocalState } = useAuthStore();

    const onSubmit = async (data) => {
        const loadToast = toast.loading("Processing your application...");
        try {
            const formData = new FormData();

            // Object ke har key ko append karein
            Object.keys(data).forEach((key) => {
                if (key === 'logo') {
                    if (data.logo[0]) formData.append("logo", data.logo[0]);
                } else if (key === 'drugLicenseFile') {
                    if (data.drugLicenseFile?.[0]) formData.append("drugLicenseFile", data.drugLicenseFile[0]);
                } else {
                    formData.append(key, data[key]);
                }
            });

            const response = await API.post('/vendor/apply', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data.success) {
                // Local state refresh
                if (typeof updateUserLocalState === 'function') {
                    updateUserLocalState({ ...user, sellerStatus: 'pending' });
                }
                toast.success("Submitted! Status: PENDING", { id: loadToast });
                setTimeout(() => navigate('/profile'), 2000);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Submission failed", { id: loadToast });
        }
    };
    return (
        <div className="min-h-screen bg-[#f8f9fa] py-12 px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-[2.5rem] p-8 lg:p-12 shadow-2xl border border-gray-100">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-black text-gray-900 uppercase italic tracking-tighter">Vendor Terminal</h1>
                    <p className="text-gray-500 font-medium mt-2">Start your business journey on Trireme Marketplace</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
                    <FormBranding register={register} errors={errors} />

                    <FormBusinessInfo register={register} errors={errors} />

                    <FormLegal
                        register={register}
                        errors={errors}
                        selectedCategory={selectedCategory}
                    />

                    <FormBanking register={register} errors={errors} />

                    <button type="submit" className="w-full py-5 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[#ff4d6d] transition-all transform hover:-translate-y-1 shadow-xl">
                        Submit Application <ArrowRight size={22} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BecomeSeller;