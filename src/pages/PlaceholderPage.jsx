import React from 'react';

function PlaceholderPage({ title }) {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 py-20 text-center animate-fade-in">
            <div className="max-w-2xl mx-auto bg-[#FAF8F6] p-10 md:p-16 rounded-3xl border border-petal-gray shadow-sm">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-petal-gray text-2xl">
                    ⏳
                </div>
                <h1 className="text-4xl md:text-5xl font-display text-ink mb-6">{title}</h1>
                <p className="text-stone text-lg md:text-xl font-sans leading-relaxed">
                    This page is currently being updated. <br className="hidden md:block" />
                    Please contact us at <a href="mailto:info@nyla-cosmetics.com" className="text-burgundy-800 font-medium hover:underline transition-all">info@nyla-cosmetics.com</a> for any inquiries.
                </p>
            </div>
        </div>
    );
}

export default PlaceholderPage;