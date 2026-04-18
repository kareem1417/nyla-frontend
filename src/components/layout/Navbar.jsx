import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, User, Menu, X, LogOut, Heart } from 'lucide-react';

import { useCartStore } from '../../services/cartStore';
import { useAuthStore } from '../../services/authStore';
import { useWishlistStore } from '../../services/wishlistStore';

function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [keyword, setKeyword] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        if (keyword.trim()) {
            navigate(`/shop?search=${keyword}`);
            setIsSearchOpen(false);
            setKeyword('');
        }
    };

    const cartStore = useCartStore();
    const cartItems = cartStore.cartItems || cartStore.items || [];
    const toggleCart = cartStore.toggleCart;
    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    const wishlistItems = useWishlistStore((state) => state.wishlistItems) || [];
    const wishlistCount = wishlistItems.length;

    const { user, logout } = useAuthStore();

    const handleLogout = () => {
        logout();
        useWishlistStore.getState().clearWishlist();
        useCartStore.getState().clearCart();
        window.location.href = '/login';
    };

    return (
        <nav className="sticky top-0 w-full bg-white/95 backdrop-blur-md z-40 border-b border-petal-gray transition-all duration-300">
            <div className="w-full px-6 md:px-12 lg:px-16 xl:px-24">
                <div className="flex justify-between items-center h-20">

                    <div className="flex-1 md:flex-none lg:w-1/4">
                        <Link to="/" className="text-3xl font-display text-ink tracking-tight hover:text-burgundy-800 transition-colors">
                            NYLA
                        </Link>
                        <span className="text-sm font-medium text-stone hover:text-burgundy-800 transition-colors uppercase tracking-wider">Beta Version</span>
                    </div>

                    <div className="hidden md:flex flex-1 justify-center items-center gap-8 lg:gap-12">
                        <Link to="/" className="text-sm font-medium text-stone hover:text-burgundy-800 transition-colors uppercase tracking-wider">Home</Link>
                        <Link to="/shop" className="text-sm font-medium text-stone hover:text-burgundy-800 transition-colors uppercase tracking-wider">Shop</Link>
                        <Link to="/categories" className="text-sm font-medium text-stone hover:text-burgundy-800 transition-colors uppercase tracking-wider">Collections</Link>
                        <Link to="/about" className="text-sm font-medium text-stone hover:text-burgundy-800 transition-colors uppercase tracking-wider">About</Link>
                        <Link to="/contact" className="text-sm font-medium text-stone hover:text-burgundy-800 transition-colors uppercase tracking-wider">Contact</Link>
                    </div>

                    <div className="flex justify-end items-center gap-5 lg:gap-6 lg:w-1/4">

                        <div className="relative flex items-center">
                            {isSearchOpen ? (
                                <form onSubmit={handleSearch} className="flex items-center animate-fade-in absolute right-0 bg-white border border-petal-gray rounded-full px-4 py-1.5 shadow-sm w-[200px] md:w-[250px] z-50">
                                    <input
                                        type="text"
                                        autoFocus
                                        placeholder="Search..."
                                        className="w-full text-sm outline-none bg-transparent py-1 text-ink"
                                        value={keyword}
                                        onChange={(e) => setKeyword(e.target.value)}
                                    />
                                    <button type="button" onClick={() => setIsSearchOpen(false)} className="text-stone hover:text-burgundy-800 ml-2">
                                        <X size={18} />
                                    </button>
                                </form>
                            ) : (
                                <button onClick={() => setIsSearchOpen(true)} className="p-1 text-stone hover:text-burgundy-800 transition-colors">
                                    <Search size={20} />
                                </button>
                            )}
                        </div>

                        {user ? (
                            <div className="flex items-center gap-3">
                                <Link to="/profile" className="text-sm font-medium text-ink hover:text-burgundy-800 hidden lg:block">
                                    Hi, {user.name.split(' ')[0]}
                                </Link>
                                <button onClick={handleLogout} title="Logout" className="p-1 text-stone hover:text-burgundy-800 transition-colors flex items-center">
                                    <LogOut size={20} />
                                </button>
                            </div>
                        ) : (
                            <Link to="/login" title="Sign In" className="p-1 text-stone hover:text-burgundy-800 transition-colors hidden sm:block">
                                <User size={20} />
                            </Link>
                        )}

                        <Link to="/wishlist" className="p-1 text-stone hover:text-burgundy-800 transition-colors relative hidden sm:block">
                            <Heart size={20} />
                            {wishlistCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-burgundy-800 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                                    {wishlistCount}
                                </span>
                            )}
                        </Link>

                        <button onClick={toggleCart} className="p-1 text-stone hover:text-burgundy-800 transition-colors relative">
                            <ShoppingBag size={20} />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-burgundy-800 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                                    {cartCount}
                                </span>
                            )}
                        </button>

                        <button
                            className="md:hidden p-1 text-ink hover:text-burgundy-800 transition-colors ml-1"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X size={26} strokeWidth={1.5} /> : <Menu size={26} strokeWidth={1.5} />}
                        </button>
                    </div>
                </div>
            </div>

            <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-screen opacity-100 border-b border-petal-gray shadow-lg' : 'max-h-0 opacity-0'}`}>
                <div className="bg-white px-6 py-6 flex flex-col gap-6">
                    <div className="flex flex-col gap-4">
                        <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-xl text-ink font-display hover:text-burgundy-800">Home</Link>
                        <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)} className="text-xl text-ink font-display hover:text-burgundy-800">Shop</Link>
                        <Link to="/categories" onClick={() => setIsMobileMenuOpen(false)} className="text-xl text-ink font-display hover:text-burgundy-800">Collections</Link>
                        <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-xl text-ink font-display hover:text-burgundy-800">About</Link>
                        <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="text-xl text-ink font-display hover:text-burgundy-800">Contact</Link>
                    </div>

                    <div className="border-t border-petal-gray pt-6 flex flex-col gap-4">
                        {!user && (
                            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-base text-stone font-medium flex items-center gap-3 hover:text-burgundy-800">
                                <User size={20} /> Sign In / Register
                            </Link>
                        )}
                        <Link to="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="text-base text-stone font-medium flex items-center gap-3 hover:text-burgundy-800">
                            <Heart size={20} /> Wishlist
                            {wishlistCount > 0 && <span className="bg-burgundy-800 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{wishlistCount}</span>}
                        </Link>
                        {user && (
                            <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="text-base text-burgundy-800 font-medium flex items-center gap-3">
                                <User size={20} /> My Profile ({user.name.split(' ')[0]})
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;