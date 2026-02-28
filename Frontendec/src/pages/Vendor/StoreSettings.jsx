import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
    Store, Phone, MapPin, Save, ShieldCheck,
    Edit3, X, Mail, Globe, Landmark, Building2,
    CheckCircle2, AlertCircle, Loader2, Lock
} from 'lucide-react';
import useAuthStore from '../../store/authStore.js';
import API from '../../api/axios';
import toast from 'react-hot-toast';

const Field = ({ label, icon: Icon, isEdit, error, children }) => (
    <div className={`relative p-4 rounded-2xl border-2 transition-all duration-200
        ${isEdit
            ? error
                ? 'bg-red-50/50 border-red-200'
                : 'bg-white border-gray-200 focus-within:border-[#ff4d6d]'
            : 'bg-gray-50 border-transparent'
        }`}
    >
        <div className="flex items-center gap-2 mb-1.5">
            <Icon size={12} className={isEdit ? 'text-[#ff4d6d]' : 'text-gray-400'} />
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
            {!isEdit && <Lock size={9} className="text-gray-300 ml-auto" />}
        </div>
        {children}
        {error && (
            <p className="text-[10px] text-red-500 font-bold mt-1 flex items-center gap-1">
                <AlertCircle size={10} /> {error}
            </p>
        )}
    </div>
);

