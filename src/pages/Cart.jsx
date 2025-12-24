import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const savings = Math.floor(totalAmount * 0.15); // Simulated savings

    const checkoutHandler = () => {
        if (isAuthenticated) {
            navigate('/shipping');
        } else {
            navigate('/login?redirect=shipping');
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="max-w-[1248px] mx-auto px-4 py-10">
                <div className="bg-white rounded-sm shadow-sm p-10 flex flex-col items-center justify-center min-h-[400px]">
                    <img
                        src="https://rukminim2.flixcart.com/www/800/800/promos/16/05/2019/d438a32e-765a-4d8b-b4a6-520b560971e8.png?q=90"
                        alt="Empty Cart"
                        className="w-64 h-auto mb-6 opacity-80"
                    />
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Missing Cart items?</h2>
                    <p className="text-gray-500 mb-6 text-sm">Login to see the items you added previously</p>
                    <Link to="/" className="bg-[#2874f0] text-white px-10 py-3 rounded-sm font-bold shadow-md hover:bg-blue-600 transition-all flex items-center gap-2">
                        <FiShoppingBag /> SHOP NOW
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#f1f3f6] -mx-4 -mt-8 min-h-screen pb-20">
            <div className="max-w-[1248px] mx-auto px-2 pt-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 bg-white shadow-sm rounded-sm overflow-hidden">
                        <div className="p-4 border-b flex justify-between items-center bg-white sticky top-[64px] z-10">
                            <h1 className="text-lg font-bold">My Cart ({cartItems.length})</h1>
                            <button onClick={clearCart} className="text-sm text-red-500 font-bold hover:underline flex items-center gap-1">
                                <FiTrash2 /> CLEAR CART
                            </button>
                        </div>

                        <div className="divide-y divide-gray-100">
                            {cartItems.map((item) => (
                                <div key={item.product} className="p-4 md:p-6 flex flex-col md:flex-row gap-6 hover:bg-gray-50/50 transition-colors">
                                    <div className="w-full md:w-32 flex flex-col items-center gap-4">
                                        <Link to={`/product/${item.product}`}>
                                            <img src={item.image} alt={item.name} className="w-24 h-24 object-contain" />
                                        </Link>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => updateQuantity(item.product, Math.max(1, item.quantity - 1))}
                                                className="w-7 h-7 flex items-center justify-center border rounded-full hover:bg-gray-100 disabled:opacity-30"
                                                disabled={item.quantity <= 1}
                                            >
                                                <FiMinus size={14} />
                                            </button>
                                            <span className="w-10 text-center font-bold text-sm border-gray-200 border py-0.5 rounded-sm">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.product, item.quantity + 1)}
                                                className="w-7 h-7 flex items-center justify-center border rounded-full hover:bg-gray-100"
                                            >
                                                <FiPlus size={14} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex-1 space-y-2">
                                        <Link to={`/product/${item.product}`} className="text-base md:text-lg font-medium hover:text-[#2874f0] transition-colors line-clamp-2">
                                            {item.name}
                                        </Link>
                                        <p className="text-xs text-gray-400">Seller: NexusMart Official</p>

                                        <div className="flex items-center gap-3 pt-2">
                                            <span className="text-sm text-gray-500 line-through">₹{(item.price * 1.2).toFixed(0)}</span>
                                            <span className="text-xl font-bold">₹{item.price.toLocaleString()}</span>
                                            <span className="text-green-600 text-sm font-bold">20% Off</span>
                                        </div>

                                        <div className="flex gap-6 pt-4">
                                            <button
                                                onClick={() => toast.success("Item saved for later! 📌")}
                                                className="text-gray-800 font-bold text-sm hover:text-[#2874f0] transition-colors"
                                            >
                                                SAVE FOR LATER
                                            </button>
                                            <button
                                                onClick={() => {
                                                    removeFromCart(item.product);
                                                    toast.success("Item removed");
                                                }}
                                                className="text-gray-800 font-bold text-sm hover:text-red-500 transition-colors"
                                            >
                                                REMOVE
                                            </button>
                                        </div>
                                    </div>

                                    <div className="hidden md:block text-xs text-gray-500">
                                        Delivery by Wed, Oct 25 | <span className="text-green-600">Free</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-4 bg-white border-t shadow-[0_-2px_10px_0_rgba(0,0,0,0.05)] sticky bottom-0 flex justify-end">
                            <button
                                onClick={checkoutHandler}
                                className="bg-[#fb641b] text-white px-10 py-3.5 rounded-sm font-bold shadow-lg hover:bg-[#eb5d1a] transition-all md:w-64"
                            >
                                PLACE ORDER
                            </button>
                        </div>
                    </div>

                    {/* Price Details */}
                    <div className="bg-white shadow-sm rounded-sm sticky top-[80px]">
                        <h2 className="text-gray-500 font-bold text-sm uppercase p-4 border-b">Price Details</h2>
                        <div className="p-4 space-y-4">
                            <div className="flex justify-between text-sm">
                                <span>Price ({totalItems} items)</span>
                                <span>₹{(totalAmount + savings).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Discount</span>
                                <span className="text-green-600">- ₹{savings.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Delivery Charges</span>
                                <span className="text-green-600">FREE</span>
                            </div>
                            <div className="border-t border-dashed pt-4 flex justify-between text-lg font-bold">
                                <span>Total Amount</span>
                                <span>₹{totalAmount.toLocaleString()}</span>
                            </div>
                        </div>
                        <div className="p-4 border-t bg-gray-50">
                            <p className="text-green-600 font-bold text-sm">You will save ₹{savings.toLocaleString()} on this order</p>
                        </div>
                    </div>
                </div>

                {/* Safe & Secure Info */}
                <div className="mt-10 flex items-center justify-center gap-10 opacity-50 grayscale text-xs font-bold text-gray-500 uppercase tracking-widest">
                    <div className="flex items-center gap-2">
                        <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/shield_b33c0c.svg" alt="Secure" className="w-8" />
                        <span>Safe and Secure Payments</span>
                    </div>
                    <div className="hidden md:flex items-center gap-2">
                        <span>Easy Returns</span>
                    </div>
                    <div className="hidden md:flex items-center gap-2">
                        <span>100% Authentic Products</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
