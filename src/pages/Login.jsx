import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowRight, FiMail, FiLock, FiChevronRight } from 'react-icons/fi';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const success = await login(email, password);
        setLoading(false);
        if (success) {
            navigate('/');
        }
    };

    return (
        <div className="min-h-[90vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 bg-white rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.08)] overflow-hidden">

                {/* Visual Side */}
                <div className="relative hidden md:block bg-indigo-600 p-12 text-white overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full -mr-32 -mt-32 opacity-20"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full -ml-44 -mb-44 opacity-10"></div>

                    <div className="relative z-10 h-full flex flex-col">
                        <div className="mb-12">
                            <h2 className="text-4xl font-black tracking-tight leading-tight">
                                Welcome back <br />
                                <span className="text-indigo-200 underline decoration-indigo-400">Collector</span>.
                            </h2>
                            <p className="mt-4 text-indigo-100/80 text-lg font-medium">
                                Sign in to rediscover your curated collection of premium essentials.
                            </p>
                        </div>

                        <div className="mt-auto space-y-6">
                            <div className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-xl">✨</div>
                                <div>
                                    <p className="font-bold">Exclusive Access</p>
                                    <p className="text-sm opacity-70">Members get priority shipping on all orders.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Side */}
                <div className="p-8 md:p-16 flex flex-col justify-center">
                    <div className="mb-10 text-center md:text-left">
                        <h3 className="text-3xl font-black text-slate-900 tracking-tight">Login</h3>
                        <p className="text-slate-500 font-medium mt-2">Access your luxury marketplace</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                            <div className="relative group">
                                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-indigo-600 rounded-2xl outline-none transition-all text-slate-700 font-medium shadow-sm hover:shadow-md"
                                    placeholder="your@email.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-sm font-bold text-slate-700">Password</label>
                                <Link to="/forgot-password" size={12} className="text-xs text-indigo-600 font-bold hover:underline">
                                    Forgot?
                                </Link>
                            </div>
                            <div className="relative group">
                                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-12 py-4 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-indigo-600 rounded-2xl outline-none transition-all text-slate-700 font-medium shadow-sm hover:shadow-md"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold text-lg shadow-xl shadow-slate-200 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 group mt-8"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>Sign In <FiChevronRight className="group-hover:translate-x-1 transition-transform" /></>
                            )}
                        </button>
                    </form>

                    <div className="mt-12 space-y-4">
                        <p className="text-center text-slate-500 font-medium text-sm">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-indigo-600 font-bold hover:underline">
                                Create Account
                            </Link>
                        </p>

                        <div className="flex items-center justify-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest pt-4 border-t border-slate-100">
                            <Link to="/verify-email" className="hover:text-indigo-600 transition-colors">Verify Email</Link>
                            <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                            <Link to="/" className="hover:text-indigo-600 transition-colors flex items-center gap-1">
                                Skip <FiArrowRight />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;

