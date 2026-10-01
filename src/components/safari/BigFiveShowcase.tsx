'use client';

import React, { useState, useEffect } from 'react';
import { BIG_FIVE } from '@/data/wildlife';
import { WildlifeProfile } from '@/types/safari';
import { Eye, MapPin, Camera, X } from 'lucide-react';

export default function BigFiveShowcase() {
    const [activeAnimal, setActiveAnimal] = useState<WildlifeProfile | null>(null);

    // Close modal when pressing the Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setActiveAnimal(null);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <section id="bigfive" className="py-20 bg-[#122216] text-white relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-14">
                    <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#C2933D] block mb-2">
                        South Africa's Wilderness Icons
                    </span>
                    <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white mt-2 mb-3">
                        The Big Five... And So Much More
                    </h2>
                    <div className="w-20 h-1 bg-[#C2933D] mx-auto mb-4 rounded-full" />
                    <p className="text-stone-300 text-sm sm:text-base font-light">
                        Our registered nature guides decode fresh spoors, wind direction, and lowveld alarm calls to deliver respectful, up-close wildlife encounters.
                    </p>
                </div>

                {/* 5 Animal Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    {BIG_FIVE.map((animal) => (
                        <div
                            key={animal.id}
                            role="button"
                            tabIndex={0}
                            onClick={() => setActiveAnimal(animal)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    setActiveAnimal(animal);
                                }
                            }}
                            className="group relative rounded-2xl overflow-hidden h-80 border border-[#C2933D]/30 shadow-xl cursor-pointer transform hover:-translate-y-2 transition duration-300 focus:outline-none focus:ring-2 focus:ring-[#C2933D]"
                        >
                            <img
                                src={animal.imageUrl}
                                alt={animal.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition duration-700 brightness-90"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                            <div className="absolute bottom-4 left-4 right-4 text-left">
                                <span className="text-[10px] text-[#DEAE59] font-bold uppercase tracking-wider block">
                                    {animal.title}
                                </span>
                                <h4 className="font-serif text-2xl font-bold text-white">
                                    {animal.name}
                                </h4>
                                <div className="mt-2 flex items-center gap-1.5 text-xs text-stone-300 opacity-0 group-hover:opacity-100 transition duration-300">
                                    <Eye className="w-3.5 h-3.5 text-[#C2933D]" />
                                    <span>Tap for tracking insights</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Guarantee Quote */}
                <div className="mt-14 max-w-2xl mx-auto text-center border-t border-[#C2933D]/20 pt-8">
                    <p className="font-serif italic text-xl sm:text-2xl text-[#EAD5A8] font-light">
                        &ldquo;Unforgettable experiences in the heart of Africa.&rdquo;
                    </p>
                    <span className="text-xs tracking-widest uppercase text-stone-400 mt-2 block">
                        — The Safaric Guarantee
                    </span>
                </div>

            </div>

            {/* Modal Profile Sighting Sheet */}
            {activeAnimal && (
                <div
                    onClick={(e) => {
                        // Click backdrop to close
                        if (e.target === e.currentTarget) setActiveAnimal(null);
                    }}
                    className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm p-4 flex items-center justify-center animate-in fade-in duration-200"
                >
                    <div className="bg-[#1C3322] border border-[#C2933D] text-white rounded-3xl max-w-lg w-full p-6 sm:p-8 relative shadow-2xl">
                        <button
                            onClick={() => setActiveAnimal(null)}
                            aria-label="Close wildlife profile"
                            className="absolute top-4 right-4 text-stone-300 hover:text-white bg-black/40 p-2 rounded-full cursor-pointer hover:bg-black/60 transition"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <span className="text-xs font-bold uppercase text-[#DEAE59] tracking-widest block mb-1">
                            {activeAnimal.scientificName}
                        </span>
                        <h3 className="font-serif text-3xl font-bold text-white mb-2">
                            {activeAnimal.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-stone-200 leading-relaxed mb-6 font-light">
                            {activeAnimal.description}
                        </p>

                        <div className="space-y-3 bg-[#122216] p-4 rounded-xl border border-[#C2933D]/20 text-xs">
                            <div className="flex items-start gap-2.5">
                                <MapPin className="w-4 h-4 text-[#C2933D] flex-shrink-0 mt-0.5" />
                                <div>
                                    <strong className="text-stone-300 block">Prime Kruger Territory:</strong>
                                    <span className="text-stone-400">{activeAnimal.bestKrugerZones}</span>
                                </div>
                            </div>
                            <div className="flex items-start gap-2.5">
                                <Camera className="w-4 h-4 text-[#C2933D] flex-shrink-0 mt-0.5" />
                                <div>
                                    <strong className="text-stone-300 block">Field Photography Tip:</strong>
                                    <span className="text-stone-400">{activeAnimal.photographyTip}</span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setActiveAnimal(null)}
                            className="mt-6 w-full bg-gradient-to-r from-[#C2933D] to-[#DEAE59] text-[#122216] font-bold py-3 rounded-xl text-xs uppercase tracking-wider hover:brightness-110 transition cursor-pointer"
                        >
                            Back to Exploration
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}