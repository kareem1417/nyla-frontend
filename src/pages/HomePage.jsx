import React from 'react';
import { Link } from 'react-router-dom';
import { Gift, ShoppingBag, Percent } from 'lucide-react'; // ضفنا أيقونة Percent للخصم الترحيبي
import ProductCard from '../components/ui/ProductCard';
import { useProductStore } from '../services/productStore';

function HomePage() {
    const { products, isLoading, error } = useProductStore();

    const bestSellers = products.filter(prod => prod.isBestSeller).slice(0, 4);

    return (
        <div className="animate-fade-in space-y-20 md:space-y-28"> {/* ضفت مسافات بين السيكشنز بشكل عام */}

            {/* Hero Section */}
            <section
                className="relative pt-28 pb-32 px-6 md:pt-32 md:pb-40 md:px-16 lg:px-24 overflow-hidden bg-cover bg-[80%_center] md:bg-center bg-no-repeat flex items-center min-h-[550px] md:min-h-[700px]"
                style={{
                    backgroundImage: `linear-gradient(rgba(250, 248, 246, 0), rgba(128, 0, 32, 0.56)), url('./cover.jpg')`
                }}
            >
                <div className="absolute inset-0 bg-[#FAF8F6]/60 backdrop-blur-[2px] md:hidden"></div>

                <div className="absolute inset-0 bg-gradient-to-r from-[#FAF8F6]/95 via-[#FAF8F6]/60 to-transparent hidden md:block md:w-3/4"></div>

                <div className="relative z-10 max-w-2xl text-center md:text-left mx-auto md:mx-0 mt-8 md:mt-0">
                    <h1 className="text-5xl md:text-7xl lg:text-8xl mb-6 text-ink tracking-tight drop-shadow-sm">
                        Discover Your <br /> <span className="italic text-burgundy-800">Natural Beauty.</span>
                    </h1>
                    <p className="text-stone text-lg md:text-xl font-sans mb-10 leading-relaxed max-w-lg mx-auto md:mx-0">
                        Elevate your daily routine with our handcrafted, cruelty-free lip care collection.
                    </p>
                    <Link to="/shop" className="bg-burgundy-800 text-white px-10 py-4 rounded-full text-base font-medium hover:bg-ink transition-colors shadow-lg inline-block active:scale-95">
                        Shop Collection
                    </Link>
                </div>
            </section>

            {/* Marquee Banner */}
            <div className="bg-burgundy-800 text-white py-3 overflow-hidden flex whitespace-nowrap -mt-20"> {/* قللت الـ margin هنا */}
                <div className="animate-marquee inline-block font-sans text-sm tracking-widest uppercase">
                    <span className="mx-8">✨ 100% Natural Ingredients</span>
                    <span className="mx-8">✨ Cruelty Free</span>
                    <span className="mx-8">✨ Handcrafted in Egypt</span>
                    {/* تعديل الرقم هنا */}
                    <span className="mx-8">✨ Free Shipping on orders over 750 EGP</span>
                    <span className="mx-8">✨ Beta Version </span>
                </div>
            </div>

            {/* 🌟 New Multi-Promo Grid Section (Three Unified Cards) 🌟 */}
            <section className="max-w-7xl mx-auto px-6 lg:px-8">
                {/* تعديل الـ grid ليكون 3 أعمدة على الشاشات الكبيرة */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">

                    {/* Card 1: Free Shipping (Unified Look) */}
                    <div className="bg-linen/50 border border-petal-gray rounded-3xl p-8 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300">
                        {/* الخلفية الديزاين */}
                        <div className="absolute -right-12 -top-12 w-40 h-40 bg-burgundy-800/5 rounded-full blur-2xl group-hover:bg-burgundy-800/10 transition-colors"></div>

                        <div className="flex flex-col sm:flex-row items-start gap-6 relative z-10 mb-8">
                            <div className="bg-burgundy-800 text-white p-4 rounded-xl shadow-mdshrink-0"> {/* عكسنا الألوان هنا لتتوحد مع الباقي */}
                                <ShoppingBag size={28} />
                            </div>
                            <div className="flex-1 space-y-2">
                                <h3 className="text-2xl font-display text-ink mb-1">Standard Free Shipping</h3>
                                <p className="text-stone text-sm leading-relaxed">
                                    No code needed! Enjoy <span className="font-semibold text-burgundy-800">FREE SHIPPING</span> automatically applied at checkout when your cart total reaches <span className="font-semibold text-ink">750 EGP</span>.
                                </p>
                            </div>
                        </div>

                        <div className="relative z-10 flex justify-center sm:justify-start">
                            <span className="text-xl font-sans font-bold text-ink bg-white/70 px-5 py-2 rounded-full border border-petal-gray shadow-inner">Orders &gt; 750 EGP</span>
                        </div>
                    </div>

                    {/* Card 2: Buy 3 Get 1 Free (Unified White Look) */}
                    <div className="bg-linen/50 border border-petal-gray rounded-3xl p-8 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300">
                        {/* الخلفية الديزاين */}
                        <div className="absolute -right-12 -top-12 w-40 h-40 bg-burgundy-800/5 rounded-full blur-2xl group-hover:bg-burgundy-800/10 transition-colors"></div>

                        <div className="flex flex-col sm:flex-row items-start gap-6 relative z-10 mb-8">
                            <div className="bg-burgundy-800 text-white p-4 rounded-xl shadow-md shrink-0"> {/* الألوان الجديدة للأيقونة */}
                                <Gift size={28} className="animate-bounce" />
                            </div>
                            <div className="flex-1 space-y-2">
                                <span className="inline-block bg-burgundy-50 text-burgundy-800 text-xs font-sans font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-1 border border-burgundy-100">Mix & Match</span>
                                <h3 className="text-2xl font-display text-ink mb-1">Buy 3, Get 1 <span className="italic text-burgundy-800 font-medium">FREE!</span></h3>
                                <p className="text-stone text-sm leading-relaxed">
                                    Add any <span className="font-semibold text-ink">4 items</span> to your cart, and we'll automatically deduct the price of the cheapest one at checkout. 🎉
                                </p>
                            </div>
                        </div>

                        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-petal-gray/50 pt-6">
                            <span className="text-xs text-stone font-sans italic">* Discount applied in cart.</span>
                            <Link
                                to="/shop"
                                className="bg-burgundy-800 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-ink transition-colors text-center text-sm active:scale-95 shadow-md"
                            >
                                Shop Offer
                            </Link>
                        </div>
                    </div>

                    {/* 🌟 New Card 3: Welcome Discount (Unified Look) 🌟 */}
                    <div className="bg-linen/50 border border-petal-gray rounded-3xl p-8 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300 md:col-span-2 lg:col-span-1"> {/* جعلناه يأخذ عمودين على الشاشات المتوسطة ليتناسق */}
                        {/* الخلفية الديزاين */}
                        <div className="absolute -right-12 -top-12 w-40 h-40 bg-burgundy-800/5 rounded-full blur-2xl group-hover:bg-burgundy-800/10 transition-colors"></div>

                        <div className="flex flex-col sm:flex-row items-start gap-6 relative z-10 mb-8">
                            <div className="bg-burgundy-800 text-white p-4 rounded-xl shadow-md shrink-0">
                                <Percent size={28} />
                            </div>
                            <div className="flex-1 space-y-2">
                                <span className="inline-block bg-burgundy-50 text-burgundy-800 text-xs font-sans font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-1 border border-burgundy-100">New Members</span>
                                <h3 className="text-2xl font-display text-ink mb-1">Welcome Gift: <span className="text-burgundy-800 font-medium">5% OFF</span></h3>
                                <p className="text-stone text-sm leading-relaxed">
                                    First time at NYLA? <span className="font-semibold text-ink">Sign up</span> today and receive an exclusive 5% promo code for your very first handcrafted beauty order! 🌸
                                </p>
                            </div>
                        </div>

                        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-petal-gray/50 pt-6">
                            <span className="text-xs text-stone font-sans italic">* Valid on first order only.</span>
                            <Link
                                to="/login"
                                className="bg-burgundy-800 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-ink transition-colors text-center text-sm active:scale-95 shadow-md animate-pulse hover:animate-none" /* حركة Pulse لجذب الانتباه */
                            >
                                Sign Up & Get Code
                            </Link>
                        </div>
                    </div>

                </div>
            </section>

            {/* Best Sellers Section */}
            <section className="max-w-7xl mx-auto px-6 lg:px-8 py-0 text-center"> {/* قللت الـ padding هنا */}
                <div className="flex justify-between items-end mb-16 border-b border-petal-gray pb-4">
                    <h2 className="text-4xl text-left font-display text-ink">Best Sellers</h2>
                    <Link to="/shop" className="text-sm font-medium font-sans hover:text-burgundy-800 transition-colors">View All →</Link>
                </div>

                {isLoading ? (
                    <div className="py-20 text-stone text-xl animate-pulse">Loading amazing products...</div>
                ) : error ? (
                    <div className="py-20 text-red-500 text-xl">{error}</div>
                ) : bestSellers.length === 0 ? (
                    <div className="py-20 text-stone text-xl">No best sellers marked yet. Check back soon!</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 overflow-x-hidden p-2">
                        {bestSellers.map((prod) => (
                            <ProductCard key={prod._id} product={prod} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

export default HomePage;