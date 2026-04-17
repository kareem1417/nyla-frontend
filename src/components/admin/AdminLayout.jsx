import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, Settings } from 'lucide-react';

function AdminLayout() {
    const navLinks = [
        { name: 'Overview', path: '/admin/dashboard', icon: <LayoutDashboard size={20} />, end: true },
        { name: 'Products', path: '/admin/products', icon: <Package size={20} /> },
        { name: 'Orders', path: '/admin/orders', icon: <ShoppingBag size={20} /> },
        { name: 'categories', path: '/admin/categories', icon: <Package size={20} /> },
        { name: 'coupons', path: '/admin/coupons', icon: <Package size={20} /> },
        { name: 'users', path: '/admin/users', icon: <Package size={20} /> },
        { name: 'Settings', path: '/admin/settings', icon: <Settings size={20} /> },

    ];

    return (
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 flex flex-col md:flex-row gap-8 min-h-[70vh] font-sans">

            <aside className="w-full md:w-64 shrink-0">
                <div className="bg-[#FAF8F6] border border-petal-gray rounded-2xl p-4 shadow-sm sticky top-28">
                    <h2 className="text-xl font-display text-ink mb-6 px-4 pt-2">Admin Panel 👑</h2>
                    <nav className="flex flex-col gap-2">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.name}
                                to={link.path}
                                end={link.end} 
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive
                                        ? 'bg-burgundy-800 text-white shadow-md' 
                                        : 'text-stone hover:bg-white hover:text-burgundy-800' 
                                    }`
                                }
                            >
                                {link.icon}
                                {link.name}
                            </NavLink>
                        ))}
                    </nav>
                </div>
            </aside>

            <main className="flex-1 bg-white border border-petal-gray rounded-2xl shadow-sm p-6 md:p-8">
                <Outlet />
            </main>

        </div>
    );
}

export default AdminLayout;