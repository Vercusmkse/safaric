'use client';

import React, { useState, useEffect } from 'react';
import { SafariPackage, BookingFormData, BookingResponse } from '@/types/safari';
import { SAFARI_PACKAGES } from '@/data/packages';
import { useCurrency } from '@/context/CurrencyContext';
import { computeTotalZAR } from '@/lib/currency';
import { X, CheckCircle2, MessageCircle, AlertCircle, Loader2 } from 'lucide-react';

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    defaultPackageId?: string;
    defaultDate?: string;
    defaultAdults?: number;
}

export default function BookingModal({
                                         isOpen,
                                         onClose,
                                         defaultPackageId,
                                         defaultDate,
                                         defaultAdults = 2,
                                     }: BookingModalProps) {
    const { format } = useCurrency();

    const [packageId, setPackageId] = useState(defaultPackageId || SAFARI_PACKAGES[0].id);
    const [date, setDate] = useState(defaultDate || '');
    const [adults, setAdults] = useState(defaultAdults);
    const [children, setChildren] = useState(0);
    const [pickupPoint, setPickupPoint] = useState('Hazyview Lodge');
    const [includeBreakfast, setIncludeBreakfast] = useState(false);
    const [includeLensRental, setIncludeLensRental] = useState(false);

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [notes, setNotes] = useState('');

    const [loading, setLoading] = useState(false);
    const [apiResult, setApiResult] = useState<BookingResponse | null>(null);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (defaultPackageId) setPackageId(defaultPackageId);
        if (defaultDate) setDate(defaultDate);
        if (defaultAdults) setAdults(defaultAdults);
    }, [defaultPackageId, defaultDate, defaultAdults]);

    if (!isOpen) return null;

    const currentPkg = SAFARI_PACKAGES.find((p) => p.id === packageId) || SAFARI_PACKAGES[0];

    const computedZAR = computeTotalZAR({
        basePriceZAR: currentPkg.basePriceZAR,
        isVehicleRate: currentPkg.isVehicleRate,
        adults,
        children,
        includeBreakfast,
        includeLensRental,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage('');

        const payload: BookingFormData = {
            packageId,
            date,
            adults,
            children,
            pickupPoint,
            includeBreakfast,
            includeLensRental,
            fullName,
            email,
            phone,
            notes,
        };

        try {
            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data: BookingResponse = await res.json();
            if (!res.ok) {
                throw new Error(data.message || 'Booking submission failed');
            }

            setApiResult(data);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setErrorMessage(err.message);
            } else {
                setErrorMessage('An unexpected error occurred.');
            }
        } finally {
            setLoading(false);
        }
    };

    const dispatchWhatsApp = () => {
        if (!apiResult) return;
        const msg =
            `*New Safaric Reservation (%23${apiResult.referenceNumber})*%0A%0A` +
            `*Name:* ${encodeURIComponent(fullName)}%0A` +
            `*Experience:* ${encodeURIComponent(currentPkg.title)}%0A` +
            `*Date:* ${date}%0A` +
            `*Guests:* ${adults} Adults${children > 0 ? `, ${children} Children` : ''}%0A` +
            `*Pickup:* ${encodeURIComponent(pickupPoint)}%0A` +
            `*Total Estimate:* ${encodeURIComponent(format(computedZAR))}%0A` +
            `*Notes:* ${encodeURIComponent(notes || 'None')}`;

        window.open(`https://wa.me/27711234567?text=${msg}`, '_blank');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm p-4 sm:p-6 flex items-center justify-center">
            <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#C2933D]/40">

                {/* Modal Header */}
                <div className="bg-[#1C3322] text-white p-6 relative border-b border-[#C2933D]/30">
                    <button
                        onClick={onClose}
                        className="absolute top-5 right-5 text-stone-300 hover:text-white bg-[#122216]/50 p-2 rounded-full transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    <span className="text-[#C2933D] text-[11px] uppercase tracking-widest font-bold block mb-1">
            Safaric Kruger Reservation Engine
          </span>
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">Book Your Safari Experience</h3>
                    <p className="text-xs text-stone-300 font-light mt-0.5">Direct reservations, instant price calculations, and dedicated Kruger guide assignment.</p>
                </div>

                {/* Confirmation Screen */}
                {apiResult ? (
                    <div className="p-8 text-center space-y-5">
                        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                            <CheckCircle2 className="w-8 h-8" />
                        </div>
                        <h4 className="font-serif text-2xl font-bold text-[#1C3322]">Reservation Provisional Hold Confirmed!</h4>
                        <p className="text-xs text-stone-600 max-w-md mx-auto">
                            Your reference code is <strong className="text-[#1C3322] font-mono">{apiResult.referenceNumber}</strong>. An official itinerary has been scheduled for confirmation.
                        </p>

                        <div className="bg-[#F7F4EC] p-4 rounded-xl text-xs text-left max-w-md mx-auto border border-[#C2933D]/30 space-y-1 font-mono">
                            <div><strong>Safari:</strong> {currentPkg.title}</div>
                            <div><strong>Date:</strong> {date}</div>
                            <div><strong>Guests:</strong> {adults} Adults {children > 0 && `, ${children} Children`}</div>
                            <div><strong>Pickup:</strong> {pickupPoint}</div>
                            <div><strong>Estimated Total:</strong> {format(computedZAR)}</div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                            <button
                                onClick={dispatchWhatsApp}
                                className="bg-emerald-700 hover:bg-emerald-600 text-white font-semibold py-2.5 px-6 rounded-xl text-xs flex items-center justify-center gap-2 shadow"
                            >
                                <MessageCircle className="w-4 h-4" />
                                <span>Transmit To WhatsApp Operations</span>
                            </button>
                            <button
                                onClick={onClose}
                                className="bg-stone-200 hover:bg-stone-300 text-stone-800 font-semibold py-2.5 px-6 rounded-xl text-xs"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                ) : (
                    /* Form Engine */
                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                        {errorMessage && (
                            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                                <span>{errorMessage}</span>
                            </div>
                        )}

                        {/* Step 1: Experience & Timing */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#1C3322] mb-1">
                                1. Select Safari &amp; Date
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <select
                                    value={packageId}
                                    onChange={(e) => setPackageId(e.target.value)}
                                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:ring-1 focus:ring-[#1C3322] focus:outline-none"
                                >
                                    {SAFARI_PACKAGES.map((p) => (
                                        <option key={p.id} value={p.id}>
                                            {p.title} ({format(p.basePriceZAR)})
                                        </option>
                                    ))}
                                </select>

                                <input
                                    type="date"
                                    required
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:ring-1 focus:ring-[#1C3322] focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Step 2: Passenger Manifest & Pickup */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#1C3322] mb-1">
                                2. Party Configuration &amp; Pickup Area
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div>
                                    <span className="block text-[11px] text-stone-600 mb-0.5">Adults (12+ yrs)</span>
                                    <input
                                        type="number"
                                        min={1}
                                        max={20}
                                        value={adults}
                                        onChange={(e) => setAdults(Number(e.target.value))}
                                        className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <span className="block text-[11px] text-stone-600 mb-0.5">Children (4-11 yrs)</span>
                                    <input
                                        type="number"
                                        min={0}
                                        max={10}
                                        value={children}
                                        onChange={(e) => setChildren(Number(e.target.value))}
                                        className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <span className="block text-[11px] text-stone-600 mb-0.5">Pickup Location</span>
                                    <select
                                        value={pickupPoint}
                                        onChange={(e) => setPickupPoint(e.target.value)}
                                        className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none"
                                    >
                                        <option value="Hazyview Lodge">Hazyview Lodge / Hotel</option>
                                        <option value="Phabeni Gate">Phabeni Gate (Kruger)</option>
                                        <option value="Paul Kruger Gate">Paul Kruger Gate (Skukuza side)</option>
                                        <option value="Numbi Gate">Numbi Gate</option>
                                        <option value="Malelane / Southern Zone">Malelane / Southern Lodge</option>
                                        <option value="KMIA Nelspruit Airport">KMIA Airport (Mombela)</option>
                                        <option value="Other">Other (Mention in notes)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Step 3: Bush Add-ons */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#1C3322] mb-1">
                                3. Optional Bush Add-ons
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                <label className="flex items-center gap-2.5 p-2.5 rounded-lg border border-stone-200 cursor-pointer hover:bg-stone-50">
                                    <input
                                        type="checkbox"
                                        checked={includeBreakfast}
                                        onChange={(e) => setIncludeBreakfast(e.target.checked)}
                                        className="rounded text-[#1C3322]"
                                    />
                                    <div>
                                        <span className="font-semibold block">Full Bush Breakfast Stop</span>
                                        <span className="text-[10px] text-stone-500">+{format(180)} per explorer</span>
                                    </div>
                                </label>

                                <label className="flex items-center gap-2.5 p-2.5 rounded-lg border border-stone-200 cursor-pointer hover:bg-stone-50">
                                    <input
                                        type="checkbox"
                                        checked={includeLensRental}
                                        onChange={(e) => setIncludeLensRental(e.target.checked)}
                                        className="rounded text-[#1C3322]"
                                    />
                                    <div>
                                        <span className="font-semibold block">Telephoto Safari Lens Hire</span>
                                        <span className="text-[10px] text-stone-500">+{format(650)} / day rental</span>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Step 4: Primary Contact */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#1C3322] mb-1">
                                4. Primary Guest Contact Details
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <input
                                    type="text"
                                    required
                                    placeholder="Full Name *"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none"
                                />
                                <input
                                    type="email"
                                    required
                                    placeholder="Email Address *"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none"
                                />
                                <input
                                    type="tel"
                                    required
                                    placeholder="WhatsApp / Phone *"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none"
                                />
                            </div>
                            <input
                                type="text"
                                placeholder="Special dietary requirements or notes (optional)"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="mt-2 w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none"
                            />
                        </div>

                        {/* Dynamic Calculation Summary Bar */}
                        <div className="bg-[#F7F4EC] p-4 rounded-xl border border-[#C2933D]/30 flex flex-col sm:flex-row items-center justify-between gap-3">
                            <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#1C3322] block">
                  Total Estimated Booking Quote
                </span>
                                <div className="text-2xl font-serif font-bold text-[#1C3322]">
                                    {format(computedZAR)}
                                </div>
                                <span className="text-[10px] text-stone-500 block">
                  SANParks daily conservation entry fees payable at park gates.
                </span>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full sm:w-auto bg-[#1C3322] hover:bg-[#2B4D34] text-white font-bold py-3 px-8 rounded-xl text-xs uppercase tracking-wider transition shadow flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin text-[#C2933D]" /> : <CheckCircle2 className="w-4 h-4 text-[#C2933D]" />}
                                <span>{loading ? 'Processing...' : 'Confirm Safari Request'}</span>
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}