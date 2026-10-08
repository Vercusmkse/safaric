'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
    CheckCircle2,
    ShieldCheck,
    ArrowRight,
    Printer,
    MapPin,
    Compass,
    Users,
    Sparkles,
    Calendar,
    FileCheck2,
    Phone,
    Mail
} from 'lucide-react';

function ConfirmationContent() {
    const searchParams = useSearchParams();

    // Query parameters with structured defaults
    const reference = searchParams.get('ref') || searchParams.get('reference') || 'SAF-162909';
    const trxref = searchParams.get('trxref') || reference;
    const packageTitle = searchParams.get('package') || '5-Day Kruger Concession & Panorama Route';
    const safariDate = searchParams.get('date') || '2026-10-15';

    // Dynamic passenger manifest
    const adults = Math.max(1, Number(searchParams.get('adults')) || 3);
    const childrenCount = Math.max(0, Number(searchParams.get('children')) || 0);
    const totalExplorers = adults + childrenCount;

    // Logistics & Route
    const pickupPoint = searchParams.get('pickup') || 'Hazyview Lodge / Hotel (05:30 AM)';
    const dropoffPoint = searchParams.get('dropoff') || 'KMIA Nelspruit Airport Shuttle (16:30 PM)';
    const safariRoute = searchParams.get('route') || 'Phabeni Gate & Central Kruger (Skukuza Loop)';
    const guestName = searchParams.get('name') || 'Lead Explorer';

    // Financial calculations (ZAR)
    const rawTotal = Number(searchParams.get('total')) || (adults * 11000);
    const totalSafariCost = rawTotal;
    const depositPaid = Math.round(Number(searchParams.get('deposit')) || (totalSafariCost * 0.20));
    const balanceDue = totalSafariCost - depositPaid;
    const vatIncluded = Math.round((totalSafariCost * 0.15) / 1.15); // 15% South African VAT

    const formatZAR = (val: number) => `R ${val.toLocaleString('en-ZA')}`;

    return (
        <div className="min-h-screen bg-[#FDFBF7] py-8 sm:py-16 px-4 flex items-center justify-center text-stone-900 print:bg-white print:p-0">
            <div className="max-w-2xl w-full bg-white rounded-3xl p-6 sm:p-10 border border-[#C2933D]/30 shadow-2xl space-y-7 print:shadow-none print:border-none print:p-4 print:max-w-full">

                {/* Official Voucher Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-200 pb-6">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-[#C2933D] font-mono font-bold text-xs uppercase tracking-widest">
                                Official Booking Voucher &amp; Tax Receipt
                            </span>
                        </div>
                        <h1 className="font-serif text-3xl font-extrabold text-[#1C3322] tracking-tight">
                            SAFARIC
                        </h1>
                        <p className="text-xs text-stone-500 font-medium">
                            Kruger National Park Guided Safaris • Registered Tour Operator
                        </p>
                        <p className="text-[11px] text-stone-400">
                            Accredited under South African Tourism Act
                        </p>
                    </div>

                    <div className="sm:text-right bg-[#FAF8F5] sm:bg-transparent p-3 sm:p-0 rounded-xl w-full sm:w-auto border sm:border-none border-stone-200">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Confirmed &amp; Secured
                        </span>
                        <div className="mt-1 text-xs text-stone-500 font-mono">
                            Ref: <strong className="text-stone-900">{reference}</strong>
                        </div>
                        <div className="text-[11px] text-stone-400">
                            Issued: {new Date().toLocaleDateString('en-ZA')}
                        </div>
                    </div>
                </div>

                {/* Banner Status */}
                <div className="bg-emerald-50/90 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                        <FileCheck2 className="w-5 h-5" />
                    </div>
                    <div className="text-xs">
                        <p className="font-bold text-emerald-950 text-sm">
                            20% Commitment Deposit Confirmed
                        </p>
                        <p className="text-emerald-800">
                            Payment authorized via Paystack ({trxref}). Your private open safari vehicle and professional guide are reserved for {guestName}.
                        </p>
                    </div>
                </div>

                {/* Complimentary Amenities Card */}
                <div className="bg-[#F7F4EC] border border-[#C2933D]/40 rounded-2xl p-4 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#1C3322]">
                        <Sparkles className="w-4 h-4 text-[#C2933D]" />
                        <span>Complimentary Safari Inclusions (Included Free of Charge)</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-stone-700 font-medium">
                        <div className="bg-white/80 p-2 rounded-lg border border-stone-200/60">
                            <p className="text-emerald-700 font-bold">✓ Optics</p>
                            <p className="text-stone-800">Game-Spotting Binoculars</p>
                        </div>
                        <div className="bg-white/80 p-2 rounded-lg border border-stone-200/60">
                            <p className="text-emerald-700 font-bold">✓ Refreshments</p>
                            <p className="text-stone-800">Chilled Bottled Spring Water</p>
                        </div>
                        <div className="bg-white/80 p-2 rounded-lg border border-stone-200/60">
                            <p className="text-emerald-700 font-bold">✓ Comfort</p>
                            <p className="text-stone-800">Fleece Ponchos &amp; Blankets</p>
                        </div>
                        <div className="bg-white/80 p-2 rounded-lg border border-stone-200/60">
                            <p className="text-emerald-700 font-bold">✓ Gate Access</p>
                            <p className="text-stone-800">SANParks Permit Clearance</p>
                        </div>
                    </div>
                </div>

                {/* Trip & Route Manifest */}
                <div className="space-y-3">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                        Trip Manifest &amp; Routing Logistics
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="p-3 rounded-xl border border-stone-200 bg-stone-50/60 space-y-1">
                            <div className="flex items-center gap-1.5 text-stone-500 font-medium text-[11px]">
                                <Calendar className="w-3.5 h-3.5 text-[#C2933D]" />
                                Experience &amp; Date
                            </div>
                            <p className="font-bold text-stone-900 text-sm">{packageTitle}</p>
                            <p className="text-stone-600 font-mono text-[11px]">Departure: {safariDate}</p>
                        </div>

                        <div className="p-3 rounded-xl border border-stone-200 bg-stone-50/60 space-y-1">
                            <div className="flex items-center gap-1.5 text-stone-500 font-medium text-[11px]">
                                <Users className="w-3.5 h-3.5 text-[#C2933D]" />
                                Passenger Manifest
                            </div>
                            <p className="font-bold text-stone-900 text-sm">
                                {totalExplorers} Guest{totalExplorers > 1 ? 's' : ''} Confirmed
                            </p>
                            <p className="text-stone-600 font-mono text-[11px]">
                                {adults} Adult{adults > 1 ? 's' : ''} {childrenCount > 0 && `• ${childrenCount} Children`}
                            </p>
                        </div>

                        <div className="p-3 rounded-xl border border-stone-200 bg-stone-50/60 space-y-1">
                            <div className="flex items-center gap-1.5 text-stone-500 font-medium text-[11px]">
                                <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                                Pickup &amp; Drop-off Points
                            </div>
                            <p className="font-semibold text-stone-800">
                                <span className="text-stone-400 font-normal">Pick:</span> {pickupPoint}
                            </p>
                            <p className="font-semibold text-stone-800">
                                <span className="text-stone-400 font-normal">Drop:</span> {dropoffPoint}
                            </p>
                        </div>

                        <div className="p-3 rounded-xl border border-stone-200 bg-stone-50/60 space-y-1">
                            <div className="flex items-center gap-1.5 text-stone-500 font-medium text-[11px]">
                                <Compass className="w-3.5 h-3.5 text-[#1C3322]" />
                                Safari Route &amp; Gate Entry
                            </div>
                            <p className="font-bold text-stone-900">{safariRoute}</p>
                            <p className="text-stone-500 text-[11px]">SANParks gate entry ID on file</p>
                        </div>
                    </div>
                </div>

                {/* Financial Ledger & VAT Breakdown */}
                <div className="border-t border-stone-200 pt-5 space-y-2.5 font-mono text-xs">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-stone-500 font-sans">
                        Financial Statement &amp; Tax Receipt
                    </h2>

                    <div className="flex justify-between text-stone-600">
                        <span>Total Safari Package ({totalExplorers} Explorers):</span>
                        <span className="font-bold text-stone-900">{formatZAR(totalSafariCost)}</span>
                    </div>

                    <div className="flex justify-between text-[11px] text-stone-500">
                        <span>Includes 15% South African VAT:</span>
                        <span>{formatZAR(vatIncluded)}</span>
                    </div>

                    <div className="flex justify-between items-center text-emerald-800 font-bold bg-emerald-50/90 p-2.5 rounded-xl border border-emerald-200">
                        <span>Deposit Paid (20% via Paystack):</span>
                        <span>- {formatZAR(depositPaid)} [PAID]</span>
                    </div>

                    <div className="flex justify-between items-center text-stone-900 font-bold text-sm pt-1 border-t border-stone-200">
                        <span>Remaining Balance (Due on Arrival):</span>
                        <span className="text-[#1C3322] font-sans font-extrabold text-base">
                            {formatZAR(balanceDue)}
                        </span>
                    </div>

                    <p className="text-[11px] text-stone-400 font-sans italic pt-1">
                        *The remaining balance can be settled at vehicle dispatch on safari morning via card terminal or cash. Daily SANParks conservation fees remain payable directly at park gates.
                    </p>
                </div>

                {/* Operations Contact Footer */}
                <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 text-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                        <p className="font-bold text-stone-800">Need flight or pickup changes?</p>
                        <p className="text-stone-500 text-[11px]">Contact dispatch with booking ref {reference}</p>
                    </div>
                    <div className="flex flex-wrap gap-3 text-stone-700 text-xs font-medium">
                        <a
                            href="https://wa.me/27836213226"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 hover:text-emerald-700 transition"
                        >
                            <Phone className="w-3.5 h-3.5 text-emerald-600" />
                            <span>+27 83 621 3226</span>
                        </a>
                        <a
                            href="mailto:reservations@safarictours.com"
                            className="flex items-center gap-1.5 hover:text-emerald-700 transition"
                        >
                            <Mail className="w-3.5 h-3.5 text-[#C2933D]" />
                            <span>reservations@safarictours.com</span>
                        </a>
                    </div>
                </div>

                {/* Interactive Action Buttons (Hidden when printed) */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2 print:hidden">
                    <button
                        type="button"
                        onClick={() => window.print()}
                        className="flex-1 bg-stone-900 hover:bg-stone-800 text-white font-bold py-3.5 px-6 rounded-xl text-xs uppercase tracking-wider transition shadow flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <Printer className="w-4 h-4 text-[#C2933D]" />
                        <span>Print / Save Voucher (PDF)</span>
                    </button>

                    <Link
                        href="/"
                        className="flex-1 bg-[#1C3322] hover:bg-[#2B4D34] text-white font-bold py-3.5 px-6 rounded-xl text-xs uppercase tracking-wider transition shadow flex items-center justify-center gap-2 text-center"
                    >
                        <span>Return to Safaric Home</span>
                        <ArrowRight className="w-4 h-4 text-[#C2933D]" />
                    </Link>
                </div>

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-400 print:hidden">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>A digital copy of this receipt has been dispatched to your email address.</span>
                </div>
            </div>
        </div>
    );
}

export default function BookingConfirmedPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-[#1C3322] border-t-transparent rounded-full animate-spin" />
                </div>
            }
        >
            <ConfirmationContent />
        </Suspense>
    );
}