'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { MapPin, Eye, X, Sparkles, Camera } from 'lucide-react';

interface AttractionItem {
    id: string;
    title: string;
    category: 'big-five' | 'landscapes' | 'vehicles' | 'birding';
    location: string;
    caption: string;
    src: string;
    freeFeatureNote?: string;
}

const GALLERY_DATA: AttractionItem[] = [
    {
        id: '1',
        title: 'Male Lion on the S100 Granitic Loop',
        category: 'big-five',
        location: 'Central Kruger (Satara / Skukuza)',
        caption: 'Patrolling the open savanna grassland at dawn after an overnight hunt.',
        src: '/images/gallery/lion.jpg',
        freeFeatureNote: 'Tracked using onboard high-gain radio and game spotting scopes',
    },
    {
        id: '2',
        title: 'Custom 10-Seater Open Safari Cruisers',
        category: 'vehicles',
        location: 'Phabeni Gate Entrance',
        caption: 'Tiered stadium seating designed for 360-degree unobstructed angles and low-level wildlife photography.',
        src: '/images/gallery/vehicle.jpg',
        freeFeatureNote: 'Complimentary beanbags and fleece ponchos equipped at every seat',
    },
    {
        id: '3',
        title: 'Blyde River Canyon & Three Rondavels',
        category: 'landscapes',
        location: 'Mpumalanga Panorama Route',
        caption: 'Panoramic canyon vista viewed from 1,300 meters above sea level along the Drakensberg Escarpment.',
        src: '/images/gallery/panorama.jpg',
        freeFeatureNote: 'Included with all 4-Day & 5-Day Extended Concession expeditions',
    },
    {
        id: '4',
        title: 'Breeding Elephant Herd along Sabie River',
        category: 'big-five',
        location: 'Lower Sabie Riparian Zone',
        caption: 'Multi-generational family herd browsing in the reed beds and shallow pools during peak midday heat.',
        src: '/images/gallery/elephants.jpg',
        freeFeatureNote: 'Complimentary Bushnell 10x42 binoculars provided per explorer',
    },
    {
        id: '5',
        title: 'Leopard Resting in Marula Canopy',
        category: 'big-five',
        location: 'Paul Kruger Gate Corridor',
        caption: 'Solitary territorial feline sheltering in the high canopy branches before dusk activity.',
        src: '/images/gallery/leopard.jpg',
        freeFeatureNote: 'Dedicated tracking stops with engine idling silenced for filming',
    },
    {
        id: '6',
        title: 'Lilac-Breasted Roller & Raptor Flight',
        category: 'birding',
        location: 'Pretoriuskop Granite Outcrops',
        caption: 'Vibrant plumage and raptor tracking along the southern mixed-woodland corridors.',
        src: '/images/gallery/birds.jpg',
        freeFeatureNote: 'Free laminated Kruger wildlife & bird checklists on board',
    },
];

export default function AttractionsGallery() {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [activePhoto, setActivePhoto] = useState<AttractionItem | null>(null);

    const filteredPhotos = selectedCategory === 'all'
        ? GALLERY_DATA
        : GALLERY_DATA.filter((item) => item.category === selectedCategory);

    return (
        <section className="py-24 bg-[#122216] text-white border-t border-[#C2933D]/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                <div className="text-center max-w-3xl mx-auto space-y-3">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#DEAE59] text-xs font-mono font-bold uppercase tracking-widest border border-white/10">
                        <Camera className="w-3.5 h-3.5 text-[#DEAE59]" />
                        <span>Kruger Attractions &amp; Field Photography</span>
                    </div>
                    <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-white">
                        Captured on Safaric Expeditions
                    </h2>
                    <p className="text-sm text-stone-300 leading-relaxed font-light">
                        Authentic encounters from inside Kruger National Park and the Mpumalanga Escarpment, photographed directly from our custom open cruisers.
                    </p>
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap items-center justify-center gap-2">
                    {[
                        { id: 'all', label: 'All Sightings' },
                        { id: 'big-five', label: 'The Big Five' },
                        { id: 'landscapes', label: 'Panorama Route' },
                        { id: 'vehicles', label: 'Safari Cruisers' },
                        { id: 'birding', label: 'Birdlife & Flora' },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setSelectedCategory(tab.id)}
                            className={`px-4 py-2 rounded-full text-xs font-semibold transition cursor-pointer ${
                                selectedCategory === tab.id
                                    ? 'bg-[#C2933D] text-[#122216] shadow-lg font-bold'
                                    : 'bg-white/10 text-stone-300 hover:bg-white/20 border border-white/10'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Image Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPhotos.map((photo) => (
                        <div
                            key={photo.id}
                            onClick={() => setActivePhoto(photo)}
                            className="group relative bg-[#1C3322] rounded-3xl overflow-hidden border border-[#C2933D]/20 shadow-xl hover:border-[#DEAE59] transition-all duration-300 cursor-pointer flex flex-col"
                        >
                            <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-900">
                                <Image
                                    src={photo.src}
                                    alt={photo.title}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#1C3322] via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                                <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-semibold text-white flex items-center gap-1.5 border border-white/20">
                                    <MapPin className="w-3 h-3 text-[#DEAE59]" />
                                    <span>{photo.location}</span>
                                </div>

                                <div className="absolute top-3 right-3 bg-[#DEAE59] text-[#122216] p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                                    <Eye className="w-4 h-4" />
                                </div>

                                <div className="absolute bottom-3 left-4 right-4 text-white">
                                    <h3 className="font-serif font-bold text-lg leading-snug">
                                        {photo.title}
                                    </h3>
                                </div>
                            </div>

                            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                                <p className="text-xs text-stone-300 leading-relaxed">
                                    {photo.caption}
                                </p>

                                {photo.freeFeatureNote && (
                                    <div className="pt-3 border-t border-white/10 flex items-center gap-2 text-[11px] text-[#DEAE59] font-medium">
                                        <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
                                        <span>{photo.freeFeatureNote}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Lightbox Modal */}
            {activePhoto && (
                <div
                    role="dialog"
                    aria-modal="true"
                    className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md p-4 flex items-center justify-center"
                    onClick={() => setActivePhoto(null)}
                >
                    <div
                        className="relative max-w-4xl w-full bg-[#1C3322] rounded-3xl overflow-hidden border border-[#C2933D]/40 text-white shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            aria-label="Close photo preview"
                            onClick={() => setActivePhoto(null)}
                            className="absolute top-4 right-4 z-10 bg-black/70 text-white hover:bg-black p-2.5 rounded-full transition cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="relative aspect-[16/10] w-full bg-stone-900">
                            <Image
                                src={activePhoto.src}
                                alt={activePhoto.title}
                                fill
                                sizes="100vw"
                                className="object-contain"
                            />
                        </div>

                        <div className="p-6 sm:p-8 space-y-3 bg-[#1C3322]">
                            <div className="flex items-center gap-2 text-xs font-mono text-[#DEAE59]">
                                <MapPin className="w-3.5 h-3.5" />
                                <span>{activePhoto.location}</span>
                            </div>
                            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                                {activePhoto.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-light">
                                {activePhoto.caption}
                            </p>
                            {activePhoto.freeFeatureNote && (
                                <p className="text-xs text-emerald-300 font-semibold pt-1">
                                    ✦ Included in Package: {activePhoto.freeFeatureNote}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}