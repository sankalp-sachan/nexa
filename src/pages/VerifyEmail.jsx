import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from '../api/axios';
import { toast } from 'react-hot-toast';
import { FiMail, FiShield, FiArrowLeft } from 'react-icons/fi';

const VerifyEmail = () => {
    const location = useLocation();
    const [email, setEmail] = useState(location.state?.email || '');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleVerify = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('/auth/verify', { email, otp });
            toast.success('Email Verified Successfully!');
            navigate('/login');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Verification Failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#f1f3f6] -mx-4 -mt-8 min-h-[85vh] flex items-center justify-center py-10">
            <div className="max-w-md w-full mx-4">
                <div className="bg-white rounded-sm shadow-xl p-8 md:p-10">
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-16 h-16 bg-blue-50 text-[#2874f0] rounded-full flex items-center justify-center mb-4 border border-blue-100">
                            <FiShield size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">Account Verification</h2>
                        <p className="text-gray-500 text-sm text-center mt-2">
                            Enter the 6-digit code we sent to your email
                            <span className="block font-bold text-gray-700">{email}</span>
                        </p>
                    </div>

                    <form onSubmit={handleVerify} className="space-y-6">
                        <div className="relative">
                            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border-b-2 border-gray-100 focus:border-[#2874f0] transition-colors outline-none text-sm"
                                placeholder="Registered Email"
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Verification Code</label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="w-full px-4 py-4 bg-gray-50 rounded-sm border-2 border-gray-50 focus:border-[#2874f0] focus:bg-white transition-all outline-none text-center text-3xl font-bold tracking-[0.5em] placeholder:text-gray-200"
                                placeholder="000000"
                                maxLength="6"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#fb641b] text-white py-3.5 rounded-sm font-bold shadow-lg hover:bg-[#eb5d1a] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? 'VERIFYING...' : 'VERIFY & PROCEED'}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-gray-50 flex flex-col items-center gap-4">
                        <p className="text-sm text-gray-500">
                            Didn't receive code? <button className="text-[#2874f0] font-bold hover:underline">Resend OTP</button>
                        </p>
                        <Link to="/register" className="text-xs text-gray-400 flex items-center gap-1 hover:text-[#2874f0]">
                            <FiArrowLeft /> Back to Registration
                        </Link>
                    </div>
                </div>

                <p className="mt-8 text-center text-xs text-gray-400">
                    By verifying, you agree to NexusMart's
                    <button className="text-gray-500 font-bold mx-1">Terms of Use</button>
                    and
                    <button className="text-gray-500 font-bold mx-1">Privacy Policy</button>
                </p>
            </div>
        </div>
    );
};

export default VerifyEmail;
