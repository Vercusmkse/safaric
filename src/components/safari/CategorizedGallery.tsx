'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { GALLERY_CATEGORIES, GALLERY_PHOTOS, GalleryPhoto } from '@/data/gallery';
import { Camera, MapPin, ChevronLeft, ChevronRight, X, Eye, Images } from 'lucide-react';

export default function CategorizedGallery() {
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState<number>(0);

    const albumCategories = GALLERY_CATEGORIES.filter((cat) => cat.id !== 'all');

    const activePhotos: GalleryPhoto[] = activeCategory
        ? GALLERY_PHOTOS.filter((photo) => photo.category === activeCategory)
        : [];

    const activePhoto: GalleryPhoto | undefined = activePhotos[currentPhotoIndex];

    const openAlbum = (categoryId: string) => {
        setActiveCategory(categoryId);
        setCurrentPhotoIndex(0);
    };

    const closeAlbum = () => {
        setActiveCategory(null);
        setCurrentPhotoIndex(0);
    };

    const handleNext = useCallback(() => {
        if (!activePhotos.length) return;
        setCurrentPhotoIndex((prev) => (prev + 1) % activePhotos.length);
    }, [activePhotos.length]);

    const handlePrev = useCallback(() => {
        if (!activePhotos.length) return;
        setCurrentPhotoIndex((prev) => (prev - 1 + activePhotos.length) % activePhotos.length);
    }, [activePhotos.length]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!activeCategory) return;
            if (e.key === 'ArrowRight') handleNext();
            if (e.key === 'ArrowLeft') handlePrev();
            if (e.key === 'Escape') closeAlbum();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeCategory, handleNext, handlePrev]);

    return (
        <section id="gallery" className="py-20 bg-[#122216] text-white border-t border-[#C2933D]/20">
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
                        Select any category album below to browse high-resolution sightings, location details, and guide field notes.
                    </p>
                </div>

                {/* 5 Semantic Category Album Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {albumCategories.map((category) => {
                        const categoryPhotos = GALLERY_PHOTOS.filter((p) => p.category === category.id);
                        const coverPhoto = categoryPhotos[0];
                        const photoCount = categoryPhotos.length;

                        if (!coverPhoto) return null;

                        return (
                            <button
                                key={category.id}
                                type="button"
                                onClick={() => openAlbum(category.id)}
                                className="group relative h-96 w-full rounded-3xl overflow-hidden bg-stone-900 border border-white/10 hover:border-[#DEAE59] transition-all duration-500 cursor-pointer shadow-xl flex flex-col justify-end text-left focus:outline-none focus:ring-2 focus:ring-[#DEAE59]"
                            >
                                {/* Cover Photo */}
                                <Image
                                    src={coverPhoto.src}
                                    alt={category.label}
                                    fill
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                />

                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-75 transition-opacity" />

                                {/* Top Floating Badge */}
                                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                                    <span className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono font-bold text-[#DEAE59] border border-white/10 flex items-center gap-1.5">
                                        <Images className="w-3.5 h-3.5" />
                                        <span>{photoCount} {photoCount === 1 ? 'Sighting' : 'Sightings'}</span>
                                    </span>

                                    <div className="w-9 h-9 rounded-full bg-[#DEAE59] text-[#122216] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg">
                                        <Eye className="w-4 h-4" />
                                    </div>
                                </div>

                                {/* Bottom Card Text */}
                                <div className="relative z-10 p-6 space-y-2">
                                    <h3 className="font-serif text-2xl font-bold text-white group-hover:text-[#DEAE59] transition-colors leading-tight">
                                        {category.label}
                                    </h3>
                                    <p className="text-xs text-stone-300 font-light line-clamp-2">
                                        {coverPhoto.caption}
                                    </p>
                                    <div className="pt-2 flex items-center gap-1.5 text-xs text-[#DEAE59] font-bold tracking-wider uppercase">
                                        <span>Click to open album</span>
                                        <span>→</span>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Native HTML5 Accessible Modal Dialog */}
            {activeCategory && activePhoto && (
                <dialog
                    open
                    aria-label="Wildlife Sightings Album"
                    className="fixed inset-0 z-50 m-0 h-screen w-screen max-h-none max-w-none border-none bg-black/95 p-4 sm:p-8 backdrop-blur-md flex items-center justify-center select-none text-white outline-none overflow-hidden"
                >
                    {/* Backdrop Click Area */}
                    <button
                        type="button"
                        aria-label="Close album backdrop"
                        tabIndex={-1}
                        onClick={closeAlbum}
                        className="fixed inset-0 w-full h-full bg-transparent cursor-default border-none"
                    />

                    {/* Modal Content Box */}
                    <div className="relative z-10 max-w-5xl w-full max-h-[92vh] bg-[#1C3322] rounded-3xl overflow-hidden border border-[#C2933D]/40 text-white shadow-2xl flex flex-col">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-4 px-6 border-b border-white/10 bg-black/40">
                            <div className="flex items-center gap-2 text-xs font-mono text-[#DEAE59]">
                                <span className="font-bold uppercase tracking-wider">{activePhoto.categoryLabel}</span>
                                <span>•</span>
                                <span>Photo {currentPhotoIndex + 1} of {activePhotos.length}</span>
                            </div>

                            <button
                                type="button"
                                aria-label="Close photo preview"
                                onClick={closeAlbum}
                                className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Main Image Stage */}
                        <div className="relative flex-1 min-h-[50vh] sm:min-h-[60vh] bg-stone-950 flex items-center justify-center">
                            <Image
                                src={activePhoto.src}
                                alt={activePhoto.title}
                                fill
                                sizes="100vw"
                                priority
                                className="object-contain"
                            />

                            {/* Previous Button */}
                            {activePhotos.length > 1 && (
                                <button
                                    type="button"
                                    aria-label="Previous photo"
                                    onClick={handlePrev}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-[#C2933D] hover:text-[#122216] text-white p-3 rounded-full transition shadow-xl cursor-pointer"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                            )}

                            {/* Next Button */}
                            {activePhotos.length > 1 && (
                                <button
                                    type="button"
                                    aria-label="Next photo"
                                    onClick={handleNext}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-[#C2933D] hover:text-[#122216] text-white p-3 rounded-full transition shadow-xl cursor-pointer"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            )}
                        </div>

                        {/* Image Metadata & Caption */}
                        <div className="p-5 sm:p-6 bg-[#1C3322] space-y-2 border-t border-white/10">
                            <div className="flex items-center gap-2 text-xs text-[#DEAE59] font-mono">
                                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                                <span>{activePhoto.location}</span>
                            </div>
                            <h3 className="font-serif text-2xl font-bold text-white">
                                {activePhoto.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-light">
                                {activePhoto.caption}
                            </p>

                            {/* Thumbnail Strip */}
                            {activePhotos.length > 1 && (
                                <div className="pt-3 flex items-center gap-2 overflow-x-auto pb-1">
                                    {activePhotos.map((photo, idx) => (
                                        <button
                                            key={photo.id}
                                            type="button"
                                            onClick={() => setCurrentPhotoIndex(idx)}
                                            className={`relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 border-2 transition cursor-pointer ${
                                                idx === currentPhotoIndex
                                                    ? 'border-[#DEAE59] scale-105'
                                                    : 'border-white/20 opacity-60 hover:opacity-100'
                                            }`}
                                        >
                                            <Image
                                                src={photo.src}
                                                alt={photo.title}
                                                fill
                                                sizes="56px"
                                                className="object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </dialog>
            )}
        </section>
    );
}