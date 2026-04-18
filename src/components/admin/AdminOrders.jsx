import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Package, CheckCircle, Clock, Truck, Eye, X, XCircle, Printer } from 'lucide-react';
import InvoiceTicket from '../../components/InvoiceTicket';

function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchOrders = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };
            const { data } = await axios.get('https://nyla-backend.onrender.com/api/orders', config);
            setOrders(data);
        } catch (error) {
            toast.error('Failed to fetch orders');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleAction = async (id, action) => {
        let confirmMsg = "";
        if (action === 'ship') confirmMsg = "Mark this order as Shipped?";
        if (action === 'deliver') confirmMsg = "Mark this order as Delivered?";
        if (action === 'cancel') confirmMsg = "Are you sure you want to CANCEL this order? Stock will be returned.";

        if (!window.confirm(confirmMsg)) return;

        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };
            await axios.put(`https://nyla-backend.onrender.com/api/orders/${id}/${action}`, {}, config);

            toast.success(`Order marked as ${action.toUpperCase()}!`);
            fetchOrders();
            if (isModalOpen && selectedOrder?._id === id) setIsModalOpen(false);
        } catch (error) {
            console.error(`${action} Error:`, error.response?.data);
            toast.error(error.response?.data?.message || `Failed to ${action} order`);
        }
    };

    const openOrderDetails = (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const handlePrintInvoice = () => {
        window.print();
    };

    if (isLoading) return <div className="text-center py-20 text-stone">Loading orders... 📦</div>;

    return (
        <div className="space-y-6 relative print:p-0 print:m-0 print:bg-white">

            <div className="print:hidden space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-display text-ink flex items-center gap-2">
                        <Package className="text-burgundy-800" /> Orders
                    </h1>
                    <div className="bg-[#FAF8F6] px-4 py-2 rounded-xl text-sm font-medium text-stone border border-petal-gray">
                        Total: <span className="text-burgundy-800">{orders.length}</span>
                    </div>
                </div>

                <div className="bg-white border border-petal-gray rounded-2xl overflow-hidden shadow-sm">
                    <div className="block md:hidden divide-y divide-petal-gray">
                        {orders.map((order) => (
                            <div key={order._id} className={`p-4 space-y-3 transition-colors ${order.isCancelled ? 'bg-red-50/50' : 'hover:bg-[#FAF8F6]/50'}`}>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-mono text-stone bg-white px-2 py-1 rounded-md border border-petal-gray">
                                        #{order._id.substring(18, 24).toUpperCase()}
                                    </span>

                                    {order.isCancelled ? (
                                        <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-red-100 text-red-700 text-[10px] font-medium"><XCircle size={12} /> Cancelled</span>
                                    ) : order.isDelivered ? (
                                        <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-[10px] font-medium"><CheckCircle size={12} /> Delivered</span>
                                    ) : order.isShipped ? (
                                        <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-[10px] font-medium"><Truck size={12} /> Shipped</span>
                                    ) : (
                                        <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 text-[10px] font-medium"><Clock size={12} /> Pending</span>
                                    )}
                                </div>

                                <div>
                                    <div className={`font-medium text-sm ${order.isCancelled ? 'text-red-900 line-through' : 'text-ink'}`}>{order.customerName}</div>
                                    <div className="text-xs text-stone">{order.shippingAddress?.city} • {new Date(order.createdAt).toLocaleDateString('en-EG')}</div>
                                </div>

                                <div className="flex justify-between items-center pt-3 border-t border-petal-gray/50">
                                    <span className="font-semibold text-burgundy-800 text-sm">{order.totalPrice} EGP</span>
                                    <div className="flex gap-2">
                                        <button onClick={() => openOrderDetails(order)} className="p-1.5 text-stone hover:text-ink bg-white rounded-lg border border-petal-gray transition-colors">
                                            <Eye size={16} />
                                        </button>

                                        {!order.isCancelled && !order.isDelivered && (
                                            <>
                                                {!order.isShipped && (
                                                    <button onClick={() => handleAction(order._id, 'ship')} className="bg-ink text-white px-3 py-1.5 rounded-lg text-xs font-medium">Ship</button>
                                                )}
                                                {order.isShipped && (
                                                    <button onClick={() => handleAction(order._id, 'deliver')} className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium">Deliver</button>
                                                )}
                                                <button onClick={() => handleAction(order._id, 'cancel')} className="bg-white text-red-600 border border-red-200 hover:bg-red-50 px-3 py-1.5 rounded-lg text-xs font-medium">Cancel</button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[900px]">
                            <thead>
                                <tr className="bg-[#FAF8F6] border-b border-petal-gray text-stone text-sm uppercase tracking-wider">
                                    <th className="px-6 py-4 font-semibold">Order ID / Date</th>
                                    <th className="px-6 py-4 font-semibold">Customer</th>
                                    <th className="px-6 py-4 font-semibold">Total</th>
                                    <th className="px-6 py-4 font-semibold">Status</th>
                                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-petal-gray">
                                {orders.map((order) => (
                                    <tr key={order._id} className={`transition-colors ${order.isCancelled ? 'bg-red-50/30' : 'hover:bg-[#FAF8F6]/50'}`}>
                                        <td className="px-6 py-4">
                                            <div className="text-xs text-stone mb-1 font-mono">#{order._id.substring(18, 24).toUpperCase()}</div>
                                            <div className="text-sm font-medium text-ink">{new Date(order.createdAt).toLocaleDateString('en-EG', { day: 'numeric', month: 'short' })}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={`font-medium ${order.isCancelled ? 'text-red-900 line-through' : 'text-ink'}`}>{order.customerName}</div>
                                            <div className="text-xs text-stone">{order.shippingAddress?.city}</div>
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-burgundy-800">{order.totalPrice} EGP</td>
                                        <td className="px-6 py-4">
                                            {order.isCancelled ? (
                                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-medium"><XCircle size={14} /> Cancelled</span>
                                            ) : order.isDelivered ? (
                                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium"><CheckCircle size={14} /> Delivered</span>
                                            ) : order.isShipped ? (
                                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium"><Truck size={14} /> Shipped</span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-medium"><Clock size={14} /> Pending</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end items-center gap-2">
                                                <button onClick={() => openOrderDetails(order)} className="p-2 text-stone hover:text-ink hover:bg-petal-gray/30 rounded-lg transition-colors"><Eye size={18} /></button>

                                                {!order.isCancelled && !order.isDelivered && (
                                                    <>
                                                        {!order.isShipped && (
                                                            <button onClick={() => handleAction(order._id, 'ship')} className="bg-ink text-white px-3 py-1.5 rounded-lg text-xs font-medium">Ship</button>
                                                        )}
                                                        {order.isShipped && (
                                                            <button onClick={() => handleAction(order._id, 'deliver')} className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium">Deliver</button>
                                                        )}
                                                        <button onClick={() => handleAction(order._id, 'cancel')} className="bg-white text-red-600 border border-red-200 hover:bg-red-50 px-3 py-1.5 rounded-lg text-xs font-medium">Cancel</button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Modal التفاصيل */}
                {isModalOpen && selectedOrder && (
                    <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-50 flex justify-center items-center p-4">
                        <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-fade-in">
                            <div className="flex justify-between items-center p-4 md:p-6 border-b border-petal-gray sticky top-0 bg-white z-10">
                                <div>
                                    <h2 className="text-lg md:text-xl font-display text-ink flex items-center gap-2">
                                        Order Details {selectedOrder.isCancelled && <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-sans font-bold">CANCELLED</span>}
                                    </h2>
                                    <p className="text-xs md:text-sm text-stone font-mono mt-1">#{selectedOrder._id.substring(18, 24).toUpperCase()}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={handlePrintInvoice}
                                        className="flex items-center gap-1.5 text-sm font-medium text-ink bg-[#FAF8F6] border border-petal-gray px-3 py-1.5 rounded-xl hover:border-burgundy-800 transition-colors"
                                    >
                                        <Printer size={16} /> <span className="hidden sm:inline">Print</span>
                                    </button>
                                    <button onClick={() => setIsModalOpen(false)} className="text-stone hover:text-red-500 transition-colors bg-[#FAF8F6] p-2 rounded-full border border-petal-gray"><X size={20} /></button>
                                </div>
                            </div>

                            <div className="p-4 md:p-6 space-y-6 md:space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 bg-[#FAF8F6] p-4 md:p-6 rounded-xl border border-petal-gray">
                                    <div>
                                        <h3 className="text-xs font-semibold text-stone uppercase tracking-wider mb-2">Customer Info</h3>
                                        <p className="font-medium text-ink text-sm md:text-base">{selectedOrder.customerName}</p>
                                        <p className="text-sm text-stone">{selectedOrder.customerEmail}</p>
                                        <p className="text-sm text-stone mt-1 font-medium flex items-center gap-1">📞 {selectedOrder.shippingAddress?.phone}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-xs font-semibold text-stone uppercase tracking-wider mb-2">Shipping Address</h3>
                                        <p className="text-sm text-ink">{selectedOrder.shippingAddress?.address}</p>
                                        <p className="text-sm text-ink">{selectedOrder.shippingAddress?.city}</p>
                                        <p className="text-sm text-stone mt-1">Payment: <span className="font-medium text-burgundy-800">{selectedOrder.paymentMethod}</span></p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-base md:text-lg font-display text-ink mb-3 md:mb-4 border-b border-petal-gray pb-2">Items to Pack ({selectedOrder.orderItems?.length})</h3>
                                    <div className="space-y-3">
                                        {selectedOrder.orderItems?.map((item, index) => (
                                            <div key={index} className="flex gap-3 md:gap-4 items-center bg-white p-2 md:p-3 rounded-xl border border-petal-gray/50 shadow-sm">
                                                <img src={item.image} alt={item.name} className="w-12 h-12 md:w-16 md:h-16 object-cover rounded-lg bg-[#FAF8F6]" />
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-medium text-ink text-sm md:text-base truncate">{item.name}</h4>
                                                    <div className="text-xs md:text-sm text-stone mt-0.5 md:mt-1">
                                                        Shade: <span className="font-medium text-ink">{item.variantId !== 'default' ? item.variantId : 'Standard'}</span>
                                                    </div>
                                                </div>
                                                <div className="text-center px-2 md:px-4">
                                                    <div className="text-[10px] md:text-xs text-stone">Qty</div>
                                                    <div className="font-bold text-ink text-sm md:text-lg">{item.qty}</div>
                                                </div>
                                                <div className="text-right pl-2 md:pl-4 border-l border-petal-gray min-w-[60px]">
                                                    <div className="font-semibold text-burgundy-800 text-sm md:text-base">{item.price * item.qty} <span className="text-[10px] md:text-xs">EGP</span></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex justify-end mt-4 md:mt-6 text-lg md:text-xl font-bold text-ink border-t border-petal-gray pt-4">
                                        Total: <span className="text-burgundy-800 ml-2">{selectedOrder.totalPrice} EGP</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {selectedOrder && (
                <div className="hidden print:block w-full">
                    <InvoiceTicket order={selectedOrder} />
                </div>
            )}

        </div>
    );
}

export default AdminOrders;