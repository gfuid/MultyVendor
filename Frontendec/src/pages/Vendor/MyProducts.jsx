import React, { useEffect, useState } from 'react';
import API from '../../api/axios';
import { Trash2, Edit, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

// 1. Modal Component (Cloudinary Ready)
const ProductViewModal = ({ product, onClose }) => {
    const [currentImg, setCurrentImg] = useState(0);

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white max-w-4xl w-full rounded-[40px] overflow-hidden flex flex-col md:flex-row shadow-2xl relative animate-in fade-in zoom-in duration-200">
                <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-gray-100 rounded-full hover:bg-red-50 hover:text-red-500 transition-all z-10">
                    <X size={20} />
                </button>

                {/* Left: Image Slider */}
                <div className="md:w-1/2 bg-gray-50 p-6 flex flex-col items-center justify-center border-r border-gray-100">
                    <img
                        // FIX: Seedha Cloudinary URL use ho raha hai
                        src={product.images[currentImg]}
                        className="max-h-[400px] w-full object-contain rounded-2xl"
                        alt={product.name}
                        onError={(e) => { e.target.src = "/default-product.png" }}
                    />
                    <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                        {product.images.map((img, i) => (
                            <img
                                key={i}
                                src={img}
                                onClick={() => setCurrentImg(i)}
                                className={`w-16 h-16 rounded-lg cursor-pointer border-2 transition-all object-cover ${currentImg === i ? 'border-[#ff4d6d]' : 'border-transparent'}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Right: Details */}
                <div className="md:w-1/2 p-10 flex flex-col justify-center">
                    <span className="text-[#ff4d6d] font-black uppercase text-xs tracking-widest mb-2">{product.category}</span>
                    <h2 className="text-3xl font-black text-gray-900 leading-tight mb-4 uppercase italic tracking-tighter">{product.name}</h2>
                    <p className="text-gray-500 mb-8 leading-relaxed font-medium line-clamp-4">{product.description}</p>
                    <div className="flex items-center gap-6">
                        <span className="text-4xl font-black text-gray-900 tracking-tighter italic">₹{product.price}</span>
                        <span className={`px-4 py-1 rounded-full text-xs font-bold ${product.stock > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                            {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const MyProducts = () => {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        const fetchMyProducts = async () => {
            try {
                const res = await API.get('/products/my-products');
                setProducts(res.data);
            } catch (err) {
                toast.error("Products load nahi ho paye");
            }
        };
        fetchMyProducts();
    }, []);

    const deleteHandler = async (id) => {
        if (window.confirm("Bhai, pakka delete karna hai?")) {
            const toastId = toast.loading("Deleting product...");
            try {
                await API.delete(`/products/${id}`);
                setProducts(products.filter(p => p._id !== id));
                toast.success("Gayab! Product delete ho gaya.", { id: toastId });
            } catch (err) {
                toast.error("Delete nahi ho paya.", { id: toastId });
            }
        }
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-black mb-6 uppercase tracking-tighter italic">My Inventory</h1>
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
                <table className="w-full border-collapse">
                    <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                        <tr>
                            <th className="p-4 text-left">Product</th>
                            <th className="p-4">Category</th>
                            <th className="p-4">Price</th>
                            <th className="p-4">Stock</th>
                            <th className="p-4 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {products.length === 0 ? (
                            // FIX: Hydration error fix karne ke liye message ko <tr><td> mein rakha hai
                            <tr>
                                <td colSpan="5" className="p-10 text-center text-gray-400 font-bold italic">
                                    Abhi tak koi product nahi hai.
                                </td>
                            </tr>
                        ) : (
                            products.map(p => (
                                <tr key={p._id} className="hover:bg-gray-50/50 transition-colors cursor-default">
                                    <td className="p-4 flex items-center gap-3 cursor-pointer group" onClick={() => setSelectedProduct(p)}>
                                        <img
                                            // FIX: Cloudinary URL direct use ho raha hai
                                            src={p.images[0]}
                                            className="w-12 h-12 rounded-xl object-cover border border-gray-100 group-hover:scale-105 transition-transform"
                                            alt={p.name}
                                            onError={(e) => { e.target.src = "/default-product.png" }}
                                        />
                                        <span className="font-bold text-gray-800 group-hover:text-[#ff4d6d] transition-colors">{p.name}</span>
                                    </td>
                                    <td className="p-4 text-center text-sm font-medium text-gray-500 uppercase">{p.category}</td>
                                    <td className="p-4 text-center font-bold text-gray-900">₹{p.price}</td>
                                    <td className="p-4 text-center font-bold text-[#ff4d6d]">{p.stock}</td>
                                    <td className="p-4">
                                        <div className="flex justify-center gap-2">
                                            <Link to={`/seller/edit-product/${p._id}`} className="p-2 bg-pink-50 text-[#ff4d6d] rounded-lg hover:bg-[#ff4d6d] hover:text-white transition-all">
                                                <Edit size={16} />
                                            </Link>
                                            <button
                                                onClick={() => deleteHandler(p._id)}
                                                className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal - Table ke bahar render ho raha hai taaki layout na toote */}
            {selectedProduct && (
                <ProductViewModal
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                />
            )}
        </div>
    );
};

export default MyProducts;