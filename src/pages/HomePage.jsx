import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ui/ProductCard';
import { useProductStore } from '../services/productStore';

function HomePage() {
    const { products, isLoading, error } = useProductStore();

    const bestSellers = products.filter(prod => prod.isBestSeller).slice(0, 4);

    return (
        <div className="animate-fade-in">

            <section
                className="relative pt-28 pb-32 px-6 md:pt-32 md:pb-40 md:px-16 lg:px-24 overflow-hidden bg-cover bg-[80%_center] md:bg-center bg-no-repeat flex items-center min-h-[550px] md:min-h-[700px]"
                style={{
                    backgroundImage: `linear-gradient(rgba(250, 248, 246, 0), rgba(128, 0, 32, 0.56)), url('../public/cover.jpg')`
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

            <div className="bg-burgundy-800 text-white py-3 overflow-hidden flex whitespace-nowrap">
                <div className="animate-marquee inline-block font-sans text-sm tracking-widest uppercase">
                    <span className="mx-8">✨ 100% Natural Ingredients</span>
                    <span className="mx-8">✨ Cruelty Free</span>
                    <span className="mx-8">✨ Handcrafted in Egypt</span>
                    <span className="mx-8">✨ Free Shipping on orders over 1000 EGP</span>
                </div>
            </div>

            <section className="max-w-7xl mx-auto px-6 lg:px-8 py-24 text-center">
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
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