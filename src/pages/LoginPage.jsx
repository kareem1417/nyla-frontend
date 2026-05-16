import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../services/authStore';
import { Gift, Copy, CheckCircle } from 'lucide-react'; // ضفنا أيقونات الـ Modal
import toast from 'react-hot-toast';

function LoginPage() {
    const navigate = useNavigate();
    const { user, login, register, isLoading, error } = useAuthStore();

    const [isLoginMode, setIsLoginMode] = useState(true);
    const [showWelcomePopup, setShowWelcomePopup] = useState(false); // 👈 State للمودال
    const [copied, setCopied] = useState(false); // 👈 State لنسخ الكود

    const [formData, setFormData] = useState({
        name: '', email: '', password: '', phone: '', address: '', city: ''
    });

    // اتأكدنا إن الـ useEffect دي متقفلش المودال قبل ما اليوزر يشوفه
    useEffect(() => {
        if (user && isLoginMode && !showWelcomePopup) {
            navigate('/');
        }
    }, [user, navigate, isLoginMode, showWelcomePopup]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isLoginMode) {
            const success = await login(formData.email, formData.password);
            if (success) navigate('/');
        } else {
            const success = await register(formData);
            if (success) {
                // 👈 بدل ما نوجهه فوراً، هنفتحله المودال يفرح بالكود
                setShowWelcomePopup(true);
            }
        }
    };

    const handleCopyAndShop = () => {
        navigator.clipboard.writeText('WELCOME5');
        setCopied(true);
        toast.success("Code copied to clipboard! 🛒");

        setTimeout(() => {
            navigate('/'); // نوديه الصفحة الرئيسية بعد ثانية
        }, 1500);
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-6 sm:px-6 lg:px-8 bg-[#FAF8F6] relative">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-[24px] shadow-soft border border-white relative z-10">

                <div className="text-center">
                    <h2 className="text-4xl font-display text-ink mb-2">
                        {isLoginMode ? 'Welcome Back' : 'Create Account'}
                    </h2>
                    <p className="text-stone text-sm">
                        {isLoginMode ? 'Sign in to access your NYLA account.' : 'Join NYLA to track your orders and save items.'}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm text-center border border-red-100">
                        {error}
                    </div>
                )}

                <form className="space-y-5" onSubmit={handleSubmit}>
                    {!isLoginMode && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-stone mb-1">Full Name</label>
                                <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full border border-petal-gray rounded-xl px-4 py-3 focus:outline-none focus:border-burgundy-800 transition-colors" placeholder="Kareem Mahmoud" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-stone mb-1">Phone</label>
                                    <input
                                        required
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        pattern="^01[0125][0-9]{8}$"
                                        maxLength="11"
                                        title="Please enter a valid Egyptian phone number"
                                        className="w-full border border-petal-gray rounded-xl px-4 py-3 focus:outline-none focus:border-burgundy-800 transition-colors"
                                        placeholder="01xxxxxxxxx"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-stone mb-1">City</label>
                                    <input required type="text" name="city" value={formData.city} onChange={handleInputChange} className="w-full border border-petal-gray rounded-xl px-4 py-3 focus:outline-none focus:border-burgundy-800 transition-colors" placeholder="Cairo" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-stone mb-1">Detailed Address</label>
                                <input required type="text" name="address" value={formData.address} onChange={handleInputChange} className="w-full border border-petal-gray rounded-xl px-4 py-3 focus:outline-none focus:border-burgundy-800 transition-colors" placeholder="123 Street Name" />
                            </div>
                        </>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-stone mb-1">Email Address</label>
                        <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full border border-petal-gray rounded-xl px-4 py-3 focus:outline-none focus:border-burgundy-800 transition-colors" placeholder="you@example.com" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-stone mb-1">Password</label>
                        <input required type="password" name="password" value={formData.password} onChange={handleInputChange} className="w-full border border-petal-gray rounded-xl px-4 py-3 focus:outline-none focus:border-burgundy-800 transition-colors" placeholder="••••••••" />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full btn-primary py-3.5 flex justify-center items-center gap-2 mt-4"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            isLoginMode ? 'Sign In' : 'Create Account'
                        )}
                    </button>
                    <div className="flex justify-end mt-1 mb-4">
                        <Link to="/forgot-password" className="text-xs font-medium text-burgundy-800 hover:text-ink transition-colors">
                            Forgot password?
                        </Link>
                    </div>
                </form>

                <div className="text-center pt-4 border-t border-petal-gray">
                    <p className="text-sm text-stone">
                        {isLoginMode ? "Don't have an account? " : "Already have an account? "}
                        <button
                            type="button"
                            onClick={() => setIsLoginMode(!isLoginMode)}
                            className="text-burgundy-800 font-semibold hover:underline"
                        >
                            {isLoginMode ? 'Sign Up' : 'Sign In'}
                        </button>
                    </p>
                </div>
            </div>

            {/* 🌟 Welcome Promo Modal 🌟 */}
            {showWelcomePopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl relative overflow-hidden text-center transform scale-100 animate-slide-up">

                        {/* تصميم خلفية المودال */}
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-burgundy-50 rounded-full blur-2xl"></div>
                        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-petal-gray/50 rounded-full blur-2xl"></div>

                        <div className="relative z-10">
                            <div className="mx-auto w-16 h-16 bg-burgundy-800 text-white flex items-center justify-center rounded-full mb-5 shadow-lg">
                                <Gift size={32} className="animate-bounce" />
                            </div>

                            <h3 className="text-3xl font-display text-ink mb-2">Welcome to NYLA!</h3>
                            <p className="text-stone text-sm mb-6 leading-relaxed">
                                We are thrilled to have you here. As a welcome gift, enjoy <span className="font-bold text-burgundy-800">5% OFF</span> your first order!
                            </p>

                            <div className="bg-[#FAF8F6] border border-dashed border-burgundy-800 rounded-xl p-4 mb-6 relative group">
                                <p className="text-xs text-stone mb-1 uppercase tracking-widest">Your Promo Code</p>
                                <p className="text-2xl font-bold text-ink tracking-widest">WELCOME5</p>
                            </div>

                            <button
                                onClick={handleCopyAndShop}
                                className="w-full bg-burgundy-800 text-white py-3.5 rounded-xl font-medium hover:bg-ink transition-all flex items-center justify-center gap-2 shadow-md active:scale-95"
                            >
                                {copied ? <CheckCircle size={20} /> : <Copy size={20} />}
                                {copied ? 'Copied! Redirecting...' : 'Copy Code & Shop Now'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default LoginPage;