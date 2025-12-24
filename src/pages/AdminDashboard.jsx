import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { toast } from 'react-hot-toast';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('orders');
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    // Product Form State
    const [newProduct, setNewProduct] = useState({
        name: '',
        price: '',
        description: '',
        category: '',
        stock: '',
        imageUrl: ''
    });
    const [showAddProduct, setShowAddProduct] = useState(false);

    // Category Form State
    const [newCategoryName, setNewCategoryName] = useState('');
    const [showAddCategory, setShowAddCategory] = useState(false);

    // Search and Filter State
    const [searchTerm, setSearchTerm] = useState('');

    // Order Modal
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orderTab, setOrderTab] = useState('pending');

    useEffect(() => {
        fetchOrders();
        fetchCategories();
    }, []);

    const fetchOrders = async () => {
        try {
            const { data } = await axios.get('/orders/admin/orders');
            setOrders(data.orders);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchCategories = async () => {
        try {
            const { data } = await axios.get('/categories');
            setCategories(data.categories || []);
        } catch (error) {
            console.error("Failed to fetch categories", error);
        }
    };

    const fetchProducts = async () => {
        try {
            const { data } = await axios.get('/products');
            setProducts(data.products);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (activeTab === 'products') {
            fetchProducts();
        }
    }, [activeTab]);

    const verifyPayment = async (orderId) => {
        try {
            await axios.put(`/orders/admin/order/${orderId}`, {
                paymentStatus: 'Verified',
                status: 'Processing'
            });
            toast.success('Payment Verified');
            fetchOrders();
        } catch (error) {
            toast.error('Failed to verify payment');
        }
    };

    const updateOrderStatus = async (orderId, status, deliveryOtp = null) => {
        try {
            await axios.put(`/orders/admin/order/${orderId}`, {
                status,
                deliveryOtp
            });
            toast.success(`Order status updated to ${status}`);
            fetchOrders();
            if (selectedOrder) setSelectedOrder(null);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update order status');
        }
    };

    const handleShipOrder = (orderId) => {
        if (!window.confirm('Mark this order as Shipped? This will send an OTP to the user.')) return;
        updateOrderStatus(orderId, 'Shipped');
    };

    const handleDeliverOrder = (orderId) => {
        const otp = window.prompt('Enter Delivery OTP provided by customer:');
        if (!otp) return;
        updateOrderStatus(orderId, 'Delivered', otp);
    };

    const rejectPayment = async (orderId) => {
        if (!window.confirm('Mark payment as failed?')) return;
        try {
            await axios.put(`/orders/admin/order/${orderId}`, {
                paymentStatus: 'Failed'
            });
            toast.success('Payment Marked as Failed');
            fetchOrders();
            if (selectedOrder) setSelectedOrder(null);
        } catch (error) {
            toast.error('Failed to update payment status');
        }
    };

    const cancelOrderAdmin = async (orderId) => {
        if (!window.confirm('Are you sure you want to cancel this order?')) return;

        const orderToCancel = orders.find(o => o._id === orderId) || selectedOrder; // Fallback to selected if in modal

        let otp = null;
        if (orderToCancel && orderToCancel.orderStatus === 'Shipped') {
            const proceed = window.confirm('This order is Shipped. An OTP will be sent to your email to verify cancellation. Proceed?');
            if (!proceed) return;

            try {
                await axios.post(`/orders/admin/order/${orderId}/cancel-otp`);
                toast.success('OTP Sent to Admin Email');
                otp = window.prompt('Enter Cancellation OTP sent to your email:');
                if (!otp) return;
            } catch (err) {
                toast.error(err.response?.data?.message || 'Failed to send OTP');
                return;
            }
        }

        try {
            await axios.put(`/orders/admin/order/${orderId}`, {
                status: 'Cancelled',
                cancelOtp: otp
            });
            toast.success('Order Cancelled');
            fetchOrders();
            if (selectedOrder) setSelectedOrder(null);
        } catch (error) {
            if (error.response?.data?.requireOtp) {
                toast.error('Order status is Shipped. Please refresh and try again to verify with OTP.');
            } else {
                toast.error(error.response?.data?.message || 'Failed to cancel order');
            }
        }
    };

    const handleCreateProduct = async (e) => {
        e.preventDefault();
        try {
            // Validate all required fields
            if (!newProduct.name || !newProduct.price || !newProduct.category || !newProduct.description || !newProduct.stock) {
                toast.error('Please fill in all required fields (Name, Price, Category, Stock, Description)');
                return;
            }

            const productData = {
                name: newProduct.name,
                price: Number(newProduct.price),
                description: newProduct.description,
                category: newProduct.category,
                stock: Number(newProduct.stock),
                images: [
                    {
                        public_id: 'demo_id_' + Date.now(),
                        url: newProduct.imageUrl || 'https://via.placeholder.com/150'
                    }
                ]
            };

            await axios.post('/products', productData);
            toast.success('Product Created Successfully');
            setShowAddProduct(false);
            setNewProduct({ name: '', price: '', description: '', category: '', stock: '', imageUrl: '' });
            fetchProducts();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to create product');
        }
    };

    const handleCreateCategory = async (e) => {
        e.preventDefault();
        try {
            if (!newCategoryName) {
                toast.error('Category name is required');
                return;
            }

            await axios.post('/categories', { name: newCategoryName });
            toast.success('Category Created Successfully');
            setNewCategoryName('');
            setShowAddCategory(false);
            fetchCategories();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to create category');
        }
    };

    const handleDeleteCategory = async (id) => {
        if (!window.confirm('Are you sure you want to delete this category?')) return;
        try {
            await axios.delete(`/categories/${id}`);
            toast.success('Category Deleted');
            fetchCategories();
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete category');
        }
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct(prev => ({ ...prev, [name]: value }));
    };

    const handleDeleteProduct = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        try {
            await axios.delete(`/products/${id}`);
            toast.success('Product Deleted');
            fetchProducts();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to delete product');
        }
    };

    return (
        <div className="flex h-screen bg-[#f8fafc]">
            {/* Sidebar */}
            <div className="w-72 bg-[#1e293b] text-white shadow-xl flex flex-col">
                <div className="p-8">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <span className="text-xl font-bold text-white">N</span>
                        </div>
                        <span className="font-bold text-2xl tracking-tight text-white">NexusMart</span>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    <button
                        onClick={() => { setActiveTab('orders'); setSearchTerm(''); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === 'orders' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                        <span className="font-medium">Orders & Payments</span>
                    </button>
                    <button
                        onClick={() => { setActiveTab('products'); setSearchTerm(''); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === 'products' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                        <span className="font-medium">Products</span>
                    </button>
                    <button
                        onClick={() => { setActiveTab('categories'); setSearchTerm(''); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === 'categories' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                        <span className="font-medium">Categories</span>
                    </button>
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <div className="bg-slate-800/50 rounded-2xl p-4">
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Logged in as</p>
                        <p className="text-sm font-medium truncate">Administrator</p>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Topbar */}
                <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
                    <div className="flex-1 max-w-xl">
                        <div className="relative group">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            </span>
                            <input
                                type="text"
                                placeholder={`Search ${activeTab}...`}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-slate-100 border-none rounded-2xl py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all outline-none text-slate-600"
                            />
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-8">
                    {activeTab === 'orders' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                                <div>
                                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Executive Dashboard</h2>
                                    <p className="text-slate-500 mt-1 font-medium">Real-time overview of your store's performance.</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2">
                                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                        <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Live System</span>
                                    </div>
                                </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                                {[
                                    { label: 'Total Revenue', value: `₹${orders.reduce((acc, o) => acc + (o.paymentInfo.status === 'Verified' ? o.totalPrice : 0), 0).toLocaleString()}`, icon: '💰', color: 'bg-emerald-50 text-emerald-600' },
                                    { label: 'Total Orders', value: orders.length, icon: '📦', color: 'bg-indigo-50 text-indigo-600' },
                                    { label: 'Pending Payouts', value: orders.filter(o => o.paymentInfo.status === 'Pending').length, icon: '⌛', color: 'bg-amber-50 text-amber-600' },
                                    { label: 'Active Products', value: products.length || '...', icon: '🚀', color: 'bg-rose-50 text-rose-600' },
                                ].map((stat, i) => (
                                    <div key={i} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-md transition-shadow">
                                        <div className={`w-14 h-14 ${stat.color} rounded-2xl flex items-center justify-center text-2xl shadow-inner`}>
                                            {stat.icon}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                                            <p className="text-2xl font-black text-slate-900 mt-0.5">{stat.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                    <span className="w-1.5 h-6 bg-indigo-600 rounded-full"></span>
                                    Recent Transactions
                                </h3>
                                {/* Order Sub-tabs */}
                                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl">
                                    {[
                                        { id: 'pending', label: 'Processing' },
                                        { id: 'shipped', label: 'In Transit' },
                                        { id: 'delivered', label: 'Delivered' },
                                        { id: 'cancelled', label: 'Cancelled' }
                                    ].map((tab) => (
                                        <button
                                            key={tab.id}
                                            className={`py-2 px-5 rounded-xl text-xs font-bold transition-all duration-200 ${orderTab === tab.id ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                            onClick={() => setOrderTab(tab.id)}
                                        >
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>
                            </div>


                            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-x-auto">
                                <table className="w-full min-w-[1000px] text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50/50 border-b border-slate-100">
                                            <th className="p-5 text-sm font-semibold text-slate-600">Order ID</th>
                                            <th className="p-5 text-sm font-semibold text-slate-600">Customer</th>
                                            <th className="p-5 text-sm font-semibold text-slate-600">Total Amount</th>
                                            <th className="p-5 text-sm font-semibold text-slate-600">UTR / Ref</th>
                                            <th className="p-5 text-sm font-semibold text-slate-600">Payment</th>
                                            <th className="p-5 text-sm font-semibold text-slate-600">Status</th>
                                            <th className="p-5 text-sm font-semibold text-slate-600 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {orders
                                            .filter(order => {
                                                if (orderTab === 'pending') return (order.orderStatus === 'Processing' || order.orderStatus === 'Pending') && order.orderStatus !== 'Cancelled' && order.orderStatus !== 'Shipped';
                                                if (orderTab === 'shipped') return order.orderStatus === 'Shipped';
                                                if (orderTab === 'delivered') return order.orderStatus === 'Delivered';
                                                if (orderTab === 'cancelled') return order.orderStatus === 'Cancelled' || order.paymentInfo.status === 'Failed';
                                                return true;
                                            })
                                            .filter(order => {
                                                if (!searchTerm) return true;
                                                const search = searchTerm.toLowerCase();
                                                return (
                                                    order._id.toLowerCase().includes(search) ||
                                                    order.user?.name?.toLowerCase().includes(search) ||
                                                    order.user?.email?.toLowerCase().includes(search) ||
                                                    order.paymentInfo?.utr?.toLowerCase().includes(search)
                                                );
                                            })
                                            .map(order => (
                                                <tr key={order._id} className="hover:bg-slate-50/50 transition-colors group">
                                                    <td className="p-5 text-sm font-mono text-slate-500">#{order._id.slice(-8)}</td>
                                                    <td className="p-5">
                                                        <div className="font-semibold text-slate-900">{order.user?.name || 'Unknown'}</div>
                                                        <div className="text-xs text-slate-500">{order.user?.email}</div>
                                                    </td>
                                                    <td className="p-5 font-bold text-slate-900">₹{order.totalPrice.toLocaleString()}</td>
                                                    <td className="p-5 font-mono text-xs text-slate-500">{order.paymentInfo?.utr || '—'}</td>
                                                    <td className="p-5">
                                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ring-1 ring-inset ${order.paymentInfo.status === 'Verified' ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' :
                                                            order.paymentInfo.status === 'Failed' ? 'bg-rose-50 text-rose-700 ring-rose-600/20' : 'bg-amber-50 text-amber-700 ring-amber-600/20'
                                                            }`}>
                                                            {order.paymentInfo.status}
                                                        </span>
                                                    </td>
                                                    <td className="p-5">
                                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ring-1 ring-inset
                                                        ${order.orderStatus === 'Delivered' ? 'bg-indigo-50 text-indigo-700 ring-indigo-600/20' :
                                                                order.orderStatus === 'Shipped' ? 'bg-blue-50 text-blue-700 ring-blue-600/20' :
                                                                    order.orderStatus === 'Cancelled' ? 'bg-slate-50 text-slate-700 ring-slate-600/20' : 'bg-amber-50 text-amber-700 ring-amber-600/20'}`}>
                                                            {order.orderStatus}
                                                        </span>
                                                    </td>
                                                    <td className="p-5 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={() => setSelectedOrder(order)}
                                                                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                                                title="View Details"
                                                            >
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                                            </button>
                                                            {order.paymentInfo.status === 'Pending' && order.orderStatus !== 'Cancelled' && (
                                                                <>
                                                                    <button
                                                                        onClick={() => verifyPayment(order._id)}
                                                                        className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                                                                        title="Verify Payment"
                                                                    >
                                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                                                    </button>
                                                                    <button
                                                                        onClick={() => rejectPayment(order._id)}
                                                                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                                                        title="Reject Payment"
                                                                    >
                                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                                                    </button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        {orders.filter(order => {
                                            if (orderTab === 'pending') return (order.orderStatus === 'Processing' || order.orderStatus === 'Pending') && order.orderStatus !== 'Cancelled' && order.orderStatus !== 'Shipped';
                                            if (orderTab === 'shipped') return order.orderStatus === 'Shipped';
                                            if (orderTab === 'delivered') return order.orderStatus === 'Delivered';
                                            if (orderTab === 'cancelled') return order.orderStatus === 'Cancelled' || order.paymentInfo.status === 'Failed';
                                            return true;
                                        }).filter(order => {
                                            if (!searchTerm) return true;
                                            const search = searchTerm.toLowerCase();
                                            return (
                                                order._id.toLowerCase().includes(search) ||
                                                order.user?.name?.toLowerCase().includes(search) ||
                                                order.user?.email?.toLowerCase().includes(search) ||
                                                order.paymentInfo?.utr?.toLowerCase().includes(search)
                                            );
                                        }).length === 0 && (
                                                <tr>
                                                    <td colSpan="7" className="p-20 text-center">
                                                        <div className="flex flex-col items-center justify-center">
                                                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                                                <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                                                            </div>
                                                            <p className="text-slate-500 font-medium">No orders found in this category.</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                    </tbody>
                                </table>
                            </div>
                            {/* Order Details Modal */}
                            {selectedOrder && (
                                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                                    <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                                        <div className="flex justify-between items-center p-6 border-b">
                                            <h3 className="text-xl font-bold">Order Details</h3>
                                            <button
                                                onClick={() => setSelectedOrder(null)}
                                                className="text-gray-500 hover:text-gray-700 text-2xl"
                                            >
                                                &times;
                                            </button>
                                        </div>
                                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <h4 className="font-bold text-gray-700 mb-2 border-b pb-1">User Info</h4>
                                                <p><span className="font-medium">Name:</span> {selectedOrder.user?.name}</p>
                                                <p><span className="font-medium">Email:</span> {selectedOrder.user?.email}</p>
                                                <p><span className="font-medium">ID:</span> {selectedOrder.user?._id}</p>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-700 mb-2 border-b pb-1">Shipping Info</h4>
                                                <p>{selectedOrder.shippingInfo.address}</p>
                                                <p>{selectedOrder.shippingInfo.city}, {selectedOrder.shippingInfo.postalCode}</p>
                                                <p>{selectedOrder.shippingInfo.country}</p>
                                                <p><span className="font-medium">Phone:</span> {selectedOrder.shippingInfo.phoneNo}</p>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-700 mb-2 border-b pb-1">Payment Info</h4>
                                                <p><span className="font-medium">UTR:</span> {selectedOrder.paymentInfo.utr}</p>
                                                <p><span className="font-medium">Method:</span> {selectedOrder.paymentInfo.method}</p>
                                                <p><span className="font-medium">Status:</span> {selectedOrder.paymentInfo.status}</p>
                                                <p><span className="font-medium">Paid At:</span> {selectedOrder.paidAt ? new Date(selectedOrder.paidAt).toLocaleString() : 'Not Paid'}</p>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-700 mb-2 border-b pb-1">Order Status</h4>
                                                <p><span className="font-medium">Status:</span> {selectedOrder.orderStatus}</p>
                                                <p><span className="font-medium">Placed At:</span> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                                            </div>
                                            <div className="md:col-span-2">
                                                <h4 className="font-bold text-gray-700 mb-2 border-b pb-1">Order Items</h4>
                                                <div className="overflow-x-auto">
                                                    <table className="w-full text-sm text-left">
                                                        <thead>
                                                            <tr className="bg-gray-50">
                                                                <th className="p-2">Product</th>
                                                                <th className="p-2">Price</th>
                                                                <th className="p-2">Qty</th>
                                                                <th className="p-2">Total</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {selectedOrder.orderItems.map((item, index) => (
                                                                <tr key={index} className="border-b">
                                                                    <td className="p-2 flex items-center">
                                                                        <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded mr-2" />
                                                                        <span>{item.name}</span>
                                                                    </td>
                                                                    <td className="p-2">₹{item.price}</td>
                                                                    <td className="p-2">{item.qty}</td>
                                                                    <td className="p-2 font-bold">₹{item.price * item.qty}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <div className="mt-4 text-right">
                                                    <p>Subtotal: ₹{selectedOrder.itemsPrice}</p>
                                                    <p>Tax: ₹{selectedOrder.taxPrice}</p>
                                                    <p>Shipping: ₹{selectedOrder.shippingPrice}</p>
                                                    <p className="text-lg font-bold">Total: ₹{selectedOrder.totalPrice}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-6 border-t bg-gray-50 flex justify-end space-x-3">
                                            <button
                                                onClick={() => {
                                                    const printWindow = window.open('', '', 'width=800,height=600');
                                                    printWindow.document.write('<html><head><title>Order Receipt</title>');
                                                    printWindow.document.write('<style>body{font-family:sans-serif; padding: 20px;} table{width:100%; border-collapse:collapse;} th,td{border:1px solid #ddd; padding:8px; text-align:left;} .header{margin-bottom:20px; border-bottom:1px solid #eee; padding-bottom:10px;} .total{text-align:right; font-weight:bold; margin-top:20px;}</style>');
                                                    printWindow.document.write('</head><body>');
                                                    printWindow.document.write('<div class="header"><h1>NexusMart Order Receipt</h1><p>Order ID: ' + selectedOrder._id + '</p></div>');
                                                    printWindow.document.write('<h3>Customer Details</h3><p>Name: ' + (selectedOrder.user?.name || 'N/A') + '</p><p>Email: ' + (selectedOrder.user?.email || 'N/A') + '</p>');
                                                    printWindow.document.write('<h3>Shipping Address</h3><p>' + selectedOrder.shippingInfo.address + '<br>' + selectedOrder.shippingInfo.city + ', ' + selectedOrder.shippingInfo.postalCode + '<br>' + selectedOrder.shippingInfo.country + '<br>Phone: ' + selectedOrder.shippingInfo.phoneNo + '</p>');
                                                    printWindow.document.write('<h3>Order Items</h3><table><thead><tr><th>Product</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead><tbody>');
                                                    selectedOrder.orderItems.forEach(item => {
                                                        printWindow.document.write('<tr><td>' + item.name + '</td><td>' + item.qty + '</td><td>₹' + item.price + '</td><td>₹' + (item.price * item.qty) + '</td></tr>');
                                                    });
                                                    printWindow.document.write('</tbody></table>');
                                                    printWindow.document.write('<div class="total"><p>Subtotal: ₹' + selectedOrder.itemsPrice + '</p><p>Tax: ₹' + selectedOrder.taxPrice + '</p><p>Shipping: ₹' + selectedOrder.shippingPrice + '</p><p>Total Amount: ₹' + selectedOrder.totalPrice + '</p></div>');
                                                    printWindow.document.write('</body></html>');
                                                    printWindow.document.close();
                                                    printWindow.print();
                                                }}
                                                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                                            >
                                                Print / Download PDF
                                            </button>
                                            <button
                                                onClick={() => setSelectedOrder(null)}
                                                className="px-4 py-2 border rounded hover:bg-gray-100"
                                            >
                                                Close
                                            </button>
                                            {selectedOrder.paymentInfo.status === 'Pending' && (
                                                <>
                                                    <button
                                                        onClick={() => rejectPayment(selectedOrder._id)}
                                                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                                    >
                                                        Reject Payment
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            verifyPayment(selectedOrder._id);
                                                            setSelectedOrder(null);
                                                        }}
                                                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                                    >
                                                        Verify Payment
                                                    </button>
                                                </>
                                            )}
                                            {(selectedOrder.orderStatus !== 'Cancelled' && selectedOrder.orderStatus !== 'Delivered') && (
                                                <button
                                                    onClick={() => cancelOrderAdmin(selectedOrder._id)}
                                                    className="px-4 py-2 bg-red-800 text-white rounded hover:bg-red-900"
                                                >
                                                    Cancel Order
                                                </button>
                                            )}
                                            {selectedOrder.orderStatus === 'Processing' && selectedOrder.paymentInfo.status === 'Verified' && (
                                                <button
                                                    onClick={() => handleShipOrder(selectedOrder._id)}
                                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                                >
                                                    Mark Shipped
                                                </button>
                                            )}
                                            {selectedOrder.orderStatus === 'Shipped' && (
                                                <button
                                                    onClick={() => handleDeliverOrder(selectedOrder._id)}
                                                    className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                                                >
                                                    Complete Order
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'products' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                                <div>
                                    <h2 className="text-3xl font-extrabold text-slate-900">Inventory Management</h2>
                                    <p className="text-slate-500 mt-1">Add, update or remove products from your catalog.</p>
                                </div>
                                <button
                                    onClick={() => setShowAddProduct(!showAddProduct)}
                                    className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all hover:-translate-y-0.5"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                                    {showAddProduct ? 'Cancel' : 'Add New Product'}
                                </button>
                            </div>

                            {showAddProduct && (
                                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 mb-8 blur-in duration-300">
                                    <h3 className="text-xl font-bold text-slate-900 mb-6">Create New Product</h3>
                                    <form onSubmit={handleCreateProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-semibold text-slate-700">Product Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={newProduct.name}
                                                onChange={handleInputChange}
                                                className="w-full bg-slate-50 border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all outline-none"
                                                placeholder="e.g. Wireless Headphones"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-semibold text-slate-700">Price (₹)</label>
                                            <input
                                                type="number"
                                                name="price"
                                                value={newProduct.price}
                                                onChange={handleInputChange}
                                                className="w-full bg-slate-50 border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all outline-none"
                                                placeholder="0.00"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-semibold text-slate-700">Category</label>
                                            <select
                                                name="category"
                                                value={newProduct.category}
                                                onChange={handleInputChange}
                                                className="w-full bg-slate-50 border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all outline-none"
                                                required
                                            >
                                                <option value="">Select Category</option>
                                                {categories.map((cat) => (
                                                    <option key={cat._id} value={cat._id}>
                                                        {cat.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-semibold text-slate-700">Initial Stock</label>
                                            <input
                                                type="number"
                                                name="stock"
                                                value={newProduct.stock}
                                                onChange={handleInputChange}
                                                className="w-full bg-slate-50 border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all outline-none"
                                                placeholder="100"
                                                required
                                            />
                                        </div>
                                        <div className="md:col-span-2 space-y-1.5">
                                            <label className="text-sm font-semibold text-slate-700">Product Image URL</label>
                                            <input
                                                type="url"
                                                name="imageUrl"
                                                value={newProduct.imageUrl}
                                                onChange={handleInputChange}
                                                placeholder="https://images.unsplash.com/..."
                                                className="w-full bg-slate-50 border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all outline-none"
                                            />
                                        </div>
                                        <div className="md:col-span-2 space-y-1.5">
                                            <label className="text-sm font-semibold text-slate-700">Detailed Description</label>
                                            <textarea
                                                name="description"
                                                value={newProduct.description}
                                                onChange={handleInputChange}
                                                rows="4"
                                                className="w-full bg-slate-50 border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all outline-none"
                                                placeholder="Write something about the product..."
                                                required
                                            ></textarea>
                                        </div>
                                        <div className="md:col-span-2 flex justify-end">
                                            <button
                                                type="submit"
                                                className="bg-emerald-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all"
                                            >
                                                Create Product
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                                {products
                                    .filter(p => {
                                        if (!searchTerm) return true;
                                        const search = searchTerm.toLowerCase();
                                        return (
                                            p.name.toLowerCase().includes(search) ||
                                            p.description.toLowerCase().includes(search) ||
                                            (p.category?.name || categories.find(c => c._id === p.category)?.name || '').toLowerCase().includes(search)
                                        );
                                    })
                                    .map(p => (
                                        <div key={p._id} className="bg-white rounded-[2rem] p-4 shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 group">
                                            <div className="relative aspect-square rounded-[1.5rem] overflow-hidden bg-slate-100 mb-4">
                                                <img
                                                    src={p.images?.[0]?.url || 'https://via.placeholder.com/300'}
                                                    alt={p.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                                <div className="absolute top-3 right-3 flex gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                                    <button
                                                        onClick={() => handleDeleteProduct(p._id)}
                                                        className="w-10 h-10 bg-white/90 backdrop-blur-md text-rose-600 rounded-full flex items-center justify-center shadow-lg hover:bg-rose-600 hover:text-white transition-colors"
                                                        title="Delete Product"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                    </button>
                                                </div>
                                                <div className="absolute bottom-3 left-3">
                                                    <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-slate-900 text-xs font-bold rounded-full shadow-sm">
                                                        {p.category?.name || categories.find(c => c._id === p.category)?.name || 'Misc'}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="px-2 pb-2">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h3 className="font-bold text-slate-800 line-clamp-1 flex-1">{p.name}</h3>
                                                </div>
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className="text-indigo-600 font-extrabold text-lg">₹{p.price.toLocaleString()}</span>
                                                    <span className={`text-[10px] uppercase tracking-widest font-bold ${p.stock > 10 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                        {p.stock} In Stock
                                                    </span>
                                                </div>
                                                <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">{p.description}</p>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    )}
                    {activeTab === 'categories' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                                <div>
                                    <h2 className="text-3xl font-extrabold text-slate-900">Categories</h2>
                                    <p className="text-slate-500 mt-1">Organize your products into logical groups.</p>
                                </div>
                                <button
                                    onClick={() => setShowAddCategory(!showAddCategory)}
                                    className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                                    {showAddCategory ? 'Cancel' : 'Add New Category'}
                                </button>
                            </div>

                            {showAddCategory && (
                                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 mb-8 max-w-lg blur-in duration-300">
                                    <h3 className="text-xl font-bold text-slate-900 mb-6">Create New Category</h3>
                                    <form onSubmit={handleCreateCategory} className="flex gap-4">
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                placeholder="Category Name (e.g. Electronics)"
                                                value={newCategoryName}
                                                onChange={(e) => setNewCategoryName(e.target.value)}
                                                className="w-full bg-slate-50 border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all outline-none"
                                                required
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/10"
                                        >
                                            Save
                                        </button>
                                    </form>
                                </div>
                            )}

                            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden max-w-2xl">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50/50 border-b border-slate-100">
                                            <th className="p-5 text-sm font-semibold text-slate-600">Category Name</th>
                                            <th className="p-5 text-sm font-semibold text-slate-600 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {categories.length === 0 ? (
                                            <tr>
                                                <td colSpan="2" className="p-20 text-center">
                                                    <div className="flex flex-col items-center justify-center">
                                                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                                            <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                                                        </div>
                                                        <p className="text-slate-500 font-medium">No categories found.</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            categories.map(cat => (
                                                <tr key={cat._id} className="hover:bg-slate-50/50 transition-colors group">
                                                    <td className="p-5 font-semibold text-slate-800">{cat.name}</td>
                                                    <td className="p-5 text-right">
                                                        <button
                                                            onClick={() => handleDeleteCategory(cat._id)}
                                                            className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                                                            title="Delete Category"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div >
    );
};

export default AdminDashboard;
