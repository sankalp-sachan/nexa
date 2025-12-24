import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { FiShoppingCart, FiHeart, FiStar, FiArrowRight, FiZap, FiBox, FiShield } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const { wishlistItems, toggleWishlist } = useWishlist();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const searchKeyword = searchParams.get('search') || '';

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const { data } = await axios.get(`/products?keyword=${searchKeyword}`);
                setProducts(data.products || []);
            } catch (error) {
                console.error(error);
                toast.error("Failed to load products");
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [searchKeyword]);

    if (loading) return (
        <div className="flex flex-col justify-center items-center min-h-[60vh] gap-4">
            <div className="relative w-16 h-16">
                <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="text-slate-500 font-medium animate-pulse">Curating best deals for you...</p>
        </div>
    );

    const scrollToProducts = () => {
        document.getElementById('products-grid')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="space-y-12 pb-20">
            {/* Hero Banner Section */}
            {!searchKeyword && (
                <section className="relative h-[400px] md:h-[500px] w-full rounded-[2rem] overflow-hidden group">
                    <img
                        src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2000"
                        alt="Hero"
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s] ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/40 to-transparent"></div>
                    <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-20 max-w-4xl space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600/20 backdrop-blur-md rounded-full border border-indigo-400/30 text-indigo-100 text-sm font-bold w-fit">
                            <FiZap className="text-yellow-400" /> NEW SEASON ARRIVALS
                        </div>
                        <h1 className="text-4xl md:text-7xl font-extrabold text-white leading-[1.1]">
                            Elevate Your <br />
                            <span className="text-indigo-400">Lifestyle</span> Experience
                        </h1>
                        <p className="text-lg md:text-xl text-slate-200 max-w-lg font-medium opacity-90">
                            Discover our curated collection of premium essentials designed for modern living.
                        </p>
                        <div className="flex flex-wrap gap-4 pt-4">
                            <button
                                onClick={scrollToProducts}
                                className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 hover:-translate-y-1 transition-all flex items-center gap-2"
                            >
                                Shop Collection <FiArrowRight />
                            </button>
                            <button
                                onClick={() => navigate('/?search=luxe')}
                                className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/20 transition-all font-sans"
                            >
                                View Lookbook
                            </button>
                        </div>
                    </div>
                </section>
            )}

            {/* Features Bar */}
            {!searchKeyword && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { icon: <FiBox />, title: "Premium Packaging", desc: "Every order handled with care" },
                        { icon: <FiShield />, title: "Secure Checkout", desc: "Military grade encryption" },
                        { icon: <FiZap />, title: "Next Day Delivery", desc: "Available for select regions" }
                    ].map((feature, i) => (
                        <div key={i} className="flex items-center gap-4 p-6 premium-card">
                            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 text-xl">
                                {feature.icon}
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">{feature.title}</h3>
                                <p className="text-sm text-slate-500">{feature.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Product Section */}
            <section id="products-grid">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                            {searchKeyword ? `Results for "${searchKeyword}"` : "Featured Selections"}
                        </h2>
                        <div className="h-1.5 w-12 bg-indigo-600 rounded-full mt-2"></div>
                    </div>
                    {products.length > 0 && (
                        <div className="flex items-center gap-4 text-sm font-bold text-slate-400">
                            <span>{products.length} Products</span>
                        </div>
                    )}
                </div>

                {products.length === 0 ? (
                    <div className="text-center py-32 premium-card bg-slate-50/50 border-dashed border-2 border-slate-200">
                        <div className="w-24 h-24 bg-white rounded-3xl shadow-lg flex items-center justify-center mx-auto mb-6 text-slate-300">
                            <FiBox size={40} />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">No results found</h3>
                        <p className="text-slate-500 max-w-xs mx-auto mb-8">We couldn't find any products matching your search. Try different keywords or browse our categories.</p>
                        <Link to="/" className="text-indigo-600 font-bold hover:underline py-2 px-4">Clear all filters</Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {products.map((product) => (
                            <div key={product._id} className="premium-card group flex flex-col p-4 relative">
                                {/* Wishlist Button */}
                                <button
                                    onClick={() => toggleWishlist(product)}
                                    className={`absolute top-6 right-6 p-2.5 rounded-xl shadow-sm transition-all z-10 ${wishlistItems.find(i => i._id === product._id) ? 'bg-rose-500 text-white' : 'bg-white/80 backdrop-blur-md text-slate-400 hover:text-rose-500 hover:bg-white'}`}
                                >
                                    <FiHeart size={20} fill={wishlistItems.find(i => i._id === product._id) ? "currentColor" : "none"} />
                                </button>


                                {/* Product Link Wrapper */}
                                <Link to={`/product/${product._id}`} className="flex flex-col h-full">
                                    {/* Image Holder */}
                                    <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-slate-50 relative">
                                        <img
                                            src={product.images?.[0]?.url || 'https://via.placeholder.com/300'}
                                            alt={product.name}
                                            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700 ease-out"
                                        />
                                        {product.stock === 0 && (
                                            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center">
                                                <span className="bg-white text-slate-900 px-4 py-2 rounded-lg font-bold text-xs">OUT OF STOCK</span>
                                            </div>
                                        )}
                                        {product.discount > 0 && (
                                            <div className="absolute bottom-3 left-3 bg-rose-500 text-white px-3 py-1 rounded-lg font-bold text-xs shadow-lg">
                                                -{product.discount}%
                                            </div>
                                        )}
                                    </div>

                                    {/* Product Details */}
                                    <div className="mt-6 flex-grow space-y-3">
                                        <div className="flex items-center gap-2">
                                            <div className="flex text-yellow-400">
                                                {[...Array(5)].map((_, i) => (
                                                    <FiStar key={i} size={14} fill={i < 4 ? "currentColor" : "none"} />
                                                ))}
                                            </div>
                                            <span className="text-xs font-bold text-slate-400">(42)</span>
                                        </div>

                                        <h3 className="text-lg font-bold text-slate-900 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                                            {product.name}
                                        </h3>

                                        <div className="flex items-baseline gap-2">
                                            <span className="text-2xl font-black text-slate-900">₹{product.price.toLocaleString()}</span>
                                            {product.discount > 0 && (
                                                <span className="text-sm font-medium text-slate-400 line-through">
                                                    ₹{(product.price * (1 + product.discount / 100)).toFixed(0).toLocaleString()}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </Link>

                                {/* Action Button */}
                                <button
                                    disabled={product.stock === 0}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        addToCart(product);
                                    }}
                                    className="mt-6 w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-slate-200"
                                >
                                    <FiShoppingCart size={18} /> {product.stock === 0 ? 'Out of Stock' : 'Add to Bag'}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Home;

