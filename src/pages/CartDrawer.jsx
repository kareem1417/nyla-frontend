import React, { useEffect } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, Gift } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../services/cartStore';

function CartDrawer() {
    const navigate = useNavigate();

    const { isOpen, toggleCart, cartItems, removeItem, updateQuantity, cartTotal, buyXGetCheapestFree, fetchShippingFee, getFreeItemSaving } = useCartStore();

    useEffect(() => {
        if (isOpen) fetchShippingFee();
    }, [isOpen, fetchShippingFee]);

    if (!isOpen) return null;

    const { saving: freeItemSaving, freeItemName } = getFreeItemSaving();
    const displaySubtotal = cartTotal - freeItemSaving;

    const handleCheckout = () => {
        toggleCart();
        navigate('/checkout');
    };

    // Find the cheapest item's productId+variantId to mark it
    let cheapestKey = null;
    if (buyXGetCheapestFree && cartItems.length >= 4) {
        let cheapestPrice = Infinity;
        for (const item of cartItems) {
            if (item.unitPrice < cheapestPrice) {
                cheapestPrice = item.unitPrice;
                cheapestKey = `${item.productId}-${item.variantId}`;
            }
        }
    }

    return (
        <>
            <div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity"
                onClick={toggleCart}
            />

            <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col font-sans animate-slide-in-right border-l border-petal-gray">

                <div className="flex items-center justify-between px-6 py-5 border-b border-petal-gray">
                    <h2 className="text-2xl font-display text-ink flex items-center gap-2">
                        <ShoppingBag size={24} /> Your Cart
                    </h2>
                    <button onClick={toggleCart} className="text-stone hover:text-burgundy-800 transition-colors p-2 bg-linen rounded-full">
                        <X size={20} />
                    </button>
                </div>

                {/* 🎁 Free Item Offer Banner */}
                {buyXGetCheapestFree && (
                    <div className="mx-6 mt-4 flex items-center gap-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl px-4 py-3">
                        <div className="bg-green-500 text-white p-1.5 rounded-full shrink-0">
                            <Gift size={16} />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-green-800">Buy 3 Get 1 FREE!</p>
                            <p className="text-xs text-green-600">Add 4+ items to get one free</p>
                        </div>
                    </div>
                )}

                <div className="flex-1 overflow-y-auto p-6">
                    {cartItems.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-70">
                            <ShoppingBag size={48} className="text-stone" />
                            <p className="text-lg text-stone font-medium">Your cart is currently empty.</p>
                            <button onClick={toggleCart} className="btn-secondary mt-4">Continue Shopping</button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {cartItems.map((item) => {
                                const itemKey = `${item.productId}-${item.variantId}`;
                                const isFreeItem = itemKey === cheapestKey;

                                return (
                                    <div key={itemKey} className={`flex gap-4 p-4 rounded-2xl border relative group ${isFreeItem ? 'bg-green-50 border-green-200' : 'bg-[#FAF8F6] border-petal-gray/50'}`}>

                                        <div className="w-20 h-20 bg-white rounded-xl border border-petal-gray flex items-center justify-center p-2 shrink-0 relative">
                                            <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-contain mix-blend-multiply" />
                                            {isFreeItem && (
                                                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm animate-pulse">
                                                    FREE
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex-1">
                                            <h3 className="text-sm font-semibold text-ink line-clamp-1 pr-6">{item.productName}</h3>
                                            <p className="text-xs text-stone mt-0.5">Variant: {item.variantLabel}</p>
                                            <div className="mt-2 flex items-center gap-2">
                                                {isFreeItem ? (
                                                    <>
                                                        <span className="text-stone line-through text-sm">{item.unitPrice} EGP</span>
                                                        <span className="text-green-600 font-bold text-sm">FREE 🎁</span>
                                                    </>
                                                ) : (
                                                    <span className="text-burgundy-800 font-bold">{item.unitPrice * item.quantity} EGP</span>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-3 mt-3">
                                                <div className="flex items-center gap-1 border border-petal-gray rounded-full px-1 bg-white">
                                                    <button onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)} className="p-1 hover:text-burgundy-800 text-stone"><Minus size={14} /></button>
                                                    <span className="text-sm font-semibold w-6 text-center">{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)} className="p-1 hover:text-burgundy-800 text-stone"><Plus size={14} /></button>
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => removeItem(item.productId, item.variantId)}
                                            className="absolute top-4 right-4 text-stone hover:text-red-500 transition-colors bg-white p-1.5 rounded-full shadow-sm"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {cartItems.length > 0 && (
                    <div className="border-t border-petal-gray p-6 bg-[#FAF8F6] space-y-4">
                        {freeItemSaving > 0 && (
                            <div className="flex justify-between items-center text-green-600 text-sm font-medium">
                                <span>🎁 Free Item ({freeItemName})</span>
                                <span>-{freeItemSaving} EGP</span>
                            </div>
                        )}
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-stone font-medium">Subtotal</span>
                            <span className="text-2xl font-display text-ink">{displaySubtotal} EGP</span>
                        </div>
                        <p className="text-xs text-stone mb-4 text-center">Shipping & taxes calculated at checkout.</p>
                        <button
                            onClick={handleCheckout}
                            className="w-full btn-primary py-4 text-lg"
                        >
                            Checkout Now
                        </button>
                    </div>
                )}

            </div>
        </>
    );
}

export default CartDrawer;