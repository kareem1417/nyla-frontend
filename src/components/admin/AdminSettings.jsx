import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Settings, Save, Tag } from 'lucide-react';
import BASE_URL from '../../config';

function AdminSettings() {
    const [shippingFee, setShippingFee] = useState(0);
    const [buyXGetCheapestFree, setBuyXGetCheapestFree] = useState(false); // 👈 الـ State الجديدة
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const { data } = await axios.get(`${BASE_URL}/api/settings`);
                setShippingFee(data.shippingFee);
                setBuyXGetCheapestFree(data.buyXGetCheapestFree || false); // 👈 قراءة القيمة من الداتا بيز
            } catch (error) {
                console.error("Error fetching settings", error);
            }
        };
        fetchSettings();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

            // 👈 بعتنا القيمة الجديدة للباك إند
            await axios.put(`${BASE_URL}/api/settings`, {
                shippingFee: Number(shippingFee),
                buyXGetCheapestFree
            }, config);

            toast.success("Settings updated successfully! ⚙️");
        } catch (error) {
            toast.error("Failed to update settings!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-display text-ink flex items-center gap-2">
                    <Settings className="text-burgundy-800" /> Store Settings
                </h1>
            </div>

            <div className="bg-white border border-petal-gray rounded-2xl overflow-hidden shadow-sm p-6 md:p-8 max-w-2xl">
                <h2 className="text-lg font-semibold text-ink mb-6 border-b border-petal-gray pb-4">General Configuration</h2>

                <form onSubmit={handleSave} className="space-y-8">
                    {/* Shipping Fee Section */}
                    <div>
                        <label className="block text-sm font-medium text-ink mb-2">Standard Shipping Fee (EGP)</label>
                        <p className="text-xs text-stone mb-3">This amount will be added automatically to all customer orders at checkout.</p>
                        <div className="relative max-w-xs">
                            <input
                                type="number"
                                min="0"
                                required
                                value={shippingFee}
                                onChange={(e) => setShippingFee(e.target.value)}
                                className="w-full border border-petal-gray rounded-xl px-4 py-3 pl-12 focus:outline-none focus:border-burgundy-800 text-lg font-semibold text-ink transition-colors"
                            />
                            <span className="absolute left-4 top-3.5 text-stone font-medium">EGP</span>
                        </div>
                    </div>

                    {/* 🌟 Promotions Section (Buy 3 Get 1 Free) 🌟 */}
                    <div className="pt-6 border-t border-petal-gray">
                        <label className="flex items-center gap-2 text-sm font-medium text-ink mb-4">
                            <Tag size={18} className="text-burgundy-800" /> Active Promotions
                        </label>

                        <div className="flex items-center justify-between p-5 bg-[#FAF8F6] border border-petal-gray rounded-xl transition-all hover:border-burgundy-200">
                            <div className="pr-4">
                                <p className="font-semibold text-ink text-base">Buy 3 Get 1 Free</p>
                                <p className="text-xs text-stone mt-1.5 leading-relaxed">
                                    Automatically apply a 100% discount on the cheapest item when a customer adds 4 items to their cart.
                                </p>
                            </div>

                            {/* Stylish Toggle Switch */}
                            <label className="relative inline-flex items-center cursor-pointer shrink-0">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={buyXGetCheapestFree}
                                    onChange={(e) => setBuyXGetCheapestFree(e.target.checked)}
                                />
                                <div className="w-11 h-6 bg-petal-gray peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-burgundy-800"></div>
                            </label>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-petal-gray">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-burgundy-800 text-white px-8 py-3.5 rounded-xl flex items-center gap-2 hover:bg-ink transition-colors font-medium shadow-sm disabled:opacity-50 active:scale-95"
                        >
                            <Save size={18} /> {loading ? "Saving..." : "Save Settings"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AdminSettings;