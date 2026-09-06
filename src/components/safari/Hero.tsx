'use client';

import React, { useState, useEffect } from 'react';
import { Compass, Camera, Leaf, Search } from 'lucide-react';
import { SAFARI_PACKAGES } from '@/data/packages';

interface HeroProps {
    onQuickBook: (packageId: string, date: string, adults: number) => void;
}

const BACKGROUND_SLIDES = [
    {
        src: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=2000&q=80',
        alt: 'African Safari Sunset over Kruger savanna',
    },
    {
        src: 'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=2000&q=80',
        alt: 'Male lion resting in Kruger National Park',
    },
    {
        src: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=2000&q=80',
        alt: 'Herd of wild African elephants walking at dusk',
    },
    {
        src: 'https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=2000&q=80',
        alt: 'Leopard perched on a marula tree branch',
    },
];

export default function Hero({ onQuickBook }: HeroProps) {
    const [selectedPkg, setSelectedPkg] = useState(SAFARI_PACKAGES[0].id);
    const [selectedDate, setSelectedDate] = useState(() => {
        const d = new Date();
        d.setDate(d.getDate() + 1);
        return d.toISOString().split('T')[0];
    });
    const [guestCount, setGuestCount] = useState(2);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Auto-rotate background every 6.5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % BACKGROUND_SLIDES.length);
        }, 6500);

        return () => clearInterval(interval);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onQuickBook(selectedPkg, selectedDate, guestCount);
    };

    return (
        <section className="relative min-h-[92vh] flex items-center justify-center bg-[#122216] text-white overflow-hidden">
            {/* Visual Canvas Background with Crossfade Transition */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                {BACKGROUND_SLIDES.map((slide, index) => {
                    const isActive = index === currentImageIndex;
                    return (
                        <div
                            key={slide.src}
                            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                                isActive ? 'opacity-100' : 'opacity-0'
                            }`}
                        >
                            <img
                                src={slide.src}
                                alt={slide.alt}
                                className={`w-full h-full object-cover object-center filter brightness-[0.38] transition-transform duration-[7000ms] ease-out ${
                                    isActive ? 'scale-105' : 'scale-100'
                                }`}
                            />
                        </div>
                    );
                })}

                {/* Ambient Safaric Vignettes & Gradients */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#122216] via-[#122216]/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#122216]/80 via-transparent to-[#122216]/70" />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1C3322]/80 border border-[#C2933D]/40 text-[#EAD5A8] text-xs tracking-widest uppercase mb-6 shadow">
                    <span className="w-2 h-2 rounded-full bg-[#C2933D] animate-ping" />
                    Wildlife • People • Places • For a Brighter Tomorrow
                </div>

                <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-tight mb-4">
                    Kruger National Park <span className="block italic font-light text-[#DEAE59]">Safaris</span>
                </h1>

                <p className="font-sans text-stone-200 text-sm sm:text-lg max-w-2xl mx-auto font-light leading-relaxed mb-8">
                    <strong className="font-semibold text-white tracking-wide">GUIDED SAFARIS &nbsp;|&nbsp; TRANSFERS &nbsp;|&nbsp; TAILOR-MADE EXPERIENCES</strong><br />
                    Experience Africa’s greatest wilderness through elevated open 4x4 vehicles, certified indigenous trackers, and soul-stirring Big Five encounters.
                </p>

                {/* Badges */}
                <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-stone-300 mb-10">
                    <span className="flex items-center gap-1.5"><Compass className="w-4 h-4 text-[#C2933D]" /> FGASA Certified Field Guides</span>
                    <span className="flex items-center gap-1.5"><Camera className="w-4 h-4 text-[#C2933D]" /> Custom Open 4x4 Tiered Vehicles</span>
                    <span className="flex items-center gap-1.5"><Leaf className="w-4 h-4 text-[#C2933D]" /> Sustainable &amp; Conservation Driven</span>
                </div>

                {/* Quick Booking Engine Bar */}
                <div className="bg-[#122216]/90 backdrop-blur-md p-4 sm:p-6 rounded-2xl border border-[#C2933D]/30 shadow-2xl max-w-4xl mx-auto text-left">
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                        <div>
                            <label className="block text-[11px] uppercase tracking-wider text-[#C2933D] font-bold mb-1">Safari Experience</label>
                            <select
                                value={selectedPkg}
                                onChange={(e) => setSelectedPkg(e.target.value)}
                                className="w-full bg-[#1C3322] border border-[#C2933D]/30 rounded-lg px-3 py-2.5 text-xs text-white focus:ring-1 focus:ring-[#C2933D] focus:outline-none"
                            >
                                {SAFARI_PACKAGES.map((p) => (
                                    <option key={p.id} value={p.id} className="bg-[#122216] text-white">
                                        {p.title}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-[11px] uppercase tracking-wider text-[#C2933D] font-bold mb-1">Preferred Date</label>
                            <input
                                type="date"
                                required
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="w-full bg-[#1C3322] border border-[#C2933D]/30 rounded-lg px-3 py-2 text-xs text-white focus:ring-1 focus:ring-[#C2933D] focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-[11px] uppercase tracking-wider text-[#C2933D] font-bold mb-1">Guests</label>
                            <select
                                value={guestCount}
                                onChange={(e) => setGuestCount(Number(e.target.value))}
                                className="w-full bg-[#1C3322] border border-[#C2933D]/30 rounded-lg px-3 py-2.5 text-xs text-white focus:ring-1 focus:ring-[#C2933D] focus:outline-none"
                            >
                                <option value={1}>1 Solo Explorer</option>
                                <option value={2}>2 Adults (Couple)</option>
                                <option value={3}>3 Guests</option>
                                <option value={4}>4 Guests (Family)</option>
                                <option value={6}>6 Guests (Small Group)</option>
                                <option value={10}>Private Vehicle Exclusive (Up to 10)</option>
                            </select>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-[#C2933D] to-[#DEAE59] text-[#122216] font-bold py-2.5 px-4 rounded-lg text-xs uppercase tracking-wider transition hover:brightness-110 shadow flex items-center justify-center gap-2"
                            >
                                <Search className="w-4 h-4" />
                                <span>Check &amp; Book</span>
                            </button>
                        </div>
                    </form>
                </div>

                {/* Subtle Interactive Slide Indicators */}
                <div className="flex items-center justify-center gap-2 mt-6">
                    {BACKGROUND_SLIDES.map((_, index) => (
                        <button
                            key={index}
                            type="button"
                            onClick={() => setCurrentImageIndex(index)}
                            aria-label={`Switch to safari background ${index + 1}`}
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                                index === currentImageIndex
                                    ? 'w-6 bg-[#C2933D]'
                                    : 'w-2 bg-white/20 hover:bg-white/40'
                            }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}