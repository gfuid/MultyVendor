import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getProducts } from '../redux/slices/adminSlice';
import { Trash2, Eye, Search, Package, ExternalLink } from 'lucide-react';
import API from '../api/index'; // ✅ axios nahi, API instance use karo (token bhejta hai)
import toast from 'react-hot-toast';

const AdminProductList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { products, loading } = useSelector((state) => state.admin);
    const [searchTerm, setSearchTerm] = useState('');
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        // Redux se products fetch karo (token automatically jayega)
        if (!products || products.length === 0) {
            dispatch(getProducts());
        }
    }, [dispatch]);

    // ✅ FIX: API instance use karo, seedha axios nahi
    const deleteProduct = async (id) => {
        if (!window.confirm('Remove this product from the marketplace?')) return;
        setDeletingId(id);
        const toastId = toast.loading('Removing product...');
        try {
            await API.delete(`/admin/product/${id}`);
            toast.success('Product removed!', { id: toastId });
            // Redux state update - refetch
            dispatch(getProducts());
        } catch (err) {
            toast.error(err.response?.data?.message || 'Delete failed!', { id: toastId });
        } finally {
            setDeletingId(null);
        }
    };

    const filteredProducts = products?.filter(p =>
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.seller?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    if (loading && (!products || products.length === 0)) return (
        <div className="min-h-screen flex items-center justify-center bg-[#fff5f7]">
            <div className="text-center space-y-3">
                <div className="w-10 h-10 border-4 border-[#ff4d6d] border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Loading Catalog...</p>
            </div>
        </div>
    );

    return (
        <div className="p-4 md:p-8 bg-[#fff5f7] min-h-screen">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black uppercase italic tracking-tighter text-gray-900 flex items-center gap-3">
                        <Package className="text-[#ff4d6d]" size={28} />
                        Global Catalog
                    </h1>
                    <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-1">
                        {filteredProducts.length} products in marketplace
                    </p>
                </div>

                {/* Search */}
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search by name, seller, category..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 bg-white focus:border-[#ff4d6d] outline-none font-bold text-sm"
                    />
                </div>
            </div>

            {/* Products List */}
            {filteredProducts.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-[3rem] border-4 border-dashed border-gray-100">
                    <Package size={48} className="text-gray-200 mx-auto mb-4" />
                    <p className="font-black text-gray-300 uppercase tracking-widest italic">
                        {products?.length === 0 ? 'No products found' : 'No search results'}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredProducts.map(product => (
                        <div
                            key={product._id}
                            className="bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all p-5"
                        >
                            <div className="flex flex-col md:flex-row gap-5 items-start md:items-center">

                                {/* Images */}
                                <div className="flex flex-col gap-2 flex-shrink-0">
                                    <img
                                        src={product.images?.[0] || 'https://via.placeholder.com/160'}
                                        className="w-28 h-28 rounded-2xl object-cover border border-gray-100"
                                        alt={product.name}
                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/160'; }}
                                    />
                                    {product.images?.length > 1 && (
                                        <div className="flex gap-1">
                                            {product.images.slice(1, 4).map((img, idx) => (
                                                <img
                                                    key={idx}
                                                    src={img}
                                                    className="w-8 h-8 rounded-lg object-cover border border-gray-100"
                                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/32'; }}
                                                />
                                            ))}
                                            {product.images.length > 4 && (
                                                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-[9px] font-black text-gray-400">
                                                    +{product.images.length - 4}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Product Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                        <span className="text-[10px] bg-pink-50 text-[#ff4d6d] px-2 py-0.5 rounded-full font-black uppercase tracking-widest">
                                            {product.category}
                                        </span>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase ${product.stock > 10 ? 'bg-green-100 text-green-600' :
                                            product.stock > 0 ? 'bg-yellow-100 text-yellow-600' :
                                                'bg-red-100 text-red-500'
                                            }`}>
                                            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                                        </span>
                                    </div>
                                    <h4 className="text-lg font-black text-gray-800 italic uppercase tracking-tight truncate">
                                        {product.name}
                                    </h4>
                                    <p className="text-gray-400 text-xs font-medium line-clamp-2 mt-1">
                                        {product.description}
                                    </p>
                                    <div className="flex items-center gap-4 mt-2">
                                        <span className="text-xl font-black text-[#ff4d6d]">₹{product.price}</span>
                                        <span className="text-[11px] text-gray-400 font-bold">
                                            Seller: {product.seller?.name || 'Independent'}
                                        </span>
                                        <span className="text-[10px] text-gray-300 font-bold">
                                            ID: {product._id?.slice(-6)}
                                        </span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 flex-shrink-0">
                                    <button
                                        onClick={() => navigate(`/product-detail/${product._id}`)}
                                        className="p-3 bg-gray-100 hover:bg-gray-800 hover:text-white text-gray-500 rounded-2xl transition-all"
                                        title="View Details"
                                    >
                                        <Eye size={18} />
                                    </button>
                                    <button
                                        onClick={() => deleteProduct(product._id)}
                                        disabled={deletingId === product._id}
                                        className="p-3 bg-red-50 text-red-400 hover:bg-red-500 hover:text-white rounded-2xl transition-all disabled:opacity-50"
                                        title="Delete Product"
                                    >
                                        {deletingId === product._id
                                            ? <div className="w-[18px] h-[18px] border-2 border-red-300 border-t-transparent rounded-full animate-spin" />
                                            : <Trash2 size={18} />
                                        }
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminProductList;