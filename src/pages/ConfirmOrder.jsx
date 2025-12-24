import { useCart } from '../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMapPin, FiBox, FiCheckCircle } from 'react-icons/fi';

const ConfirmOrder = () => {
    const { cartItems, shippingInfo } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const subtotal = cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0);
    const shippingPrice = subtotal > 500 ? 0 : 50;
    const taxPrice = Number((0.18 * subtotal).toFixed(2));
    const totalPrice = subtotal + shippingPrice + taxPrice;

    const proceedToPayment = () => {
        const data = {
            itemsPrice: subtotal,
            shippingPrice,
            taxPrice,
            totalPrice
        };
        sessionStorage.setItem('orderInfo', JSON.stringify(data));
        navigate('/payment');
    };

    return (
        <div className="bg-[#f1f3f6] -mx-4 -mt-8 min-h-screen pb-10">
            <div className="max-w-[1248px] mx-auto pt-10 px-2 flex flex-col lg:flex-row gap-4 items-start">

                <div className="flex-1 space-y-4">
                    {/* Shipping Address Card */}
                    <div className="bg-white rounded-sm shadow-sm overflow-hidden">
                        <div className="bg-white p-4 border-b flex items-center gap-3 text-gray-400">
                            <div className="w-6 h-6 rounded-full bg-blue-50 text-[#2874f0] flex items-center justify-center text-xs font-bold">1</div>
                            <h2 className="font-bold uppercase text-sm tracking-wider text-gray-500">Shipping Details</h2>
                            <FiCheckCircle className="ml-auto text-green-500" />
                        </div>
                        <div className="p-6">
                            <p className="font-bold text-gray-800 mb-1">{user?.name}</p>
                            <p className="text-sm text-gray-600 leading-relaxed max-w-md">
                                {shippingInfo.address}, {shippingInfo.city}, {shippingInfo.postalCode}, {shippingInfo.country}
                            </p>
                            <p className="text-sm font-bold text-gray-800 mt-3 flex items-center gap-2">
                                <span className="text-gray-400 font-medium italic">Phone:</span> {shippingInfo.phoneNo}
                            </p>
                        </div>
                    </div>

                    {/* Order Items Card */}
                    <div className="bg-white rounded-sm shadow-sm overflow-hidden">
                        <div className="bg-white p-4 border-b flex items-center gap-3 text-[#2874f0]">
                            <div className="w-6 h-6 rounded-full bg-blue-50 text-[#2874f0] flex items-center justify-center text-xs font-bold">2</div>
                            <h2 className="font-bold uppercase text-sm tracking-wider">Order Summary</h2>
                        </div>
                        <div className="divide-y divide-gray-50">
                            {cartItems.map(item => (
                                <div key={item.product} className="p-4 md:p-6 flex items-center gap-6 hover:bg-gray-50/50 transition-colors">
                                    <img src={item.image} alt={item.name} className="w-16 h-16 md:w-20 md:h-20 object-contain rounded-sm" />
                                    <div className="flex-grow space-y-1">
                                        <Link to={`/product/${item.product}`} className="text-sm md:text-base font-medium text-gray-800 hover:text-[#2874f0] transition-colors line-clamp-1">
                                            {item.name}
                                        </Link>
                                        <p className="text-xs text-gray-400">Seller: NexusMart</p>
                                        <p className="text-sm font-bold pt-1">
                                            {item.quantity} × <span className="text-gray-400 font-medium">₹{item.price.toLocaleString()}</span> = ₹{(item.quantity * item.price).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="hidden md:block text-xs text-gray-500">
                                        Delivery by Wed, Oct 25 | <span className="text-green-600">Free</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Bank Summary */}
                <div className="w-full lg:w-96 shrink-0 bg-white rounded-sm shadow-sm sticky top-[80px]">
                    <h2 className="text-gray-500 font-bold text-sm uppercase p-4 border-b">Price Details</h2>
                    <div className="p-4 space-y-4">
                        <div className="flex justify-between text-sm">
                            <span>Price ({cartItems.length} items)</span>
                            <span>₹{subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Delivery Charges</span>
                            <span className={shippingPrice === 0 ? "text-green-600 font-bold" : "text-gray-800"}>
                                {shippingPrice === 0 ? 'FREE' : `₹${shippingPrice}`}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Tax (GST 18%)</span>
                            <span>₹{taxPrice.toLocaleString()}</span>
                        </div>
                        <div className="border-t border-dashed pt-4 flex justify-between text-lg font-bold">
                            <span>Amount Payable</span>
                            <span>₹{totalPrice.toLocaleString()}</span>
                        </div>
                    </div>
                    <div className="p-4 border-t bg-gray-50 flex items-center gap-2">
                        <FiBox className="text-green-600" />
                        <p className="text-green-600 font-bold text-[10px] uppercase">Safe and Secure Payments. 100% Authentic products.</p>
                    </div>
                    <div className="p-4 bg-white border-t">
                        <button
                            onClick={proceedToPayment}
                            className="w-full bg-[#fb641b] text-white py-4 rounded-sm font-bold shadow-lg hover:bg-[#eb5d1a] transition-all"
                        >
                            PROCEED TO PAYMENT
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmOrder;

