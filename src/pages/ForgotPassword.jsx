import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Mail, ArrowLeft } from 'lucide-react';
import BASE_URL from '../../config';
function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) return toast.error("Please enter your email address");

        setIsLoading(true);
        try {
            await axios.post(`${BASE_URL}/api/users/forgotpassword`, { email });
            setIsSent(true);
            toast.success("Reset link sent to your email! ✉️");
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 animate-fade-in">
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-petal-gray w-full max-w-md">

                <div className="mb-8">
                    <h1 className="text-3xl font-display text-ink mb-3">Forgot Password?</h1>
                    <p className="text-stone text-sm leading-relaxed">
                        No worries! Enter the email address associated with your account, and we'll send you a link to reset your password.
                    </p>
                </div>

                {!isSent ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-stone mb-2">Email Address</label>
                            <div className="relative">
                                <Mail size={18} className="absolute left-4 top-3.5 text-stone" />
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-[#FAF8F6] border border-petal-gray rounded-xl focus:outline-none focus:border-burgundy-800 transition-colors text-sm"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-ink text-white py-3.5 rounded-xl font-medium hover:bg-burgundy-800 transition-colors disabled:opacity-50"
                        >
                            {isLoading ? 'Sending...' : 'Send Reset Link'}
                        </button>
                    </form>
                ) : (
                    <div className="bg-green-50 border border-green-200 p-6 rounded-xl text-center">
                        <p className="text-green-800 font-medium mb-2">Email Sent Successfully! 🎉</p>
                        <p className="text-sm text-green-700">Please check your inbox (and spam folder) for the password reset link.</p>
                    </div>
                )}

                <div className="mt-8 text-center border-t border-petal-gray pt-6">
                    <Link to="/login" className="inline-flex items-center gap-2 text-sm text-stone hover:text-burgundy-800 transition-colors font-medium">
                        <ArrowLeft size={16} /> Back to Login
                    </Link>
                </div>

            </div>
        </div>
    );
}

export default ForgotPassword;