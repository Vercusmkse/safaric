'use client';

import React from 'react';
import { ShieldCheck, Users } from 'lucide-react';

interface CapacityIndicatorProps {
    allocatedSeats?: number;
    maxSeats?: number;
    compact?: boolean;
}

export function CapacityIndicator({
                                      allocatedSeats = 2,
                                      maxSeats = 6,
                                      compact = false,
                                  }: CapacityIndicatorProps) {
    const remaining = Math.max(0, maxSeats - allocatedSeats);

    if (compact) {
        return (
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-600/40 text-emerald-400 text-xs font-medium">
                <Users className="w-3.5 h-3.5" />
                <span>Max 6 Guests • {remaining} Window Seats Left</span>
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-stone-800 bg-stone-900/90 p-4 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                <div>
                    <span className="text-[11px] font-semibold tracking-wider text-amber-500 uppercase">
                        Vehicle Seating Architecture
                    </span>
                    <p className="text-sm font-semibold text-stone-100">
                        {remaining === 0 ? 'Vehicle Full' : `${remaining} Window Seats Available`}
                    </p>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/50 text-[11px] font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Zero Middle Seats</span>
                </div>
            </div>

            <div className="pt-3">
                <p className="text-[11px] text-stone-400 mb-2.5 text-center">
                    Custom 3-Tier Open Safari Vehicle (2 Seats Per Row):
                </p>
                <div className="grid grid-cols-2 gap-2 max-w-[240px] mx-auto font-mono text-xs">
                    <SeatBox index={0} allocatedSeats={allocatedSeats} label="Row 1 - Left Window" />
                    <SeatBox index={1} allocatedSeats={allocatedSeats} label="Row 1 - Right Window" />
                    <SeatBox index={2} allocatedSeats={allocatedSeats} label="Row 2 - Left Window" />
                    <SeatBox index={3} allocatedSeats={allocatedSeats} label="Row 2 - Right Window" />
                    <SeatBox index={4} allocatedSeats={allocatedSeats} label="Deck - Left Window" />
                    <SeatBox index={5} allocatedSeats={allocatedSeats} label="Deck - Right Window" />
                </div>
            </div>
        </div>
    );
}

function SeatBox({
                     index,
                     allocatedSeats,
                     label,
                 }: {
    index: number;
    allocatedSeats: number;
    label: string;
}) {
    const isOccupied = index < allocatedSeats;

    return (
        <div
            title={label}
            className={`py-2 px-1 text-center rounded border transition-colors ${
                isOccupied
                    ? 'bg-stone-800/80 border-stone-700/60 text-stone-500 cursor-not-allowed'
                    : 'bg-emerald-950/40 border-emerald-600/60 text-emerald-300 font-semibold'
            }`}
        >
            <div className="text-[10px] tracking-tight">{isOccupied ? 'Reserved' : 'Window'}</div>
        </div>
    );
}