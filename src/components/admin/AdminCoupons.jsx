import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Ticket, Plus, Trash2, Calendar, Users, Hash, Percent } from 'lucide-react';

function AdminCoupons() {
    const [coupons, setCoupons] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newCoupon, setNewCoupon] = useState({
        code: '',
        discountPercentage: '',
        expiryDate: '',
        usageLimit: 1,
        targetUser: ''
    });

    const fetchCoupons = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };
            const { data } = await axios.get('http://localhost:5000/api/coupons', config);
            setCoupons(data);
        } catch (error) {
            toast.error('Failed to load coupons');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };

            const { data } = await axios.post('http://localhost:5000/api/coupons', newCoupon, config);

            setCoupons([...coupons, data]);
            setNewCoupon({ code: '', discountPercentage: '', expiryDate: '', usageLimit: 1, targetUser: '' });
            toast.success('Coupon created successfully! 💸');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create coupon');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this coupon?')) return;
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };
            await axios.delete(`http://localhost:5000/api/coupons/${id}`, config);
            setCoupons(coupons.filter(c => c._id !== id));
            toast.success('Coupon deleted 🗑️');
        } catch (error) {
            toast.error('Failed to delete');
        }
    };

    if (isLoading) return <div className="text-center py-20 text-stone animate-pulse">Loading Coupons... 🎫</div>;

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-display text-ink flex items-center gap-2">
                    <Ticket className="text-burgundy-800" /> Promo Codes
                </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-2xl border border-petal-gray shadow-sm sticky top-24">
                        <h2 className="text-lg font-display text-ink mb-6 flex items-center gap-2">
                            <Plus size={18} /> Create New Coupon
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-stone uppercase mb-1">Coupon Code</label>
                                <input
                                    type="text"
                                    placeholder="e.g. SUMMER50"
                                    className="w-full px-4 py-2.5 bg-[#FAF8F6] border border-petal-gray rounded-xl focus:outline-none focus:border-burgundy-800 uppercase"
                                    value={newCoupon.code}
                                    onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-stone uppercase mb-1">Discount %</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            className="w-full px-4 py-2.5 bg-[#FAF8F6] border border-petal-gray rounded-xl focus:outline-none focus:border-burgundy-800"
                                            value={newCoupon.discountPercentage}
                                            onChange={(e) => setNewCoupon({ ...newCoupon, discountPercentage: e.target.value })}
                                            required
                                        />
                                        <Percent size={14} className="absolute right-3 top-3.5 text-stone" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-stone uppercase mb-1">Usage Limit</label>
                                    <input
                                        type="number"
                                        className="w-full px-4 py-2.5 bg-[#FAF8F6] border border-petal-gray rounded-xl focus:outline-none focus:border-burgundy-800"
                                        value={newCoupon.usageLimit}
                                        onChange={(e) => setNewCoupon({ ...newCoupon, usageLimit: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-stone uppercase mb-1">Expiry Date</label>
                                <input
                                    type="date"
                                    className="w-full px-4 py-2.5 bg-[#FAF8F6] border border-petal-gray rounded-xl focus:outline-none focus:border-burgundy-800"
                                    value={newCoupon.expiryDate}
                                    onChange={(e) => setNewCoupon({ ...newCoupon, expiryDate: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-stone uppercase mb-1">Target User ID (Optional)</label>
                                <input
                                    type="text"
                                    placeholder="Leave empty for all"
                                    className="w-full px-4 py-2.5 bg-[#FAF8F6] border border-petal-gray rounded-xl focus:outline-none focus:border-burgundy-800"
                                    value={newCoupon.targetUser}
                                    onChange={(e) => setNewCoupon({ ...newCoupon, targetUser: e.target.value })}
                                />
                            </div>

                            <button type="submit" className="w-full bg-ink text-white py-3 rounded-xl hover:bg-burgundy-800 transition-colors font-medium mt-4">
                                Create Coupon
                            </button>
                        </form>
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-4">
                    {coupons.length === 0 ? (
                        <div className="bg-white p-20 text-center rounded-2xl border border-dashed border-petal-gray">
                            <Ticket className="mx-auto h-12 w-12 text-petal-gray mb-3" />
                            <p className="text-stone">No active coupons yet.</p>
                        </div>
                    ) : (
                        coupons.map((coupon) => (
                            <div key={coupon._id} className="bg-white p-5 rounded-2xl border border-petal-gray shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="bg-burgundy-50 p-3 rounded-xl text-burgundy-800">
                                        <Ticket size={24} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-ink text-lg">{coupon.code}</h3>
                                            <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-bold">-{coupon.discountPercentage}% OFF</span>
                                        </div>
                                        <div className="flex flex-wrap gap-4 mt-1 text-xs text-stone">
                                            <span className="flex items-center gap-1"><Calendar size={14} /> Exp: {new Date(coupon.expiryDate).toLocaleDateString()}</span>
                                            <span className="flex items-center gap-1"><Hash size={14} /> {coupon.usedBy.length} / {coupon.usageLimit} Used</span>
                                            {coupon.targetUser && <span className="flex items-center gap-1 text-burgundy-800 font-medium"><Users size={14} /> Specific User</span>}
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleDelete(coupon._id)}
                                    className="p-2.5 text-stone hover:text-red-500 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminCoupons;