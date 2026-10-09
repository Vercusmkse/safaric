'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { GALLERY_CATEGORIES, GALLERY_PHOTOS, GalleryPhoto } from '@/data/gallery';
import { Camera, MapPin, ChevronLeft, ChevronRight, X, Sparkles, Filter } from 'lucide-react';

export default function CategorizedGallery() {
    const [activeTab, setActiveTab] = useState<string>('all');
    const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

    // Filter items based on selected category tab
    const filteredPhotos = activeTab === 'all'
        ? GALLERY_PHOTOS
        : GALLERY_PHOTOS.filter((photo) => photo.category === activeTab);

    // Lightbox navigation
    const handleNext = useCallback(() => {
        if (selectedPhotoIndex === null) return;
        setSelectedPhotoIndex((prev) => (prev! + 1) % filteredPhotos.length);
    }, [selectedPhotoIndex, filteredPhotos.length]);

    const handlePrev = useCallback(() => {
        if (selectedPhotoIndex === null) return;
        setSelectedPhotoIndex((prev) => (prev! - 1 + filteredPhotos.length) % filteredPhotos.length);
    }, [selectedPhotoIndex, filteredPhotos.length]);

    const handleClose = () => setSelectedPhotoIndex(null);

    // Keyboard navigation (Arrow keys & Escape)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (selectedPhotoIndex === null) return;
            if (e.key === 'ArrowRight') handleNext();
            if (e.key === 'ArrowLeft') handlePrev();
            if (e.key === 'Escape') handleClose();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedPhotoIndex, handleNext, handlePrev]);

    const activePhoto: GalleryPhoto | undefined =
        selectedPhotoIndex !== null ? filteredPhotos[selectedPhotoIndex] : undefined;

    return (
        <section id="gallery" className="py-24 bg-[#122216] text-white border-t border-[#C2933D]/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto space-y-3">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#DEAE59] text-xs font-mono font-bold uppercase tracking-widest border border-white/10">
                        <Camera className="w-3.5 h-3.5 text-[#DEAE59]" />
                        <span>Kruger Field Archive</span>
                    </div>
                    <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-white">
                        Wildlife Sightings by Category
                    </h2>
                    <p className="text-sm text-stone-300 font-light leading-relaxed">
                        Explore our field guides’ recent encounters across Kruger National Park. Select a category below to filter by species and terrain.
                    </p>
                </div>

                {/* Category Filter Navigation Bar */}
                <div className="flex flex-wrap items-center justify-center gap-2">
                    {GALLERY_CATEGORIES.map((cat) => {
                        const count = cat.id === 'all'
                            ? GALLERY_PHOTOS.length
                            : GALLERY_PHOTOS.filter((p) => p.category === cat.id).length;

                        const isActive = activeTab === cat.id;

                        return (
                            <button
                                key={cat.id}
                                type="button"
                                onClick={() => {
                                    setActiveTab(cat.id);
                                    setSelectedPhotoIndex(null);
                                }}
                                className={`px-4 py-2.5 rounded-full text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                                    isActive
                                        ? 'bg-[#C2933D] text-[#122216] shadow-lg font-bold scale-105'
                                        : 'bg-white/10 text-stone-300 hover:bg-white/20 border border-white/10'
                                }`}
                            >
                                <span>{cat.label}</span>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                                    isActive ? 'bg-[#122216] text-[#DEAE59]' : 'bg-black/40 text-stone-300'
                                }`}>
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Photo Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredPhotos.map((photo, idx) => (
                        <div
                            key={photo.id}
                            onClick={() => setSelectedPhotoIndex(idx)}
                            className="group relative h-72 rounded-2xl overflow-hidden bg-stone-900 border border-white/10 hover:border-[#DEAE59] transition-all duration-300 cursor-pointer shadow-md flex flex-col justify-end"
                        >
                            <Image
                                src={photo.src}
                                alt={photo.title}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-85 group-hover:opacity-75 transition-opacity" />

                            {/* Badge */}
                            <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-mono text-[#DEAE59] border border-white/10">
                                {photo.categoryLabel}
                            </div>

                            {/* Info */}
                            <div className="relative z-10 p-4 space-y-1">
                                <h3 className="font-serif font-bold text-sm text-white leading-tight">
                                    {photo.title}
                                </h3>
                                <p className="text-[11px] text-stone-300 flex items-center gap-1 font-light">
                                    <MapPin className="w-3 h-3 text-[#DEAE59] flex-shrink-0" />
                                    <span className="truncate">{photo.location}</span>
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredPhotos.length === 0 && (
                    <div className="text-center py-16 text-stone-400 text-sm">
                        No photos added to this category yet.
                    </div>
                )}
            </div>

            {/* Lightbox Modal with Next/Prev Controls */}
            {activePhoto && selectedPhotoIndex !== null && (
                <div
                    role="dialog"
                    aria-modal="true"
                    className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md p-4 sm:p-8 flex items-center justify-center select-none"
                    onClick={handleClose}
                >
                    <div
                        className="relative max-w-5xl w-full max-h-[90vh] bg-[#1C3322] rounded-3xl overflow-hidden border border-[#C2933D]/40 text-white shadow-2xl flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Top Bar */}
                        <div className="flex items-center justify-between p-4 px-6 border-b border-white/10 bg-black/40">
                            <div className="flex items-center gap-2 text-xs font-mono text-[#DEAE59]">
                                <span>Photo {selectedPhotoIndex + 1} of {filteredPhotos.length}</span>
                                <span>•</span>
                                <span>{activePhoto.categoryLabel}</span>
                            </div>

                            <button
                                type="button"
                                aria-label="Close photo preview"
                                onClick={handleClose}
                                className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Image Viewer Area */}
                        <div className="relative flex-1 min-h-[50vh] sm:min-h-[60vh] bg-stone-950 flex items-center justify-center">
                            <Image
                                src={activePhoto.src}
                                alt={activePhoto.title}
                                fill
                                sizes="100vw"
                                priority
                                className="object-contain"
                            />

                            {/* Left Nav Button */}
                            <button
                                type="button"
                                aria-label="Previous photo"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handlePrev();
                                }}
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-[#C2933D] hover:text-[#122216] text-white p-3 rounded-full transition shadow-xl cursor-pointer"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>

                            {/* Right Nav Button */}
                            <button
                                type="button"
                                aria-label="Next photo"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleNext();
                                }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-[#C2933D] hover:text-[#122216] text-white p-3 rounded-full transition shadow-xl cursor-pointer"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Details Footer */}
                        <div className="p-6 bg-[#1C3322] space-y-1.5 border-t border-white/10">
                            <div className="flex items-center gap-2 text-xs text-[#DEAE59] font-mono">
                                <MapPin className="w-3.5 h-3.5" />
                                <span>{activePhoto.location}</span>
                            </div>
                            <h3 className="font-serif text-2xl font-bold text-white">
                                {activePhoto.title}
                            </h3>
                            <p className="text-xs text-stone-300 leading-relaxed font-light">
                                {activePhoto.caption}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}