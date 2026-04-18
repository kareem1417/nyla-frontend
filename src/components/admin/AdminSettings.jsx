import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Settings, Save } from 'lucide-react';
import BASE_URL from '../../config';
function AdminSettings() {
    const [shippingFee, setShippingFee] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const { data } = await axios.get(`${BASE_URL}/api/settings`);
                setShippingFee(data.shippingFee);
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

            await axios.put(`${BASE_URL}/api/settings`, { shippingFee: Number(shippingFee) }, config);
            toast.success("Shipping fee updated successfully! 🚚");
        } catch (error) {
            toast.error("Failed to update shipping fee!");
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

                <form onSubmit={handleSave} className="space-y-6">
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
                                className="w-full border border-petal-gray rounded-xl px-4 py-3 pl-12 focus:outline-none focus:border-burgundy-800 text-lg font-semibold text-ink"
                            />
                            <span className="absolute left-4 top-3.5 text-stone font-medium">EGP</span>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-petal-gray">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-burgundy-800 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-ink transition-colors font-medium shadow-sm disabled:opacity-50"
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