const StoreSettings = () => {
    const { user } = useAuthStore();
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();

    const [isUpdating, setIsUpdating] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saveSuccess, setSaveSuccess] = useState(false);

    useEffect(() => {
        const fetchStoreData = async () => {
            try {
                const { data } = await API.get('/vendor/settings');

                // ✅ Handle both formats:
                // Format 1: { success: true, store: { businessInfo: {}, bankingInfo: {} } }
                // Format 2: { businessInfo: {}, bankingInfo: {} } (direct object)
                const store = data.store || data;

                console.log('Store data received:', store); // Debug ke liye

                if (!store) {
                    toast.error('Store data not found.');
                    return;
                }

                setValue('storeName', store.businessInfo?.storeName || '');
                setValue('category', store.businessInfo?.category || '');
                setValue('storeDescription', store.businessInfo?.description || '');
                setValue('supportEmail', store.businessInfo?.supportEmail || '');
                setValue('contactPhone', store.bankingInfo?.phone || '');
                setValue('storeAddress', store.bankingInfo?.pickupAddress || '');
                setValue('bankName', store.bankingInfo?.bankName || '');

            } catch (err) {
                console.error('Store fetch error:', err.response?.data || err.message);
                toast.error(err.response?.data?.message || 'Failed to load store data.');
            } finally {
                setLoading(false);
            }
        };
        fetchStoreData();
    }, [setValue]);

    const onSubmit = async (formData) => {
        setIsUpdating(true);
        const toastId = toast.loading('Saving changes...');
        try {
            const { data } = await API.put('/vendor/update-store', formData);
            if (data.success) {
                toast.success('Store updated successfully!', { id: toastId });
                setIsEditMode(false);
                setSaveSuccess(true);
                setTimeout(() => setSaveSuccess(false), 3000);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Update failed!', { id: toastId });
        } finally {
            setIsUpdating(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center space-y-3">
                <div className="w-10 h-10 border-4 border-[#ff4d6d] border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Loading Store Profile...</p>
            </div>
        </div>
    );

    return (
        <div className="p-4 md:p-8 bg-[#f8f8f8] min-h-screen mt-16">
            <div className="max-w-4xl mx-auto space-y-5">

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black uppercase italic tracking-tighter text-gray-900 flex items-center gap-3">
                            <Store className="text-[#ff4d6d]" size={28} /> Store Settings
                        </h1>
                        <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-1">
                            Manage your store identity & business info
                        </p>
                    </div>
                    <button
                        onClick={() => setIsEditMode(prev => !prev)}
                        className={`self-start md:self-auto flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all
                            ${isEditMode ? 'bg-gray-200 text-gray-600 hover:bg-gray-300' : 'bg-gray-900 text-white hover:bg-[#ff4d6d] shadow-lg'}`}
                    >
                        {isEditMode ? <><X size={15} /> Cancel</> : <><Edit3 size={15} /> Edit Profile</>}
                    </button>
                </div>

                {saveSuccess && (
                    <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 px-5 py-4 rounded-2xl font-bold text-sm">
                        <CheckCircle2 size={18} /> Store profile updated successfully!
                    </div>
                )}
                {isEditMode && (
                    <div className="flex items-center gap-3 bg-pink-50 border border-pink-100 text-[#ff4d6d] px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest">
                        <Edit3 size={14} /> Edit mode active — make your changes and save
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                    {/* Card 1: Business Identity */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between">
                            <div>
                                <h2 className="font-black text-gray-900 uppercase italic tracking-tighter">Business Identity</h2>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Core branding & contact info</p>
                            </div>
                            {user?.isVerified && (
                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-600 rounded-full text-[10px] font-black border border-green-100">
                                    <ShieldCheck size={12} /> Verified Vendor
                                </div>
                            )}
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Field label="Store Name" icon={Store} isEdit={isEditMode} error={errors.storeName?.message}>
                                <input {...register('storeName', { required: 'Store name is required.' })}
                                    disabled={!isEditMode} placeholder="Your store name"
                                    className="w-full bg-transparent font-bold text-gray-800 text-sm outline-none placeholder:text-gray-300 disabled:cursor-default" />
                            </Field>
                            <Field label="Category / Niche" icon={Globe} isEdit={isEditMode}>
                                <input {...register('category')} disabled={!isEditMode} placeholder="e.g. Kids Fashion"
                                    className="w-full bg-transparent font-bold text-gray-800 text-sm outline-none placeholder:text-gray-300 disabled:cursor-default" />
                            </Field>
                            <Field label="Support Email" icon={Mail} isEdit={isEditMode} error={errors.supportEmail?.message}>
                                <input {...register('supportEmail', { pattern: { value: /^\S+@\S+$/i, message: 'Please enter a valid email.' } })}
                                    disabled={!isEditMode} placeholder="support@yourstore.com"
                                    className="w-full bg-transparent font-bold text-gray-800 text-sm outline-none placeholder:text-gray-300 disabled:cursor-default" />
                            </Field>
                            <Field label="Contact Phone" icon={Phone} isEdit={isEditMode} error={errors.contactPhone?.message}>
                                <input {...register('contactPhone', { pattern: { value: /^[0-9]{10}$/, message: 'Please enter a valid 10-digit number.' } })}
                                    disabled={!isEditMode} placeholder="10-digit mobile number"
                                    className="w-full bg-transparent font-bold text-gray-800 text-sm outline-none placeholder:text-gray-300 disabled:cursor-default" />
                            </Field>
                        </div>
                    </div>

                    {/* Card 2: Store Description */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-50">
                            <h2 className="font-black text-gray-900 uppercase italic tracking-tighter">Store Description</h2>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Shown publicly on your store page</p>
                        </div>
                        <div className="p-6">
                            <textarea {...register('storeDescription')} disabled={!isEditMode} rows={4}
                                placeholder="Tell customers what your store is about..."
                                className={`w-full p-4 rounded-2xl border-2 font-medium text-sm text-gray-700 resize-none transition-all outline-none
                                    ${isEditMode ? 'bg-white border-gray-200 focus:border-[#ff4d6d] placeholder:text-gray-300' : 'bg-gray-50 border-transparent text-gray-600 cursor-default'}`} />
                        </div>
                    </div>

                    {/* Card 3: Operations & Banking */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-50">
                            <h2 className="font-black text-gray-900 uppercase italic tracking-tighter">Operations & Banking</h2>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Pickup address and payout details</p>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Field label="Pickup Address" icon={MapPin} isEdit={isEditMode}>
                                <input {...register('storeAddress')} disabled={!isEditMode} placeholder="Full pickup address"
                                    className="w-full bg-transparent font-bold text-gray-800 text-sm outline-none placeholder:text-gray-300 disabled:cursor-default" />
                            </Field>
                            <Field label="Banking Partner" icon={Landmark} isEdit={isEditMode}>
                                <input {...register('bankName')} disabled={!isEditMode} placeholder="Bank name"
                                    className="w-full bg-transparent font-bold text-gray-800 text-sm outline-none placeholder:text-gray-300 disabled:cursor-default" />
                            </Field>
                        </div>
                    </div>

                    {/* Card 4: Account Info (Read Only) */}
                    <div className="bg-gray-900 rounded-3xl p-6 text-white">
                        <div className="flex items-center gap-3 mb-4">
                            <Building2 size={18} className="text-gray-400" />
                            <h2 className="font-black uppercase italic tracking-tighter text-sm">Account Info</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                { label: 'Seller ID', value: user?._id?.slice(-10) || '—' },
                                { label: 'Account', value: user?.email || '—' },
                                { label: 'Role', value: user?.role?.toUpperCase() || 'SELLER' },
                            ].map((item) => (
                                <div key={item.label} className="bg-white/5 rounded-2xl px-4 py-3">
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{item.label}</p>
                                    <p className="font-black text-white text-sm truncate">{item.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Save Button */}
                    {isEditMode && (
                        <div className="flex gap-3">
                            <button type="button" onClick={() => setIsEditMode(false)}
                                className="flex-1 md:flex-none px-8 py-4 bg-white border-2 border-gray-200 text-gray-600 rounded-2xl font-black text-xs uppercase tracking-wider hover:bg-gray-50 transition-colors">
                                Cancel
                            </button>
                            <button type="submit" disabled={isUpdating}
                                className="flex-1 bg-[#ff4d6d] hover:bg-[#e0344f] disabled:opacity-60 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-lg shadow-pink-200">
                                {isUpdating ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : <><Save size={16} /> Save Changes</>}
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default StoreSettings;