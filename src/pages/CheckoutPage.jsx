import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Tag, X, CheckCircle2 } from 'lucide-react';
import { useCartStore } from '../services/cartStore';
import BASE_URL from '../../config';

function CheckoutPage() {
    const navigate = useNavigate();
    // 👈 ضفنا removeItem هنا من الـ Store
    const { cartItems, clearCart, cartTotal, shippingFee, fetchShippingFee, getFreeItemSaving, buyXGetCheapestFree, removeItem } = useCartStore();

    const [isLoading, setIsLoading] = useState(false);
    const [couponCodeInput, setCouponCodeInput] = useState('');
    const [isVerifyingCoupon, setIsVerifyingCoupon] = useState(false);
    const [appliedCoupon, setAppliedCoupon] = useState(null);

    const FREE_SHIPPING_THRESHOLD = 750;

    // Free item offer calculation
    const { saving: freeItemSaving, freeItemName } = getFreeItemSaving();
    const subtotalAfterFreeItem = cartTotal - freeItemSaving;

    const discountAmount = appliedCoupon ? (subtotalAfterFreeItem * appliedCoupon.discountPercentage) / 100 : 0;
    const subtotalAfterDiscount = subtotalAfterFreeItem - discountAmount;
    const effectiveShipping = subtotalAfterDiscount >= FREE_SHIPPING_THRESHOLD ? 0 : shippingFee;
    const finalTotal = subtotalAfterDiscount + effectiveShipping;

    // Find the cheapest item key to tag it
    let cheapestKey = null;
    if (buyXGetCheapestFree && cartItems.length >= 3) { // 👈 عدلت دي لـ 3 عشان تطابق لوجيك Buy 2 Get 1 Free
        let cheapestPrice = Infinity;
        for (const item of cartItems) {
            if (item.unitPrice < cheapestPrice) {
                cheapestPrice = item.unitPrice;
                cheapestKey = `${item.productId}-${item.variantId}`;
            }
        }
    }

    const [formData, setFormData] = useState({
        customerName: '', customerEmail: '', phone: '', address: '',
        governorate: 'Cairo', cityName: '', postalCode: ''
    });

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (userInfo) {
            setFormData((prev) => ({
                ...prev,
                customerName: userInfo.name || '',
                customerEmail: userInfo.email || ''
            }));
        }
        fetchShippingFee();
    }, [fetchShippingFee]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleApplyCoupon = async (e) => {
        e.preventDefault();
        if (!couponCodeInput.trim()) return;
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userInfo) return toast.error("You must be logged in to use a promo code! 🔒");

        setIsVerifyingCoupon(true);
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const { data } = await axios.post(`${BASE_URL}/api/coupons/verify`, { code: couponCodeInput }, config);
            setAppliedCoupon({ code: data.code, discountPercentage: data.discountPercentage });
            toast.success(data.message);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Invalid coupon code');
            setAppliedCoupon(null);
        } finally {
            setIsVerifyingCoupon(false);
        }
    };

    const removeCoupon = () => {
        setAppliedCoupon(null);
        setCouponCodeInput('');
        toast.success("Coupon removed");
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        if (!formData.customerName || !formData.customerEmail || !formData.phone || !formData.address || !formData.cityName) {
            return toast.error("Please fill in all required shipping details! 🛑");
        }
        if (cartItems.length === 0) return toast.error("Your cart is empty! 🛒");

        setIsLoading(true);
        try {
            const orderData = {
                customerName: formData.customerName,
                customerEmail: formData.customerEmail,
                shippingAddress: {
                    address: formData.address,
                    city: `${formData.governorate} - ${formData.cityName}`,
                    postalCode: formData.postalCode || '00000',
                    phone: formData.phone,
                },
                paymentMethod: 'Cash On Delivery',
                itemsPrice: cartTotal,
                shippingPrice: effectiveShipping,
                couponCode: appliedCoupon?.code || null,
                orderItems: cartItems.map((item) => ({
                    name: item.productName, qty: item.quantity, image: item.imageUrl || item.image,
                    price: item.unitPrice, variantId: item.variantId || 'default', product: item.productId,
                })),
            };

            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    ...(userInfo && { Authorization: `Bearer ${userInfo.token}` }),
                },
            };

            const { data } = await axios.post(`${BASE_URL}/api/orders`, orderData, config);
            toast.success('Order placed successfully! 🎉');
            clearCart();
            navigate('/order-success', { state: { order: data } });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to place order!');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
            <h1 className="text-4xl font-display text-ink mb-10 text-center">Checkout</h1>

            {/* لو السلة فاضية نطلعله رسالة يرجع يتسوق */}
            {cartItems.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-petal-gray">
                    <h2 className="text-2xl font-display text-ink mb-4">Your cart is empty! 🛒</h2>
                    <p className="text-stone mb-6">Looks like you haven't added any products yet.</p>
                    <button onClick={() => navigate('/shop')} className="bg-burgundy-800 text-white px-8 py-3 rounded-xl font-medium hover:bg-ink transition-colors">
                        Return to Shop
                    </button>
                </div>
            ) : (
                <div className="flex flex-col lg:flex-row gap-10">
                    <div className="lg:w-2/3 bg-white p-8 rounded-3xl shadow-sm border border-petal-gray">
                        <h2 className="text-2xl font-display text-ink mb-6">Shipping Details</h2>
                        <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div><label className="block text-sm font-medium text-ink mb-2">Full Name</label><input type="text" name="customerName" required value={formData.customerName} onChange={handleChange} className="w-full border border-petal-gray rounded-xl px-4 py-3 focus:outline-none focus:border-burgundy-800" /></div>
                                <div><label className="block text-sm font-medium text-ink mb-2">Email Address</label><input type="email" name="customerEmail" required value={formData.customerEmail} onChange={handleChange} className="w-full border border-petal-gray rounded-xl px-4 py-3 focus:outline-none focus:border-burgundy-800" /></div>
                            </div>
                            <div><label className="block text-sm font-medium text-ink mb-2">Phone Number</label><input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className="w-full border border-petal-gray rounded-xl px-4 py-3 focus:outline-none focus:border-burgundy-800" placeholder="01xxxxxxxxx" /></div>
                            <div><label className="block text-sm font-medium text-ink mb-2">Street Address</label><input type="text" name="address" required value={formData.address} onChange={handleChange} className="w-full border border-petal-gray rounded-xl px-4 py-3 focus:outline-none focus:border-burgundy-800" placeholder="e.g. 123 Street Name, Building 4, Apt 12" /></div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-ink mb-2">Governorate (المحافظة)</label>
                                    <select name="governorate" value={formData.governorate} onChange={handleChange} className="w-full border border-petal-gray rounded-xl px-4 py-3 focus:outline-none focus:border-burgundy-800 bg-white">
                                        <option value="Cairo">Cairo (القاهرة)</option>
                                        <option value="Giza">Giza (الجيزة)</option>
                                        <option value="Alexandria">Alexandria (الإسكندرية)</option>
                                        <option value="Others">Others</option>
                                    </select>
                                </div>
                                <div><label className="block text-sm font-medium text-ink mb-2">City / Area (المدينة/المنطقة)</label><input type="text" name="cityName" required value={formData.cityName} onChange={handleChange} className="w-full border border-petal-gray rounded-xl px-4 py-3 focus:outline-none focus:border-burgundy-800" placeholder="e.g. Nasr City" /></div>
                            </div>
                        </form>
                    </div>

                    <div className="lg:w-1/3">
                        <div className="bg-[#FAF8F6] p-8 rounded-3xl border border-petal-gray sticky top-24">
                            <h2 className="text-xl font-display text-ink mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
                                {cartItems.map((item, index) => {
                                    const itemKey = `${item.productId}-${item.variantId}`;
                                    const isFreeItem = itemKey === cheapestKey;
                                    return (
                                        <div key={index} className={`flex gap-3 items-center border-b pb-4 last:border-0 last:pb-0 ${isFreeItem ? 'border-green-200' : 'border-petal-gray/50'}`}>
                                            <div className="relative">
                                                <img src={item.imageUrl || item.image} alt={item.productName} className="w-16 h-16 object-cover rounded-xl bg-white" />
                                                {isFreeItem && (
                                                    <span className="absolute -top-1.5 -right-1.5 bg-green-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">FREE</span>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-sm font-medium text-ink line-clamp-1">{item.productName}</h4>
                                                {item.variantLabel && item.variantLabel !== 'Standard' && (<span className="text-xs text-stone block mt-1">Shade: {item.variantLabel}</span>)}
                                                <span className="text-xs text-stone mt-1 block">Qty: {item.quantity}</span>
                                            </div>

                                            {/* 🌟 تعديل السعر وإضافة زرار الحذف 🌟 */}
                                            <div className="flex items-center gap-3">
                                                <div className="font-semibold text-sm">
                                                    {isFreeItem ? (
                                                        <div className="text-right">
                                                            <span className="line-through text-stone text-xs block">{item.unitPrice} EGP</span>
                                                            <span className="text-green-600 font-bold">FREE</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-burgundy-800">{item.unitPrice * item.quantity} EGP</span>
                                                    )}
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeItem(item.productId, item.variantId)}
                                                    className="p-1.5 text-stone hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                                    title="Remove item"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="mb-6 pt-4 border-t border-petal-gray">
                                {!appliedCoupon ? (
                                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                                        <div className="relative flex-1">
                                            <Tag size={16} className="absolute left-3 top-3.5 text-stone" />
                                            <input type="text" placeholder="Promo Code" value={couponCodeInput} onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())} className="w-full pl-9 pr-4 py-3 bg-white border border-petal-gray rounded-xl focus:outline-none focus:border-burgundy-800 uppercase text-sm" />
                                        </div>
                                        <button type="submit" disabled={isVerifyingCoupon || !couponCodeInput} className="px-5 py-3 bg-ink text-white text-sm font-medium rounded-xl hover:bg-burgundy-800 transition-colors disabled:opacity-50">
                                            {isVerifyingCoupon ? 'Wait...' : 'Apply'}
                                        </button>
                                    </form>
                                ) : (
                                    <div className="flex items-center justify-between bg-green-50 border border-green-200 p-3 rounded-xl">
                                        <div className="flex items-center gap-2 text-green-700">
                                            <CheckCircle2 size={18} />
                                            <div className="text-sm font-medium">Code <span className="font-bold">{appliedCoupon.code}</span> applied! (-{appliedCoupon.discountPercentage}%)</div>
                                        </div>
                                        <button onClick={removeCoupon} className="text-stone hover:text-red-500 transition-colors p-1"><X size={16} /></button>
                                    </div>
                                )}
                            </div>

                            <div className="border-t border-petal-gray pt-4 space-y-3 mb-6">
                                <div className="flex justify-between text-stone text-sm">
                                    <span>Subtotal</span>
                                    <span className={appliedCoupon ? 'line-through text-petal-gray' : ''}>{cartTotal} EGP</span>
                                </div>

                                <div className="flex justify-between text-stone text-sm">
                                    <span>Shipping Fee</span>
                                    <span className={effectiveShipping === 0 ? 'text-green-600 font-semibold' : ''}>
                                        {effectiveShipping === 0 ? '🎉 FREE' : `+${effectiveShipping} EGP`}
                                    </span>
                                </div>
                                {effectiveShipping === 0 && (
                                    <p className="text-xs text-green-600 text-right">Free shipping applied! (order over {FREE_SHIPPING_THRESHOLD} EGP)</p>
                                )}
                                {effectiveShipping > 0 && (FREE_SHIPPING_THRESHOLD - subtotalAfterDiscount) <= 200 && (
                                    <p className="text-xs text-burgundy-800 text-right">Add {(FREE_SHIPPING_THRESHOLD - subtotalAfterDiscount).toFixed(0)} EGP more for free shipping!</p>
                                )}

                                {freeItemSaving > 0 && (
                                    <div className="flex justify-between text-green-600 text-sm font-medium">
                                        <span>🎁 Free Item ({freeItemName})</span>
                                        <span>-{freeItemSaving} EGP</span>
                                    </div>
                                )}

                                {appliedCoupon && (
                                    <div className="flex justify-between text-green-600 text-sm font-medium">
                                        <span>Discount (-{appliedCoupon.discountPercentage}%)</span>
                                        <span>-{discountAmount.toFixed(2)} EGP</span>
                                    </div>
                                )}

                                <div className="flex justify-between text-ink text-lg font-bold border-t border-petal-gray pt-3">
                                    <span>Total</span>
                                    <span className="text-burgundy-800">{finalTotal.toFixed(2)} EGP</span>
                                </div>
                            </div>

                            <button form="checkout-form" type="submit" disabled={isLoading || cartItems.length === 0} className="w-full bg-burgundy-800 text-white py-4 rounded-xl font-medium text-lg hover:bg-ink transition-colors shadow-md disabled:opacity-50">
                                {isLoading ? 'Processing...' : `Place Order • ${finalTotal.toFixed(2)} EGP`}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CheckoutPage;