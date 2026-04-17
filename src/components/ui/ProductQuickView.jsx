import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Heart, ShoppingCart, Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';

function ProductQuickView({ product, onClose }) {
    const defaultVariant = product.variants.find(v => v.stock > 0) || product.variants[0];
    const [selectedVariant, setSelectedVariant] = useState(defaultVariant);
    const [quantity, setQuantity] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(false);

    const addItem = useCartStore((state) => state.addItem);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'auto'; };
    }, []);

    if (!product) return null;

    const updateQuantity = (newQty) => {
        if (newQty >= 1 && newQty <= selectedVariant.stock) setQuantity(newQty);
    };

    const handleAddToCart = () => {
        addItem({
            productId: product._id,
            variantId: selectedVariant.id,
            productName: product.name,
            variantLabel: selectedVariant.value || 'Standard',
            imageUrl: product.imageUrl,
            unitPrice: selectedVariant.basePrice || product.basePrice,
            quantity: quantity
        });
        onClose();
    };

    const modalContent = (
        <div
            className="fixed inset-0 bg-ink/70 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] shadow-2xl overflow-hidden relative flex flex-col md:flex-row"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 rounded-full bg-linen hover:bg-petal-gray text-charcoal transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="w-full md:w-1/2 bg-linen flex items-center justify-center p-8 relative">
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-auto max-h-[300px] md:max-h-full object-cover mix-blend-multiply"
                    />
                    {selectedVariant.stock === 0 && (
                        <div className="absolute top-4 left-4 bg-burgundy-800 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                            Out of Stock
                        </div>
                    )}
                </div>

                <div className="w-full md:w-1/2 p-8 flex flex-col justify-center overflow-y-auto">
                    <p className="text-xs text-stone uppercase tracking-widest mb-2">{product.category}</p>
                    <h2 className="text-3xl font-display text-ink mb-2">{product.name}</h2>
                    <p className="text-burgundy-800 text-2xl font-semibold mb-6">
                        {selectedVariant.basePrice || product.basePrice} EGP
                    </p>

                    <p className="text-stone text-sm mb-6 line-clamp-3">
                        {product.description}
                    </p>

                    {product.variants.length > 1 && (
                        <div className="mb-6">
                            <p className="text-sm font-medium text-ink mb-3">Shade:</p>
                            <div className="flex flex-wrap gap-2">
                                {product.variants.map((v) => (
                                    <button
                                        key={v.id}
                                        onClick={() => v.stock > 0 && (setSelectedVariant(v), setQuantity(1))}
                                        className={`w-8 h-8 rounded-full border-2 transition-all ${selectedVariant.id === v.id ? 'border-burgundy-800 scale-110 shadow-md' : 'border-transparent'
                                            } ${v.stock === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:scale-110'}`}
                                    >
                                        <span
                                            className="block w-full h-full rounded-full border border-stone-200"
                                            style={{ backgroundColor: v.shadeColor || '#C8C2BE' }}
                                        ></span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex items-center gap-4 mb-8">
                        <div className="flex items-center gap-2 border border-petal-gray rounded-lg p-1">
                            <button onClick={() => updateQuantity(quantity - 1)} className="p-1 text-stone hover:text-ink disabled:opacity-50" disabled={quantity <= 1 || selectedVariant.stock === 0}><Minus size={16} /></button>
                            <span className="w-8 text-center font-medium">{quantity}</span>
                            <button onClick={() => updateQuantity(quantity + 1)} className="p-1 text-stone hover:text-ink disabled:opacity-50" disabled={quantity >= selectedVariant.stock || selectedVariant.stock === 0}><Plus size={16} /></button>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            className="btn-primary flex-1 flex items-center justify-center gap-2 h-10"
                            disabled={selectedVariant.stock === 0}
                        >
                            <ShoppingCart size={18} />
                            {selectedVariant.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </button>

                        <button onClick={() => setIsWishlisted(!isWishlisted)} className="p-2 border border-petal-gray rounded-lg hover:border-burgundy-800 transition-colors">
                            <Heart size={20} className={isWishlisted ? 'fill-burgundy-800 text-burgundy-800' : 'text-stone'} />
                        </button>
                    </div>

                    <div className="mt-auto pt-4 border-t border-petal-gray text-center">
                        <Link
                            to={`/product/${product._id}`}
                            onClick={onClose}
                            className="text-burgundy-800 hover:text-burgundy-600 font-medium text-sm inline-flex items-center gap-1 group"
                        >
                            View Full Product Details <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}

export default ProductQuickView;