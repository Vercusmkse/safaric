'use client';

import React from 'react';
import { Eye, Droplets, ShieldCheck, Sparkles } from 'lucide-react';

interface Perk {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
    badge: string;
}

const INCLUDED_PERKS: Perk[] = [
    {
        icon: Eye,
        title: 'High-Power Game Optics',
        description: 'Bushnell 10x42 high-contrast binoculars provided per explorer seat for observing predator behavior and distant river crossings.',
        badge: 'Free for All Explorers',
    },
    {
        icon: Droplets,
        title: 'Continuous Hydration & Cold Storage',
        description: 'Unlimited chilled mineral spring water and onboard insulated cooler boxes for personal beverages throughout the drive.',
        badge: 'Complimentary Onboard',
    },
    {
        icon: ShieldCheck,
        title: 'Thermal Ponchos & Dust Blankets',
        description: 'Heavy fleece-lined safari ponchos and wind-guards provided for crisp 05:30 AM open vehicle departures into Kruger.',
        badge: 'Full Weather Comfort',
    },
];

export default function FreeAmenitiesSection() {
    return (
        <section className="py-20 bg-[#F7F4EC] border-y border-[#C2933D]/20 text-stone-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                <div className="text-center max-w-3xl mx-auto space-y-3">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-mono font-bold uppercase tracking-widest">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Inclusive Bush Hospitality</span>
                    </div>
                    <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#1C3322]">
                        Every Booking Includes These Amenities Free of Charge
                    </h2>
                    <p className="text-sm text-stone-600 leading-relaxed">
                        No hidden equipment rental fees, optical surcharges, or cold water add-ons. Everything required for an immersive safari experience is provided as standard.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {INCLUDED_PERKS.map((perk) => {
                        const Icon = perk.icon;
                        return (
                            <div
                                key={perk.title}
                                className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm hover:border-[#C2933D] hover:shadow-md transition-all space-y-4"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-100">
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <span className="text-[10px] font-bold font-mono tracking-wider uppercase bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-200">
                                        {perk.badge}
                                    </span>
                                </div>

                                <div className="space-y-1.5">
                                    <h3 className="font-serif text-lg font-bold text-[#1C3322]">
                                        {perk.title}
                                    </h3>
                                    <p className="text-xs text-stone-600 leading-relaxed">
                                        {perk.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}