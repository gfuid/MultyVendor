import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Edit3, Trash2 } from 'lucide-react';

const AdminProductList = () => {
    // 1. Initialize as empty array
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get('/api/admin/products');
                // 2. Safety Check: Handle different response formats
                if (Array.isArray(res.data)) {
                    setProducts(res.data);
                } else if (res.data && Array.isArray(res.data.products)) {
                    setProducts(res.data.products);
                } else {
                    setProducts([]);
                }
            } catch (err) {
                console.error("Error fetching products:", err);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Remove this product?")) {
            await axios.delete(`/api/admin/product/${id}`);
            setProducts(products.filter(p => p._id !== id));
        }
    };

    if (loading) return <div className="p-8 text-[#ff4d6d] font-bold">Loading Products...</div>;

    return (
        <div className="grid grid-cols-1 gap-4 p-4">
            {/* 3. Safety Check: Map only if it's an array */}
            {Array.isArray(products) && products.length > 0 ? (
                products.map(product => (
                    <div key={product._id} className="flex items-center justify-between p-4 bg-white border border-pink-100 rounded-2xl shadow-sm">
                        <div className="flex items-center gap-4">
                            <img src={product.image} alt="" className="w-16 h-16 object-cover rounded-lg" />
                            <div>
                                <h4 className="font-bold text-gray-800">{product.name}</h4>
                                <p className="text-[#ff4d6d] font-black">₹{product.price}</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => handleDelete(product._id)} className="p-2 bg-gray-50 text-gray-400 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center py-10 text-gray-400">No products found.</div>
            )}
        </div>
    );
};

export default AdminProductList;