'use client';

import React, { useState, useEffect } from 'react';
import { useCurrency } from '@/context/CurrencyContext';
import { SAFARI_PACKAGES } from '@/data/packages';
import { computeDepositBreakdown } from '@/lib/currency';
import { Users, ShieldCheck, ArrowRight } from 'lucide-react';

interface StickyBookingBarProps {
    onOpenBookingModal: (packageId: string, adults: number) => void;
}

export function StickyBookingBar({ onOpenBookingModal }: StickyBookingBarProps) {
    const { currency } = useCurrency();
    const [selectedPackageId, setSelectedPackageId] = useState('pkg-4day-classic');
    const [guests, setGuests] = useState(2);
    const [isVisible, setIsVisible] = useState(false);

    const activePackage = SAFARI_PACKAGES.find((p) => p.id === selectedPackageId) || SAFARI_PACKAGES[0];
    const totalZar = activePackage.isVehicleRate
        ? activePackage.basePriceZAR
        : activePackage.basePriceZAR * guests;

    const breakdown = computeDepositBreakdown(totalZar, currency);

    useEffect(() => {
        const handleScroll = () => {
            setIsVisible(window.scrollY > 350);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (!isVisible) return null;

    return (
        <aside
            aria-label="Quick Booking"
            className="fixed bottom-0 left-0 right-0 z-40 bg-[#122216]/95 border-t border-[#C2933D]/30 backdrop-blur-lg px-4 py-3 shadow-2xl transition-transform duration-300 md:top-16 md:bottom-auto md:border-b md:border-t-0"
        >
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
                {/* Package & Seat Guarantee Selector */}
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <select
                        aria-label="Select safari experience"
                        value={selectedPackageId}
                        onChange={(e) => setSelectedPackageId(e.target.value)}
                        className="bg-[#1C3322] border border-[#C2933D]/40 text-white text-xs md:text-sm rounded-xl px-3 py-2 font-medium focus:ring-1 focus:ring-[#C2933D] focus:outline-none"
                    >
                        {SAFARI_PACKAGES.map((pkg) => (
                            <option key={pkg.id} value={pkg.id} className="bg-[#1C3322] text-white">
                                {pkg.title}
                            </option>
                        ))}
                    </select>

                    <div className="hidden lg:flex items-center gap-1.5 text-xs text-[#DEAE59] bg-[#1C3322] border border-[#C2933D]/30 px-3 py-1.5 rounded-xl">
                        <ShieldCheck className="w-4 h-4 text-[#C2933D]" />
                        <span>Max 6 Guests • Guaranteed Window</span>
                    </div>
                </div>

                {/* Guests and Live Pricing Breakdown */}
                <div className="flex items-center justify-between w-full md:w-auto gap-4">
                    <div className="flex items-center gap-2 bg-[#1C3322] border border-[#C2933D]/30 rounded-xl px-3 py-2 text-xs text-stone-200">
                        <Users className="w-4 h-4 text-[#C2933D]" />
                        <label htmlFor="sticky-guests-select" className="sr-only">Number of Guests</label>
                        <select
                            id="sticky-guests-select"
                            value={guests}
                            onChange={(e) => setGuests(Number(e.target.value))}
                            className="bg-transparent text-white text-xs font-semibold focus:outline-none cursor-pointer"
                        >
                            {[1, 2, 3, 4, 5, 6].map((num) => (
                                <option key={num} value={num} className="bg-[#1C3322] text-white">
                                    {num} {num === 1 ? 'Guest' : 'Guests'}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="text-right">
                        <div className="text-[11px] text-stone-300">
                            Total: <span className="text-white font-semibold">{breakdown.totalFormatted}</span>
                        </div>
                        <div className="text-sm md:text-base font-bold text-[#DEAE59]">
                            {breakdown.depositFormatted}{' '}
                            <span className="text-[10px] md:text-xs text-stone-300 font-normal">
                                (20% Deposit)
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={() => onOpenBookingModal(selectedPackageId, guests)}
                        className="flex items-center gap-2 bg-gradient-to-r from-[#C2933D] to-[#DEAE59] hover:brightness-110 text-[#122216] px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition shadow-lg cursor-pointer whitespace-nowrap"
                    >
                        <span>Reserve</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </aside>
    );
}