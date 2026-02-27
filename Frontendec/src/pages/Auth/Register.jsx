import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Store, Eye, EyeOff } from 'lucide-react';
import API from '../../api/axios';
import useAuthStore from '../../store/authStore.js';
import { toast } from 'react-hot-toast';

// 1. SIMPLE VALIDATION SCHEMA
const schema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    wantToBeSeller: z.boolean().optional(),
});

const Register = () => {
    const [showPassword, setShowPassword] = useState(false); // Eye toggle state
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(schema)
    });

    const onSubmit = async (data) => {
        try {
            const response = await API.post('/auth/register', data);
            login(response.data.user, response.data.token);
            toast.success("Account created successfully!");
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-lg border border-pink-100">
                <div className="text-center">
                    <h2 className="text-3xl font-black text-[#ff4d6d] italic tracking-tighter">TRIREME</h2>
                    <h3 className="mt-2 text-xl font-bold text-gray-800">Create Your Account</h3>
                    <p className="text-sm text-gray-500">Join our multi-vendor marketplace today</p>
                </div>

                <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    {/* Name Field */}
                    <div className="relative">
                        <User className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                        <input
                            {...register("name")}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#ff4d6d] transition-all"
                            placeholder="Full Name"
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1 ml-1">{errors.name.message}</p>}
                    </div>

                    {/* Email Field */}
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                        <input
                            {...register("email")}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#ff4d6d] transition-all"
                            placeholder="Email Address"
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email.message}</p>}
                    </div>

                    {/* Password Field with Eye Icon */}
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                        <input
                            type={showPassword ? "text" : "password"} // Type toggle
                            {...register("password")}
                            className="w-full pl-10 pr-12 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#ff4d6d] transition-all"
                            placeholder="Password (Min 6 chars)"
                        />
                        {/* Eye Toggle Button */}
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-2.5 text-gray-400 hover:text-[#ff4d6d]"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                        {errors.password && <p className="text-red-500 text-xs mt-1 ml-1">{errors.password.message}</p>}
                    </div>

                    {/* Become Seller Checkbox */}
                    <div className="flex items-center gap-3 p-4 bg-pink-50 rounded-xl border border-pink-100 mt-6 group cursor-pointer">
                        <input
                            type="checkbox"
                            {...register("wantToBeSeller")}
                            id="seller"
                            className="w-5 h-5 accent-[#ff4d6d] cursor-pointer"
                        />
                        <label htmlFor="seller" className="text-sm font-semibold text-gray-700 flex items-center gap-2 cursor-pointer">
                            <Store className="w-4 h-4 text-[#ff4d6d]" /> I want to sell products on Trireme
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[#ff4d6d] text-white py-3 rounded-xl font-bold hover:bg-[#ff7096] transition-all shadow-md mt-4 active:scale-95 disabled:opacity-50"
                    >
                        {isSubmitting ? "CREATING..." : "CREATE ACCOUNT"}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-600">
                    Already have an account? <Link to="/login" className="text-[#ff4d6d] font-bold hover:underline">Login here</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;