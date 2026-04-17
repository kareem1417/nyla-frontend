import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone, Facebook, Instagram } from 'lucide-react';
import TikTokIcon from '../ui/TikTokIcon';



function Footer() {
    const socialLinks = [
        { icon: Facebook, href: '#', name: 'Facebook' },
        { icon: Instagram, href: '#', name: 'Instagram' },
        { icon: TikTokIcon, href: '#', name: 'TikTok' },
    ];

    return (
        <footer className="bg-linen/50 border-t border-petal-gray text-charcoal font-sans mt-24">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-sm">

                <div className="space-y-6">
                    <Link to="/" className="text-3xl font-display font-semibold text-burgundy-800 tracking-wider">
                        NYLA
                    </Link>
                    <div className="space-y-4 text-stone">
                        <div className="flex items-start gap-3">
                            <MapPin size={20} className="text-burgundy-800 shrink-0 mt-0.5" />
                            <span>Cairo, Egypt
                                (Online Store Only currently)</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Mail size={18} className="text-burgundy-800" />
                            <a href="mailto:info@elle-cosmetics.com" className="hover:text-burgundy-800 transition-colors">info@elle-cosmetics.com</a>
                        </div>
                        <div className="flex items-center gap-3">
                            <Phone size={18} className="text-burgundy-800" />
                            <a href="tel:+201040355508" className="hover:text-burgundy-800 transition-colors"></a>
                        </div>
                    </div>
                    <div className="flex gap-4 pt-2">
                        {socialLinks.map((social) => (
                            <a key={social.name} href={social.href} className="text-stone hover:text-burgundy-800 transition-colors" target="_blank" rel="noopener noreferrer">
                                <social.icon size={22} className="" />
                            </a>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="font-medium text-ink text-base">STORE INFO</h3>
                    <nav className="flex flex-col gap-2.5 text-stone">
                        <Link to="/about" className="hover:text-burgundy-800 transition-colors">About Us</Link>
                        <Link to="/contact" className="hover:text-burgundy-800 transition-colors">Contact</Link>
                        <Link to="/shop" className="hover:text-burgundy-800 transition-colors">Shop All</Link>
                        <Link to="/categories" className="hover:text-burgundy-800 transition-colors">Categories</Link>
                    </nav>
                </div>

                <div className="space-y-4">
                    <h3 className="font-medium text-ink text-base">SUPPORT</h3>
                    <ul className="space-y-3">
                        <li><Link to="/faq" className="text-stone hover:text-burgundy-800 transition-colors">FAQ</Link></li>
                        <li><Link to="/shipping-returns" className="text-stone hover:text-burgundy-800 transition-colors">Shipping & Returns</Link></li>
                        <li><Link to="/privacy-policy" className="text-stone hover:text-burgundy-800 transition-colors">Privacy Policy</Link></li>
                        <li><Link to="/terms" className="text-stone hover:text-burgundy-800 transition-colors">Terms of Service</Link></li>
                    </ul>
                </div>

                <div className="space-y-4">
                    <h3 className="font-medium text-ink text-base">Subscribe</h3>
                    <p className="text-stone">Subscribe to our newsletter and get 10% off your first order!</p>
                    <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
                        <input
                            type="email"
                            placeholder="Your email address"
                            className="w-full border border-petal-gray rounded-btn px-4 py-2.5 focus:outline-none focus:border-burgundy-800 transition-colors text-sm bg-white"
                        />
                        <button type="submit" className="btn-primary w-full">Subscribe</button>
                    </form>
                </div>

            </div>
        </footer>
    );
}

export default Footer;