import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Heart, ShoppingCart, Plus, Minus, CheckCircle, ChevronDown, Star, User } from 'lucide-react';
import { useCartStore } from '../services/cartStore';
import ProductCard from '../components/ui/ProductCard';
import BASE_URL from '../../config';
function ProductDetailPage() {
    const { id } = useParams();

    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const availableStock = selectedVariant ? selectedVariant.stock : (product?.stock || 100);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [activeAccordion, setActiveAccordion] = useState('description');

    const [relatedProducts, setRelatedProducts] = useState([]);

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);

    const [userInfo, setUserInfo] = useState(null);
    useEffect(() => {
        try {
            const storedData = localStorage.getItem('userInfo');
            if (storedData && storedData !== 'undefined') {
                setUserInfo(JSON.parse(storedData));
            }
        } catch (e) {
            console.error("Error parsing user info:", e);
        }
    }, []);

    const addItem = useCartStore((state) => state.addItem);

    const fetchProductDetails = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`${BASE_URL}/api/products/${id}`);
            if (!response.ok) throw new Error('Product not found');
            const data = await response.json();
            setProduct(data);

            if (data?.variants && data.variants.length > 0) {
                const defaultVar = data.variants.find(v => v.stock > 0) || data.variants[0];
                setSelectedVariant(defaultVar);
            }

            // جلب المنتجات المشابهة
            const relatedRes = await fetch(`${BASE_URL}/api/products/${id}/related`);
            if (relatedRes.ok) {
                const relatedData = await relatedRes.json();
                if (Array.isArray(relatedData)) {
                    setRelatedProducts(relatedData);
                }
            }

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProductDetails();
        window.scrollTo(0, 0);
    }, [id]);

    const updateQuantity = (newQty) => {
        //if (!selectedVariant) return;
        if (newQty < 1) return;
        if (newQty > selectedVariant.stock) return;
        setQuantity(newQty);
    };

    const handleAddToCart = () => {
        if (!product) return;

        addItem({
            productId: product._id,
            variantId: selectedVariant ? (selectedVariant.id || selectedVariant._id) : 'default',
            productName: product.name,
            variantLabel: selectedVariant ? selectedVariant.value : 'Standard',
            imageUrl: product.imageUrl,
            unitPrice: selectedVariant ? (selectedVariant.basePrice || product.basePrice) : product.basePrice,
            quantity: quantity
        });

        toast.success(`${product.name} added to cart! 🛒`);
    };

    const submitReviewHandler = async (e) => {
        e.preventDefault();
        if (rating === 0) return toast.error("Please select a star rating! ⭐");
        if (!comment.trim()) return toast.error("Please write a comment! 📝");

        setIsSubmittingReview(true);
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };
            await axios.post(`${BASE_URL}/api/products/${id}/reviews`, { rating, comment }, config);

            toast.success("Review submitted successfully! 🎉");
            setRating(0);
            setComment('');
            fetchProductDetails();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to submit review.");
        } finally {
            setIsSubmittingReview(false);
        }
    };

    const renderStars = (ratingValue) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        size={16}
                        className={star <= (ratingValue || 0) ? "fill-orange-400 text-orange-400" : "text-stone opacity-30"}
                    />
                ))}
            </div>
        );
    };

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-petal-gray border-t-burgundy-800 rounded-full animate-spin"></div>
                <p className="text-stone font-medium animate-pulse">Loading product details...</p>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="text-center py-32 font-display text-4xl text-stone flex flex-col items-center">
                <p className="mb-6">{error || "Product not found."}</p>
                <Link to="/shop" className="btn-primary text-lg">Back to Shop</Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 font-sans overflow-x-hidden animate-fade-in">

            <nav className="text-sm text-stone mb-10 flex gap-2">
                <Link to="/" className="hover:text-burgundy-800">Home</Link> /
                <Link to="/shop" className="hover:text-burgundy-800">Shop</Link> /
                <span className="text-charcoal">{product?.name}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-20">

                <div className="space-y-4 lg:sticky lg:top-28 mb-10 lg:mb-0">
                    <div className="w-full aspect-square bg-[#FDF9F6] rounded-card border border-petal-gray shadow-sm flex items-center justify-center overflow-hidden relative p-8">
                        <img
                            src={product?.imageUrl}
                            alt={product?.name}
                            className="w-full h-full object-contain mix-blend-multiply"
                        />
                        {selectedVariant?.stock === 0 && (
                            <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center">
                                <span className="text-burgundy-800 text-sm font-sans font-bold uppercase tracking-widest bg-white px-6 py-3 rounded-full shadow-lg">
                                    Out of Stock
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-8 bg-white p-8 rounded-card shadow-soft">

                    <header className="space-y-3 border-b border-petal-gray pb-6">
                        <div className="flex justify-between items-start">
                            <p className="text-xs font-sans text-stone uppercase tracking-widest">{product?.category || 'Category'}</p>
                            <span className="text-xs font-medium text-stone bg-linen px-3 py-1 rounded-full">{product?.size || '-'}</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-display text-ink">{product?.name}</h1>

                        <div className="flex items-center gap-3 pt-1">
                            {renderStars(product?.rating)}
                            <span className="text-sm text-stone font-medium">({product?.numReviews || 0} Reviews)</span>
                            <a href="#reviews" className="text-xs text-burgundy-800 underline hover:text-ink transition-colors">See all</a>
                        </div>

                        <p className="text-stone max-w-lg leading-relaxed pt-2">{product?.description}</p>
                    </header>

                    <div className="border-b border-petal-gray pb-6">
                        <div className="flex justify-between items-center mb-5">
                            <p className="text-burgundy-800 text-3xl font-sans font-semibold">
                                {selectedVariant?.basePrice || product?.basePrice} EGP
                            </p>
                            {selectedVariant?.stock > 0 && selectedVariant?.stock < 10 && (
                                <span className="text-copper-500 text-xs font-medium flex items-center gap-1.5 bg-copper-50 px-3 py-1 rounded-full">
                                    <CheckCircle size={14} /> Only {selectedVariant.stock} left in stock!
                                </span>
                            )}
                        </div>

                        {product?.variants && product.variants.length > 1 && (
                            <div className="space-y-3 pt-5 border-t border-petal-gray">
                                <p className="text-sm text-stone font-medium">Shade: <span className="text-ink font-semibold ml-1">{selectedVariant?.value}</span></p>
                                <div className="flex flex-wrap gap-3">
                                    {product.variants.map((v) => (
                                        <button
                                            key={v._id || v.id}
                                            title={v.value}
                                            onClick={() => v.stock > 0 && (setSelectedVariant(v), setQuantity(1))}
                                            className={`relative w-10 h-10 rounded-full border-2 transition-all ${selectedVariant?.id === v.id || selectedVariant?._id === v._id ? 'border-burgundy-800 shadow-md scale-110' : 'border-stone-200 hover:border-petal-gray'
                                                } ${v.stock === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:scale-105'}`}
                                        >
                                            <span
                                                className="absolute inset-[3px] rounded-full"
                                                style={{ backgroundColor: v.shadeColor || '#C8C2BE' }}
                                            ></span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="border-b border-petal-gray pb-8">
                        <div className="flex items-center gap-4 mb-6">
                            <p className="text-sm text-stone font-medium">Quantity:</p>
                            <div className="flex items-center gap-1 border border-petal-gray rounded-full px-1 py-1 bg-white">
                                <button
                                    onClick={() => updateQuantity(quantity - 1)}
                                    className="p-1.5 rounded-full text-stone hover:text-burgundy-800 hover:bg-burgundy-50 disabled:opacity-30 transition-colors"
                                    disabled={availableStock === 0 || quantity <= 1}
                                >
                                    <Minus size={16} />
                                </button>

                                <span className="text-ink font-semibold text-lg w-10 text-center">{quantity}</span>

                                <button
                                    onClick={() => updateQuantity(quantity + 1)}
                                    className="p-1.5 rounded-full text-stone hover:text-burgundy-800 hover:bg-burgundy-50 disabled:opacity-30 transition-colors"
                                    disabled={availableStock === 0 || quantity >= availableStock}
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4">
                            <button onClick={handleAddToCart} className="btn-primary flex-grow flex items-center justify-center gap-2.5 text-base h-14" disabled={selectedVariant?.stock === 0}>
                                <ShoppingCart size={20} />
                                {selectedVariant?.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                            </button>

                            <button onClick={() => setIsWishlisted(!isWishlisted)} className="btn-secondary flex items-center justify-center gap-2.5 px-6 h-14 border-petal-gray hover:border-burgundy-200 group">
                                <Heart size={20} className={`transition-colors ${isWishlisted ? 'fill-burgundy-800 text-burgundy-800' : 'text-stone group-hover:text-burgundy-800'}`} strokeWidth={1.5} />
                                <span className="text-ink font-medium hidden md:inline">{isWishlisted ? 'Saved' : 'Save'}</span>
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4 pt-4 text-left font-sans text-sm">
                        <div className="border border-petal-gray rounded-xl overflow-hidden bg-white shadow-sm">
                            <button onClick={() => setActiveAccordion(activeAccordion === 'description' ? null : 'description')} className="flex justify-between items-center w-full px-6 py-4 bg-[#FAF8F6] font-medium text-ink uppercase tracking-wider text-xs focus:outline-none hover:bg-linen transition-colors">
                                <span>Description</span>
                                <ChevronDown size={18} className={`text-stone transform transition-transform duration-300 ${activeAccordion === 'description' ? 'rotate-180' : ''}`} />
                            </button>
                            <div className={`overflow-hidden transition-all duration-300 ${activeAccordion === 'description' ? 'max-h-96 border-t border-petal-gray' : 'max-h-0'}`}>
                                <p className="p-6 text-stone leading-relaxed">{product?.description}</p>
                            </div>
                        </div>
                        <div className="border border-petal-gray rounded-xl overflow-hidden bg-white shadow-sm">
                            <button onClick={() => setActiveAccordion(activeAccordion === 'ingredients' ? null : 'ingredients')} className="flex justify-between items-center w-full px-6 py-4 bg-[#FAF8F6] font-medium text-ink uppercase tracking-wider text-xs focus:outline-none hover:bg-linen transition-colors">
                                <span>Ingredients</span>
                                <ChevronDown size={18} className={`text-stone transform transition-transform duration-300 ${activeAccordion === 'ingredients' ? 'rotate-180' : ''}`} />
                            </button>
                            <div className={`overflow-hidden transition-all duration-300 ${activeAccordion === 'ingredients' ? 'max-h-96 border-t border-petal-gray' : 'max-h-0'}`}>
                                <p className="p-6 text-stone leading-relaxed">{product?.ingredients}</p>
                            </div>
                        </div>

                        <div className="border border-petal-gray rounded-xl overflow-hidden bg-white shadow-sm">
                            <button onClick={() => setActiveAccordion(activeAccordion === 'howToUse' ? null : 'howToUse')} className="flex justify-between items-center w-full px-6 py-4 bg-[#FAF8F6] font-medium text-ink uppercase tracking-wider text-xs focus:outline-none hover:bg-linen transition-colors">
                                <span>How to Use</span>
                                <ChevronDown size={18} className={`text-stone transform transition-transform duration-300 ${activeAccordion === 'howToUse' ? 'rotate-180' : ''}`} />
                            </button>
                            <div className={`overflow-hidden transition-all duration-300 ${activeAccordion === 'howToUse' ? 'max-h-96 border-t border-petal-gray' : 'max-h-0'}`}>
                                <p className="p-6 text-stone leading-relaxed">{product?.howToUse}</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <div id="reviews" className="mt-20 pt-16 border-t border-petal-gray">
                <div className="flex flex-col md:flex-row gap-12">

                    {/* قائمة التقييمات القديمة */}
                    <div className="md:w-2/3">
                        <h2 className="text-3xl font-display text-ink mb-8 flex items-center gap-3">
                            Customer Reviews <span className="text-lg bg-burgundy-50 text-burgundy-800 px-3 py-1 rounded-full font-sans">{product?.numReviews || 0}</span>
                        </h2>

                        {!product?.reviews || product.reviews.length === 0 ? (
                            <div className="bg-[#FAF8F6] p-10 rounded-2xl border border-dashed border-petal-gray text-center">
                                <Star className="mx-auto h-10 w-10 text-petal-gray mb-3" />
                                <p className="text-stone font-medium">No reviews yet.</p>
                                <p className="text-sm text-stone">Be the first to share your experience with {product?.name}!</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {product.reviews.map((review) => (
                                    <div key={review._id} className="bg-white p-6 rounded-2xl border border-petal-gray shadow-sm">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-linen text-ink flex items-center justify-center font-bold text-lg">
                                                    {review.name ? review.name.charAt(0).toUpperCase() : 'U'}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-ink text-sm">{review.name}</p>
                                                    {renderStars(review.rating)}
                                                </div>
                                            </div>
                                            <span className="text-xs text-stone">{new Date(review.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-stone text-sm leading-relaxed mt-4 pl-1">{review.comment}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="md:w-1/3">
                        <div className="bg-[#FAF8F6] p-8 rounded-2xl border border-petal-gray sticky top-28">
                            <h3 className="text-xl font-display text-ink mb-6">Write a Review</h3>

                            {userInfo ? (
                                <form onSubmit={submitReviewHandler} className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium text-stone mb-2">Overall Rating</label>
                                        <div className="flex gap-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setRating(star)}
                                                    className="focus:outline-none hover:scale-110 transition-transform"
                                                >
                                                    <Star size={24} className={star <= rating ? "fill-orange-400 text-orange-400" : "text-petal-gray"} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-stone mb-2">Your Review</label>
                                        <textarea
                                            rows="4"
                                            placeholder="What did you love about this product?"
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            className="w-full px-4 py-3 bg-white border border-petal-gray rounded-xl focus:outline-none focus:border-burgundy-800 resize-none text-sm"
                                        ></textarea>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmittingReview || rating === 0 || !comment.trim()}
                                        className="w-full bg-ink text-white py-3.5 rounded-xl font-medium hover:bg-burgundy-800 transition-colors disabled:opacity-50"
                                    >
                                        {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                                    </button>
                                </form>
                            ) : (
                                <div className="text-center p-6 bg-white border border-petal-gray rounded-xl">
                                    <User className="mx-auto h-8 w-8 text-stone mb-3" />
                                    <p className="text-sm text-stone mb-4">Please log in to write a review and share your experience.</p>
                                    <Link to="/login" className="block w-full bg-white border border-burgundy-800 text-burgundy-800 py-2.5 rounded-xl font-medium hover:bg-burgundy-50 transition-colors">
                                        Log In
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>

            {relatedProducts && relatedProducts.length > 0 && (
                <div className="mt-20 pt-16 border-t border-petal-gray print:hidden">
                    <h2 className="text-3xl font-display text-ink mb-8 text-center">You May Also Like</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
                        {relatedProducts.map((item) => (
                            <ProductCard key={item._id} product={item} />
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
}

export default ProductDetailPage;