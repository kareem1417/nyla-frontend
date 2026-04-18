import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../services/authStore';

function LoginPage() {
    const navigate = useNavigate();
    const { user, login, register, isLoading, error } = useAuthStore();

    const [isLoginMode, setIsLoginMode] = useState(true);

    const [formData, setFormData] = useState({
        name: '', email: '', password: '', phone: '', address: '', city: ''
    });

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

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
            if (success) navigate('/');
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-6 sm:px-6 lg:px-8 bg-[#FAF8F6]">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-[24px] shadow-soft border border-white">

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
                                        title="Please enter a valid Egyptian phone number (e.g., 01012345678)"
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
                            onClick={() => {
                                setIsLoginMode(!isLoginMode);
                            }}
                            className="text-burgundy-800 font-semibold hover:underline"
                        >
                            {isLoginMode ? 'Sign Up' : 'Sign In'}
                        </button>
                    </p>
                </div>

            </div>
        </div>
    );
}

export default LoginPage;