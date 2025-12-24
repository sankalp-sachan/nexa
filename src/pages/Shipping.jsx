import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';
import { FiTruck, FiMapPin, FiPhone, FiCheckCircle } from 'react-icons/fi';

const Shipping = () => {
    const { shippingInfo, saveShippingInfo } = useCart();
    const navigate = useNavigate();

    const [address, setAddress] = useState(shippingInfo.address || '');
    const [city, setCity] = useState(shippingInfo.city || '');
    const [postalCode, setPostalCode] = useState(shippingInfo.postalCode || '');
    const [phoneNo, setPhoneNo] = useState(shippingInfo.phoneNo || '');
    const [country, setCountry] = useState(shippingInfo.country || 'India');

    const submitHandler = (e) => {
        e.preventDefault();
        saveShippingInfo({ address, city, postalCode, phoneNo, country });
        navigate('/order/confirm');
    };

    return (
        <div className="bg-[#f1f3f6] -mx-4 -mt-8 min-h-screen pb-10">
            <div className="max-w-[800px] mx-auto pt-10 px-4">
                {/* Checkout Steps Simulation */}
                <div className="flex items-center justify-between mb-10 bg-white p-6 rounded-sm shadow-sm">
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#2874f0] text-white flex items-center justify-center text-xs font-bold shadow-lg shadow-blue-200">1</div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Login</span>
                    </div>
                    <div className="flex-1 h-[2px] bg-[#2874f0] mx-4 mb-6"></div>
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#2874f0] text-white flex items-center justify-center text-xs font-bold">2</div>
                        <span className="text-[10px] font-bold text-[#2874f0] uppercase tracking-tighter">Delivery Address</span>
                    </div>
                    <div className="flex-1 h-[2px] bg-gray-100 mx-4 mb-6"></div>
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center text-xs font-bold">3</div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Order Summary</span>
                    </div>
                    <div className="flex-1 h-[2px] bg-gray-100 mx-4 mb-6"></div>
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center text-xs font-bold">4</div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Payment</span>
                    </div>
                </div>

                <div className="bg-white rounded-sm shadow-sm overflow-hidden">
                    <div className="bg-[#2874f0] p-4 flex items-center gap-3 text-white">
                        <FiTruck size={20} />
                        <h2 className="font-bold uppercase text-sm tracking-wider">Delivery Address</h2>
                    </div>

                    <form onSubmit={submitHandler} className="p-8 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="md:col-span-2 relative">
                                <FiMapPin className="absolute left-0 top-3 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="House No, Street Name, Area"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    required
                                    className="w-full pl-8 py-2 border-b-2 border-gray-100 focus:border-[#2874f0] outline-none transition-colors text-sm"
                                />
                                <label className="block text-[10px] font-bold text-gray-400 uppercase mt-1">Full Address</label>
                            </div>

                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="City"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    required
                                    className="w-full py-2 border-b-2 border-gray-100 focus:border-[#2874f0] outline-none transition-colors text-sm"
                                />
                                <label className="block text-[10px] font-bold text-gray-400 uppercase mt-1">City</label>
                            </div>

                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Pincode"
                                    value={postalCode}
                                    onChange={(e) => setPostalCode(e.target.value)}
                                    required
                                    className="w-full py-2 border-b-2 border-gray-100 focus:border-[#2874f0] outline-none transition-colors text-sm"
                                />
                                <label className="block text-[10px] font-bold text-gray-400 uppercase mt-1">Postal Code</label>
                            </div>

                            <div className="relative">
                                <FiPhone className="absolute left-0 top-3 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="10-digit mobile number"
                                    value={phoneNo}
                                    onChange={(e) => setPhoneNo(e.target.value)}
                                    required
                                    className="w-full pl-8 py-2 border-b-2 border-gray-100 focus:border-[#2874f0] outline-none transition-colors text-sm"
                                />
                                <label className="block text-[10px] font-bold text-gray-400 uppercase mt-1">Phone Number</label>
                            </div>

                            <div className="relative">
                                <input
                                    type="text"
                                    value={country}
                                    onChange={(e) => setCountry(e.target.value)}
                                    required
                                    className="w-full py-2 border-b-2 border-gray-100 focus:border-[#2874f0] outline-none transition-colors text-sm"
                                />
                                <label className="block text-[10px] font-bold text-gray-400 uppercase mt-1">Country</label>
                            </div>
                        </div>

                        <div className="pt-10 flex flex-col md:flex-row items-center gap-6">
                            <button
                                type="submit"
                                className="w-full md:w-64 bg-[#fb641b] text-white py-4 rounded-sm font-bold shadow-lg hover:shadow-xl hover:bg-[#eb5d1a] transition-all flex items-center justify-center gap-2"
                            >
                                SAVE AND DELIVER HERE
                            </button>
                            <Link to="/cart" className="text-[#2874f0] font-bold text-sm hover:underline">Cancel</Link>
                        </div>
                    </form>
                </div>

                <div className="mt-10 p-4 border border-blue-100 bg-blue-50/50 rounded-sm flex items-center gap-4">
                    <FiCheckCircle className="text-blue-500 shrink-0" size={24} />
                    <p className="text-xs text-gray-600 leading-relaxed">
                        By placing an order, you agree to NexusMart's <span className="text-[#2874f0] font-bold">Terms of Service</span>.
                        Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our privacy policy.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Shipping;
