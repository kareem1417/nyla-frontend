import React from 'react';
import { Heart, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWishlistStore } from '../../services/wishlistStore';
import { useCartStore } from '../../services/cartStore';
import toast from 'react-hot-toast';

function ProductCard({ product }) {
    const { toggleWishlist, isInWishlist } = useWishlistStore();
    const isSaved = isInWishlist(product._id);
    const addItem = useCartStore((state) => state.addItem);

    const handleQuickAdd = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const defaultVar = product.variants?.find(v => v.stock > 0) || product.variants?.[0] || {};
        if (defaultVar?.stock === 0) {
            toast.error('This product is out of stock!');
            return;
        }

        addItem({
            productId: product._id,
            variantId: defaultVar?.id || defaultVar?._id || 'default',
            productName: product.name,
            variantLabel: defaultVar?.value || 'Standard',
            imageUrl: product.imageUrl,
            unitPrice: defaultVar?.basePrice || product.basePrice,
            quantity: 1
        });

        toast.success('Added to cart!');
    };

    const handleWishlist = (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(product);

        // إشعار للمفضلة كمان للروقان
        if (isSaved) {
            toast('Removed from wishlist', { icon: '💔' });
        } else {
            toast.success('Added to wishlist!');
        }
    };

    return (
        <div className="group font-sans flex flex-col h-full cursor-pointer relative">

            {/* 1. مساحة الصورة والخلفية */}
            <div className="relative aspect-square sm:aspect-[4/5] bg-[#FDF9F6] rounded-[24px] overflow-hidden border border-petal-gray mb-4">

                <button
                    onClick={handleWishlist}
                    className="absolute top-4 right-4 z-20 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                >
                    <Heart size={18} className={`transition-colors ${isSaved ? 'fill-burgundy-800 text-burgundy-800' : 'text-stone hover:text-burgundy-800'}`} />
                </button>

                <Link to={`/product/${product._id}`} className="absolute inset-0 z-10 flex items-center justify-center p-8">
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                    />
                </Link>

                <button
                    onClick={handleQuickAdd}
                    className="absolute bottom-4 left-4 right-4 z-20 bg-white/95 backdrop-blur-sm text-ink text-sm font-semibold py-3.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 shadow-sm flex items-center justify-center gap-2 hover:bg-burgundy-800 hover:text-white"
                >
                    <ShoppingBag size={18} /> Quick Add
                </button>
            </div>

            {/* 2. مساحة النصوص */}
            <div className="flex flex-col flex-grow px-1 items-center text-center mt-1">
                <Link to={`/product/${product._id}`} className="text-lg font-medium text-ink hover:text-burgundy-800 transition-colors line-clamp-1 mb-1">
                    {product.name}
                </Link>
                <p className="text-stone text-sm mb-3">{product.category}</p>
                <span className="text-burgundy-800 font-semibold">{product.basePrice} EGP</span>
            </div>

        </div>
    );
}

export default ProductCard;