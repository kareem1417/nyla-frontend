import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../services/cartStore';

function CartDrawer() {
    const navigate = useNavigate();

    const { isOpen, toggleCart, cartItems, removeItem, updateQuantity, cartTotal } = useCartStore();

    if (!isOpen) return null;

    const handleCheckout = () => {
        toggleCart();
        navigate('/checkout');
    };

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

                <div className="flex-1 overflow-y-auto p-6">
                    {cartItems.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-70">
                            <ShoppingBag size={48} className="text-stone" />
                            <p className="text-lg text-stone font-medium">Your cart is currently empty.</p>
                            <button onClick={toggleCart} className="btn-secondary mt-4">Continue Shopping</button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {cartItems.map((item) => (
                                <div key={`${item.productId}-${item.variantId}`} className="flex gap-4 bg-[#FAF8F6] p-4 rounded-2xl border border-petal-gray/50 relative group">

                                    <div className="w-20 h-20 bg-white rounded-xl border border-petal-gray flex items-center justify-center p-2 shrink-0">
                                        <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-contain mix-blend-multiply" />
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="text-sm font-semibold text-ink line-clamp-1 pr-6">{item.productName}</h3>
                                        <p className="text-xs text-stone mt-0.5">Variant: {item.variantLabel}</p>
                                        <p className="text-burgundy-800 font-bold mt-2">{item.unitPrice} EGP</p>

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
                            ))}
                        </div>
                    )}
                </div>

                {cartItems.length > 0 && (
                    <div className="border-t border-petal-gray p-6 bg-[#FAF8F6] space-y-4">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-stone font-medium">Subtotal</span>
                            <span className="text-2xl font-display text-ink">{cartTotal} EGP</span>
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