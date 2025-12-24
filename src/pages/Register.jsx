import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { FiMail, FiLock, FiUser, FiArrowRight, FiCheckCircle, FiShield, FiChevronRight } from 'react-icons/fi';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [loading, setLoading] = useState(false);

    const { register, verifyEmail } = useAuth();
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        const result = await register({ name, email, password });
        setLoading(false);
        if (result.success && result.userId) {
            setShowOtpInput(true);
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        setLoading(true);
        const success = await verifyEmail(email, otp);
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
                                {showOtpInput ? 'Final Step' : 'Join the'} <br />
                                <span className="text-indigo-200 underline decoration-indigo-400">{showOtpInput ? 'Verification' : 'Circle'}</span>.
                            </h2>
                            <p className="mt-4 text-indigo-100/80 text-lg font-medium">
                                {showOtpInput
                                    ? "We've sent a secure code to your inbox to protect your account."
                                    : "Create your account and start your journey into our curated premium marketplace."}
                            </p>
                        </div>

                        <div className="mt-auto space-y-4">
                            {[
                                { icon: <FiCheckCircle />, text: "Quality inspected products" },
                                { icon: <FiShield />, text: "Buyer protection included" },
                                { icon: <FiArrowRight />, text: "Exclusive member drops" }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 text-indigo-100/90 font-medium">
                                    <span className="text-indigo-300">{item.icon}</span>
                                    {item.text}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Form Side */}
                <div className="p-8 md:p-16 flex flex-col justify-center">
                    <div className="mb-10 text-center md:text-left">
                        <h3 className="text-3xl font-black text-slate-900 tracking-tight">
                            {showOtpInput ? 'Verify Email' : 'Register'}
                        </h3>
                        <p className="text-slate-500 font-medium mt-2">
                            {showOtpInput ? 'Check your inbox for 6-digit code' : 'Start your premium experience today'}
                        </p>
                    </div>

                    {!showOtpInput ? (
                        <form onSubmit={handleRegister} className="space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                                <div className="relative group">
                                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-indigo-600 rounded-2xl outline-none transition-all text-slate-700 font-medium shadow-sm hover:shadow-md"
                                        placeholder="John Carter"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                                <div className="relative group">
                                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-indigo-600 rounded-2xl outline-none transition-all text-slate-700 font-medium shadow-sm hover:shadow-md"
                                        placeholder="john@example.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
                                <div className="relative group">
                                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-indigo-600 rounded-2xl outline-none transition-all text-slate-700 font-medium shadow-sm hover:shadow-md"
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
                                    <>Create Account <FiChevronRight className="group-hover:translate-x-1 transition-transform" /></>
                                )}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerify} className="space-y-8">
                            <div className="space-y-6 text-center">
                                <div className="p-4 bg-indigo-50 text-indigo-700 text-sm font-medium rounded-2xl border border-indigo-100">
                                    Check <span className="font-bold underline">{email}</span> for OTP
                                </div>

                                <div className="flex justify-center gap-3">
                                    <input
                                        type="text"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        className="w-full py-6 bg-slate-50 border-2 border-slate-100 text-center text-4xl font-black tracking-[0.5em] outline-none focus:border-indigo-600 focus:bg-white transition-all rounded-[1.5rem] shadow-inner"
                                        maxLength="6"
                                        placeholder="000000"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-bold text-lg shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all"
                            >
                                {loading ? 'Validating...' : 'Complete Registry'}
                            </button>

                            <button
                                type="button"
                                onClick={() => setShowOtpInput(false)}
                                className="w-full text-slate-400 text-sm font-bold hover:text-indigo-600 transition-colors"
                            >
                                Incorrect email? Go back
                            </button>
                        </form>
                    )}

                    <div className="mt-12 space-y-4">
                        <p className="text-center text-slate-500 font-medium text-sm">
                            Already have an account?{' '}
                            <Link to="/login" className="text-indigo-600 font-bold hover:underline">
                                Sign In
                            </Link>
                        </p>

                        <div className="flex items-center justify-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest pt-4 border-t border-slate-100">
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

export default Register;

