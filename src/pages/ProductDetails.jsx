import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { FiStar, FiShoppingCart, FiZap, FiHeart, FiShare2 } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const { wishlistItems, toggleWishlist } = useWishlist();
    const navigate = useNavigate();
    const [qty, setQty] = useState(1);

    const isWishlisted = wishlistItems.find(i => i._id === id);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const { data } = await axios.get(`/products/${id}`);
                setProduct(data.product);
            } catch (error) {
                console.error(error);
                toast.error("Failed to load product details");
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) return (
        <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
    );

    if (!product) return (
        <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-gray-500">Product not found</h2>
            <Link to="/" className="text-indigo-600 hover:underline mt-4 inline-block font-bold">Back to Home</Link>
        </div>
    );

    const originalPrice = product.price * (1 + (product.discount || 0) / 100);

    return (
        <div className="bg-white px-2 md:px-8 py-6 rounded-sm shadow-sm md:flex gap-10 min-h-[80vh]">
            {/* Left: Image & Buttons */}
            <div className="w-full md:w-[40%] flex-shrink-0">
                <div className="sticky top-24">
                    <div className="border border-gray-100 p-4 md:p-10 mb-4 rounded-sm relative group">
                        <img
                            src={product.images[0]?.url || 'https://via.placeholder.com/600'}
                            alt={product.name}
                            className="w-full aspect-[4/5] object-contain"
                        />
                        <button
                            onClick={() => toggleWishlist(product)}
                            className={`absolute top-4 right-4 w-10 h-10 border border-gray-100 rounded-full flex items-center justify-center shadow-sm transition-all z-10 ${isWishlisted ? 'bg-rose-500 text-white border-rose-500' : 'bg-white text-gray-300 hover:text-rose-500'}`}
                        >
                            <FiHeart size={20} fill={isWishlisted ? "currentColor" : "none"} />
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-4">
                        <button
                            onClick={() => {
                                addToCart(product, qty);
                                toast.success("Added to Cart");
                            }}
                            className="flex items-center justify-center gap-2 bg-[#ff9f00] text-white py-3 md:py-4 rounded-sm font-bold text-sm md:text-lg shadow-md hover:bg-[#fb641b] transition-all"
                        >
                            <FiShoppingCart size={22} /> ADD TO CART
                        </button>
                        <button
                            onClick={() => {
                                addToCart(product, qty);
                                navigate('/shipping');
                            }}
                            className="flex items-center justify-center gap-2 bg-[#fb641b] text-white py-3 md:py-4 rounded-sm font-bold text-sm md:text-lg shadow-md hover:bg-[#eb5d1a] transition-all"
                        >
                            <FiZap size={22} /> BUY NOW
                        </button>
                    </div>
                </div>
            </div>

            {/* Right: Product Info */}
            <div className="flex-1 mt-6 md:mt-0">
                <nav className="text-[10px] md:text-xs text-gray-400 mb-2 flex items-center gap-2">
                    <Link to="/" className="hover:text-[#2874f0]">Home</Link>
                    <span>{'>'}</span>
                    <span className="hover:text-[#2874f0] cursor-pointer">{product.category?.name || 'Category'}</span>
                    <span>{'>'}</span>
                    <span className="text-gray-500 truncate">{product.name}</span>
                </nav>

                <h1 className="text-lg md:text-xl font-medium text-gray-800 mb-2 leading-relaxed">{product.name}</h1>

                <div className="flex items-center gap-3 mb-4">
                    <div className="bg-green-600 text-white text-[10px] md:text-xs px-2 py-0.5 rounded-sm flex items-center gap-1 font-bold">
                        {product.ratings || '4.2'} <FiStar size={12} fill="currentColor" />
                    </div>
                    <span className="text-gray-400 text-sm font-bold">{product.numOfReviews || '1,245'} Ratings & {Math.floor(product.numOfReviews * 0.4) || '320'} Reviews</span>
                    <div className="ml-auto flex gap-4 text-gray-400">
                        <FiShare2 className="cursor-pointer hover:text-[#2874f0]" />
                    </div>
                </div>

                <div className="space-y-1 mb-6">
                    <p className="text-green-600 text-sm font-bold">Extra ₹{((originalPrice - product.price) * 0.1).toFixed(0)} off</p>
                    <div className="flex items-end gap-3">
                        <span className="text-2xl md:text-3xl font-bold">₹{product.price.toLocaleString()}</span>
                        {product.discount > 0 && (
                            <>
                                <span className="text-sm md:text-base text-gray-400 line-through">₹{originalPrice.toFixed(0).toLocaleString()}</span>
                                <span className="text-sm md:text-base text-green-600 font-bold">{product.discount}% off</span>
                            </>
                        )}
                    </div>
                    {product.stock > 0 && product.stock < 10 && (
                        <p className="text-red-500 text-xs font-bold pt-2 animate-pulse">Hurry, Only {product.stock} left!</p>
                    )}
                </div>

                {/* Offers */}
                <div className="mb-8">
                    <p className="font-bold text-sm md:text-base mb-3">Available offers</p>
                    <div className="space-y-2">
                        {[
                            "Bank Offer 5% Cashback on NexusMart Axis Bank Card",
                            "Special Price Get extra 10% off (price inclusive of cashback/coupon)",
                            "Partner Offer Buy this product and get upto ₹250 off on next purchase"
                        ].map((offer, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm">
                                <span className="text-green-600 shrink-0"><FiZap fill="currentColor" size={14} /></span>
                                <span className="text-gray-700 font-medium"> <span className="font-bold">{offer.split(' ')[0]} {offer.split(' ')[1]}</span> {offer.split(' ').slice(2).join(' ')}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Qty Selector */}
                <div className="flex items-center gap-6 mb-8 border-y py-4 border-gray-100">
                    <span className="text-gray-500 font-bold text-sm uppercase">Quantity</span>
                    <div className="flex items-center">
                        <button
                            className="w-8 h-8 flex items-center justify-center border rounded-full hover:bg-gray-50 transition-colors disabled:opacity-30"
                            onClick={() => setQty(q => Math.max(1, q - 1))}
                            disabled={qty <= 1}
                        >-</button>
                        <span className="w-12 text-center font-bold">{qty}</span>
                        <button
                            className="w-8 h-8 flex items-center justify-center border rounded-full hover:bg-gray-50 transition-colors disabled:opacity-30"
                            onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                            disabled={qty >= product.stock}
                        >+</button>
                    </div>
                    <span className={`text-sm font-bold ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                        {product.stock > 0 ? `${product.stock} items available` : 'Out of Stock'}
                    </span>
                </div>

                {/* Description */}
                <div className="mb-8">
                    <h3 className="font-bold text-gray-800 mb-4 border-b pb-2 inline-block border-[#2874f0]">Description</h3>
                    <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{product.description}</p>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
