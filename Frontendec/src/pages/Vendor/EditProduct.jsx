import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import API from '../../api/axios';
import toast from 'react-hot-toast';

const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await API.get(`/products/${id}`);
                // Form fields mein purana data set karein
                setValue('name', data.name);
                setValue('price', data.price);
                setValue('stock', data.stock);
                setValue('category', data.category);
                setValue('description', data.description);
                setLoading(false);
            } catch (err) {
                toast.error("Product fetch karne mein galti hui");
                navigate('/seller/my-products');
            }
        };
        fetchProduct();
    }, [id, setValue, navigate]);

    const onSubmit = async (data) => {
        try {
            await API.put(`/products/${id}`, data);
            toast.success("Product update ho gaya!");
            navigate('/seller/my-products');
        } catch (err) {
            toast.error("Update fail ho gaya");
        }
    };

    if (loading) return <p className="text-center p-20 font-bold">Loading Product Data...</p>;

    return (
        <div className="max-w-2xl mx-auto p-8 bg-white rounded-3xl mt-10 shadow-sm border border-gray-100">
            <h1 className="text-2xl font-black mb-6 italic uppercase tracking-tighter">Edit Product</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <input {...register('name')} className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-[#ff4d6d]" placeholder="Product Name" />
                <div className="grid grid-cols-2 gap-4">
                    <input type="number" {...register('price')} className="p-3 border rounded-xl outline-none" placeholder="Price" />
                    <input type="number" {...register('stock')} className="p-3 border rounded-xl outline-none" placeholder="Stock" />
                </div>
                <textarea {...register('description')} className="w-full p-3 border rounded-xl h-32" placeholder="Description"></textarea>
                <button type="submit" className="w-full bg-[#ff4d6d] text-white py-4 rounded-xl font-black uppercase tracking-widest shadow-lg shadow-pink-100">Save Changes</button>
            </form>
        </div>
    );
};

export default EditProduct;