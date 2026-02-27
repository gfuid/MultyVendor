import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../../api/axios';
import { ShoppingCart, Star, Package, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/authStore.js';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [related, setRelated] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user, updateCart } = useAuthStore();

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                setLoading(true);
                // 1. Single product details fetch karein
                const { data } = await API.get(`/products/${id}`);
                setProduct(data.product || data);

                // 2. Related products fetch karein (Same category wale)
                const category = data.product?.category || data.category;
                const relatedRes = await API.get(`/products?category=${category}`);
                setRelated(relatedRes.data.products?.filter(p => p._id !== id) || []);

                setLoading(false);
                window.scrollTo(0, 0); // Page top par scroll karein
            } catch (err) {
                toast.error("Product details nahi mil payi");
                setLoading(false);
            }
        };
        fetchProductData();
    }, [id]);

    const handleAddToCart = async (p) => {
        if (!user) return toast.error("Please login first");
        const loadToast = toast.loading("Adding...");
        try {
            const { data } = await API.post('/cart/add', { productId: p._id, quantity: 1 });
            if (updateCart) updateCart(data.cart);
            toast.success("Added to cart! 🛒", { id: loadToast });
        } catch (err) {
            toast.error("Error adding to cart", { id: loadToast });
        }
    };

    if (loading) return <div className="py-20 text-center font-black animate-pulse italic uppercase">Opening Your Choice...</div>;

    return (
        <div className="bg-white min-h-screen font-sans">
            <div className="max-w-[1400px] mx-auto px-4 md:px-10 py-10">
                {/* Main Product Info Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
                    {/* Left: Product Images */}
                    <div className="space-y-4">
                        <div className="bg-[#fcf9f4] rounded-[3rem] overflow-hidden border-2 border-gray-50 h-[500px]">
                            <img
                                src={product?.images?.[0]}
                                className="w-full h-full object-contain mix-blend-multiply"
                                alt={product?.name}
                            />
                        </div>
                    </div>

                    {/* Right: Product Meta */}
                    <div className="flex flex-col justify-center">
                        <div className="flex items-center gap-2 text-[#004d2c] font-black text-xs uppercase tracking-widest mb-4">
                            <span>{product?.category}</span>
                            <ChevronRight size={14} />
                            <span className="opacity-50">Details</span>
                        </div>

                        <h1 className="text-5xl font-black italic text-gray-800 uppercase tracking-tighter leading-none mb-4">
                            {product?.name}
                        </h1>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full">
                                <Star size={16} className="fill-yellow-400 text-yellow-400" />
                                <span className="font-bold text-sm">4.9</span>
                            </div>
                            <span className="text-gray-400 text-sm font-bold uppercase italic">In Stock ({product?.stock} units)</span>
                        </div>

                        <p className="text-gray-500 text-lg font-medium leading-relaxed italic mb-8 border-l-4 border-gray-100 pl-6">
                            "{product?.description}"
                        </p>

                        <div className="flex items-center justify-between p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 mb-8">
                            <div>
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Price Point</p>
                                <p className="text-4xl font-black text-[#004d2c] italic">₹{product?.price}</p>
                            </div>
                            <button
                                onClick={() => handleAddToCart(product)}
                                className="bg-[#004d2c] text-white px-10 py-5 rounded-2xl font-black text-xs uppercase flex items-center gap-3 hover:bg-[#4ade80] transition-all transform active:scale-95 shadow-xl shadow-green-50"
                            >
                                <ShoppingCart size={18} /> Add To Bag
                            </button>
                        </div>
                    </div>
                </div>

                {/* Related Products Section */}
                {related.length > 0 && (
                    <div className="border-t-4 border-[#e6ffed] pt-12">
                        <h2 className="text-3xl font-black italic text-[#004d2c] tracking-tighter uppercase mb-8">
                            You Might Also Like
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {related.slice(0, 4).map((item) => (
                                <div
                                    key={item._id}
                                    onClick={() => navigate(`/product/${item._id}`)}
                                    className="cursor-pointer bg-white p-4 rounded-[2rem] border-2 border-gray-50 hover:shadow-xl transition-all group"
                                >
                                    <img src={item.images[0]} className="w-full h-48 object-cover rounded-2xl mb-4 group-hover:scale-105 transition-transform" />
                                    <h3 className="font-black text-gray-800 uppercase italic text-sm">{item.name}</h3>
                                    <p className="text-[#004d2c] font-black italic">₹{item.price}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetail;