'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/safari/Hero';
import PackageSection from '@/components/safari/PackageSection';
import BigFiveShowcase from '@/components/safari/BigFiveShowcase';
import ServicesSection from '@/components/safari/ServicesSection';
import ImpactSection from '@/components/safari/ImpactSection';
import BookingModal from '@/components/booking/BookingModal';
import { SafariPackage } from '@/types/safari';
import { Phone, Mail, MapPin, Globe } from 'lucide-react';

export default function HomePage() {
    const [modalOpen, setModalOpen] = useState(false);
    const [activePackageId, setActivePackageId] = useState<string | undefined>();
    const [activeDate, setActiveDate] = useState<string | undefined>();
    const [activeAdults, setActiveAdults] = useState<number>(2);

    const handleHeroQuickBook = (pkgId: string, date: string, adults: number) => {
        setActivePackageId(pkgId);
        setActiveDate(date);
        setActiveAdults(adults);
        setModalOpen(true);
    };

    const handleSelectPackage = (pkg: SafariPackage) => {
        setActivePackageId(pkg.id);
        setModalOpen(true);
    };

    return (
        <main className="min-h-screen flex flex-col">
            <Navbar onOpenBooking={() => setModalOpen(true)} />

            <Hero onQuickBook={handleHeroQuickBook} />

            <PackageSection onSelectPackage={handleSelectPackage} />

            <BigFiveShowcase />

            <ServicesSection />

            <ImpactSection />

            {/* Inquiry & Direct Contact Details */}
            <section id="contact" className="py-20 bg-[#F7F4EC] border-t border-stone-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                        <div className="lg:col-span-6 space-y-6">
                            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#C2933D]">Direct Reservations</span>
                            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#1C3322]">
                                Start Planning Your Kruger Journey
                            </h2>
                            <p className="text-stone-600 text-sm sm:text-base font-light leading-relaxed">
                                Connect directly with our local Kruger operations desk for custom vehicle availability, gate logistics, and tailor-made multi-day circuits.
                            </p>

                            <div className="space-y-4 pt-2">
                                <a href="tel:+27836213226" className="flex items-center gap-4 p-4 rounded-xl bg-white border border-stone-200 shadow-sm hover:border-[#C2933D] transition">
                                    <div className="w-10 h-10 rounded-lg bg-[#1C3322] text-[#C2933D] flex items-center justify-center flex-shrink-0">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-stone-400 uppercase font-semibold block">Reservations Phone</span>
                                        <span className="text-sm font-bold text-[#1C3322]">+27 71 123 4567</span>
                                    </div>
                                </a>

                                <a href="mailto:info@safaric.co.za" className="flex items-center gap-4 p-4 rounded-xl bg-white border border-stone-200 shadow-sm hover:border-[#C2933D] transition">
                                    <div className="w-10 h-10 rounded-lg bg-[#1C3322] text-[#C2933D] flex items-center justify-center flex-shrink-0">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-stone-400 uppercase font-semibold block">Email Operations</span>
                                        <span className="text-sm font-bold text-[#1C3322]">info@safaric.co.za</span>
                                    </div>
                                </a>

                                <div className="flex items-center gap-4 p-4 rounded-xl bg-white border border-stone-200 shadow-sm">
                                    <div className="w-10 h-10 rounded-lg bg-[#1C3322] text-[#C2933D] flex items-center justify-center flex-shrink-0">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-stone-400 uppercase font-semibold block">Operational Gateway</span>
                                        <span className="text-sm font-bold text-[#1C3322]">Kruger National Park &amp; Surrounding Areas</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 p-4 rounded-xl bg-white border border-stone-200 shadow-sm">
                                    <div className="w-10 h-10 rounded-lg bg-[#1C3322] text-[#C2933D] flex items-center justify-center flex-shrink-0">
                                        <Globe className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-stone-400 uppercase font-semibold block">Official Website</span>
                                        <span className="text-sm font-bold text-[#1C3322]">www.safaric.co.za</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Action Box */}
                        <div className="lg:col-span-6 bg-[#1C3322] text-white p-8 sm:p-10 rounded-3xl border border-[#C2933D]/40 shadow-2xl">
                            <span className="text-xs uppercase font-bold text-[#C2933D] tracking-widest block mb-2">Real-time availability</span>
                            <h3 className="font-serif text-3xl font-bold text-white mb-4">Book Directly With Official Guides</h3>
                            <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed mb-8">
                                Eliminate middlemen commissions. Booking directly with Safaric guarantees vehicle exclusivity options, direct radio contact with trackers, and customizable departure times.
                            </p>
                            <button
                                onClick={() => setModalOpen(true)}
                                className="w-full bg-gradient-to-r from-[#C2933D] to-[#DEAE59] text-[#122216] font-bold py-3.5 px-6 rounded-xl text-xs uppercase tracking-wider transition hover:brightness-110 shadow-lg"
                            >
                                Launch Booking Engine
                            </button>
                        </div>

                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[#122216] text-stone-400 border-t border-[#C2933D]/20 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
                    <div className="tracking-widest uppercase font-semibold text-xs text-[#DEAE59]">
                        PEOPLE &nbsp;|&nbsp; WILDLIFE &nbsp;|&nbsp; CONSERVATION &nbsp;|&nbsp; SUSTAINABLE TOURISM
                    </div>
                    <p className="text-xs text-stone-500">
                        &copy; 2026 SAFARIC. All rights reserved. Registered South African Safari Tour Operator.
                    </p>
                </div>
            </footer>

            {/* Wizard Modal */}
            <BookingModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                defaultPackageId={activePackageId}
                defaultDate={activeDate}
                defaultAdults={activeAdults}
            />
        </main>
    );
}