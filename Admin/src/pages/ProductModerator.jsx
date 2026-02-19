import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductModerator = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios.get('/api/admin/products').then(res => setProducts(res.data));
    }, []);

    const deleteProduct = async (id) => {
        if (window.confirm("Remove this product from the marketplace?")) {
            await axios.delete(`/api/admin/product/${id}`);
            setProducts(products.filter(p => p._id !== id));
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map(product => (
                <div key={product._id} className="flex items-center gap-4 p-4 bg-white border border-pink-100 rounded-2xl">
                    <img src={product.image} className="w-20 h-20 rounded-xl object-cover" alt="" />
                    <div className="flex-1">
                        <h4 className="font-bold text-gray-800">{product.name}</h4>
                        <p className="text-xs text-[#ff7096] font-bold">Vendor: {product.vendor?.storeName}</p>
                        <p className="text-lg font-black text-[#ff4d6d]">₹{product.price}</p>
                    </div>
                    <button onClick={() => deleteProduct(product._id)} className="bg-red-50 text-red-500 p-3 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                        <Trash2 size={20} />
                    </button>
                </div>
            ))}
        </div>
    );
};

export default ProductModerator;