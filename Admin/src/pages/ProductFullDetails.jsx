import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Image as ImageIcon } from 'lucide-react'; // Trash2 missing tha aapke code mein

const ProductFullDetails = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        // Backend stats aur products fetch logic
        axios.get('/api/admin/products').then(res => setProducts(res.data));
    }, []);

    const deleteProduct = async (id) => {
        if (window.confirm("Remove this product from the marketplace?")) {
            // Admin moderation logic
            await axios.delete(`/api/admin/product/${id}`);
            setProducts(products.filter(p => p._id !== id));
        }
    };

    return (
        <div className="grid grid-cols-1 gap-6 p-4">
            {products.map(product => (
                <div key={product._id} className="p-6 bg-white border border-pink-100 rounded-[2.5rem] shadow-sm">
                    <div className="flex flex-col md:flex-row gap-6">

                        {/* 1. SAARI IMAGES DIKHANE KA LOGIC YAHAN HAI */}
                        <div className="flex flex-col gap-2">
                            {/* Main Display Image (Pehli wali) */}
                            <img
                                src={product.images && product.images[0]}
                                className="w-40 h-40 rounded-3xl object-cover border-4 border-[#fff5f7]"
                                alt={product.name}
                            />

                            {/* Thumbnails Loop - Baaki bachi hui images */}
                            <div className="flex gap-2">
                                {product.images?.map((img, idx) => (
                                    <img
                                        key={idx}
                                        src={img}
                                        className="w-10 h-10 rounded-lg object-cover border border-gray-100 hover:border-[#ff4d6d] cursor-pointer"
                                    />
                                ))}
                            </div>
                        </div>

                        {/* 2. PRODUCT INFO */}
                        <div className="flex-1 space-y-2">
                            <h4 className="text-xl font-black text-gray-800 italic uppercase tracking-tighter">
                                {product.name}
                            </h4>
                            {/* Seller mapping fix */}
                            <p className="text-xs text-[#ff7096] font-black uppercase italic">
                                Vendor: {product.seller?.name || "Direct Merchant"}
                            </p>
                            <p className="text-gray-500 text-sm font-medium line-clamp-2 italic">
                                "{product.description}"
                            </p>
                            <p className="text-2xl font-black text-[#ff4d6d]">₹{product.price}</p>
                        </div>

                        {/* 3. DELETE ACTION */}
                        <div className="flex items-center">
                            <button
                                onClick={() => deleteProduct(product._id)}
                                className="bg-red-50 text-red-500 p-4 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-red-50"
                            >
                                <Trash2 size={24} />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProductFullDetails;