'use client';

import React, { useState } from 'react';
import { SafariPackage } from '@/types/safari';
import { SAFARI_PACKAGES } from '@/data/packages';
import { useCurrency } from '@/context/CurrencyContext';
import { Clock, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';

interface PackageSectionProps {
    onSelectPackage: (pkg: SafariPackage) => void;
}

export default function PackageSection({ onSelectPackage }: PackageSectionProps) {
    const { format } = useCurrency();
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    const filtered = selectedCategory === 'all'
        ? SAFARI_PACKAGES
        : SAFARI_PACKAGES.filter((p) => p.category === selectedCategory);

    return (
        <section id="safaris" className="py-20 bg-[#FDFBF7]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#C2933D]">Explore • Discover • Experience</span>
                    <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#1C3322] mt-2 mb-4">
                        Curated Kruger Safaris &amp; Adventures
                    </h2>
                    <div className="w-20 h-1 bg-[#C2933D] mx-auto mb-4 rounded-full" />
                    <p className="text-stone-600 text-sm sm:text-base font-light">
                        All game drives conducted on custom 4x4 open safari vehicles equipped with tiered seating, phone charging hubs, and high-frequency sighting radios.
                    </p>

                    {/* Filter Tabs */}
                    <div className="flex flex-wrap justify-center gap-2 mt-8">
                        {[
                            { id: 'all', label: 'All Experiences' },
                            { id: 'day-drive', label: 'Game Drives' },
                            { id: 'photo', label: 'Photography Charter' },
                            { id: 'multiday', label: 'Multi-Day Safaris' },
                            { id: 'transfer', label: 'Transfers & Shuttles' },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setSelectedCategory(tab.id)}
                                className={`px-4 py-2 text-xs font-semibold rounded-full border transition ${
                                    selectedCategory === tab.id
                                        ? 'bg-[#1C3322] text-white border-[#1C3322] shadow'
                                        : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Card Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filtered.map((pkg) => (
                        <div
                            key={pkg.id}
                            className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-stone-200 flex flex-col group"
                        >
                            <div className="relative h-56 overflow-hidden">
                                <img
                                    src={pkg.imageUrl}
                                    alt={pkg.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                />
                                {pkg.badge && (
                                    <span className="absolute top-3 right-3 bg-[#C2933D] text-[#122216] text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                    {pkg.badge}
                  </span>
                                )}
                                <div className="absolute bottom-3 left-3 bg-[#122216]/85 text-white text-xs px-2.5 py-1 rounded backdrop-blur-sm flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5 text-[#C2933D]" />
                                    <span>{pkg.duration}</span>
                                </div>
                            </div>

                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex items-center gap-1 text-xs text-stone-500 mb-2">
                                    <MapPin className="w-3.5 h-3.5 text-[#C2933D]" />
                                    <span>{pkg.location}</span>
                                </div>

                                <h3 className="font-serif text-2xl font-bold text-[#1C3322] mb-2">{pkg.title}</h3>
                                <p className="text-stone-600 text-xs leading-relaxed mb-4 flex-1">{pkg.description}</p>

                                <div className="space-y-1.5 text-xs text-stone-600 mb-6 bg-[#F7F4EC] p-3 rounded-xl border border-[#C2933D]/20">
                                    {pkg.highlights.map((h, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
                                            <span>{h}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                                    <div>
                    <span className="text-[10px] text-stone-500 uppercase tracking-wider block">
                      {pkg.isVehicleRate ? 'Per Vehicle Private' : 'From Per Person'}
                    </span>
                                        <span className="text-xl font-bold text-[#1C3322]">
                      {format(pkg.basePriceZAR)}
                    </span>
                                    </div>
                                    <button
                                        onClick={() => onSelectPackage(pkg)}
                                        className="bg-[#1C3322] hover:bg-[#2B4D34] text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition flex items-center gap-1.5 shadow"
                                    >
                                        <span>Reserve</span>
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}