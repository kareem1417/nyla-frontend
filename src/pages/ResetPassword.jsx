import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Lock, ArrowRight } from 'lucide-react';

function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password.length < 6) return toast.error("Password must be at least 6 characters");
        if (password !== confirmPassword) return toast.error("Passwords do not match! 🛑");

        setIsLoading(true);
        try {
            await axios.put(`https://nyla-backend.onrender.com/api/users/resetpassword/${token}`, { password });
            setIsSuccess(true);
            toast.success("Password reset successfully! 🎉");

            // تحويل لصفحة اللوجين بعد ثانيتين
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (error) {
            toast.error(error.response?.data?.message || "Invalid or expired link");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 animate-fade-in">
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-petal-gray w-full max-w-md">

                <div className="mb-8">
                    <h1 className="text-3xl font-display text-ink mb-3">Set New Password</h1>
                    <p className="text-stone text-sm leading-relaxed">
                        Your new password must be different from previous used passwords.
                    </p>
                </div>

                {!isSuccess ? (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-stone mb-2">New Password</label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-4 top-3.5 text-stone" />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-[#FAF8F6] border border-petal-gray rounded-xl focus:outline-none focus:border-burgundy-800 transition-colors text-sm"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-stone mb-2">Confirm New Password</label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-4 top-3.5 text-stone" />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-[#FAF8F6] border border-petal-gray rounded-xl focus:outline-none focus:border-burgundy-800 transition-colors text-sm"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || !password || !confirmPassword}
                            className="w-full bg-ink text-white py-3.5 rounded-xl font-medium hover:bg-burgundy-800 transition-colors disabled:opacity-50 mt-2"
                        >
                            {isLoading ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </form>
                ) : (
                    <div className="text-center space-y-4">
                        <div className="bg-green-50 border border-green-200 p-6 rounded-xl">
                            <p className="text-green-800 font-medium">Password Updated! 🔒</p>
                            <p className="text-sm text-green-700 mt-1">Redirecting you to login...</p>
                        </div>
                        <Link to="/login" className="inline-flex items-center justify-center gap-2 w-full bg-burgundy-800 text-white py-3.5 rounded-xl font-medium hover:bg-ink transition-colors">
                            Go to Login <ArrowRight size={18} />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ResetPassword;