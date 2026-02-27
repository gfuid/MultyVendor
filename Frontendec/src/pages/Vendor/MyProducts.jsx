import React, { useEffect, useState, useMemo } from 'react';
import API from '../../api/axios';
import { Trash2, Edit, X, Search, Package, Plus, Grid, List, Eye, Tag, Layers } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

// ─── Product View Modal ───────────────────────────────────────
const ProductViewModal = ({ product, onClose, onDelete }) => {
    const [currentImg, setCurrentImg] = useState(0);

    return (
        <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="bg-white max-w-3xl w-full rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row shadow-2xl relative">

                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 p-2 bg-gray-100 hover:bg-red-50 hover:text-red-500 rounded-full transition-all z-10"
                >
                    <X size={18} />
                </button>

                {/* Left: Images */}
                <div className="md:w-1/2 bg-gray-50 p-6 flex flex-col items-center justify-center border-r border-gray-100">
                    <div className="w-full aspect-square rounded-2xl overflow-hidden bg-white border border-gray-100 flex items-center justify-center">
                        <img
                            src={product.images?.[currentImg] || 'https://via.placeholder.com/300'}
                            className="max-h-[280px] w-full object-contain"
                            alt={product.name}
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/300'; }}
                        />
                    </div>
                    {product.images?.length > 1 && (
                        <div className="flex gap-2 mt-4 overflow-x-auto pb-1 w-full justify-center">
                            {product.images.map((img, i) => (
                                <img
                                    key={i}
                                    src={img}
                                    onClick={() => setCurrentImg(i)}
                                    className={`w-14 h-14 rounded-xl cursor-pointer border-2 object-cover flex-shrink-0 transition-all
                                        ${currentImg === i ? 'border-[#ff4d6d] scale-105' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                    alt=""
                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/56'; }}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Right: Details */}
                <div className="md:w-1/2 p-8 flex flex-col justify-between">
                    <div>
                        <span className="inline-block text-[#ff4d6d] font-black uppercase text-[10px] tracking-widest bg-pink-50 px-3 py-1 rounded-full mb-3">
                            {product.category}
                        </span>
                        <h2 className="text-2xl font-black text-gray-900 leading-tight uppercase italic tracking-tighter mb-3">
                            {product.name}
                        </h2>
                        <p className="text-gray-500 text-sm leading-relaxed line-clamp-4 mb-6">
                            {product.description || 'No description provided.'}
                        </p>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between bg-gray-50 rounded-2xl px-4 py-3">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Price</span>
                                <span className="text-2xl font-black text-gray-900 italic">₹{product.price}</span>
                            </div>
                            <div className="flex items-center justify-between bg-gray-50 rounded-2xl px-4 py-3">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Stock</span>
                                <span className={`text-sm font-black px-3 py-1 rounded-full ${product.stock > 10 ? 'bg-green-100 text-green-600' :
                                        product.stock > 0 ? 'bg-yellow-100 text-yellow-600' :
                                            'bg-red-100 text-red-500'
                                    }`}>
                                    {product.stock > 0 ? `${product.stock} units` : 'Out of Stock'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 mt-6">
                        <Link
                            to={`/seller/edit-product/${product._id}`}
                            className="flex-1 bg-[#ff4d6d] text-white py-3 rounded-2xl font-black text-sm uppercase tracking-wider text-center flex items-center justify-center gap-2 hover:bg-[#e0344f] transition-colors"
                        >
                            <Edit size={16} /> Edit
                        </Link>
                        <button
                            onClick={() => onDelete(product._id)}
                            className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Product Card (Grid View) ─────────────────────────────────
const ProductCard = ({ product, onView, onDelete }) => (
    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group">
        {/* Image */}
        <div
            className="relative aspect-square bg-gray-50 overflow-hidden cursor-pointer"
            onClick={() => onView(product)}
        >
            <img
                src={product.images?.[0] || 'https://via.placeholder.com/300'}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                alt={product.name}
                onError={(e) => { e.target.src = 'https://via.placeholder.com/300'; }}
            />
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                <div className="bg-white rounded-full p-3 opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 shadow-lg">
                    <Eye size={18} className="text-gray-700" />
                </div>
            </div>
            {/* Stock badge */}
            {product.stock === 0 && (
                <div className="absolute top-3 left-3 bg-red-500 text-white text-[9px] font-black uppercase px-2 py-1 rounded-full">
                    Out of Stock
                </div>
            )}
            {product.stock > 0 && product.stock <= 5 && (
                <div className="absolute top-3 left-3 bg-yellow-400 text-white text-[9px] font-black uppercase px-2 py-1 rounded-full">
                    Low Stock
                </div>
            )}
        </div>

        {/* Info */}
        <div className="p-4">
            <p className="text-[10px] text-[#ff4d6d] font-black uppercase tracking-widest mb-1">
                {product.category}
            </p>
            <h3 className="font-black text-gray-800 text-sm uppercase italic tracking-tight truncate mb-2">
                {product.name}
            </h3>
            <div className="flex items-center justify-between">
                <span className="text-lg font-black text-gray-900">₹{product.price}</span>
                <span className="text-[10px] text-gray-400 font-bold">{product.stock} units</span>
            </div>
        </div>

        {/* Actions */}
        <div className="px-4 pb-4 flex gap-2">
            <Link
                to={`/seller/edit-product/${product._id}`}
                className="flex-1 bg-gray-50 hover:bg-[#ff4d6d] hover:text-white text-gray-600 py-2.5 rounded-2xl font-black text-[11px] uppercase tracking-wider text-center flex items-center justify-center gap-1.5 transition-all border border-gray-100"
            >
                <Edit size={13} /> Edit
            </Link>
            <button
                onClick={() => onDelete(product._id)}
                className="p-2.5 bg-gray-50 hover:bg-red-500 hover:text-white text-gray-400 rounded-2xl border border-gray-100 transition-all"
            >
                <Trash2 size={14} />
            </button>
        </div>
    </div>
);

// ─── Table Row (List View) ────────────────────────────────────
const ProductRow = ({ product, onView, onDelete }) => (
    <tr className="hover:bg-gray-50/80 transition-colors group">
        <td className="p-4">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => onView(product)}>
                <img
                    src={product.images?.[0] || 'https://via.placeholder.com/48'}
                    className="w-12 h-12 rounded-2xl object-cover border border-gray-100 group-hover:scale-105 transition-transform"
                    alt={product.name}
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/48'; }}
                />
                <div>
                    <p className="font-black text-gray-800 text-sm uppercase italic tracking-tight group-hover:text-[#ff4d6d] transition-colors">
                        {product.name}
                    </p>
                    <p className="text-[10px] text-gray-400 font-bold">Click to preview</p>
                </div>
            </div>
        </td>
        <td className="p-4 text-center">
            <span className="bg-pink-50 text-[#ff4d6d] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                {product.category}
            </span>
        </td>
        <td className="p-4 text-center font-black text-gray-900">₹{product.price}</td>
        <td className="p-4 text-center">
            <span className={`text-xs font-black px-3 py-1 rounded-full ${product.stock > 10 ? 'bg-green-100 text-green-600' :
                    product.stock > 0 ? 'bg-yellow-100 text-yellow-600' :
                        'bg-red-100 text-red-500'
                }`}>
                {product.stock > 0 ? `${product.stock} units` : 'Out of Stock'}
            </span>
        </td>
        <td className="p-4">
            <div className="flex justify-center gap-2">
                <button
                    onClick={() => onView(product)}
                    className="p-2 bg-gray-100 hover:bg-gray-800 hover:text-white text-gray-500 rounded-xl transition-all"
                >
                    <Eye size={15} />
                </button>
                <Link
                    to={`/seller/edit-product/${product._id}`}
                    className="p-2 bg-pink-50 text-[#ff4d6d] rounded-xl hover:bg-[#ff4d6d] hover:text-white transition-all"
                >
                    <Edit size={15} />
                </Link>
                <button
                    onClick={() => onDelete(product._id)}
                    className="p-2 bg-red-50 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                >
                    <Trash2 size={15} />
                </button>
            </div>
        </td>
    </tr>
);

// ─── Main Component ───────────────────────────────────────────
const MyProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

    useEffect(() => {
        const fetchMyProducts = async () => {
            try {
                const res = await API.get('/products/my-products');
                setProducts(res.data || []);
            } catch (err) {
                toast.error('Products load nahi ho paye!');
            } finally {
                setLoading(false);
            }
        };
        fetchMyProducts();
    }, []);

    // Unique categories for filter
    const categories = useMemo(() => {
        const cats = [...new Set(products.map(p => p.category).filter(Boolean))];
        return cats;
    }, [products]);

    // Filtered products
    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const matchesSearch =
                p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.category?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = filterCategory === 'all' || p.category === filterCategory;
            return matchesSearch && matchesCategory;
        });
    }, [products, searchTerm, filterCategory]);

    const deleteHandler = async (id) => {
        if (!window.confirm('Pakka delete karna hai?')) return;
        const toastId = toast.loading('Deleting...');
        try {
            await API.delete(`/products/${id}`);
            setProducts(prev => prev.filter(p => p._id !== id));
            if (selectedProduct?._id === id) setSelectedProduct(null);
            toast.success('Product delete ho gaya!', { id: toastId });
        } catch (err) {
            toast.error('Delete fail ho gaya.', { id: toastId });
        }
    };

    // Stats
    const totalValue = products.reduce((acc, p) => acc + (p.price * p.stock), 0);
    const outOfStock = products.filter(p => p.stock === 0).length;
    const lowStock = products.filter(p => p.stock > 0 && p.stock <= 5).length;

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center space-y-3">
                <div className="w-10 h-10 border-4 border-[#ff4d6d] border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Loading Inventory...</p>
            </div>
        </div>
    );

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen mt-16">

            {/* ── HEADER ───────────────────────────────────────── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black uppercase italic tracking-tighter text-gray-900 flex items-center gap-3">
                        <Layers className="text-[#ff4d6d]" size={28} />
                        My Inventory
                    </h1>
                    <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-1">
                        {products.length} products listed
                    </p>
                </div>
                <Link
                    to="/seller/add-product"
                    className="bg-[#ff4d6d] hover:bg-[#e0344f] text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-colors shadow-lg shadow-pink-200 self-start md:self-auto"
                >
                    <Plus size={16} /> Add Product
                </Link>
            </div>

            {/* ── MINI STATS ───────────────────────────────────── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                    { label: 'Total Products', value: products.length, color: 'text-gray-900', bg: 'bg-white' },
                    { label: 'Inventory Value', value: `₹${totalValue.toLocaleString('en-IN')}`, color: 'text-green-600', bg: 'bg-white' },
                    { label: 'Low Stock', value: lowStock, color: 'text-yellow-600', bg: 'bg-white' },
                    { label: 'Out of Stock', value: outOfStock, color: 'text-red-500', bg: 'bg-white' },
                ].map((s, i) => (
                    <div key={i} className={`${s.bg} rounded-2xl p-4 border border-gray-100 shadow-sm`}>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{s.label}</p>
                        <p className={`text-2xl font-black mt-1 ${s.color}`}>{s.value}</p>
                    </div>
                ))}
            </div>

            {/* ── FILTERS + VIEW TOGGLE ─────────────────────────── */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 bg-white focus:border-gray-400 outline-none font-bold text-sm transition-all"
                    />
                </div>

                {/* Category Filter */}
                {categories.length > 0 && (
                    <div className="relative">
                        <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="appearance-none pl-10 pr-8 py-3 rounded-2xl border border-gray-200 bg-white font-black uppercase text-xs outline-none cursor-pointer"
                        >
                            <option value="all">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                )}

                {/* View Toggle */}
                <div className="flex bg-white border border-gray-200 rounded-2xl p-1 gap-1">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2.5 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-gray-900 text-white' : 'text-gray-400 hover:text-gray-700'}`}
                    >
                        <Grid size={16} />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-2.5 rounded-xl transition-all ${viewMode === 'list' ? 'bg-gray-900 text-white' : 'text-gray-400 hover:text-gray-700'}`}
                    >
                        <List size={16} />
                    </button>
                </div>
            </div>

            {/* ── EMPTY STATE ───────────────────────────────────── */}
            {filteredProducts.length === 0 && (
                <div className="text-center py-24 bg-white rounded-[3rem] border-4 border-dashed border-gray-100">
                    <Package size={48} className="text-gray-200 mx-auto mb-4" />
                    <p className="font-black text-gray-300 uppercase tracking-widest italic text-lg">
                        {products.length === 0 ? 'No products yet' : 'No results found'}
                    </p>
                    {products.length === 0 && (
                        <Link
                            to="/seller/add-product"
                            className="mt-4 inline-block bg-[#ff4d6d] text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-wider hover:bg-[#e0344f] transition-colors"
                        >
                            + Add Your First Product
                        </Link>
                    )}
                </div>
            )}

            {/* ── GRID VIEW ─────────────────────────────────────── */}
            {viewMode === 'grid' && filteredProducts.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredProducts.map(p => (
                        <ProductCard
                            key={p._id}
                            product={p}
                            onView={setSelectedProduct}
                            onDelete={deleteHandler}
                        />
                    ))}
                </div>
            )}

            {/* ── LIST VIEW ─────────────────────────────────────── */}
            {viewMode === 'list' && filteredProducts.length > 0 && (
                <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
                    <table className="w-full border-collapse">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                {['Product', 'Category', 'Price', 'Stock', 'Actions'].map(h => (
                                    <th key={h} className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center first:text-left">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredProducts.map(p => (
                                <ProductRow
                                    key={p._id}
                                    product={p}
                                    onView={setSelectedProduct}
                                    onDelete={deleteHandler}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* ── MODAL ─────────────────────────────────────────── */}
            {selectedProduct && (
                <ProductViewModal
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                    onDelete={deleteHandler}
                />
            )}
        </div>
    );
};

export default MyProducts;