'use client';

import React, { useState } from 'react';
import { Coffee, Binoculars, Utensils, Sun, Compass, Sunset, CheckCircle2 } from 'lucide-react';

interface DiurnalSlot {
    time: string;
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
}

const DIURNAL_SCHEDULE: DiurnalSlot[] = [
    {
        time: '05:00 – 05:30',
        title: 'Dawn Pickups & Gate Staging',
        description: 'Complimentary morning pickup from Ngwenya Lodge, Marloth Park, Crocodile Bridge, or Lower Sabie. Settle into custom open 4x4 vehicles with complimentary warm fleece blankets, rain ponchos, and chilled spring water.',
        icon: Coffee,
    },
    {
        time: '05:30 – 09:30',
        title: 'First-Light Predator Tracking',
        description: 'Enter Kruger gates at opening light. Our registered nature guides follow fresh tracks, bird alarm calls, and river loops during the coolest hours when lions, leopards, and wild dogs conclude night hunts.',
        icon: Binoculars,
    },
    {
        time: '09:30 – 10:30',
        title: 'Rest Camp Breakfast Stop (~1 Hour)',
        description: 'A dedicated one-hour stop at an authorized SANParks rest camp (such as Lower Sabie or Crocodile Bridge). Enjoy breakfast, stretch your legs, and use campsite facilities (meals are for your own account).',
        icon: Utensils,
    },
    {
        time: '10:30 – 13:00',
        title: 'Midday Waterhole & River Loops',
        description: 'Explore active water points and riverine corridors as elephant breeding herds, buffalos, giraffes, and plains game congregate to drink and wallow during the warmer midday hours.',
        icon: Compass,
    },
    {
        time: '13:00 – 14:00',
        title: 'Midday Lunch Break (~1 Hour)',
        description: 'A relaxed one-hour rest stop at a park campsite/cafeteria to escape the midday heat, have lunch, and browse the park shop before the afternoon run (meals for own account).',
        icon: Sun,
    },
    {
        time: '14:45 – 18:00',
        title: 'Afternoon & Golden Hour Safari',
        description: 'Traverse southern game corridors as afternoon temperatures ease. Golden hour photography lighting illuminates active game before gates close at dusk.',
        icon: Sunset,
    },
    {
        time: '18:00',
        title: 'Gate Clearance & Lodge Return',
        description: 'Exit park gates before closing time and transit directly back to your lodge or rest camp with full sightings logged by your guide.',
        icon: CheckCircle2,
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
                        From dawn gate openings to golden hour tracking—explore how our game drives align with natural wildlife movements and rest camp stopovers.
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

export default DiurnalTimeline;