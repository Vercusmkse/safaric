'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { useCurrency } from '@/context/CurrencyContext';
import { CURRENCIES } from '@/lib/currency';
import { CurrencyCode } from '@/types/safari';
import { Menu, X, Calendar, MessageCircle } from 'lucide-react';

interface NavbarProps {
    readonly onOpenBooking: () => void;
}

const NAV_ITEMS = [
    { label: 'Safaris & Packages', href: '/#safaris' },
    { label: 'Our Services', href: '/#services' },
    { label: 'The Big Five', href: '/#big-five' },
    { label: 'Gallery', href: '/#gallery' },
    { label: 'Conservation', href: '/#impact' },
    { label: 'Contact', href: '/#contact' },
];

export default function Navbar({ onOpenBooking }: NavbarProps) {
    const { currency, setCurrency } = useCurrency();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-40 bg-[#1C3322]/95 backdrop-blur-md text-white border-b border-[#C2933D]/20 shadow-xl">
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-2">

                {/* Company Brand Logo */}
                <Link href="/" className="flex items-center gap-2.5 sm:gap-3.5 group flex-shrink-0">
                    <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 transition-transform duration-300 group-hover:scale-105 overflow-hidden rounded-full border border-[#C2933D]/40 bg-white shadow-md">
                        <Image
                            src="/logoo.jpg"
                            alt="SAFARIC Logo"
                            width={48}
                            height={48}
                            priority
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div>
                        <span className="font-serif text-xl sm:text-2xl font-bold tracking-[0.18em] sm:tracking-[0.2em] text-white block leading-tight">
                            SAFARIC
                        </span>
                        <span className="text-[8px] sm:text-[9px] tracking-[0.2em] sm:tracking-[0.25em] text-[#C2933D] uppercase font-semibold block whitespace-nowrap">
                            Nature Connects Us
                        </span>
                    </div>
                </Link>

                {/* Desktop Nav Links */}
                <nav className="hidden lg:flex items-center gap-6 xl:gap-7 text-sm font-medium">
                    {NAV_ITEMS.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="text-stone-200 hover:text-[#C2933D] transition"
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-2 sm:gap-3">
                    {/* Desktop Currency Switcher */}
                    <div className="hidden md:flex items-center gap-1 bg-[#122216] px-2.5 py-1.5 rounded-full border border-[#C2933D]/30">
                        <select
                            aria-label="Select Currency"
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                            className="bg-transparent text-[#DEAE59] font-semibold text-xs focus:outline-none cursor-pointer"
                        >
                            {Object.entries(CURRENCIES).map(([code, config]) => (
                                <option key={code} value={code} className="bg-[#122216] text-white">
                                    {config.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <a
                        href="https://wa.me/27836213226?text=Hello%20Safaric!%20I'm%20planning%20a%20Kruger%20Safari."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hidden sm:inline-flex items-center gap-1.5 bg-emerald-800/80 hover:bg-emerald-700 text-white text-xs font-semibold px-3.5 py-2.5 rounded-full border border-emerald-500/40 transition shadow"
                    >
                        <MessageCircle className="w-4 h-4 text-emerald-300" />
                        <span>WhatsApp</span>
                    </a>

                    <button
                        type="button"
                        onClick={onOpenBooking}
                        className="bg-gradient-to-r from-[#C2933D] via-[#DEAE59] to-[#C2933D] text-[#122216] font-bold text-xs sm:text-sm px-4 sm:px-5 py-2.5 rounded-full shadow-lg hover:brightness-105 transition transform active:scale-95 flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                    >
                        <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span>Book Safari</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="lg:hidden p-2 text-stone-200 hover:text-white cursor-pointer"
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown */}
            {mobileMenuOpen && (
                <div className="lg:hidden bg-[#122216] border-b border-[#C2933D]/20 px-6 py-5 space-y-3">
                    {NAV_ITEMS.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block text-stone-200 hover:text-[#C2933D] py-1.5 text-sm font-medium"
                        >
                            {item.label}
                        </Link>
                    ))}

                    {/* Mobile Currency Selector */}
                    <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                        <span className="text-xs text-stone-400 uppercase font-semibold tracking-wider">Currency:</span>
                        <select
                            aria-label="Select Currency"
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                            className="bg-[#1C3322] text-[#DEAE59] font-semibold text-xs px-3 py-1.5 rounded-lg border border-[#C2933D]/30 focus:outline-none"
                        >
                            {Object.entries(CURRENCIES).map(([code, config]) => (
                                <option key={code} value={code} className="bg-[#122216] text-white">
                                    {config.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="pt-2 flex flex-col gap-2.5">
                        <button
                            type="button"
                            onClick={() => { setMobileMenuOpen(false); onOpenBooking(); }}
                            className="w-full bg-gradient-to-r from-[#C2933D] to-[#DEAE59] text-[#122216] font-bold py-2.5 rounded-xl text-sm shadow cursor-pointer"
                        >
                            Book Safari Today
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
}