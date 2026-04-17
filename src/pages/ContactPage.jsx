import React from 'react';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

function ContactPage() {
    return (
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
            <header className="text-center mb-16">
                <h1 className="text-5xl md:text-6xl font-display mb-4">Get in Touch</h1>
                <p className="text-stone max-w-xl mx-auto text-lg font-sans">
                    We'd love to hear from you. Whether you have a question about our products, shipping, or anything else, our team is ready to answer all your questions.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

                <div className="space-y-8">
                    <h2 className="text-3xl font-display text-ink border-b border-petal-gray pb-4">Contact Information</h2>

                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-burgundy-50 text-burgundy-800 rounded-full flex items-center justify-center shrink-0">
                                <Mail size={24} />
                            </div>
                            <div>
                                <h3 className="font-sans font-medium text-ink text-lg">Email Us</h3>
                                <p className="text-stone">hello@nylacosmetics.com</p>
                                <p className="text-stone text-sm mt-1">We aim to reply within 24 hours.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-burgundy-50 text-burgundy-800 rounded-full flex items-center justify-center shrink-0">
                                <Phone size={24} />
                            </div>
                            <div>
                                <h3 className="font-sans font-medium text-ink text-lg">Call Us</h3>
                                <p className="text-stone">+20 100 123 4567</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-burgundy-50 text-burgundy-800 rounded-full flex items-center justify-center shrink-0">
                                <MapPin size={24} />
                            </div>
                            <div>
                                <h3 className="font-sans font-medium text-ink text-lg">Visit Us</h3>
                                <p className="text-stone">Cairo, Egypt<br />(Online Store Only currently)</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-burgundy-50 text-burgundy-800 rounded-full flex items-center justify-center shrink-0">
                                <Clock size={24} />
                            </div>
                            <div>
                                <h3 className="font-sans font-medium text-ink text-lg">Business Hours</h3>
                                <p className="text-stone">Sunday - Thursday: 9:00 AM - 6:00 PM</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-2xl border border-petal-gray shadow-sm">
                    <h2 className="text-2xl font-display text-ink mb-6">Send a Message</h2>
                    <form className="space-y-4 font-sans" onSubmit={(e) => e.preventDefault()}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-stone mb-1">First Name</label>
                                <input type="text" className="w-full border border-petal-gray rounded-lg px-4 py-2 focus:outline-none focus:border-burgundy-800 transition-colors" placeholder="First Name" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-stone mb-1">Last Name</label>
                                <input type="text" className="w-full border border-petal-gray rounded-lg px-4 py-2 focus:outline-none focus:border-burgundy-800 transition-colors" placeholder="Last Name" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-stone mb-1">Email</label>
                            <input type="email" className="w-full border border-petal-gray rounded-lg px-4 py-2 focus:outline-none focus:border-burgundy-800 transition-colors" placeholder="Email Address" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-stone mb-1">Message</label>
                            <textarea rows="4" className="w-full border border-petal-gray rounded-lg px-4 py-2 focus:outline-none focus:border-burgundy-800 transition-colors" placeholder="How can we help you?"></textarea>
                        </div>
                        <button type="submit" className="btn-primary w-full mt-4">Send Message</button>
                    </form>
                </div>

            </div>
        </div>
    );
}

export default ContactPage;