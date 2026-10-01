'use client';

import React from 'react';
import { Truck, ShieldCheck, Plane, Users, Compass, Map } from 'lucide-react';

const SERVICES = [
    {
        icon: Truck,
        title: 'Guided Safari Drives',
        desc: 'Morning, afternoon, sunset, and full-day expeditions in custom open 4x4 vehicles led by Tourism Act registered nature guides[cite: 3]. Every drive includes complimentary warm blankets, ponchos, and chilled water.',
    },
    {
        icon: ShieldCheck,
        title: 'Private Vehicle Charters',
        desc: 'Sole-use open safari vehicles (half-day and full-day) dedicated entirely to your private party. Set your own pace, sighting durations, and focus species without shared passenger compromises.',
    },
    {
        icon: Plane,
        title: 'Lodge & Airport Transfers',
        desc: 'Punctual transit connecting regional airports (KMIA Nelspruit, Skukuza) with complimentary gate pickups from Ngwenya Lodge, Marloth Park, Crocodile Bridge, and Lower Sabie Rest Camp.',
    },
    {
        icon: Map,
        title: 'Panorama Escarpment Tours',
        desc: 'Bespoke scenic day tours on request covering the Mpumalanga escarpment: Blyde River Canyon, God’s Window, Lisbon Falls, and Bourke’s Luck Potholes.',
    },
    {
        icon: Compass,
        title: 'Mozambique Coastal Excursions',
        desc: 'Tailor-made cross-border expeditions on request linking the Kruger lowveld with Maputo’s vibrant culture, tropical beaches, and fresh seafood cuisine.',
    },
    {
        icon: Users,
        title: 'Private Groups & Convoys',
        desc: 'Coordinated multi-vehicle fleet logistics for families and private groups, complete with rest camp meal arrangements and customized gate clearance.',
    },
];

export default function ServicesSection() {
    return (
        <section id="services" className="py-20 bg-[#F7F4EC] border-t border-stone-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#C2933D] block mb-2">
                        Complete Safari Infrastructure
                    </span>
                    <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#1C3322] mt-2 mb-4">
                        Tailored Services For Discerning Travelers
                    </h2>
                    <div className="w-20 h-1 bg-[#C2933D] mx-auto mb-4 rounded-full" />
                    <p className="text-stone-600 text-sm sm:text-base font-light">
                        Every step of your African safari is managed with authentic lowveld warmth, statutory guiding excellence[cite: 3], and operational reliability.
                    </p>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {SERVICES.map((s, idx) => {
                        const Icon = s.icon;
                        return (
                            <div
                                key={idx}
                                className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition duration-300 group"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-[#1C3322] text-[#C2933D] flex items-center justify-center mb-6 group-hover:bg-[#C2933D] group-hover:text-[#122216] transition-colors duration-300 shadow">
                                    <Icon className="w-7 h-7" />
                                </div>
                                <h3 className="font-serif text-2xl font-bold text-[#1C3322] mb-3">
                                    {s.title}
                                </h3>
                                <p className="text-stone-600 text-xs sm:text-sm leading-relaxed font-light">
                                    {s.desc}
                                </p>
                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}