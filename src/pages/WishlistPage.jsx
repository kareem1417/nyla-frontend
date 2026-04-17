import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useWishlistStore } from '../services/wishlistStore';
import ProductCard from '../components/ui/ProductCard';

function WishlistPage() {
    const { wishlistItems } = useWishlistStore();

    return (
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 md:py-20 font-sans">
            <h1 className="text-4xl md:text-5xl font-display text-ink mb-2">My Wishlist</h1>
            <p className="text-stone mb-10">Products you've saved for later.</p>

            {/* لو المفضلة فاضية */}
            {wishlistItems.length === 0 ? (
                <div className="bg-[#FAF8F6] border border-petal-gray rounded-[24px] p-12 text-center flex flex-col items-center justify-center">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-petal-gray">
                        <Heart size={32} className="text-stone" />
                    </div>
                    <h2 className="text-2xl font-display text-ink mb-3">Your wishlist is empty</h2>
                    <p className="text-stone max-w-md mx-auto mb-8">Save your favorite items here to easily find them later.</p>
                    <Link to="/shop" className="btn-primary">Discover Products</Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                    {wishlistItems.map((prod) => (
                        <ProductCard key={prod._id} product={prod} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default WishlistPage;