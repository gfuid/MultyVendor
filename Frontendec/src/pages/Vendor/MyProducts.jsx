import React, { useEffect, useState } from 'react';
import API from '../../api/axios';
import { Trash2, Edit } from 'lucide-react';

const MyProducts = () => {
    const [products, setProducts] = useState([]);
    // API calls ke liye purana variable
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    // Images ke liye naya variable
    const UPLOAD_URL = import.meta.env.VITE_UPLOAD_URL;

    useEffect(() => {
        const fetchMyProducts = async () => {
            const res = await API.get('/products/my-products');
            setProducts(res.data);
        };
        fetchMyProducts();
    }, []);

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-black mb-6 uppercase tracking-tighter">My Inventory</h1>
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
                <table className="w-full">
                    <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                        <tr>
                            <th className="p-4 text-left">Product</th>
                            <th className="p-4">Category</th>
                            <th className="p-4">Price</th>
                            <th className="p-4">Stock</th>
                            <th className="p-4">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {products.map(p => (
                            <tr key={p._id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="p-4 flex items-center gap-3">
                                    <img
                                        src={`${UPLOAD_URL}${p.images[0]}`}
                                        className="w-12 h-12 rounded-xl object-cover"
                                        alt={p.name}
                                        onError={(e) => { e.target.src = "/default-product.png" }}
                                    />
                                    <span className="font-bold text-gray-800">{p.name}</span>
                                </td>
                                <td className="p-4 text-center text-sm font-medium text-gray-500">{p.category}</td>
                                <td className="p-4 text-center font-bold text-gray-900">₹{p.price}</td>
                                <td className="p-4 text-center font-bold text-[#ff4d6d]">{p.stock}</td>
                                <td className="p-4 text-center flex justify-center gap-2">
                                    <button className="p-2 bg-pink-50 text-[#ff4d6d] rounded-lg"><Edit size={16} /></button>
                                    <button className="p-2 bg-gray-100 text-gray-400 rounded-lg"><Trash2 size={16} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MyProducts;