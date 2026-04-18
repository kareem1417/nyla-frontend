import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function CategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await axios.get('https://nyla-backend.onrender.com/api/categories');
                setCategories(data);
            } catch (err) {
                setError('Failed to load collections. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategories();
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 animate-fade-in">
            <header className="mb-16 text-center">
                <h1 className="text-5xl md:text-6xl mb-4 font-display text-ink">Our Collections</h1>
                <p className="text-stone max-w-xl mx-auto text-lg font-sans">
                    Explore our range of natural cosmetics handcrafted with care.
                </p>
            </header>

            {isLoading ? (
                <div className="text-center py-20 text-stone text-xl animate-pulse">Loading amazing collections... ✨</div>
            ) : error ? (
                <div className="text-center py-20 text-red-500 text-xl">{error}</div>
            ) : categories.length === 0 ? (
                <div className="text-center py-20 text-stone text-xl">No collections available yet. Check back soon!</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {categories.map((cat) => (
                        <Link to={`/shop?category=${cat.name}`} key={cat._id} className="block h-full group">
                            <div className="card-product group flex items-center p-8 transition-all h-full cursor-pointer hover:border-burgundy-200 hover:shadow-sm">

                                <div className="w-24 h-24 md:w-32 md:h-32 bg-[#FAF8F6] rounded-2xl flex items-center justify-center text-4xl md:text-5xl font-display text-burgundy-800 group-hover:bg-burgundy-50 transition-colors mr-6 md:mr-8 shrink-0 border border-petal-gray/50 overflow-hidden">
                                    {cat.imageUrl ? (
                                        <img
                                            src={cat.imageUrl}
                                            alt={cat.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        cat.name.charAt(0).toUpperCase()
                                    )}
                                </div>

                                <div className="flex-1">
                                    <h3 className="font-display text-2xl md:text-3xl mb-2 text-ink group-hover:text-burgundy-800 transition-colors">
                                        {cat.name}
                                    </h3>
                                    <p className="font-sans text-stone text-sm mb-4 leading-relaxed line-clamp-3">
                                        {cat.description || `Discover our exclusive ${cat.name.toLowerCase()} collection, crafted for your daily natural glow.`}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}

                    <div className="h-full">
                        <div className="card-product flex items-center p-8 transition-all h-full opacity-60 cursor-not-allowed border-dashed">
                            <div className="w-24 h-24 md:w-32 md:h-32 bg-linen rounded-2xl flex items-center justify-center text-4xl md:text-5xl mr-6 md:mr-8 shrink-0">
                                🌿
                            </div>
                            <div className="flex-1">
                                <h3 className="font-display text-2xl md:text-3xl mb-2 text-ink">
                                    More Magic
                                </h3>
                                <p className="font-sans text-stone text-sm mb-4">
                                    We are always working on new natural formulas.
                                </p>
                                <span className="text-xs font-sans font-medium bg-petal-gray text-charcoal px-3 py-1 rounded-full uppercase tracking-wider">
                                    Coming Soon
                                </span>
                            </div>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
}

export default CategoriesPage;