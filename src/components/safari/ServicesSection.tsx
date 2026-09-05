import React from 'react';
import { Truck, Camera, Plane, Users, BedDouble, Map } from 'lucide-react';

const SERVICES = [
    {
        icon: Truck,
        title: 'Guided Game Drives',
        desc: 'Half-day and full-day expeditions in custom open 4x4 vehicles led by certified FGASA guides with radio telemetry network access.',
    },
    {
        icon: Camera,
        title: 'Wildlife Photography',
        desc: 'Charter vehicle runs positioned for lighting geometry, equipped with steady beanbag mounts and unhurried sighting observation.',
    },
    {
        icon: Plane,
        title: 'Airport Transfers',
        desc: 'Executive, air-conditioned transfers between KMIA (Nelspruit), Skukuza (SZK), Hoedspruit (HDS), OR Tambo (JNB), and private lodges.',
    },
    {
        icon: Users,
        title: 'Groups & Incentives',
        desc: 'Tailored logistics for corporate seminars, family reunions, and incentive travelers with convoy management and private boma banquets.',
    },
    {
        icon: BedDouble,
        title: 'Accommodation Assistance',
        desc: 'Direct booking assistance for inside-the-park SANParks rest camp bungalows (Skukuza, Lower Sabie) or private luxury 5-star game lodges.',
    },
    {
        icon: Map,
        title: 'Tailor-Made Itineraries',
        desc: 'Custom multiday safari routes incorporating the Blyde River Canyon, God’s Window, and private walking trails with bush breakfasts.',
    },
];

export default function ServicesSection() {
    return (
        <section id="services" className="py-20 bg-[#F7F4EC]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#C2933D]">Complete Safari Infrastructure</span>
                    <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#1C3322] mt-2 mb-4">
                        Tailored Services For Discerning Travelers
                    </h2>
                    <div className="w-20 h-1 bg-[#C2933D] mx-auto mb-4 rounded-full" />
                    <p className="text-stone-600 text-sm sm:text-base font-light">
                        Every step of your African safari is managed with authentic warmth and operational expertise.
                    </p>
                </div>

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
                                <h3 className="font-serif text-2xl font-bold text-[#1C3322] mb-3">{s.title}</h3>
                                <p className="text-stone-600 text-xs leading-relaxed">{s.desc}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}