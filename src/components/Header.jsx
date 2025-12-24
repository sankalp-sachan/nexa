import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { FiShoppingCart, FiUser, FiLogOut, FiMenu, FiSearch, FiPackage, FiHeart } from 'react-icons/fi';
import { useState, useEffect } from 'react';
const Header = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const { cartItems } = useCart();
    const { wishlistItems } = useWishlist();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isScrolled, setIsScrolled] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showInstallBtn, setShowInstallBtn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowInstallBtn(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            setShowInstallBtn(false);
        }
        setDeferredPrompt(null);
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/?search=${searchTerm}`);
        } else {
            navigate('/');
        }
    };

    return (
        <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-lg shadow-sm border-b border-slate-200/50 py-2' : 'bg-white py-4'}`}>
            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
                <div className="flex items-center justify-between gap-4 md:gap-8">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group shrink-0">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 group-hover:rotate-6 transition-transform">
                            <FiPackage className="text-white text-xl" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 leading-tight">
                                NexusMart
                            </span>
                            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold leading-none">
                                Premium Shop
                            </span>
                        </div>
                    </Link>

                    {/* Search Bar - Center */}
                    <form onSubmit={handleSearch} className="flex-1 max-w-2xl hidden md:block">
                        <div className="relative flex items-center group">
                            <button
                                type="submit"
                                className="absolute left-4 text-slate-400 group-focus-within:text-indigo-500 hover:text-indigo-600 transition-colors z-10"
                            >
                                <FiSearch size={20} />
                            </button>
                            <input
                                type="text"
                                placeholder="Search for luxury items..."
                                className="w-full py-3 pl-12 pr-4 bg-slate-100 border-transparent focus:bg-white focus:ring-4 focus:ring-indigo-50 border-2 focus:border-indigo-500 rounded-2xl text-slate-700 outline-none transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </form>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-2 md:gap-4">
                        <div className="hidden sm:flex items-center gap-2">
                            <Link to="/cart" className="relative p-2.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all group">
                                <FiShoppingCart size={22} />
                                {cartItems.length > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] rounded-lg h-5 min-w-[20px] px-1 flex items-center justify-center font-bold ring-4 ring-white">
                                        {cartItems.length}
                                    </span>
                                )}
                            </Link>
                            <Link to="/wishlist" className="relative p-2.5 text-slate-600 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
                                <FiHeart size={22} />
                                {wishlistItems.length > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] rounded-lg h-5 min-w-[20px] px-1 flex items-center justify-center font-bold ring-4 ring-white">
                                        {wishlistItems.length}
                                    </span>
                                )}
                            </Link>
                        </div>

                        <div className="h-8 w-px bg-slate-200 hidden sm:block mx-1"></div>

                        {isAuthenticated ? (
                            <div className="relative group">
                                <button className="flex items-center gap-3 p-1.5 pl-3 border border-slate-200 rounded-2xl hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-50 transition-all bg-white">
                                    <div className="flex flex-col items-end hidden lg:flex">
                                        <span className="text-sm font-bold text-slate-900 leading-none">{user?.name?.split(' ')[0]}</span>
                                        <span className="text-[10px] text-slate-400 font-medium">Account</span>
                                    </div>
                                    <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-700 overflow-hidden font-bold">
                                        {user?.avatar?.url ? (
                                            <img src={user.avatar.url} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            user?.name?.charAt(0)
                                        )}
                                    </div>
                                </button>

                                {/* Dropdown */}
                                <div className="absolute right-0 top-full pt-4 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-2 group-hover:translate-y-0 transition-all duration-300 z-[100]">
                                    <div className="bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden">
                                        <div className="p-5 border-b bg-slate-50/50">
                                            <p className="font-bold text-slate-900">{user?.name}</p>
                                            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                                        </div>
                                        <div className="p-2">
                                            {user?.role === 'admin' && (
                                                <Link to="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-xl transition-colors font-medium">
                                                    <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600"><FiUser /></div>
                                                    Admin DashBoard
                                                </Link>
                                            )}
                                            <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 rounded-xl transition-colors">
                                                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center"><FiUser /></div>
                                                My Profile
                                            </Link>
                                            <Link to="/orders" className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 rounded-xl transition-colors">
                                                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center"><FiPackage /></div>
                                                My Orders
                                            </Link>
                                            <div className="my-2 border-t border-slate-100"></div>
                                            <button onClick={logout} className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm text-rose-600 hover:bg-rose-50 rounded-xl transition-colors font-bold">
                                                <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center"><FiLogOut /></div>
                                                Sign Out
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Link to="/login" className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all">
                                Login
                            </Link>
                        )}

                        {showInstallBtn && (
                            <button
                                onClick={handleInstallClick}
                                className="hidden lg:flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl font-bold text-sm border border-indigo-100 hover:bg-indigo-100 transition-all"
                            >
                                <FiPackage />
                                Install App
                            </button>
                        )}

                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2.5 text-slate-600 hover:bg-slate-100 rounded-xl">
                            <FiMenu size={24} />
                        </button>
                    </div>
                </div>

                {/* Mobile Search Bar */}
                <form onSubmit={handleSearch} className="mt-4 md:hidden">
                    <div className="relative flex items-center group">
                        <div className="absolute left-4 text-slate-400">
                            <FiSearch size={18} />
                        </div>
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="w-full py-2.5 pl-10 pr-4 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </form>
            </div>

            {/* Mobile Sidebar */}
            {isMenuOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100]" onClick={() => setIsMenuOpen(false)}>
                    <div className="w-4/5 max-w-[320px] h-full bg-white flex flex-col p-8 shadow-2xl animate-in slide-in-from-left duration-500" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center gap-3 mb-12">
                            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                                <FiPackage className="text-white text-xl" />
                            </div>
                            <span className="text-2xl font-bold text-slate-900">NexusMart</span>
                        </div>
                        <nav className="flex flex-col gap-4">
                            <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-lg font-bold text-slate-700 hover:text-indigo-600 px-2 py-3 rounded-xl hover:bg-indigo-50 transition-all">Home</Link>
                            <Link to="/cart" onClick={() => setIsMenuOpen(false)} className="text-lg font-bold text-slate-700 hover:text-indigo-600 px-2 py-3 rounded-xl hover:bg-indigo-50 transition-all flex justify-between items-center">
                                My Cart
                                {cartItems.length > 0 && <span className="bg-indigo-600 text-white text-xs px-2 py-1 rounded-lg">{cartItems.length}</span>}
                            </Link>
                            {isAuthenticated ? (
                                <>
                                    <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="text-lg font-bold text-slate-700 hover:text-indigo-600 px-2 py-3 rounded-xl hover:bg-indigo-50 transition-all">Profile</Link>
                                    <button onClick={() => { logout(); setIsMenuOpen(false); }} className="text-left text-lg font-bold text-rose-600 mt-8 border-t border-slate-100 pt-6 flex items-center gap-3">
                                        <FiLogOut /> Sign Out
                                    </button>
                                </>
                            ) : (
                                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="bg-indigo-600 text-center text-white py-4 rounded-xl font-bold mt-8 shadow-xl shadow-indigo-100">Login</Link>
                            )}
                        </nav>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;

