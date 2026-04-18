import React from 'react';
import { Leaf, ShieldCheck, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

function AboutPage() {
    return (
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 font-sans">

            <header className="text-center mb-20">
                <h1 className="text-5xl md:text-6xl font-display text-ink mb-6">Our Story</h1>
                <p className="text-stone max-w-2xl mx-auto text-lg leading-relaxed">
                    Welcome to NYLA, where nature meets beauty. We believe that what you put on your body is just as important as what you put in it.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
                <div className="aspect-[4/5]">
                    <img
                        src="./ab.png"
                        alt="Natural Ingredients"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="space-y-6">
                    <h2 className="text-3xl md:text-4xl font-display text-ink">Handcrafted with Love</h2>
                    <p className="text-stone leading-relaxed">
                        Started with a simple vision, NYLA was born out of a desire for truly clean, effective, and luxurious lip care. Every balm, gloss, and scrub is meticulously formulated using ethically sourced, natural ingredients.
                    </p>
                    <p className="text-stone leading-relaxed">
                        We don't believe in compromises. You shouldn't have to choose between high-performance cosmetics and safe, healthy ingredients. Our mission is to elevate your daily routine with products you can trust.
                    </p>
                    <div className="pt-4">
                        <Link to="/shop" className="btn-secondary inline-block">Explore Our Products</Link>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
                <div className="bg-white p-8 rounded-2xl border border-petal-gray shadow-sm flex flex-col items-center hover:shadow-md transition-shadow">
                    <div className="w-14 h-14 bg-burgundy-50 text-burgundy-800 rounded-full flex items-center justify-center mb-6">
                        <Leaf size={28} />
                    </div>
                    <h3 className="text-xl font-medium text-ink mb-3">100% Natural</h3>
                    <p className="text-stone text-sm">No parabens, no sulfates, and no artificial fragrances. Just pure, earth-born goodness.</p>
                </div>
                <div className="bg-white p-8 rounded-2xl border border-petal-gray shadow-sm flex flex-col items-center hover:shadow-md transition-shadow">
                    <div className="w-14 h-14 bg-burgundy-50 text-burgundy-800 rounded-full flex items-center justify-center mb-6">
                        <Heart size={28} />
                    </div>
                    <h3 className="text-xl font-medium text-ink mb-3">Cruelty-Free</h3>
                    <p className="text-stone text-sm">We love animals. Our products are rigorously tested on willing humans, never on our furry friends.</p>
                </div>
                <div className="bg-white p-8 rounded-2xl border border-petal-gray shadow-sm flex flex-col items-center hover:shadow-md transition-shadow">
                    <div className="w-14 h-14 bg-burgundy-50 text-burgundy-800 rounded-full flex items-center justify-center mb-6">
                        <ShieldCheck size={28} />
                    </div>
                    <h3 className="text-xl font-medium text-ink mb-3">Quality Assured</h3>
                    <p className="text-stone text-sm">Handcrafted in small batches to ensure the highest level of quality and freshness in every jar.</p>
                </div>
            </div>

        </div>
    );
}

export default AboutPage;