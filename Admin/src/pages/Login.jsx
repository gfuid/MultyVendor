import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../redux/slices/authSlice';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, token } = useSelector((state) => state.auth);

    useEffect(() => {
        if (token) navigate('/');
    }, [token, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(login(formData));
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#fff5f7]">
            <div className="bg-white p-10 rounded-[2rem] shadow-2xl w-full max-w-md border border-gray-100">
                <div className="text-center mb-10">
                    <div className="bg-[#ff4d6d] text-white inline-block px-6 py-2 rounded-xl font-black italic text-3xl shadow-lg mb-4">
                        TRIREME
                    </div>
                    <h2 className="text-gray-400 font-bold tracking-widest text-xs uppercase">Admin Security Portal</h2>
                </div>

                {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 font-bold text-sm border-l-4 border-red-500">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <input
                        type="email"
                        placeholder="Admin Email"
                        className="w-full p-4 rounded-xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-[#ff4d6d] font-medium"
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    <input
                        type="password"
                        placeholder="Master Password"
                        className="w-full p-4 rounded-xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-[#ff4d6d] font-medium"
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                    <button className="w-full bg-[#ff4d6d] text-white p-4 rounded-xl font-black shadow-lg hover:bg-[#ff7096] transition-all active:scale-95">
                        {loading ? "VERIFYING..." : "ENTER DASHBOARD"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;