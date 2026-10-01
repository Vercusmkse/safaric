'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Award, Volume2 } from 'lucide-react';

interface GuideData {
    id: string;
    name: string;
    role: string;
    accreditation: string;
    registrationNumber: string;
    specialties: string[];
    yearsExperience: number;
    bio: string;
    imageUrl: string;
}

const GUIDES: GuideData[] = [
    {
        id: 'guide-sipho',
        name: 'Sipho Khumalo',
        role: 'Lead Naturalist & Tracker',
        accreditation: 'Tourism Act Registered • Dangerous Game Certified',
        registrationNumber: 'GP/NAT/4821',
        specialties: ['Predator Ethology', 'Track & Sign Specialist', 'Birding Identification'],
        yearsExperience: 14,
        bio: 'Raised along the southern boundary of Greater Kruger, Sipho has spent over a decade deciphering lowveld footprints, alarm calls, and predator movement corridors.',
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    },
    {
        id: 'guide-johann',
        name: 'Johann Van Der Merwe',
        role: 'Senior Naturalist & Wildlife Specialist',
        accreditation: 'CATHSSETA NQF Level 4 • Provincially Registered',
        registrationNumber: 'MP/NAT/3190',
        specialties: ['Wildlife Photography', 'Lowveld Ecology', 'Astrophotography'],
        yearsExperience: 11,
        bio: 'A professional wildlife photographer and guide who positions vehicles specifically for golden hour angles, clean backgrounds, and predictable animal behavior.',
        imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    },
];

export function GuideShowcase() {
    const [playingGuideId, setPlayingGuideId] = useState<string | null>(null);

    const toggleAudio = (id: string) => {
        setPlayingGuideId((prev) => (prev === id ? null : id));
    };

    return (
        <section className="py-20 bg-[#122216] border-t border-[#C2933D]/20 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#C2933D] block mb-2">
                            Guiding Excellence
                        </span>
                        <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
                            Accredited Lead Nature Guides
                        </h2>
                    </div>
                    <p className="text-stone-300 text-xs sm:text-sm font-light max-w-md leading-relaxed">
                        Every SAFARIC departure is captained by accredited professional guides holding statutory Tourism Act qualifications, dangerous game tracking credentials, and decades of lowveld pedigree.
                    </p>
                </div>

                {/* Guide Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {GUIDES.map((guide) => (
                        <div
                            key={guide.id}
                            className="rounded-3xl border border-[#C2933D]/30 bg-[#162a1c] p-6 sm:p-8 flex flex-col sm:flex-row gap-6 shadow-2xl hover:border-[#C2933D] transition-colors"
                        >
                            {/* Guide Headshot */}
                            <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden shrink-0 border border-[#C2933D]/40">
                                <Image
                                    src={guide.imageUrl}
                                    alt={guide.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            {/* Guide Profile Information */}
                            <div className="flex-1 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                                                {guide.name}
                                            </h3>
                                            <span className="text-[10px] text-stone-400 font-mono block">
                                                Reg: {guide.registrationNumber}
                                            </span>
                                        </div>
                                        <span className="text-[11px] text-[#DEAE59] font-semibold bg-[#1C3322] px-2.5 py-1 rounded-full border border-[#C2933D]/30 whitespace-nowrap">
                                            {guide.yearsExperience}+ Yrs Bush
                                        </span>
                                    </div>

                                    {/* Accreditation Line */}
                                    <div className="inline-flex items-center gap-1.5 text-xs text-[#DEAE59] font-medium mt-2">
                                        <Award className="w-3.5 h-3.5 shrink-0 text-[#C2933D]" />
                                        <span>{guide.accreditation}</span>
                                    </div>

                                    <p className="text-xs sm:text-sm text-stone-300 font-light mt-3 leading-relaxed">
                                        {guide.bio}
                                    </p>
                                </div>

                                {/* Tags & Audio Action */}
                                <div className="mt-5 pt-4 border-t border-[#C2933D]/20 flex items-center justify-between gap-2">
                                    <div className="flex flex-wrap gap-1.5">
                                        {guide.specialties.map((spec) => (
                                            <span
                                                key={spec}
                                                className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#1C3322] text-stone-200 border border-[#C2933D]/20"
                                            >
                                                {spec}
                                            </span>
                                        ))}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => toggleAudio(guide.id)}
                                        aria-label={playingGuideId === guide.id ? `Stop intro for ${guide.name}` : `Listen to intro for ${guide.name}`}
                                        className="inline-flex items-center gap-1.5 text-xs text-[#DEAE59] hover:text-white cursor-pointer font-semibold transition shrink-0"
                                    >
                                        <Volume2 className="w-3.5 h-3.5 text-[#C2933D]" />
                                        <span>{playingGuideId === guide.id ? 'Playing...' : 'Audio Intro'}</span>
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

export default GuideShowcase;