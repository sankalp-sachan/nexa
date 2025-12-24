import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { FiPackage, FiUser, FiPower, FiShoppingBag, FiChevronRight, FiCheckCircle, FiClock, FiXCircle } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const Profile = () => {
    const { user, logout } = useAuth();
    const [orders, setOrders] = useState([]);
    const [activeTab, setActiveTab] = useState('orders');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await axios.get('/orders/me');
                setOrders(data.orders);
            } catch (error) {
                console.error(error);
            }
        };
        fetchOrders();
    }, []);

    const handleCancelOrder = async (orderId) => {
        if (!window.confirm('Are you sure you want to cancel this order?')) return;
        try {
            await axios.put(`/orders/${orderId}/cancel`);
            toast.success("Order cancelled successfully");
            // Refresh orders
            const { data } = await axios.get('/orders/me');
            setOrders(data.orders);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to cancel order");
        }
    };

    return (
        <div className="bg-[#f1f3f6] -mx-4 -mt-8 min-h-screen pb-10">
            <div className="max-w-[1248px] mx-auto px-2 pt-4 flex flex-col md:flex-row gap-4">

                {/* Sidebar */}
                <div className="w-full md:w-80 shrink-0 space-y-4">
                    {/* User Card */}
                    <div className="bg-white p-4 shadow-sm rounded-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#2874f0] rounded-full flex items-center justify-center text-white font-bold text-xl">
                            {user?.name?.charAt(0)}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-xs text-gray-500 font-medium italic">Hello,</p>
                            <p className="font-bold text-gray-800 truncate">{user?.name}</p>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="bg-white shadow-sm rounded-sm overflow-hidden">
                        <div className="p-4 border-b flex items-center gap-4 text-gray-400 group cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => setActiveTab('orders')}>
                            <FiPackage className="text-[#2874f0]" size={20} />
                            <span className={`font-bold uppercase text-sm flex-1 ${activeTab === 'orders' ? 'text-[#2874f0]' : 'text-gray-500'}`}>My Orders</span>
                            <FiChevronRight />
                        </div>

                        <div className="p-4 border-b">
                            <div className="flex items-center gap-4 text-gray-400 mb-4 pt-2">
                                <FiUser className="text-[#2874f0]" size={20} />
                                <span className="font-bold uppercase text-sm text-gray-500">Account Settings</span>
                            </div>
                            <div className="pl-9 space-y-4">
                                <p className={`text-sm cursor-pointer ${activeTab === 'profile' ? 'text-[#2874f0] font-bold' : 'text-gray-600 hover:text-[#2874f0]'}`} onClick={() => setActiveTab('profile')}>Profile Information</p>
                                <p className="text-sm text-gray-600 hover:text-[#2874f0] cursor-pointer">Manage Addresses</p>
                                <p className="text-sm text-gray-600 hover:text-[#2874f0] cursor-pointer">PAN Card Information</p>
                            </div>
                        </div>

                        <div className="p-4 flex items-center gap-4 text-gray-400 hover:bg-gray-50 cursor-pointer transition-colors" onClick={logout}>
                            <FiPower className="text-[#2874f0]" size={20} />
                            <span className="font-bold uppercase text-sm text-gray-500 flex-1">Logout</span>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 space-y-4">
                    {activeTab === 'orders' && (
                        <div className="bg-white shadow-sm rounded-sm p-4 md:p-6 min-h-[500px]">
                            <h1 className="text-lg font-bold text-gray-800 mb-6 border-b pb-4">All Orders</h1>

                            {orders.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 text-center">
                                    <FiShoppingBag className="text-gray-200 mb-4" size={60} />
                                    <p className="text-gray-500 font-medium">You haven't placed any orders yet</p>
                                    <Link to="/" className="text-[#2874f0] font-bold mt-2 hover:underline">Start Shopping</Link>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {orders.map(order => (
                                        <div key={order._id} className="border border-gray-100 p-4 md:p-6 flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow relative">
                                            <div className="flex gap-4 flex-1">
                                                <div className="w-20 h-20 bg-gray-50 p-2 border rounded-sm">
                                                    <img
                                                        src={order.orderItems[0]?.image || 'https://via.placeholder.com/100'}
                                                        alt="order"
                                                        className="w-full h-full object-contain"
                                                    />
                                                </div>
                                                <div className="space-y-1 overflow-hidden">
                                                    <p className="text-sm font-medium text-gray-800 line-clamp-2">{order.orderItems.map(i => i.name).join(', ')}</p>
                                                    <p className="text-xs text-gray-400">Order ID: #{order._id.slice(-8)}</p>
                                                    <p className="text-base font-bold text-gray-900 pt-2">₹{order.totalPrice.toLocaleString()}</p>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-2 md:w-60">
                                                <div className="flex items-center gap-2">
                                                    {order.orderStatus === 'Delivered' ? (
                                                        <FiCheckCircle className="text-green-600 shrink-0" />
                                                    ) : order.orderStatus === 'Cancelled' ? (
                                                        <FiXCircle className="text-red-500 shrink-0" />
                                                    ) : (
                                                        <FiClock className="text-[#2874f0] shrink-0" />
                                                    )}
                                                    <span className={`text-sm font-bold ${order.orderStatus === 'Delivered' ? 'text-green-600' :
                                                            order.orderStatus === 'Cancelled' ? 'text-red-500' : 'text-gray-800'
                                                        }`}>
                                                        {order.orderStatus === 'Delivered' ? 'Delivered on Oct 20' :
                                                            order.orderStatus === 'Cancelled' ? 'Cancelled' : order.orderStatus}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-500 pl-6">
                                                    {order.orderStatus === 'Delivered' && 'Your item has been delivered'}
                                                    {order.orderStatus === 'Shipped' && 'Arriving by Sat, Oct 28'}
                                                    {order.orderStatus === 'Processing' && 'Under processing'}
                                                </p>

                                                {order.orderStatus === 'Shipped' && order.deliveryOtp && (
                                                    <div className="mt-2 ml-6 bg-blue-50 p-2 rounded-sm border border-blue-100">
                                                        <p className="text-[10px] uppercase font-bold text-blue-400 mb-0.5">Delivery OTP</p>
                                                        <p className="text-lg font-bold text-blue-600 tracking-widest leading-none">{order.deliveryOtp}</p>
                                                    </div>
                                                )}

                                                {(order.orderStatus === 'Processing' || order.orderStatus === 'Pending') && (
                                                    <button
                                                        onClick={() => handleCancelOrder(order._id)}
                                                        className="mt-4 ml-6 text-red-500 hover:text-red-700 text-xs font-bold transition flex items-center gap-1 group w-fit"
                                                    >
                                                        <FiXCircle className="group-hover:rotate-90 transition-transform" /> CANCEL ORDER
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'profile' && (
                        <div className="bg-white shadow-sm rounded-sm p-4 md:p-10 min-h-[500px]">
                            <h2 className="text-xl font-bold mb-8">Personal Information</h2>
                            <div className="space-y-10 max-w-xl">
                                <div className="space-y-4">
                                    <label className="text-xs text-gray-500 font-bold uppercase">Full Name</label>
                                    <div className="flex gap-4">
                                        <input type="text" readOnly value={user?.name} className="flex-1 bg-gray-50 border p-3 rounded-sm text-gray-600 outline-none" />
                                        <button className="text-[#2874f0] font-bold text-sm">Edit</button>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-xs text-gray-500 font-bold uppercase">Email Address</label>
                                    <div className="flex gap-4">
                                        <input type="text" readOnly value={user?.email} className="flex-1 bg-gray-50 border p-3 rounded-sm text-gray-600 outline-none" />
                                        <button className="text-[#2874f0] font-bold text-sm">Edit</button>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-xs text-gray-500 font-bold uppercase">Your Role</label>
                                    <div className="flex gap-4">
                                        <input type="text" readOnly value={user?.role} className="flex-1 bg-gray-50 border p-3 rounded-sm text-gray-600 outline-none uppercase" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
