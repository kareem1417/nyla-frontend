import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, ShoppingBag, Printer } from 'lucide-react';
import InvoiceTicket from '../components/InvoiceTicket'; 

function OrderSuccessPage() {
    const location = useLocation();
    const order = location.state?.order;

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 py-12 animate-fade-in print:py-0">

            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-petal-gray max-w-lg w-full text-center print:hidden">

                <div className="flex justify-center mb-6">
                    <div className="bg-green-100 p-4 rounded-full">
                        <CheckCircle className="text-green-500 w-16 h-16" />
                    </div>
                </div>

                <h1 className="text-3xl md:text-4xl font-display text-ink mb-4">
                    Order Received! 🎉
                </h1>

                <p className="text-stone mb-8 leading-relaxed">
                    Thank you for your purchase. We are preparing your order with love and will contact you shortly to confirm delivery details.
                </p>

                <div className="bg-[#FAF8F6] p-4 rounded-xl border border-petal-gray mb-8">
                    <p className="text-sm text-ink font-medium">
                        Payment Method: <span className="text-burgundy-800">Cash on Delivery (COD)</span>
                    </p>
                    {order && (
                        <p className="text-sm text-stone mt-2">
                            Order ID: #{order._id.substring(18)}
                        </p>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    {order && (
                        <button
                            onClick={handlePrint}
                            className="flex-1 inline-flex items-center justify-center gap-2 bg-[#FAF8F6] border border-petal-gray text-ink py-4 rounded-xl font-medium hover:border-burgundy-800 transition-colors"
                        >
                            <Printer size={20} />
                            Print Invoice
                        </button>
                    )}

                    <Link
                        to="/shop"
                        className="flex-1 inline-flex items-center justify-center gap-2 bg-burgundy-800 text-white py-4 rounded-xl font-medium hover:bg-ink transition-colors shadow-md"
                    >
                        <ShoppingBag size={20} />
                        Keep Shopping
                    </Link>
                </div>
            </div>

            {order && (
                <div className="mt-12 w-full max-w-2xl print:mt-0 print:block">
                    <div className="print:hidden text-center mb-4 text-stone text-sm font-medium uppercase tracking-widest border-b border-petal-gray pb-2 inline-block">
                        Invoice Preview
                    </div>
                    <InvoiceTicket order={order} />
                </div>
            )}

        </div>
    );
}

export default OrderSuccessPage;