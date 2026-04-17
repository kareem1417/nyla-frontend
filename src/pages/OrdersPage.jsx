import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, Clock, CheckCircle, Truck, XCircle, ShoppingBag } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

function OrdersPage() {
    const navigate = useNavigate();
    const { user } = useAuthStore();

    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    useEffect(() => {
        const fetchMyOrders = async () => {
            if (!user) return;

            try {
                const response = await fetch('http://localhost:5000/api/orders/myorders', {
                    headers: {
                        // هنا السحر: بنبعت الـ Token في الهيدر عشان "الحارس" يعدينا
                        Authorization: `Bearer ${user.token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('مقدرناش نجيب الأوردرات، حاول تاني');
                }

                const data = await response.json();
                setOrders(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMyOrders();
    }, [user]);

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Pending':
                return <span className="flex items-center gap-1.5 bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold"><Clock size={14} /> Pending</span>;
            case 'Processing':
                return <span className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold"><Package size={14} /> Processing</span>;
            case 'Shipped':
                return <span className="flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold"><Truck size={14} /> Shipped</span>;
            case 'Delivered':
                return <span className="flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-semibold"><CheckCircle size={14} /> Delivered</span>;
            case 'Cancelled':
                return <span className="flex items-center gap-1.5 bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs font-semibold"><XCircle size={14} /> Cancelled</span>;
            default:
                return <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold">{status}</span>;
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-petal-gray border-t-burgundy-800 rounded-full animate-spin"></div>
                <p className="text-stone font-medium animate-pulse">Loading your orders...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 md:py-20 font-sans">
            <h1 className="text-4xl md:text-5xl font-display text-ink mb-2">My Orders</h1>
            <p className="text-stone mb-10">Check the status of your recent orders and manage your account.</p>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-8 border border-red-100">
                    {error}
                </div>
            )}

            {orders.length === 0 ? (
                <div className="bg-[#FAF8F6] border border-petal-gray rounded-[24px] p-12 text-center flex flex-col items-center justify-center">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-petal-gray">
                        <ShoppingBag size={32} className="text-stone" />
                    </div>
                    <h2 className="text-2xl font-display text-ink mb-3">No orders yet</h2>
                    <p className="text-stone max-w-md mx-auto mb-8">You haven't placed any orders yet. Start exploring our collection of natural beauty products.</p>
                    <Link to="/shop" className="btn-primary">Start Shopping</Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order._id} className="bg-white border border-petal-gray rounded-[24px] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <div className="bg-[#FAF8F6] px-6 py-4 border-b border-petal-gray flex flex-wrap flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div className="flex flex-wrap gap-6 md:gap-12">
                                    <div>
                                        <p className="text-xs text-stone font-medium uppercase tracking-wider mb-1">Order Placed</p>
                                        <p className="text-sm text-ink font-semibold">
                                            {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-stone font-medium uppercase tracking-wider mb-1">Total Amount</p>
                                        <p className="text-sm text-ink font-semibold">{order.totalAmount} EGP</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-stone font-medium uppercase tracking-wider mb-1">Order ID</p>
                                        <p className="text-sm font-mono text-stone">#{order._id.substring(order._id.length - 8)}</p>
                                    </div>
                                </div>

                                <div>
                                    {getStatusBadge(order.status)}
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="space-y-4">
                                    {order.orderItems.map((item, index) => (
                                        <div key={index} className="flex items-center justify-between py-3 border-b border-petal-gray/50 last:border-0 last:pb-0">
                                            <div className="flex items-start gap-4">
                                                <div>
                                                    <p className="text-ink font-medium text-sm md:text-base">{item.productName}</p>
                                                    <p className="text-stone text-xs md:text-sm mt-0.5">Variant: {item.variantLabel}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-ink font-semibold text-sm md:text-base">{item.unitPrice} EGP</p>
                                                <p className="text-stone text-xs md:text-sm mt-0.5">Qty: {item.quantity}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default OrdersPage;