import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Package, User, Heart, Clock, CheckCircle, Truck, XCircle, MapPin, Phone, Map } from 'lucide-react';

function ProfilePage() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('orders');
    const [userInfo, setUserInfo] = useState(null);

    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);

    const [formData, setFormData] = useState({ phone: '', address: '', city: 'Cairo' });
    const [updatingProfile, setUpdatingProfile] = useState(false);

    const [wishlistItems, setWishlistItems] = useState([]);

    useEffect(() => {
        const syncWishlist = () => {
            const savedWishlist = JSON.parse(localStorage.getItem('wishlistItems')) || [];
            setWishlistItems(savedWishlist);
        };

        syncWishlist();
        window.addEventListener('storage', syncWishlist);

        const user = JSON.parse(localStorage.getItem('userInfo'));
        if (!user) {
            navigate('/login');
        } else {
            setUserInfo(user);
            setFormData({
                phone: user.phone || '',
                address: user.address || '',
                city: user.city || 'Cairo'
            });
            fetchMyOrders(user.token);
        }

        return () => {
            window.removeEventListener('storage', syncWishlist);
        };
    }, [navigate]);

    const fetchMyOrders = async (token) => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.get('http://localhost:5000/api/orders/myorders', config);
            setOrders(data);
        } catch (error) {
            toast.error('Failed to load your orders.');
        } finally {
            setLoadingOrders(false);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setUpdatingProfile(true);
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const { data } = await axios.put('http://localhost:5000/api/users/profile', formData, config);

            localStorage.setItem('userInfo', JSON.stringify(data));
            setUserInfo(data);
            toast.success('Profile updated successfully! ✨');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setUpdatingProfile(false);
        }
    };

    const removeFromWishlist = (productId) => {
        const updatedWishlist = wishlistItems.filter(item => item._id !== productId);
        setWishlistItems(updatedWishlist);
        localStorage.setItem('wishlistItems', JSON.stringify(updatedWishlist));
        toast.success('Removed from wishlist 💔');
        window.dispatchEvent(new Event('storage'));
    };

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        navigate('/login');
    };

    if (!userInfo) return null;

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-20 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-display text-ink mb-10">Welcome, {userInfo.name.split(' ')[0]}!</h1>

            <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-1/4">
                    <div className="bg-white rounded-2xl border border-petal-gray p-4 flex flex-col gap-2 shadow-sm sticky top-24">
                        <button onClick={() => setActiveTab('orders')} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left font-medium ${activeTab === 'orders' ? 'bg-[#FAF8F6] text-burgundy-800 border border-petal-gray' : 'text-stone hover:bg-[#FAF8F6]/50'}`}>
                            <Package size={20} /> My Orders
                        </button>
                        <button onClick={() => setActiveTab('info')} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left font-medium ${activeTab === 'info' ? 'bg-[#FAF8F6] text-burgundy-800 border border-petal-gray' : 'text-stone hover:bg-[#FAF8F6]/50'}`}>
                            <User size={20} /> Account Details
                        </button>
                        <button onClick={() => setActiveTab('wishlist')} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left font-medium ${activeTab === 'wishlist' ? 'bg-[#FAF8F6] text-burgundy-800 border border-petal-gray' : 'text-stone hover:bg-[#FAF8F6]/50'}`}>
                            <Heart size={20} /> My Wishlist
                        </button>
                        <div className="h-px bg-petal-gray my-2"></div>
                        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left font-medium text-red-600 hover:bg-red-50">
                            Log Out
                        </button>
                    </div>
                </div>

                <div className="w-full md:w-3/4">

                    {activeTab === 'orders' && (
                        <div className="bg-white rounded-2xl border border-petal-gray p-6 shadow-sm">
                            <h2 className="text-xl font-display text-ink mb-6">Order History</h2>

                            {loadingOrders ? (
                                <div className="text-center py-10 text-stone">Loading your orders... 📦</div>
                            ) : orders.length === 0 ? (
                                <div className="text-center py-10">
                                    <Package className="w-12 h-12 text-petal-gray mx-auto mb-3" />
                                    <p className="text-stone">You haven't placed any orders yet.</p>
                                    <button onClick={() => navigate('/shop')} className="mt-4 bg-burgundy-800 text-white px-6 py-2 rounded-xl hover:bg-ink transition-colors">Start Shopping</button>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {orders.map((order) => (
                                        <div key={order._id} className="border border-petal-gray rounded-xl p-5 hover:shadow-md transition-shadow bg-white">
                                            <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 border-b border-petal-gray pb-4 mb-4">
                                                <div>
                                                    <p className="text-xs text-stone font-mono bg-[#FAF8F6] inline-block px-2 py-1 rounded-md mb-2">
                                                        Order ID: #{order._id.substring(18, 24).toUpperCase()}
                                                    </p>
                                                    <p className="text-sm font-medium text-ink">
                                                        Order Placed: {new Date(order.createdAt).toLocaleDateString('en-EG', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                    </p>
                                                    <div className="mt-3">
                                                        {order.isCancelled ? (
                                                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-medium"><XCircle size={14} /> Cancelled</span>
                                                        ) : order.isDelivered ? (
                                                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium"><CheckCircle size={14} /> Delivered</span>
                                                        ) : order.isShipped ? (
                                                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium"><Truck size={14} /> On the way!</span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-medium"><Clock size={14} /> Processing</span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="text-left md:text-right bg-[#FAF8F6] p-3 rounded-xl border border-petal-gray">
                                                    <p className="text-xs text-stone uppercase tracking-wider font-semibold mb-1">Total Amount</p>
                                                    <p className="text-xl font-bold text-burgundy-800">{order.totalPrice || order.total || 0} EGP</p>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <h4 className="text-sm font-medium text-stone mb-2">Items in this order:</h4>
                                                {order.orderItems?.map((item, index) => (
                                                    <div key={index} className="flex gap-4 items-center bg-[#FAF8F6]/50 p-3 rounded-xl border border-petal-gray/50">
                                                        <img src={item.image || item.imageUrl} alt={item.name} className="w-14 h-14 rounded-lg object-cover bg-white border border-petal-gray" />

                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-medium text-sm text-ink truncate">{item.name || item.productName || 'Product'}</p>
                                                            <p className="text-xs text-stone mt-1">
                                                                Variant: <span className="font-medium text-ink">{item.variantId && item.variantId !== 'default' ? item.variantId : 'Standard'}</span>
                                                            </p>
                                                        </div>

                                                        <div className="text-center px-2 md:px-4 border-l border-petal-gray/50">
                                                            <p className="text-[10px] uppercase text-stone font-semibold">Qty</p>
                                                            <p className="font-bold text-sm text-ink">{item.qty || item.quantity || 1}</p>
                                                        </div>

                                                        <div className="text-right pl-2 md:pl-4 border-l border-petal-gray/50 min-w-[70px]">
                                                            <p className="font-bold text-burgundy-800 text-sm">{item.price || item.unitPrice || 0} <span className="text-[10px]">EGP</span></p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* 2. تاب بيانات الحساب */}
                    {activeTab === 'info' && (
                        <div className="bg-white rounded-2xl border border-petal-gray p-6 shadow-sm">
                            <h2 className="text-xl font-display text-ink mb-6">Account Details</h2>

                            <div className="mb-8 bg-[#FAF8F6] p-5 rounded-xl border border-petal-gray">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-stone uppercase tracking-wider font-semibold mb-1">Personal Info</p>
                                        <p className="text-sm text-stone mb-1">Name: <span className="font-medium text-ink">{userInfo.name}</span></p>
                                        <p className="text-sm text-stone mb-1">Email: <span className="font-medium text-ink">{userInfo.email}</span></p>
                                        <p className="text-sm text-stone">Phone: <span className="font-medium text-ink">{userInfo.phone || <span className="text-petal-gray italic">Not added yet</span>}</span></p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-stone uppercase tracking-wider font-semibold mb-1">Shipping Details</p>
                                        <p className="text-sm text-stone mb-1">City: <span className="font-medium text-ink">{userInfo.city || <span className="text-petal-gray italic">Not added yet</span>}</span></p>
                                        <p className="text-sm text-stone">Address: <span className="font-medium text-ink">{userInfo.address || <span className="text-petal-gray italic">Not added yet</span>}</span></p>
                                    </div>
                                </div>
                            </div>

                            <h3 className="text-lg font-display text-ink mb-4 border-b border-petal-gray pb-2">Update Information</h3>

                            <form onSubmit={handleUpdateProfile} className="space-y-5">
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-ink mb-2">
                                        <Phone size={16} /> Phone Number
                                    </label>
                                    <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full border border-petal-gray rounded-xl px-4 py-3 focus:outline-none focus:border-burgundy-800" />
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-ink mb-2">
                                        <Map size={16} /> Governorate (City)
                                    </label>
                                    <select value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="w-full border border-petal-gray rounded-xl px-4 py-3 focus:outline-none focus:border-burgundy-800 bg-white">
                                        <option value="Cairo">Cairo</option>
                                        <option value="Giza">Giza</option>
                                        <option value="Alexandria">Alexandria</option>
                                        <option value="Dakahlia">Dakahlia</option>
                                        <option value="Red Sea">Red Sea</option>
                                        <option value="Port Said">Port Said</option>
                                        <option value="Sharqia">Sharqia</option>
                                        <option value="Gharbia">Gharbia</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-ink mb-2">
                                        <MapPin size={16} /> Street Address
                                    </label>
                                    <textarea rows="3" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full border border-petal-gray rounded-xl px-4 py-3 focus:outline-none focus:border-burgundy-800 resize-none"></textarea>
                                </div>
                                <button type="submit" disabled={updatingProfile} className="bg-burgundy-800 text-white px-6 py-3 rounded-xl font-medium hover:bg-ink transition-colors disabled:opacity-50 shadow-sm">
                                    {updatingProfile ? 'Saving...' : 'Save Changes'}
                                </button>
                            </form>
                        </div>
                    )}

                    {activeTab === 'wishlist' && (
                        <div className="bg-white rounded-2xl border border-petal-gray p-6 shadow-sm">
                            <h2 className="text-xl font-display text-ink mb-6">My Wishlist</h2>

                            {wishlistItems.length === 0 ? (
                                <div className="text-center py-16 bg-[#FAF8F6] rounded-xl border border-dashed border-petal-gray">
                                    <Heart className="w-12 h-12 text-petal-gray mx-auto mb-4" />
                                    <p className="text-stone mb-4">Your wishlist is currently empty.</p>
                                    <button onClick={() => navigate('/shop')} className="bg-burgundy-800 text-white px-8 py-2.5 rounded-xl font-medium hover:bg-ink transition-colors shadow-sm">
                                        Explore Products
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <p className="text-stone mb-6">You have <span className="font-bold text-burgundy-800">{wishlistItems.length}</span> items in your wishlist.</p>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {wishlistItems.map((product) => (
                                            <div key={product._id} className="bg-white border border-petal-gray rounded-2xl overflow-hidden hover:shadow-md transition-all group flex flex-col">

                                                <div className="relative aspect-square overflow-hidden bg-[#FAF8F6]">
                                                    <img src={product.imageUrl || product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />

                                                    <button
                                                        onClick={() => removeFromWishlist(product._id)}
                                                        className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm text-red-500 hover:bg-red-50 hover:scale-110 transition-all"
                                                        title="Remove from wishlist"
                                                    >
                                                        <Heart className="w-5 h-5 fill-current" />
                                                    </button>
                                                </div>

                                                <div className="p-4 flex flex-col flex-1">
                                                    <h3 className="font-medium text-ink truncate mb-1">{product.name}</h3>
                                                    <p className="font-bold text-burgundy-800 mb-4">{product.basePrice || product.price} EGP</p>

                                                    <button
                                                        onClick={() => navigate(`/product/${product._id}`)}
                                                        className="mt-auto w-full bg-ink text-white py-2 rounded-xl text-sm font-medium hover:bg-burgundy-800 transition-colors shadow-sm"
                                                    >
                                                        View Product
                                                    </button>
                                                </div>

                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;