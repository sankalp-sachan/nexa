import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiTrash2, FiStar, FiBox, FiArrowRight } from 'react-icons/fi';

const Wishlist = () => {
    const { wishlistItems, loading, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();

    if (loading) return (
        <div className="flex flex-col justify-center items-center min-h-[60vh] gap-4">
            <div className="relative w-16 h-16">
                <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="text-slate-500 font-medium">Loading your favorites...</p>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex items-center justify-between mb-12">
                <div>
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight flex items-center gap-4">
                        My Wishlist <span className="text-indigo-600"><FiHeart /></span>
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium">You have {wishlistItems.length} items in your collection.</p>
                </div>
                <Link to="/" className="hidden md:flex items-center gap-2 text-indigo-600 font-bold hover:gap-3 transition-all">
                    Continue Shopping <FiArrowRight />
                </Link>
            </div>

            {wishlistItems.length === 0 ? (
                <div className="text-center py-24 premium-card bg-white border-dashed border-2 border-slate-100">
                    <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 text-slate-300">
                        <FiHeart size={40} />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Your wishlist is empty</h3>
                    <p className="text-slate-500 max-w-xs mx-auto mb-8">Save items you love here and they'll be waiting for you when you're ready.</p>
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                    >
                        Explore Products
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {wishlistItems.map((product) => (
                        <div key={product._id} className="premium-card group flex flex-col p-4 relative bg-white">
                            <button
                                onClick={() => removeFromWishlist(product._id)}
                                className="absolute top-6 right-6 p-2.5 bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl shadow-sm transition-all z-10"
                            >
                                <FiTrash2 size={18} />
                            </button>

                            <Link to={`/product/${product._id}`} className="flex flex-col h-full">
                                <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-slate-50 relative">
                                    <img
                                        src={product.images?.[0]?.url || 'https://via.placeholder.com/300'}
                                        alt={product.name}
                                        className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700"
                                    />
                                    {product.discount > 0 && (
                                        <div className="absolute bottom-3 left-3 bg-rose-500 text-white px-3 py-1 rounded-lg font-bold text-xs">
                                            -{product.discount}%
                                        </div>
                                    )}
                                </div>

                                <div className="mt-6 flex-grow space-y-3">
                                    <div className="flex items-center gap-2">
                                        <div className="flex text-yellow-400">
                                            <FiStar size={14} fill="currentColor" />
                                        </div>
                                        <span className="text-xs font-bold text-slate-400">4.8</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                                        {product.name}
                                    </h3>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-2xl font-black text-slate-900">₹{product.price.toLocaleString()}</span>
                                    </div>
                                </div>
                            </Link>

                            <button
                                onClick={() => {
                                    addToCart(product);
                                    removeFromWishlist(product._id);
                                }}
                                className="mt-6 w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                            >
                                <FiShoppingCart size={18} /> Move to Bag
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Wishlist;
