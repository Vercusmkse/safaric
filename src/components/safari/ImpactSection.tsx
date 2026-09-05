import React from 'react';
import { ShieldAlert, GraduationCap, Recycle } from 'lucide-react';

export default function ImpactSection() {
    return (
        <section id="impact" className="py-20 bg-[#1C3322] text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#C2933D]">People • Wildlife • Conservation</span>
                    <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white mt-2 mb-4">
                        Safaris with a Conscience
                    </h2>
                    <div className="w-20 h-1 bg-[#C2933D] mx-auto mb-4 rounded-full" />
                    <p className="text-stone-300 text-sm sm:text-base font-light">
                        A percentage of every Safaric booking directly finances anti-poaching initiatives and youth environmental education along the Kruger park border.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-[#122216] p-8 rounded-2xl border border-[#C2933D]/20 shadow-lg flex flex-col">
                        <div className="w-12 h-12 rounded-xl bg-[#C2933D]/20 text-[#C2933D] flex items-center justify-center mb-6">
                            <ShieldAlert className="w-6 h-6" />
                        </div>
                        <h3 className="font-serif text-2xl font-bold text-[#DEAE59] mb-3">Rhino Anti-Poaching Units</h3>
                        <p className="text-xs text-stone-300 leading-relaxed flex-1">
                            Funding canine tracking teams, GPS night vision surveillance equipment, and boundary patrol fuel in critical southern Kruger black and white rhino sectors.
                        </p>
                    </div>

                    <div className="bg-[#122216] p-8 rounded-2xl border border-[#C2933D]/20 shadow-lg flex flex-col">
                        <div className="w-12 h-12 rounded-xl bg-[#C2933D]/20 text-[#C2933D] flex items-center justify-center mb-6">
                            <GraduationCap className="w-6 h-6" />
                        </div>
                        <h3 className="font-serif text-2xl font-bold text-[#DEAE59] mb-3">Community Guiding Academy</h3>
                        <p className="text-xs text-stone-300 leading-relaxed flex-1">
                            Sponsoring youth from Mpumalanga border communities through accredited FGASA nature guide certifications to ensure local communities benefit from wilderness protection.
                        </p>
                    </div>

                    <div className="bg-[#122216] p-8 rounded-2xl border border-[#C2933D]/20 shadow-lg flex flex-col">
                        <div className="w-12 h-12 rounded-xl bg-[#C2933D]/20 text-[#C2933D] flex items-center justify-center mb-6">
                            <Recycle className="w-6 h-6" />
                        </div>
                        <h3 className="font-serif text-2xl font-bold text-[#DEAE59] mb-3">Zero Single-Use Plastics</h3>
                        <p className="text-xs text-stone-300 leading-relaxed flex-1">
                            All vehicles operate with sanitized stainless-steel cold water canteens, solar-recharged batteries, and leave-no-trace picnic protocols.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}