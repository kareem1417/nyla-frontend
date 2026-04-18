import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Users, Search, UserCheck, Mail, Phone, MapPin, Heart, PackageOpen, X, Calendar } from 'lucide-react';

function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // States للـ Modal بتاع تفاصيل العميل
    const [selectedUser, setSelectedUser] = useState(null);
    const [isDetailsLoading, setIsDetailsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 1. جلب كل العملاء للجدول
    const fetchUsers = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };
            const { data } = await axios.get('https://nyla-backend.onrender.com/api/users', config);
            setUsers(data);
        } catch (error) {
            toast.error('Failed to load users');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleViewDetails = async (userId) => {
        setIsModalOpen(true);
        setIsDetailsLoading(true);
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };
            const { data } = await axios.get(`https://nyla-backend.onrender.com/api/users/${userId}/details`, config);
            setSelectedUser(data);
        } catch (error) {
            toast.error('Failed to load user details');
            setIsModalOpen(false);
        } finally {
            setIsDetailsLoading(false);
        }
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.phone && user.phone.includes(searchTerm))
    );

    if (isLoading) return <div className="text-center py-20 text-stone animate-pulse">Loading Customers CRM... 👥</div>;

    return (
        <div className="space-y-6 animate-fade-in relative">
            {/* ================= الهيدر والبحث ================= */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-2xl font-display text-ink flex items-center gap-2">
                    <Users className="text-burgundy-800" /> Customers
                </h1>

                <div className="relative w-full md:w-72">
                    <Search size={18} className="absolute left-3 top-3 text-stone" />
                    <input
                        type="text"
                        placeholder="Search by name, email, phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-petal-gray rounded-xl focus:outline-none focus:border-burgundy-800 text-sm"
                    />
                </div>
            </div>

            {/* ================= جدول العملاء ================= */}
            <div className="bg-white rounded-2xl border border-petal-gray shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#FAF8F6] border-b border-petal-gray text-stone text-xs uppercase tracking-wider">
                                <th className="px-6 py-4 font-semibold">Customer</th>
                                <th className="px-6 py-4 font-semibold hidden md:table-cell">Contact</th>
                                <th className="px-6 py-4 font-semibold hidden sm:table-cell">Joined</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-petal-gray">
                            {filteredUsers.map((user) => (
                                <tr key={user._id} className="hover:bg-[#FAF8F6]/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-burgundy-50 text-burgundy-800 flex items-center justify-center font-bold text-lg border border-burgundy-100">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-medium text-ink flex items-center gap-1.5">
                                                    {user.name}
                                                    {user.isAdmin && <span className="bg-ink text-white text-[10px] px-2 py-0.5 rounded-full">Admin</span>}
                                                </div>
                                                <div className="text-xs text-stone md:hidden">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 hidden md:table-cell">
                                        <div className="text-sm text-ink">{user.email}</div>
                                        {user.phone && <div className="text-xs text-stone mt-0.5">{user.phone}</div>}
                                    </td>
                                    <td className="px-6 py-4 hidden sm:table-cell text-sm text-stone">
                                        {new Date(user.createdAt).toLocaleDateString('en-GB')}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleViewDetails(user._id)}
                                            className="px-4 py-2 bg-[#FAF8F6] border border-petal-gray text-ink text-sm font-medium rounded-xl hover:bg-white hover:border-burgundy-800 transition-all shadow-sm"
                                        >
                                            View Profile
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredUsers.length === 0 && (
                        <div className="p-12 text-center text-stone">No customers found.</div>
                    )}
                </div>
            </div>

            {/* ================= نافذة تفاصيل العميل (Modal) ================= */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-50 flex justify-center items-center p-4 md:p-6">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-fade-in overflow-hidden border border-petal-gray">

                        {/* هيدر الـ Modal */}
                        <div className="flex justify-between items-center p-6 border-b border-petal-gray bg-[#FAF8F6]">
                            <h2 className="text-xl font-display text-ink flex items-center gap-2">
                                <UserCheck className="text-burgundy-800" /> Customer Profile
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-stone hover:text-red-500 transition-colors p-2 bg-white rounded-full border border-petal-gray">
                                <X size={20} />
                            </button>
                        </div>

                        {/* محتوى الـ Modal */}
                        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-white">
                            {isDetailsLoading || !selectedUser ? (
                                <div className="py-20 text-center text-stone animate-pulse">Loading full profile data... ⏳</div>
                            ) : (
                                <div className="space-y-8">

                                    {/* 1. الكارت الشخصي */}
                                    <div className="bg-[#FAF8F6] p-6 rounded-2xl border border-petal-gray grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <h3 className="text-lg font-bold text-ink mb-4">Contact Info</h3>
                                            <p className="flex items-center gap-3 text-sm text-stone"><UserCheck size={16} className="text-burgundy-800" /> <span className="font-medium text-ink">{selectedUser.name}</span></p>
                                            <p className="flex items-center gap-3 text-sm text-stone"><Mail size={16} className="text-burgundy-800" /> {selectedUser.email}</p>
                                            <p className="flex items-center gap-3 text-sm text-stone"><Phone size={16} className="text-burgundy-800" /> {selectedUser.phone || 'No phone provided'}</p>
                                            {/* 👈 الزرار الجديد بتاع الـ Copy ID */}
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(selectedUser._id);
                                                    toast.success('User ID Copied! 📋');
                                                }}
                                                className="mt-2 text-[10px] font-mono bg-petal-gray/30 text-stone px-2 py-1 rounded-md border border-petal-gray hover:bg-burgundy-50 hover:text-burgundy-800 hover:border-burgundy-200 transition-all flex items-center gap-1 w-fit"
                                            >
                                                ID: {selectedUser._id}
                                            </button>
                                        </div>
                                        <div className="space-y-3">
                                            <h3 className="text-lg font-bold text-ink mb-4 text-transparent select-none hidden md:block">Details</h3>
                                            <p className="flex items-start gap-3 text-sm text-stone">
                                                <MapPin size={16} className="text-burgundy-800 shrink-0 mt-0.5" />
                                                <span>{selectedUser.address ? `${selectedUser.address}, ${selectedUser.city}` : 'No address provided'}</span>
                                            </p>
                                            <p className="flex items-center gap-3 text-sm text-stone"><Calendar size={16} className="text-burgundy-800" /> Joined: {new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>

                                    {/* 2. مفضلة العميل (Wishlist) */}
                                    <div>
                                        <h3 className="text-lg font-display text-ink mb-4 flex items-center gap-2">
                                            <Heart className="text-burgundy-800" size={20} /> Wishlist ({selectedUser.wishlist?.length || 0})
                                        </h3>
                                        {selectedUser.wishlist?.length > 0 ? (
                                            <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
                                                {selectedUser.wishlist.map(item => (
                                                    <div key={item._id} className="min-w-[140px] w-[140px] bg-white border border-petal-gray rounded-xl p-3 snap-start hover:border-burgundy-800 transition-colors">
                                                        <img src={item.imageUrl} alt={item.name} className="w-full h-24 object-cover rounded-lg mb-2" />
                                                        <p className="text-xs font-medium text-ink truncate" title={item.name}>{item.name}</p>
                                                        <p className="text-xs font-bold text-burgundy-800 mt-1">{item.basePrice} EGP</p>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-stone italic bg-[#FAF8F6] p-4 rounded-xl border border-dashed border-petal-gray text-center">This user hasn't added any items to their wishlist yet.</p>
                                        )}
                                    </div>

                                    {/* 3. تاريخ الطلبات (Order History) */}
                                    <div>
                                        <h3 className="text-lg font-display text-ink mb-4 flex items-center gap-2">
                                            <PackageOpen className="text-burgundy-800" size={20} /> Order History ({selectedUser.orders?.length || 0})
                                        </h3>
                                        {selectedUser.orders?.length > 0 ? (
                                            <div className="space-y-3">
                                                {selectedUser.orders.map(order => (
                                                    <div key={order._id} className="flex justify-between items-center p-4 bg-white border border-petal-gray rounded-xl hover:bg-[#FAF8F6] transition-colors">
                                                        <div>
                                                            <p className="font-medium text-sm text-ink mb-1">Order <span className="text-stone">#{order._id.substring(18)}</span></p>
                                                            <p className="text-xs text-stone">{new Date(order.createdAt).toLocaleDateString()} • {order.orderItems.length} items</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-bold text-sm text-burgundy-800 mb-1">{order.totalPrice} EGP</p>
                                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide
                                                                ${order.isDelivered ? 'bg-green-100 text-green-700' :
                                                                    order.isCancelled ? 'bg-red-100 text-red-700' :
                                                                        'bg-orange-100 text-orange-700'}`}
                                                            >
                                                                {order.isDelivered ? 'Delivered' : order.isCancelled ? 'Cancelled' : 'Processing'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-stone italic bg-[#FAF8F6] p-4 rounded-xl border border-dashed border-petal-gray text-center">No orders placed by this user yet.</p>
                                        )}
                                    </div>

                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminUsers;