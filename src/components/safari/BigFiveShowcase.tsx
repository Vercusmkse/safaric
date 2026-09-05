'use client';

import React, { useState } from 'react';
import { BIG_FIVE } from '@/data/wildlife';
import { WildlifeProfile } from '@/types/safari';
import { Eye, MapPin, Camera, X } from 'lucide-react';

export default function BigFiveShowcase() {
    const [activeAnimal, setActiveAnimal] = useState<WildlifeProfile | null>(null);

    return (
        <section id="bigfive" className="py-20 bg-[#122216] text-white relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-14">
                    <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#C2933D]">South Africa's Wilderness Icons</span>
                    <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white mt-2 mb-3">
                        The Big Five... And So Much More
                    </h2>
                    <div className="w-20 h-1 bg-[#C2933D] mx-auto mb-4 rounded-full" />
                    <p className="text-stone-300 text-sm sm:text-base font-light">
                        Our indigenous field rangers decode animal tracks, wind direction, and alarm calls to deliver ethical, up-close viewing opportunities.
                    </p>
                </div>

                {/* 5 Animal Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    {BIG_FIVE.map((animal) => (
                        <div
                            key={animal.id}
                            onClick={() => setActiveAnimal(animal)}
                            className="group relative rounded-2xl overflow-hidden h-80 border border-[#C2933D]/30 shadow-xl cursor-pointer transform hover:-translate-y-2 transition duration-300"
                        >
                            <img
                                src={animal.imageUrl}
                                alt={animal.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition duration-700 brightness-90"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                            <div className="absolute bottom-4 left-4 right-4 text-left">
                                <span className="text-[10px] text-[#C2933D] font-bold uppercase tracking-wider block">{animal.title}</span>
                                <h4 className="font-serif text-2xl font-bold text-white">{animal.name}</h4>
                                <div className="mt-2 flex items-center gap-1.5 text-xs text-stone-300 opacity-0 group-hover:opacity-100 transition duration-300">
                                    <Eye className="w-3.5 h-3.5 text-[#C2933D]" />
                                    <span>Tap for tracking insights</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-14 max-w-2xl mx-auto text-center border-t border-[#C2933D]/20 pt-8">
                    <p className="font-serif italic text-xl sm:text-2xl text-[#EAD5A8] font-light">
                        &ldquo;Unforgettable experiences in the heart of Africa.&rdquo;
                    </p>
                    <span className="text-xs tracking-widest uppercase text-stone-400 mt-2 block">— The Safaric Guarantee</span>
                </div>
            </div>

            {/* Modal Profile Sighting Sheet */}
            {activeAnimal && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm p-4 flex items-center justify-center">
                    <div className="bg-[#1C3322] border border-[#C2933D] text-white rounded-3xl max-w-lg w-full p-6 sm:p-8 relative shadow-2xl">
                        <button
                            onClick={() => setActiveAnimal(null)}
                            className="absolute top-4 right-4 text-stone-300 hover:text-white bg-black/40 p-2 rounded-full"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <span className="text-xs font-bold uppercase text-[#C2933D] tracking-widest block">{activeAnimal.scientificName}</span>
                        <h3 className="font-serif text-3xl font-bold text-white mb-2">{activeAnimal.name}</h3>
                        <p className="text-xs sm:text-sm text-stone-200 leading-relaxed mb-6 font-light">{activeAnimal.description}</p>

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
                            className="mt-6 w-full bg-[#C2933D] text-[#122216] font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider hover:brightness-105"
                        >
                            Back to Exploration
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}