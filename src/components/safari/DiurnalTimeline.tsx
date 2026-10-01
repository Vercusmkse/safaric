'use client';

import React, { useState } from 'react';
import { Coffee, Binoculars, Utensils, Moon, Flame, Sun } from 'lucide-react';

interface DiurnalSlot {
    time: string;
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
}

const DIURNAL_SCHEDULE: DiurnalSlot[] = [
    {
        time: '05:00 – 05:30',
        title: 'Dawn Wake-Up & Verandah Coffee',
        description: 'Artisanal rusks and fresh French-press coffee served on private room verandahs as morning bird calls announce first light.',
        icon: Coffee,
    },
    {
        time: '05:30 – 09:30',
        title: 'First-Light Predator Tracking',
        description: 'Traverse Kruger river loops in custom 6-seat vehicles during the coolest hours when big cats conclude active nocturnal hunts.',
        icon: Binoculars,
    },
    {
        time: '09:30 – 10:30',
        title: 'Wilderness Bush Breakfast',
        description: 'Gourmet hot picnic breakfast served at an authorized scenic river overlook or shaded wilderness rest site.',
        icon: Utensils,
    },
    {
        time: '13:00 – 15:30',
        title: 'High-Heat Siesta & Solar Lodge Rest',
        description: 'Multi-course light lunch, swimming pool leisure, camera download stations, and siesta during midday heat.',
        icon: Sun,
    },
    {
        time: '16:00 – 18:30',
        title: 'Dusk Drive & Elevated Sundowners',
        description: 'Afternoon tracking culminating in traditional gin & tonics and charcuterie at an elevated lowveld viewpoint as the sun sets.',
        icon: Sun,
    },
    {
        time: '18:30 – 19:30',
        title: 'Nocturnal Spotlight Search',
        description: 'High-powered red-filtered spotlighting for elusive nocturnal species: leopards, civets, bushbabies, and owls.',
        icon: Moon,
    },
    {
        time: '19:30 – 21:30',
        title: 'Private Concession Boma Braai',
        description: 'Multi-course braai dinner cooked over open hardwood coals around a roaring central firepit with guide debriefs.',
        icon: Flame,
    },
];

export function DiurnalTimeline() {
    const [activeIndex, setActiveIndex] = useState(1);
    const active = DIURNAL_SCHEDULE[activeIndex];
    const ActiveIcon = active.icon;

    return (
        <section className="py-20 bg-[#F7F4EC] border-t border-stone-200 text-stone-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#C2933D] block mb-2">
                        The Lowveld Rhythm
                    </span>
                    <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#1C3322]">
                        A Day in the Kruger Bush
                    </h2>
                    <p className="mt-3 text-stone-600 text-sm sm:text-base font-light leading-relaxed">
                        From dawn coffee to fireside star debriefs—explore how our days align with natural wildlife movements.
                    </p>
                </div>

                {/* Timeline Tabs */}
                <div className="flex overflow-x-auto pb-4 gap-2 no-scrollbar scroll-smooth justify-start md:justify-center">
                    {DIURNAL_SCHEDULE.map((slot, index) => {
                        const isCurrent = activeIndex === index;
                        return (
                            <button
                                key={slot.time}
                                onClick={() => setActiveIndex(index)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                                    isCurrent
                                        ? 'bg-[#1C3322] text-white border-[#1C3322] shadow-md'
                                        : 'bg-white border-stone-300 text-stone-600 hover:border-[#C2933D] hover:text-[#1C3322]'
                                }`}
                            >
                                <span className={isCurrent ? 'text-[#DEAE59]' : 'text-[#C2933D]'}>
                                    {slot.time.split(' ')[0]}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Active Card */}
                <div className="mt-6 rounded-3xl border border-stone-200 bg-white p-6 sm:p-10 shadow-xl max-w-4xl mx-auto">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-[#1C3322] text-[#C2933D] flex items-center justify-center shrink-0">
                                <ActiveIcon className="w-6 h-6" />
                            </div>
                            <div>
                                <span className="text-xs font-mono text-[#C2933D] font-bold block uppercase tracking-wider">
                                    {active.time}
                                </span>
                                <h3 className="font-serif text-2xl font-bold text-[#1C3322]">
                                    {active.title}
                                </h3>
                            </div>
                        </div>
                        <div className="text-xs text-stone-400 font-medium">
                            Step {activeIndex + 1} of {DIURNAL_SCHEDULE.length}
                        </div>
                    </div>
                    <p className="mt-5 text-stone-600 text-sm sm:text-base leading-relaxed font-light">
                        {active.description}
                    </p>
                </div>

            </div>
        </section>
    );
}