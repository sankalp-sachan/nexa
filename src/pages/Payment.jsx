import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FiShield, FiCheckCircle, FiInfo, FiCreditCard } from 'react-icons/fi';

const Payment = () => {
    const { cartItems, shippingInfo, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const orderInfo = JSON.parse(sessionStorage.getItem('orderInfo'));

    const [utr, setUtr] = useState('');
    const [loading, setLoading] = useState(false);

    const submitPayment = async (e) => {
        e.preventDefault();
        if (utr.length < 12) {
            return toast.error("Please enter a valid 12-digit UTR/Transaction ID");
        }
        setLoading(true);

        try {
            const orderItems = cartItems.map(item => ({
                product: item.product,
                name: item.name,
                price: item.price,
                image: item.image,
                qty: item.quantity
            }));

            const orderData = {
                orderItems,
                shippingInfo,
                itemsPrice: orderInfo.itemsPrice,
                taxPrice: orderInfo.taxPrice,
                shippingPrice: orderInfo.shippingPrice,
                totalPrice: orderInfo.totalPrice,
                paymentInfo: {
                    utr,
                    status: 'Pending',
                    method: 'UPI (Demo)',
                    isDemo: true
                }
            };

            await axios.post('/orders/new', orderData);

            clearCart();
            navigate('/success');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Order failed');
            setLoading(false);
        }
    };

    if (!orderInfo) return null;

    return (
        <div className="bg-[#f1f3f6] -mx-4 -mt-8 min-h-screen pb-10">
            <div className="max-w-[1248px] mx-auto pt-10 px-2 flex flex-col lg:flex-row gap-4 items-start">

                <div className="flex-1 space-y-4">
                    {/* Previous Steps Summary */}
                    <div className="bg-white rounded-sm shadow-sm overflow-hidden opacity-80">
                        <div className="p-4 flex items-center gap-4 text-gray-500">
                            <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold">1</div>
                            <span className="font-bold text-xs uppercase tracking-wider">Login</span>
                            <FiCheckCircle className="text-green-500 ml-auto" />
                        </div>
                    </div>

                    <div className="bg-white rounded-sm shadow-sm overflow-hidden opacity-80">
                        <div className="p-4 flex items-center gap-4 text-gray-500 border-b border-gray-50">
                            <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold">2</div>
                            <span className="font-bold text-xs uppercase tracking-wider">Delivery Address</span>
                            <FiCheckCircle className="text-green-500 ml-auto" />
                        </div>
                    </div>

                    <div className="bg-white rounded-sm shadow-sm overflow-hidden opacity-80">
                        <div className="p-4 flex items-center gap-4 text-gray-500 border-b border-gray-50">
                            <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold">3</div>
                            <span className="font-bold text-xs uppercase tracking-wider">Order Summary</span>
                            <FiCheckCircle className="text-green-500 ml-auto" />
                        </div>
                    </div>

                    {/* Active Payment Step */}
                    <div className="bg-white rounded-sm shadow-sm overflow-hidden">
                        <div className="bg-[#2874f0] p-4 flex items-center gap-4 text-white">
                            <div className="w-5 h-5 rounded-sm bg-white text-[#2874f0] flex items-center justify-center text-[10px] font-bold">4</div>
                            <h2 className="font-bold uppercase text-sm tracking-wider">Payment Options</h2>
                        </div>

                        <div className="p-0 flex flex-col md:flex-row min-h-[400px]">
                            {/* Left Tabs (Demo labels) */}
                            <div className="w-full md:w-64 bg-gray-50 border-r border-gray-100">
                                <div className="p-4 border-b border-white bg-white text-[#2874f0] font-bold text-sm border-l-4 border-l-[#2874f0] flex items-center gap-3">
                                    <FiCreditCard /> UPI / QR Code
                                </div>
                                <div className="p-4 border-b border-white text-gray-400 font-medium text-sm cursor-not-allowed opacity-60">
                                    Wallets (Inactive)
                                </div>
                                <div className="p-4 border-b border-white text-gray-400 font-medium text-sm cursor-not-allowed opacity-60">
                                    Credit / Debit Card
                                </div>
                                <div className="p-4 border-b border-white text-gray-400 font-medium text-sm cursor-not-allowed opacity-60">
                                    Net Banking
                                </div>
                                <div className="p-4 border-b border-white text-gray-400 font-medium text-sm cursor-not-allowed opacity-60">
                                    Cash on Delivery
                                </div>
                            </div>

                            {/* Right Content */}
                            <div className="flex-1 p-6 md:p-8">
                                <div className="max-w-md mx-auto text-center">
                                    <div className="bg-blue-50 border border-blue-100 rounded p-4 mb-6 text-left flex gap-3">
                                        <FiInfo className="text-blue-500 shrink-0 mt-1" />
                                        <div>
                                            <p className="text-xs font-bold text-blue-800 uppercase mb-1">Portfolio Demo Mode</p>
                                            <p className="text-xs text-blue-700">This is a simulation. Scan the QR and enter any 12-digit number to complete your order test.</p>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="inline-block p-3 border-2 border-gray-100 rounded-xl bg-white shadow-sm">
                                            <img
                                                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=nexusmart@fampay&pn=NexusMart&am=${orderInfo?.totalPrice || 0}&cu=INR`}
                                                alt="Demo QR Code"
                                                className="w-40 h-40 md:w-48 md:h-48"
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <p className="text-sm text-gray-400 font-medium">UPI ID: <span className="text-gray-900 font-bold italic">nexusmart@fampay</span></p>
                                            <p className="text-2xl font-black text-gray-900 tracking-tight">₹{orderInfo?.totalPrice.toLocaleString()}</p>
                                        </div>

                                        <form onSubmit={submitPayment} className="space-y-6 text-left pt-4">
                                            <div>
                                                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Transaction ID / UTR Number</label>
                                                <input
                                                    type="text"
                                                    placeholder="Enter 12 digit UTR number"
                                                    className="w-full border-b-2 border-gray-200 py-3 focus:outline-none focus:border-[#2874f0] transition-colors text-sm font-medium"
                                                    value={utr}
                                                    onChange={(e) => setUtr(e.target.value.replace(/\D/g, '').slice(0, 12))}
                                                    maxLength={12}
                                                    required
                                                />
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="w-full bg-[#fb641b] text-white py-4 rounded-sm font-bold shadow-lg hover:bg-[#eb5d1a] transition-all flex items-center justify-center gap-2 uppercase tracking-wide"
                                            >
                                                {loading ? (
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                ) : (
                                                    'Confirm Order'
                                                )}
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-sm shadow-sm flex items-center justify-between text-gray-400">
                        <div className="flex items-center gap-2">
                            <FiShield className="text-lg" />
                            <span className="text-xs font-bold uppercase">Safe and Secure Payments</span>
                        </div>
                        <div className="flex gap-4 grayscale opacity-50 overflow-hidden h-6">
                            <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/payment-method_69e7bc.svg" alt="Payments" className="h-full" />
                        </div>
                    </div>
                </div>

                {/* Right Bank Summary */}
                <div className="w-full lg:w-96 shrink-0 bg-white rounded-sm shadow-sm sticky top-[80px]">
                    <h2 className="text-gray-500 font-bold text-sm uppercase p-4 border-b">Price Details</h2>
                    <div className="p-4 space-y-4">
                        <div className="flex justify-between text-sm">
                            <span>Price ({cartItems.length} items)</span>
                            <span>₹{orderInfo.itemsPrice.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Delivery Charges</span>
                            <span className={orderInfo.shippingPrice === 0 ? "text-green-600 font-bold" : "text-gray-800"}>
                                {orderInfo.shippingPrice === 0 ? 'FREE' : `₹${orderInfo.shippingPrice}`}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Tax (GST 18%)</span>
                            <span>₹{orderInfo.taxPrice.toLocaleString()}</span>
                        </div>
                        <div className="border-t border-dashed pt-4 flex justify-between text-lg font-bold">
                            <span>Amount Payable</span>
                            <span>₹{orderInfo.totalPrice.toLocaleString()}</span>
                        </div>
                    </div>
                    <div className="p-4 border-t border-gray-100">
                        <p className="text-[11px] text-green-600 font-bold flex items-center gap-1">
                            <FiShield /> 100% Authentic products. Safe & Secure Payments.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Payment;