'use client';

import React, { useState } from 'react';
import { useCurrency } from '@/context/CurrencyContext';
import { CURRENCIES } from '@/lib/currency';
import { CurrencyCode } from '@/types/safari';
import { Phone, Mail, MapPin, Menu, X, Calendar, MessageCircle, ShieldCheck } from 'lucide-react';

interface NavbarProps {
    onOpenBooking: () => void;
}

export default function Navbar({ onOpenBooking }: NavbarProps) {
    const { currency, setCurrency } = useCurrency();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <>
            {/* Top Utility Bar */}
            <div className="bg-[#122216] text-[#EAD5A8] text-xs py-2 px-4 border-b border-[#1C3322]/60">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
                    <div className="flex items-center gap-4 text-[11px] sm:text-xs">
            <span className="flex items-center gap-1.5 font-medium">
              <MapPin className="w-3.5 h-3.5 text-[#C2933D]" />
              Kruger National Park &amp; Surrounding Areas, South Africa
            </span>
                        <span className="hidden md:inline text-[#2B4D34]">|</span>
                        <span className="hidden md:flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              FGASA Certified Field Guides
            </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs">
                        <a href="tel:+27711234567" className="hover:text-white transition flex items-center gap-1">
                            <Phone className="w-3 h-3 text-[#C2933D]" /> +27 71 123 4567
                        </a>
                        <span className="text-[#2B4D34]">•</span>
                        <a href="mailto:info@safaric.co.za" className="hover:text-white transition flex items-center gap-1">
                            <Mail className="w-3 h-3 text-[#C2933D]" /> info@safaric.co.za
                        </a>
                        <span className="text-[#2B4D34]">•</span>

                        {/* Currency Switcher */}
                        <div className="flex items-center gap-1 bg-[#1C3322] px-2 py-0.5 rounded border border-[#C2933D]/30">
                            <span className="text-[#C2933D] font-bold text-[10px]">CURRENCY:</span>
                            <select
                                aria-label="Select Currency"
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                                className="bg-transparent text-white font-semibold text-xs focus:outline-none cursor-pointer"
                            >
                                {Object.entries(CURRENCIES).map(([code, config]) => (
                                    <option key={code} value={code} className="bg-[#122216] text-white">
                                        {config.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Navigation Bar */}
            <header className="sticky top-0 z-40 bg-[#1C3322]/95 backdrop-blur-md text-white border-b border-[#C2933D]/20 shadow-xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">

                    {/* Scalable SVG Logo */}
                    <a href="#" className="flex items-center gap-3.5 group">
                        <div className="relative w-12 h-12 flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
                            <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow">
                                <circle cx="100" cy="100" r="88" fill="none" stroke="#C2933D" strokeWidth="3" strokeDasharray="450 60" strokeLinecap="round" />
                                <circle cx="100" cy="100" r="88" fill="none" stroke="#2B4D34" strokeWidth="4.5" strokeDasharray="250 250" strokeLinecap="round" transform="rotate(130 100 100)" />
                                <path d="M48,135 Q70,146 102,152 Q72,138 52,130 Z" fill="#2B4D34" />
                                <path d="M52,133 Q62,118 64,106 Q68,98 72,94 L70,91 Q63,98 60,105 Q58,118 48,134 Z" fill="#2B4D34" />
                                <ellipse cx="64" cy="92" rx="30" ry="7" fill="#2B4D34" />
                                <ellipse cx="68" cy="88" rx="22" ry="5" fill="#2B4D34" />
                                <ellipse cx="60" cy="85" rx="14" ry="4" fill="#2B4D34" />
                                <text x="96" y="122" fontFamily="'Cormorant Garamond', Georgia, serif" fontSize="110" fontWeight="700" fill="#C2933D" textAnchor="middle">S</text>
                                <text x="126" y="140" fontFamily="'Cormorant Garamond', Georgia, serif" fontSize="95" fontWeight="700" fill="#2B4D34" textAnchor="middle">C</text>
                                <path d="M125,56 Q135,46 142,50 Q146,55 142,61 Q155,60 162,72 Q166,79 160,85 Q154,87 148,84 Q142,88 136,83" fill="none" stroke="#C2933D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                <circle cx="152" cy="65" r="1.5" fill="#C2933D" />
                            </svg>
                        </div>
                        <div>
                            <span className="font-serif text-2xl font-bold tracking-[0.2em] text-white block">SAFARIC</span>
                            <span className="text-[9px] tracking-[0.25em] text-[#C2933D] uppercase font-semibold block -mt-1">Nature Connects Us</span>
                        </div>
                    </a>

                    {/* Desktop Nav Links */}
                    <nav className="hidden lg:flex items-center gap-7 text-sm font-medium">
                        <a href="#safaris" className="text-stone-200 hover:text-[#C2933D] transition">Safaris &amp; Packages</a>
                        <a href="#services" className="text-stone-200 hover:text-[#C2933D] transition">Our Services</a>
                        <a href="#bigfive" className="text-stone-200 hover:text-[#C2933D] transition">The Big Five</a>
                        <a href="#impact" className="text-stone-200 hover:text-[#C2933D] transition">Conservation</a>
                        <a href="#contact" className="text-stone-200 hover:text-[#C2933D] transition">Contact</a>
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        <a
                            href="https://wa.me/27711234567?text=Hello%20Safaric!%20I'm%20planning%20a%20Kruger%20Safari."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hidden sm:inline-flex items-center gap-1.5 bg-emerald-800/80 hover:bg-emerald-700 text-white text-xs font-semibold px-3.5 py-2.5 rounded-full border border-emerald-500/40 transition shadow"
                        >
                            <MessageCircle className="w-4 h-4 text-emerald-300" />
                            <span>WhatsApp</span>
                        </a>

                        <button
                            onClick={onOpenBooking}
                            className="bg-gradient-to-r from-[#C2933D] via-[#DEAE59] to-[#C2933D] text-[#122216] font-bold text-xs sm:text-sm px-5 py-2.5 rounded-full shadow-lg hover:brightness-105 transition transform active:scale-95 flex items-center gap-2"
                        >
                            <Calendar className="w-4 h-4" />
                            <span>Book Safari</span>
                        </button>

                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-2 text-stone-200 hover:text-white"
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Dropdown */}
                {mobileMenuOpen && (
                    <div className="lg:hidden bg-[#122216] border-b border-[#C2933D]/20 px-6 py-5 space-y-3">
                        <a href="#safaris" onClick={() => setMobileMenuOpen(false)} className="block text-stone-200 hover:text-[#C2933D] py-1 text-sm">Safaris &amp; Packages</a>
                        <a href="#services" onClick={() => setMobileMenuOpen(false)} className="block text-stone-200 hover:text-[#C2933D] py-1 text-sm">Our Services</a>
                        <a href="#bigfive" onClick={() => setMobileMenuOpen(false)} className="block text-stone-200 hover:text-[#C2933D] py-1 text-sm">The Big Five</a>
                        <a href="#impact" onClick={() => setMobileMenuOpen(false)} className="block text-stone-200 hover:text-[#C2933D] py-1 text-sm">Conservation &amp; Community</a>
                        <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="block text-stone-200 hover:text-[#C2933D] py-1 text-sm">Contact Us</a>
                        <button
                            onClick={() => { setMobileMenuOpen(false); onOpenBooking(); }}
                            className="w-full bg-[#C2933D] text-[#122216] font-bold py-2.5 rounded-lg text-sm shadow"
                        >
                            Book Safari Today
                        </button>
                    </div>
                )}
            </header>
        </>
    );
}