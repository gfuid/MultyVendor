import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
    ArrowLeft, Tag, Layers, User, Trash2,
    ChevronLeft, ChevronRight, Package,
    ShoppingBag, BadgeCheck
} from 'lucide-react';
import API from '../api/index';
import toast from 'react-hot-toast';

const AdminProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [currentImg, setCurrentImg] = useState(0);
    const [deleting, setDeleting] = useState(false);

    // ✅ FIX: products nested hai { success, products: [...] } ya direct array
    const rawProducts = useSelector((state) => state.admin.products);
    const productsList = Array.isArray(rawProducts)
        ? rawProducts
        : rawProducts?.products || [];

    const product = productsList.find(p => p._id === id);

    // ── Delete Handler ─────────────────────────────────────
    const handleDelete = async () => {
        if (!window.confirm('Remove this product from marketplace?')) return;
        setDeleting(true);
        const toastId = toast.loading('Removing...');
        try {
            await API.delete(`/admin/product/${id}`);
            toast.success('Product removed!', { id: toastId });
            navigate('/products');
        } catch (err) {
            toast.error('Delete failed!', { id: toastId });
            setDeleting(false);
        }
    };

    // ── Not Found ──────────────────────────────────────────
    if (!product) return (
        <div className="min-h-screen bg-[#fff5f7] flex items-center justify-center">
            <div className="text-center space-y-4">
                <Package size={56} className="text-gray-200 mx-auto" />
                <p className="font-black text-gray-300 uppercase italic tracking-widest text-xl">
                    Product Not Found
                </p>
                <button
                    onClick={() => navigate('/products')}
                    className="bg-[#ff4d6d] text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-wider hover:bg-[#e0344f] transition-colors"
                >
                    ← Back to Catalog
                </button>
            </div>
        </div>
    );

    const images = product.images?.length > 0 ? product.images : ['https://via.placeholder.com/500'];

    return (
        <div className="p-4 md:p-8 bg-[#fff5f7] min-h-screen">

            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="mb-6 flex items-center gap-2 font-black text-xs uppercase tracking-widest text-gray-400 hover:text-[#ff4d6d] transition-colors"
            >
                <ArrowLeft size={16} /> Back to Catalog
            </button>

            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2">

                    {/* ── LEFT: Image Gallery ─────────────────── */}
                    <div className="bg-gray-50 p-8 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-gray-100">

                        {/* Main Image */}
                        <div className="relative w-full max-w-sm aspect-square rounded-3xl overflow-hidden bg-white border border-gray-100 shadow-sm">
                            <img
                                src={images[currentImg]}
                                className="w-full h-full object-contain"
                                alt={product.name}
                                onError={(e) => { e.target.src = 'https://via.placeholder.com/500'; }}
                            />

                            {/* Prev / Next buttons */}
                            {images.length > 1 && (
                                <>
                                    <button
                                        onClick={() => setCurrentImg(i => Math.max(0, i - 1))}
                                        disabled={currentImg === 0}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow hover:bg-white disabled:opacity-30 transition-all"
                                    >
                                        <ChevronLeft size={18} />
                                    </button>
                                    <button
                                        onClick={() => setCurrentImg(i => Math.min(images.length - 1, i + 1))}
                                        disabled={currentImg === images.length - 1}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow hover:bg-white disabled:opacity-30 transition-all"
                                    >
                                        <ChevronRight size={18} />
                                    </button>
                                </>
                            )}

                            {/* Image counter */}
                            {images.length > 1 && (
                                <div className="absolute bottom-3 right-3 bg-black/50 text-white text-[10px] font-black px-2 py-1 rounded-full">
                                    {currentImg + 1}/{images.length}
                                </div>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {images.length > 1 && (
                            <div className="flex gap-2 mt-4 flex-wrap justify-center">
                                {images.map((img, i) => (
                                    <img
                                        key={i}
                                        src={img}
                                        onClick={() => setCurrentImg(i)}
                                        className={`w-14 h-14 rounded-xl object-cover cursor-pointer border-2 transition-all
                                            ${currentImg === i
                                                ? 'border-[#ff4d6d] scale-105'
                                                : 'border-transparent opacity-60 hover:opacity-100'
                                            }`}
                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/56'; }}
                                        alt=""
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ── RIGHT: Product Info ─────────────────── */}
                    <div className="p-8 flex flex-col justify-between gap-6">
                        <div className="space-y-5">

                            {/* Category + Status Badges */}
                            <div className="flex flex-wrap gap-2">
                                <span className="bg-pink-50 text-[#ff4d6d] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                                    <Tag size={10} /> {product.category || 'Uncategorized'}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1
                                    ${product.stock > 10 ? 'bg-green-100 text-green-600' :
                                        product.stock > 0 ? 'bg-yellow-100 text-yellow-600' :
                                            'bg-red-100 text-red-500'}`}>
                                    <Layers size={10} />
                                    {product.stock > 0 ? `${product.stock} In Stock` : 'Out of Stock'}
                                </span>
                            </div>

                            {/* Name + Price */}
                            <div>
                                <h1 className="text-3xl font-black text-gray-900 italic uppercase tracking-tighter leading-tight">
                                    {product.name}
                                </h1>
                                <p className="text-4xl font-black text-[#ff4d6d] mt-2 italic">
                                    ₹{product.price?.toLocaleString('en-IN')}
                                </p>
                            </div>

                            {/* Description */}
                            <div className="bg-gray-50 rounded-2xl p-5">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Description</p>
                                <p className="text-gray-600 text-sm font-medium leading-relaxed">
                                    {product.description || 'No description provided.'}
                                </p>
                            </div>

                            {/* Stats Row */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-gray-50 rounded-2xl p-4">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                                        <Layers size={10} /> Stock
                                    </p>
                                    <p className="font-black text-gray-800 text-lg">{product.stock} units</p>
                                </div>
                                <div className="bg-gray-50 rounded-2xl p-4">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                                        <ShoppingBag size={10} /> Product ID
                                    </p>
                                    <p className="font-black text-gray-800 text-sm">#{product._id?.slice(-8)}</p>
                                </div>
                            </div>

                            {/* Seller Info */}
                            <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-3 flex items-center gap-1">
                                    <User size={10} /> Merchant Info
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-black text-blue-600 text-sm">
                                        {product.seller?.name?.[0]?.toUpperCase() || 'S'}
                                    </div>
                                    <div>
                                        <p className="font-black text-gray-800 text-sm flex items-center gap-1">
                                            {product.seller?.name || 'Independent Seller'}
                                            <BadgeCheck size={14} className="text-blue-500" />
                                        </p>
                                        <p className="text-[11px] text-gray-400 font-bold">
                                            {product.seller?.email || `ID: ${product.seller?._id || product.seller}`}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={() => navigate(-1)}
                                className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl font-black text-xs uppercase tracking-wider transition-colors"
                            >
                                ← Back
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="flex-1 py-4 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                            >
                                {deleting
                                    ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    : <><Trash2 size={15} /> Remove Product</>
                                }
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminProductDetail;