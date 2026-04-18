import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, ShoppingCart, Package, Truck, TrendingUp, Award } from 'lucide-react';

function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };
                const { data } = await axios.get('https://nyla-backend.onrender.com/api/orders/stats', config);
                setStats(data);
            } catch (error) {
                console.error("Stats Error", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="p-10 text-center text-stone">Loading Analytics... 📈</div>;

    const statCards = [
        { title: 'Total Sales', value: `${stats?.totalSales} EGP`, icon: <DollarSign />, color: 'bg-green-100 text-green-600' },
        { title: 'Total Orders', value: stats?.totalOrders, icon: <ShoppingCart />, color: 'bg-burgundy-100 text-burgundy-800' },
        { title: 'Pending Orders', value: stats?.pendingOrders, icon: <Package />, color: 'bg-yellow-100 text-yellow-600' },
        { title: 'Shipped Orders', value: stats?.shippedOrders, icon: <Truck />, color: 'bg-blue-100 text-blue-600' },
    ];

    return (
        <div className="space-y-8 animate-fade-in pb-10">
            <div className="flex items-center gap-3">
                <TrendingUp className="text-burgundy-800 w-8 h-8" />
                <h1 className="text-2xl font-display text-ink">Business Analytics</h1>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {statCards.map((card, i) => (
                    <div key={i} className="bg-white p-4 md:p-6 rounded-2xl border border-petal-gray shadow-sm flex flex-col md:flex-row items-start md:items-center gap-4">
                        <div className={`p-3 rounded-xl ${card.color}`}>{card.icon}</div>
                        <div>
                            <p className="text-xs md:text-sm text-stone font-medium mb-1">{card.title}</p>
                            <p className="text-xl md:text-2xl font-bold text-ink">{card.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-2xl border border-petal-gray shadow-sm lg:col-span-2">
                    <h2 className="text-lg font-display text-ink mb-6 flex items-center gap-2">
                        Sales Overview (Last 7 Days)
                    </h2>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats?.salesData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F1F1" />
                                <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: '1px solid #E5E5E5', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                                    cursor={{ fill: '#FAF8F6' }}
                                />
                                <Bar dataKey="total" fill="#70011a" radius={[6, 6, 0, 0]} barSize={30} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-petal-gray shadow-sm">
                    <h2 className="text-lg font-display text-ink mb-6 flex items-center gap-2">
                        <Award className="text-yellow-500" /> Top Selling Products
                    </h2>

                    <div className="space-y-4">
                        {stats?.topProducts?.length > 0 ? (
                            stats.topProducts.map((product, index) => (
                                <div key={index} className="flex items-center gap-4 p-3 hover:bg-[#FAF8F6] rounded-xl transition-colors border border-transparent hover:border-petal-gray">

                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${index === 0 ? 'bg-yellow-100 text-yellow-700' : index === 1 ? 'bg-gray-100 text-gray-700' : index === 2 ? 'bg-orange-100 text-orange-700' : 'bg-[#FAF8F6] text-stone'}`}>
                                        {index + 1}
                                    </div>

                                    <img src={product.image} alt={product._id} className="w-12 h-12 rounded-lg object-cover border border-petal-gray/50" />

                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-medium text-ink text-sm truncate">{product._id}</h3>
                                        <p className="text-xs text-stone mt-0.5">{product.totalSold} items sold</p>
                                    </div>

                                    <div className="text-right">
                                        <p className="font-semibold text-burgundy-800 text-sm">{product.revenue} EGP</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-stone py-10 italic text-sm">
                                No sales data yet.
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
}

export default AdminDashboard;