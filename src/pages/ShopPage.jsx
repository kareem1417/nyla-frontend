import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ui/ProductCard';
import { useProductStore } from '../services/productStore';
import { SlidersHorizontal, ChevronDown, SearchX, ChevronLeft, ChevronRight } from 'lucide-react';

function ShopPage() {
    const { products, isLoading, error } = useProductStore();

    const [searchParams, setSearchParams] = useSearchParams();
    const searchQuery = searchParams.get('search') || '';
    const urlCategory = searchParams.get('category') || 'All';

    const [selectedCategory, setSelectedCategory] = useState(urlCategory);
    const [sortBy, setSortBy] = useState('featured');
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 8;

    useEffect(() => {
        setSelectedCategory(urlCategory);
        setCurrentPage(1);
    }, [urlCategory, searchQuery]);

    const categories = ['All', ...new Set(products.map(p => p.category))];

    const filteredAndSortedProducts = useMemo(() => {
        let result = [...products];

        if (searchQuery) {
            result = result.filter(p =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.category.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (selectedCategory !== 'All') {
            result = result.filter(p =>
                p.category.toLowerCase() === selectedCategory.toLowerCase()
            );
        }

        if (sortBy === 'price-low') result.sort((a, b) => a.basePrice - b.basePrice);
        else if (sortBy === 'price-high') result.sort((a, b) => b.basePrice - a.basePrice);
        else if (sortBy === 'newest') result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        return result;
    }, [products, selectedCategory, sortBy, searchQuery]);

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredAndSortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredAndSortedProducts.length / productsPerPage);

    const handleCategoryClick = (cat) => {
        setSelectedCategory(cat);
        setCurrentPage(1);
        if (cat === 'All') searchParams.delete('category');
        else searchParams.set('category', cat);
        setSearchParams(searchParams);
    };

    const clearSearch = () => {
        setSearchParams({});
        setSelectedCategory('All');
        setCurrentPage(1);
    };

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (isLoading) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-petal-gray border-t-burgundy-800 rounded-full animate-spin"></div>
                <p className="text-stone font-medium">Loading collection...</p>
            </div>
        );
    }

    if (error) return <div className="text-center py-32 text-red-500 text-xl">{error}</div>;

    return (
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 font-sans">
            <header className="mb-12 text-center md:text-left">
                <h1 className="text-5xl md:text-6xl font-display text-ink mb-4">
                    {searchQuery ? `Results for "${searchQuery}"` : selectedCategory !== 'All' ? selectedCategory : 'Shop All'}
                </h1>
                <p className="text-stone text-lg max-w-2xl">
                    {searchQuery
                        ? `Found ${filteredAndSortedProducts.length} items matching your search.`
                        : selectedCategory !== 'All'
                            ? `Explore our exclusive ${selectedCategory} collection.`
                            : "Discover our full range of natural, handcrafted cosmetics."}
                </p>
            </header>

            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4 border-b border-petal-gray pb-6">
                <button className="md:hidden flex items-center justify-center gap-2 w-full btn-secondary" onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}>
                    <SlidersHorizontal size={18} /> Filters & Categories
                </button>

                <div className={`w-full md:w-auto flex-col md:flex-row gap-2 md:gap-4 ${isMobileFiltersOpen ? 'flex' : 'hidden md:flex'}`}>
                    {categories.map((cat) => (
                        <button key={cat} onClick={() => handleCategoryClick(cat)} className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${selectedCategory.toLowerCase() === cat.toLowerCase() ? 'bg-burgundy-800 text-white shadow-md' : 'bg-white text-stone border border-petal-gray hover:border-burgundy-800 hover:text-ink'}`}>
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="relative w-full md:w-auto group">
                    <div className="flex items-center justify-between gap-2 border border-petal-gray rounded-full px-5 py-2.5 bg-white cursor-pointer hover:border-burgundy-800 transition-colors">
                        <span className="text-sm font-medium text-stone">
                            Sort: <span className="text-ink">{sortBy === 'featured' ? 'Featured' : sortBy === 'price-low' ? 'Price: Low' : sortBy === 'price-high' ? 'Price: High' : 'Newest'}</span>
                        </span>
                        <ChevronDown size={16} className="text-stone group-hover:text-ink transition-colors" />
                    </div>
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-petal-gray rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-20 overflow-hidden">
                        <button onClick={() => setSortBy('featured')} className="block w-full text-left px-5 py-3 text-sm hover:bg-linen transition-colors">Featured</button>
                        <button onClick={() => setSortBy('newest')} className="block w-full text-left px-5 py-3 text-sm hover:bg-linen transition-colors border-t border-petal-gray/50">Newest</button>
                        <button onClick={() => setSortBy('price-low')} className="block w-full text-left px-5 py-3 text-sm hover:bg-linen transition-colors border-t border-petal-gray/50">Price: Low to High</button>
                        <button onClick={() => setSortBy('price-high')} className="block w-full text-left px-5 py-3 text-sm hover:bg-linen transition-colors border-t border-petal-gray/50">Price: High to Low</button>
                    </div>
                </div>
            </div>

            <div className="mb-8 text-sm text-stone font-medium">
                Showing {filteredAndSortedProducts.length > 0 ? `${indexOfFirstProduct + 1}-${Math.min(indexOfLastProduct, filteredAndSortedProducts.length)}` : '0'} of <span className="text-ink">{filteredAndSortedProducts.length}</span> products
            </div>

            {filteredAndSortedProducts.length === 0 ? (
                <div className="text-center py-32 bg-[#FAF8F6] rounded-3xl border border-dashed border-petal-gray">
                    <SearchX size={48} className="mx-auto text-petal-gray mb-4" />
                    <p className="text-2xl font-display text-ink mb-2">No products found.</p>
                    <button onClick={clearSearch} className="bg-burgundy-800 text-white px-8 py-3 rounded-full hover:bg-ink transition-colors font-medium mt-4">Clear all filters</button>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
                        {currentProducts.map((prod) => (
                            <ProductCard key={prod._id} product={prod} />
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 mt-16 pt-8 border-t border-petal-gray">
                            <button
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="p-2 rounded-full border border-petal-gray text-stone hover:border-burgundy-800 hover:text-burgundy-800 disabled:opacity-30 disabled:hover:border-petal-gray disabled:hover:text-stone transition-colors"
                            >
                                <ChevronLeft size={20} />
                            </button>

                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => paginate(i + 1)}
                                    className={`w-10 h-10 rounded-full text-sm font-medium transition-colors ${currentPage === i + 1
                                        ? 'bg-burgundy-800 text-white shadow-md'
                                        : 'bg-white border border-petal-gray text-stone hover:border-burgundy-800 hover:text-burgundy-800'
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}

                            <button
                                onClick={() => paginate(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-full border border-petal-gray text-stone hover:border-burgundy-800 hover:text-burgundy-800 disabled:opacity-30 disabled:hover:border-petal-gray disabled:hover:text-stone transition-colors"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default ShopPage;