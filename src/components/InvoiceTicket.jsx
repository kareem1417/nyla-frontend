import React from 'react';

const InvoiceTicket = ({ order }) => {
    if (!order) return null;

    return (
        <div id="invoice-print" className="bg-white p-8 max-w-2xl mx-auto border border-petal-gray font-sans text-ink">
            <div className="flex justify-between items-start border-b-2 border-ink pb-6 mb-8">
                <div>
                    <h1 className="text-4xl font-display tracking-tight text-ink">NYLA.</h1>
                    <p className="text-xs text-stone mt-1">Natural Handcrafted Cosmetics</p>
                </div>
                <div className="text-right text-sm">
                    <p className="font-bold uppercase">Invoice</p>
                    <p className="text-stone">#{order._id.substring(18)}</p>
                    <p className="text-stone">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-10 text-sm">
                <div>
                    <p className="text-xs text-stone uppercase font-bold mb-2">Billed To:</p>
                    <p className="font-medium">{order.customerName}</p>
                    <p className="text-stone">{order.customerEmail}</p>
                    <p className="text-stone">{order.shippingAddress.phone}</p>
                </div>
                <div>
                    <p className="text-xs text-stone uppercase font-bold mb-2">Shipping Address:</p>
                    <p className="text-stone">{order.shippingAddress.address}</p>
                    <p className="text-stone">{order.shippingAddress.city}</p>
                </div>
            </div>

            <table className="w-full mb-8 text-sm">
                <thead>
                    <tr className="border-b border-petal-gray text-left">
                        <th className="py-3 font-bold">Product</th>
                        <th className="py-3 font-bold text-center">Qty</th>
                        <th className="py-3 font-bold text-right">Price</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-petal-gray">
                    {order.orderItems.map((item, index) => (
                        <tr key={index}>
                            <td className="py-4">{item.name}</td>
                            <td className="py-4 text-center">{item.qty}</td>
                            <td className="py-4 text-right">{item.price} EGP</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Totals */}
            <div className="flex justify-end">
                <div className="w-64 space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-stone">Subtotal:</span>
                        <span>{order.itemsPrice} EGP</span>
                    </div>
                    {order.discountAmount > 0 && (
                        <div className="flex justify-between text-sm text-green-600">
                            <span>Discount ({order.couponCodeUsed}):</span>
                            <span>-{order.discountAmount} EGP</span>
                        </div>
                    )}
                    <div className="flex justify-between text-sm">
                        <span className="text-stone">Shipping:</span>
                        <span>{order.shippingPrice} EGP</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t border-ink pt-3">
                        <span>Total:</span>
                        <span className="text-burgundy-800">{order.totalPrice} EGP</span>
                    </div>
                </div>
            </div>

            <div className="mt-16 text-center text-[10px] text-stone uppercase tracking-widest border-t border-petal-gray pt-6">
                Thank you for choosing NYLA. Stay Natural.
            </div>
        </div>
    );
};

export default InvoiceTicket;