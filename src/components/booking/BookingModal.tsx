'use client';

import React, { useState } from 'react';
import { BookingFormData, BookingResponse, DocumentType } from '@/types/safari';
import { SAFARI_PACKAGES } from '@/data/packages';
import { useCurrency } from '@/context/CurrencyContext';
import { computeTotalZAR } from '@/lib/currency';
import {
    X,
    CheckCircle2,
    MessageCircle,
    AlertCircle,
    Loader2,
    CreditCard,
    ShieldCheck,
    FileText,
    Sparkles,
    Compass,
    MapPin,
    Users
} from 'lucide-react';

interface BookingModalProps {
    readonly isOpen: boolean;
    readonly onClose: () => void;
    readonly defaultPackageId?: string;
    readonly defaultDate?: string;
    readonly defaultAdults?: number;
}

interface ConfirmationScreenProps {
    readonly apiResult: BookingResponse;
    readonly packageTitle: string;
    readonly date: string;
    readonly adults: number;
    readonly childrenCount: number;
    readonly pickupPoint: string;
    readonly dropoffPoint: string;
    readonly safariRoute: string;
    readonly idNumber: string;
    readonly idType: DocumentType;
    readonly fullName: string;
    readonly totalSafariFormatted: string;
    readonly notes?: string;
    readonly onClose: () => void;
}

function AcceptedPaymentBadges() {
    return (
        <div className="flex items-center justify-center gap-1.5 pt-0.5">
            <span className="text-[9px] uppercase tracking-wider text-stone-500 font-semibold mr-1">Accepted:</span>
            <span className="px-1.5 py-0.5 rounded bg-stone-100 text-stone-800 text-[10px] font-semibold border border-stone-300">Visa</span>
            <span className="px-1.5 py-0.5 rounded bg-stone-100 text-stone-800 text-[10px] font-semibold border border-stone-300">Mastercard</span>
            <span className="px-1.5 py-0.5 rounded bg-[#006FCF] text-white text-[10px] font-bold tracking-tight">AMEX</span>
            <span className="px-1.5 py-0.5 rounded bg-black text-white text-[10px] font-medium">Apple Pay</span>
            <span className="px-1.5 py-0.5 rounded bg-stone-100 text-stone-800 text-[10px] font-semibold border border-stone-300">EFT</span>
        </div>
    );
}

function BookingConfirmationScreen({
                                       apiResult,
                                       packageTitle,
                                       date,
                                       adults,
                                       childrenCount,
                                       pickupPoint,
                                       dropoffPoint,
                                       safariRoute,
                                       idNumber,
                                       idType,
                                       fullName,
                                       totalSafariFormatted,
                                       notes,
                                       onClose,
                                   }: ConfirmationScreenProps) {
    const { format } = useCurrency();
    const [isPaying, setIsPaying] = useState(false);
    const [paymentError, setPaymentError] = useState('');

    const handleInitiatePayment = async () => {
        setIsPaying(true);
        setPaymentError('');

        try {
            const res = await fetch('/api/payments/initialize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ referenceNumber: apiResult.referenceNumber }),
            });

            const data = await res.json();
            if (!res.ok || !data.authorizationUrl) {
                setPaymentError(data.error || 'Failed to initialize payment gateway.');
                setIsPaying(false);
                return;
            }

            window.location.href = data.authorizationUrl;
        } catch {
            setPaymentError('Could not launch payment gateway.');
            setIsPaying(false);
        }
    };

    const dispatchWhatsApp = () => {
        const docLabel = idType === 'sa_id' ? 'SA ID' : 'Passport';
        const childManifest = childrenCount > 0 ? `, ${childrenCount} Children` : '';
        const msg =
            `*New Safaric Reservation (%23${apiResult.referenceNumber})*%0A%0A` +
            `*Name:* ${encodeURIComponent(fullName)}%0A` +
            `*ID / Passport:* ${encodeURIComponent(idNumber)} (${docLabel})%0A` +
            `*Experience:* ${encodeURIComponent(packageTitle)}%0A` +
            `*Route:* ${encodeURIComponent(safariRoute)}%0A` +
            `*Date:* ${date}%0A` +
            `*Party:* ${adults} Adults${childManifest}%0A` +
            `*Pickup:* ${encodeURIComponent(pickupPoint)}%0A` +
            `*Drop-off:* ${encodeURIComponent(dropoffPoint)}%0A` +
            `*Total Quote:* ${encodeURIComponent(totalSafariFormatted)}%0A` +
            `*Deposit (20%):* ${encodeURIComponent(format(apiResult.depositZAR))}%0A` +
            `*Notes:* ${encodeURIComponent(notes || 'None')}`;

        window.open(`https://wa.me/27836213226?text=${msg}`, '_blank');
        onClose();
    };

    return (
        <div className="p-6 sm:p-8 text-center space-y-5 text-stone-900">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-serif text-2xl font-bold text-[#1C3322]">Reservation Hold Confirmed!</h4>
            <p className="text-xs text-stone-600 max-w-md mx-auto">
                Your reservation reference is{' '}
                <strong className="text-[#1C3322] font-mono text-sm">{apiResult.referenceNumber}</strong>. Secure your safari vehicle and private guide with a 20% deposit.
            </p>

            {paymentError && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 max-w-md mx-auto">
                    <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                    <span>{paymentError}</span>
                </div>
            )}

            <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-xl p-3 text-left max-w-md mx-auto space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Complimentary Safari Inclusions</span>
                </div>
                <p className="text-[11px] text-emerald-900 leading-snug">
                    ✓ High-power game binoculars • Chilled bottled spring water • Warm ponchos & fleece blankets • SANParks gate permit clearance.
                </p>
            </div>

            <div className="bg-[#F7F4EC] p-4 rounded-xl text-xs text-left max-w-md mx-auto border border-[#C2933D]/30 space-y-1.5 font-mono text-stone-900 shadow-sm">
                <div className="flex justify-between border-b border-[#C2933D]/20 pb-1">
                    <span className="text-stone-600">Experience:</span>
                    <span className="font-bold text-[#1C3322] text-right">{packageTitle}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-stone-600">Route & Gate:</span>
                    <span className="text-stone-900 font-medium text-right">{safariRoute}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-stone-600">Date:</span>
                    <span className="text-stone-900">{date}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-stone-600">Party Registered:</span>
                    <span className="font-bold text-[#1C3322]">
                        {adults} Adult{adults > 1 ? 's' : ''} {childrenCount > 0 && `+ ${childrenCount} Child${childrenCount > 1 ? 'ren' : ''}`}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-stone-600">Pickup Area:</span>
                    <span className="text-stone-900">{pickupPoint}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-stone-600">Drop-off Area:</span>
                    <span className="text-stone-900">{dropoffPoint}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-stone-600">Gate Permit ID:</span>
                    <span className="text-stone-900">{idNumber} ({idType === 'sa_id' ? 'SA ID' : 'Passport'})</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-[#C2933D]/20">
                    <span className="text-stone-600">Total Safari Cost:</span>
                    <span className="font-bold text-stone-900">{totalSafariFormatted}</span>
                </div>
                <div className="flex justify-between text-emerald-800 font-bold bg-emerald-50/80 p-1.5 rounded">
                    <span>Deposit Required (20%):</span>
                    <span>{format(apiResult.depositZAR)}</span>
                </div>
                <div className="flex justify-between text-[11px] text-stone-500 px-1">
                    <span>Balance (Due on Arrival):</span>
                    <span className="text-stone-900">{format(apiResult.balanceZAR)}</span>
                </div>
            </div>

            <div className="max-w-md mx-auto space-y-3 pt-2">
                <button
                    type="button"
                    onClick={handleInitiatePayment}
                    disabled={isPaying}
                    className="w-full bg-[#1C3322] hover:bg-[#2B4D34] text-white font-bold py-3.5 px-6 rounded-xl text-xs uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                    {isPaying ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin text-[#C2933D]" />
                            <span>Redirecting to Paystack...</span>
                        </>
                    ) : (
                        <>
                            <CreditCard className="w-4 h-4 text-[#C2933D]" />
                            <span>Pay 20% Deposit ({format(apiResult.depositZAR)})</span>
                        </>
                    )}
                </button>

                <div className="flex items-center justify-center gap-1.5 text-[10px] text-stone-500">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>Secured by Paystack • Visa, Mastercard, American Express, Apple Pay</span>
                </div>

                <AcceptedPaymentBadges />

                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                    <button
                        type="button"
                        onClick={dispatchWhatsApp}
                        className="w-full bg-emerald-700 hover:bg-emerald-600 text-white font-semibold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow cursor-pointer"
                    >
                        <MessageCircle className="w-4 h-4" />
                        <span>Confirm via WhatsApp</span>
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full sm:w-1/3 bg-stone-200 hover:bg-stone-300 text-stone-800 font-semibold py-2.5 px-4 rounded-xl text-xs cursor-pointer"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

interface BookingFormViewProps {
    readonly packageId: string;
    readonly setPackageId: (id: string) => void;
    readonly date: string;
    readonly setDate: (date: string) => void;
    readonly adults: number;
    readonly setAdults: (adults: number) => void;
    readonly childrenCount: number;
    readonly setChildrenCount: (count: number) => void;
    readonly pickupPoint: string;
    readonly setPickupPoint: (pickup: string) => void;
    readonly dropoffPoint: string;
    readonly setDropoffPoint: (dropoff: string) => void;
    readonly safariRoute: string;
    readonly setSafariRoute: (route: string) => void;
    readonly includeBreakfast: boolean;
    readonly setIncludeBreakfast: (include: boolean) => void;
    readonly includeLensRental: boolean;
    readonly setIncludeLensRental: (include: boolean) => void;
    readonly fullName: string;
    readonly setFullName: (name: string) => void;
    readonly email: string;
    readonly setEmail: (email: string) => void;
    readonly phone: string;
    readonly setPhone: (phone: string) => void;
    readonly notes: string;
    readonly setNotes: (notes: string) => void;
    readonly idType: DocumentType;
    readonly setIdType: (type: DocumentType) => void;
    readonly idNumber: string;
    readonly setIdNumber: (num: string) => void;
    readonly nationality: string;
    readonly setNationality: (nat: string) => void;
    readonly loading: boolean;
    readonly errorMessage: string;
    readonly onSubmit: (e: React.SyntheticEvent) => void;
}

function BookingFormView(props: BookingFormViewProps) {
    const { format } = useCurrency();
    const currentPkg = SAFARI_PACKAGES.find((p) => p.id === props.packageId) || SAFARI_PACKAGES[0];

    const computedZAR = computeTotalZAR({
        basePriceZAR: currentPkg.basePriceZAR,
        isVehicleRate: currentPkg.isVehicleRate,
        adults: props.adults,
        children: props.childrenCount,
        includeBreakfast: props.includeBreakfast,
        includeLensRental: props.includeLensRental,
    });

    const totalPartyCount = props.adults + props.childrenCount;
    const estimatedDeposit = Math.round(computedZAR * 0.20);
    const estimatedBalance = computedZAR - estimatedDeposit;

    return (
        <form onSubmit={props.onSubmit} className="p-6 space-y-5 text-stone-900">
            {props.errorMessage && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                    <span>{props.errorMessage}</span>
                </div>
            )}

            {/* Complimentary Amenities Banner */}
            <div className="bg-emerald-50/90 border border-emerald-200 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs uppercase tracking-wider mb-2">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>All Bookings Include Complimentary Bush Amenities (No Charge)</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-emerald-800 font-medium">
                    <div className="flex items-center gap-1.5 bg-white/70 px-2 py-1.5 rounded-lg border border-emerald-100">
                        <span className="text-emerald-600 font-bold">✓</span> Game Binoculars
                    </div>
                    <div className="flex items-center gap-1.5 bg-white/70 px-2 py-1.5 rounded-lg border border-emerald-100">
                        <span className="text-emerald-600 font-bold">✓</span> Chilled Bottled Water
                    </div>
                    <div className="flex items-center gap-1.5 bg-white/70 px-2 py-1.5 rounded-lg border border-emerald-100">
                        <span className="text-emerald-600 font-bold">✓</span> Fleece Ponchos
                    </div>
                    <div className="flex items-center gap-1.5 bg-white/70 px-2 py-1.5 rounded-lg border border-emerald-100">
                        <span className="text-emerald-600 font-bold">✓</span> Gate Pre-clearance
                    </div>
                </div>
            </div>

            {/* Step 1: Experience & Timing */}
            <div>
                <div className="block text-xs font-bold uppercase tracking-wider text-[#1C3322] mb-1.5">
                    1. Select Safari &amp; Date
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label htmlFor="select-package" className="sr-only">Safari Package</label>
                        <select
                            id="select-package"
                            aria-label="Safari Package"
                            value={props.packageId}
                            onChange={(e) => props.setPackageId(e.target.value)}
                            className="w-full px-3 py-2.5 text-xs text-stone-900 bg-white font-medium rounded-lg border border-stone-300 focus:ring-1 focus:ring-[#1C3322] focus:border-[#1C3322] focus:outline-none shadow-sm"
                        >
                            {SAFARI_PACKAGES.map((p) => (
                                <option key={p.id} value={p.id} className="text-stone-900 bg-white py-1">
                                    {p.title} ({format(p.basePriceZAR)} {p.isVehicleRate ? 'private vehicle' : '/ person'})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="select-date" className="sr-only">Safari Date</label>
                        <input
                            id="select-date"
                            aria-label="Safari Date"
                            type="date"
                            required
                            value={props.date}
                            onChange={(e) => props.setDate(e.target.value)}
                            className="w-full px-3 py-2.5 text-xs text-stone-900 bg-white font-medium rounded-lg border border-stone-300 focus:ring-1 focus:ring-[#1C3322] focus:border-[#1C3322] focus:outline-none shadow-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Step 2: Passenger Manifest & Routing Logistics */}
            <div>
                <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#1C3322]">
                        2. Party Configuration &amp; Trip Logistics
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {totalPartyCount} Explorer{totalPartyCount > 1 ? 's' : ''} Selected
                    </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                        <label htmlFor="input-adults" className="block text-[11px] font-semibold text-stone-700 mb-1">
                            Adults (12+ yrs)
                        </label>
                        <input
                            id="input-adults"
                            type="number"
                            min={1}
                            max={20}
                            value={props.adults}
                            onChange={(e) => props.setAdults(Math.max(1, Number.parseInt(e.target.value, 10) || 1))}
                            className="w-full px-3 py-2 text-xs text-stone-900 bg-white font-medium rounded-lg border border-stone-300 focus:ring-1 focus:ring-[#1C3322] focus:outline-none shadow-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="input-children" className="block text-[11px] font-semibold text-stone-700 mb-1">
                            Children (4-11 yrs)
                        </label>
                        <input
                            id="input-children"
                            type="number"
                            min={0}
                            max={10}
                            value={props.childrenCount}
                            onChange={(e) => props.setChildrenCount(Math.max(0, Number.parseInt(e.target.value, 10) || 0))}
                            className="w-full px-3 py-2 text-xs text-stone-900 bg-white font-medium rounded-lg border border-stone-300 focus:ring-1 focus:ring-[#1C3322] focus:outline-none shadow-sm"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                    <div>
                        <label htmlFor="select-pickup" className="block text-[11px] font-semibold text-stone-700 mb-1 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#C2933D]" />
                            <span>Pickup Location</span>
                        </label>
                        <select
                            id="select-pickup"
                            value={props.pickupPoint}
                            onChange={(e) => props.setPickupPoint(e.target.value)}
                            className="w-full px-3 py-2 text-xs text-stone-900 bg-white font-medium rounded-lg border border-stone-300 focus:ring-1 focus:ring-[#1C3322] focus:outline-none shadow-sm"
                        >
                            <option value="Hazyview Lodge / Hotel">Hazyview Lodge / Hotel (Complimentary)</option>
                            <option value="Phabeni Gate (Kruger)">Phabeni Gate (Kruger)</option>
                            <option value="Paul Kruger Gate (Skukuza side)">Paul Kruger Gate (Skukuza side)</option>
                            <option value="Numbi Gate">Numbi Gate</option>
                            <option value="Malelane / Southern Zone">Malelane / Southern Lodge</option>
                            <option value="KMIA Nelspruit Airport">KMIA Airport (Mbombela)</option>
                            <option value="Other">Other (Mention in notes)</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="select-dropoff" className="block text-[11px] font-semibold text-stone-700 mb-1 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-stone-400" />
                            <span>Drop-off Location</span>
                        </label>
                        <select
                            id="select-dropoff"
                            value={props.dropoffPoint}
                            onChange={(e) => props.setDropoffPoint(e.target.value)}
                            className="w-full px-3 py-2 text-xs text-stone-900 bg-white font-medium rounded-lg border border-stone-300 focus:ring-1 focus:ring-[#1C3322] focus:outline-none shadow-sm"
                        >
                            <option value="Same as Pickup Location">Same as Pickup Location</option>
                            <option value="Hazyview Lodge / Hotel">Hazyview Lodge / Hotel</option>
                            <option value="Paul Kruger Gate Rest Point">Paul Kruger Gate Rest Point</option>
                            <option value="Skukuza Camp Inside Kruger">Skukuza Camp Inside Kruger</option>
                            <option value="KMIA Nelspruit Airport Shuttle">KMIA Airport Shuttle</option>
                            <option value="Other">Other (Specify in notes)</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label htmlFor="select-route" className="block text-[11px] font-semibold text-stone-700 mb-1 flex items-center gap-1">
                        <Compass className="w-3 h-3 text-[#1C3322]" />
                        <span>Full Safari Route &amp; Kruger Entrance Gate</span>
                    </label>
                    <select
                        id="select-route"
                        value={props.safariRoute}
                        onChange={(e) => props.setSafariRoute(e.target.value)}
                        className="w-full px-3 py-2 text-xs text-stone-900 bg-white font-medium rounded-lg border border-stone-300 focus:ring-1 focus:ring-[#1C3322] focus:outline-none shadow-sm"
                    >
                        <option value="Phabeni Gate & Central Kruger (Skukuza)">Phabeni Gate & Central Kruger (Skukuza & Sabie River Loop)</option>
                        <option value="Paul Kruger Gate (High Predator Density)">Paul Kruger Gate (High Predator Density Corridor)</option>
                        <option value="Numbi Gate (Pretoriuskop Granite Route)">Numbi Gate (Pretoriuskop Granite Outcrops)</option>
                        <option value="Malelane & Berg-en-Dal (Southern White Rhino Zone)">Malelane & Berg-en-Dal (Southern White Rhino Zone)</option>
                        <option value="Panorama Route & Blyde Canyon Combo">Panorama Route & Blyde River Canyon Combo</option>
                    </select>
                </div>
            </div>

            {/* Step 3: Optional Bush Add-ons */}
            <div>
                <div className="block text-xs font-bold uppercase tracking-wider text-[#1C3322] mb-1.5">
                    3. Optional Bush Add-ons
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center gap-2.5 p-3 rounded-lg border border-stone-300 bg-stone-50/70 hover:bg-stone-100 hover:border-[#1C3322] cursor-pointer transition shadow-sm">
                        <input
                            id="addon-breakfast"
                            type="checkbox"
                            checked={props.includeBreakfast}
                            onChange={(e) => props.setIncludeBreakfast(e.target.checked)}
                            className="w-4 h-4 rounded text-[#1C3322] border-stone-300 focus:ring-[#1C3322] cursor-pointer"
                        />
                        <label htmlFor="addon-breakfast" className="cursor-pointer select-none">
                            <span className="font-semibold block text-stone-900">Full Bush Breakfast Stop</span>
                            <span className="text-[11px] text-stone-600 font-medium">+{format(180)} per explorer</span>
                        </label>
                    </div>

                    <div className="flex items-center gap-2.5 p-3 rounded-lg border border-stone-300 bg-stone-50/70 hover:bg-stone-100 hover:border-[#1C3322] cursor-pointer transition shadow-sm">
                        <input
                            id="addon-lens"
                            type="checkbox"
                            checked={props.includeLensRental}
                            onChange={(e) => props.setIncludeLensRental(e.target.checked)}
                            className="w-4 h-4 rounded text-[#1C3322] border-stone-300 focus:ring-[#1C3322] cursor-pointer"
                        />
                        <label htmlFor="addon-lens" className="cursor-pointer select-none">
                            <span className="font-semibold block text-stone-900">Telephoto Safari Lens Hire</span>
                            <span className="text-[11px] text-stone-600 font-medium">+{format(650)} / day rental</span>
                        </label>
                    </div>
                </div>
            </div>

            {/* Step 4: Primary Contact */}
            <div>
                <div className="block text-xs font-bold uppercase tracking-wider text-[#1C3322] mb-1.5">
                    4. Primary Guest Contact Details
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                        <label htmlFor="input-fullname" className="sr-only">Full Name</label>
                        <input
                            id="input-fullname"
                            type="text"
                            required
                            placeholder="Full Name *"
                            value={props.fullName}
                            onChange={(e) => props.setFullName(e.target.value)}
                            className="w-full px-3 py-2 text-xs text-stone-900 bg-white placeholder:text-stone-400 font-medium rounded-lg border border-stone-300 focus:ring-1 focus:ring-[#1C3322] focus:border-[#1C3322] focus:outline-none shadow-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="input-email" className="sr-only">Email Address</label>
                        <input
                            id="input-email"
                            type="email"
                            required
                            placeholder="Email Address *"
                            value={props.email}
                            onChange={(e) => props.setEmail(e.target.value)}
                            className="w-full px-3 py-2 text-xs text-stone-900 bg-white placeholder:text-stone-400 font-medium rounded-lg border border-stone-300 focus:ring-1 focus:ring-[#1C3322] focus:border-[#1C3322] focus:outline-none shadow-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="input-phone" className="sr-only">WhatsApp / Phone</label>
                        <input
                            id="input-phone"
                            type="tel"
                            required
                            placeholder="WhatsApp / Phone *"
                            value={props.phone}
                            onChange={(e) => props.setPhone(e.target.value)}
                            className="w-full px-3 py-2 text-xs text-stone-900 bg-white placeholder:text-stone-400 font-medium rounded-lg border border-stone-300 focus:ring-1 focus:ring-[#1C3322] focus:border-[#1C3322] focus:outline-none shadow-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Step 5: SANParks Gate Permit Identification */}
            <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#C2933D]/40 space-y-2.5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#1C3322]">
                        <FileText className="w-3.5 h-3.5 text-[#C2933D]" />
                        <span>5. SANParks Gate Permit Identification</span>
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded">
                        Required for Kruger Entry
                    </span>
                </div>
                <p className="text-[11px] text-stone-600 leading-tight">
                    SANParks gate control strictly requires an official SA ID or passport number registered to your booking permit.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                        <label htmlFor="select-idtype" className="block text-[11px] font-semibold text-stone-700 mb-1">
                            Identification Type
                        </label>
                        <select
                            id="select-idtype"
                            value={props.idType}
                            onChange={(e) => {
                                const val = e.target.value as DocumentType;
                                props.setIdType(val);
                                if (val === 'sa_id') props.setNationality('South Africa');
                            }}
                            className="w-full px-3 py-2 text-xs text-stone-900 bg-white font-medium rounded-lg border border-stone-300 focus:ring-1 focus:ring-[#1C3322] focus:outline-none shadow-sm"
                        >
                            <option value="sa_id" className="text-stone-900 bg-white">South African ID</option>
                            <option value="passport" className="text-stone-900 bg-white">International Passport</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="input-idnumber" className="block text-[11px] font-semibold text-stone-700 mb-1">
                            {props.idType === 'sa_id' ? '13-Digit SA ID Number *' : 'Passport Number *'}
                        </label>
                        <input
                            id="input-idnumber"
                            type="text"
                            required
                            maxLength={props.idType === 'sa_id' ? 13 : 15}
                            placeholder={props.idType === 'sa_id' ? 'e.g. 9508125089083' : 'e.g. A12345678'}
                            value={props.idNumber}
                            onChange={(e) => props.setIdNumber(e.target.value)}
                            className="w-full px-3 py-2 text-xs text-stone-900 bg-white placeholder:text-stone-400 font-mono tracking-wider font-semibold rounded-lg border border-stone-300 focus:ring-1 focus:ring-[#1C3322] focus:outline-none shadow-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="input-nationality" className="block text-[11px] font-semibold text-stone-700 mb-1">
                            Country of Citizenship
                        </label>
                        <input
                            id="input-nationality"
                            type="text"
                            required
                            value={props.nationality}
                            onChange={(e) => props.setNationality(e.target.value)}
                            placeholder="e.g. South Africa, Germany, UK"
                            className="w-full px-3 py-2 text-xs text-stone-900 bg-white placeholder:text-stone-400 font-medium rounded-lg border border-stone-300 focus:ring-1 focus:ring-[#1C3322] focus:outline-none shadow-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Notes */}
            <div>
                <label htmlFor="input-notes" className="sr-only">Special notes</label>
                <input
                    id="input-notes"
                    type="text"
                    placeholder="Special dietary requirements or notes (optional)"
                    value={props.notes}
                    onChange={(e) => props.setNotes(e.target.value)}
                    className="w-full px-3 py-2 text-xs text-stone-900 bg-white placeholder:text-stone-400 font-medium rounded-lg border border-stone-300 focus:ring-1 focus:ring-[#1C3322] focus:outline-none shadow-sm"
                />
            </div>

            {/* Summary Bar */}
            <div className="bg-[#F7F4EC] p-4 rounded-xl border border-[#C2933D]/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-stone-900 shadow-sm">
                <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#1C3322] block">
                        Total Booking Quote ({totalPartyCount} Explorer{totalPartyCount > 1 ? 's' : ''})
                    </span>
                    <div className="text-2xl font-serif font-bold text-[#1C3322]">
                        {format(computedZAR)}
                    </div>
                    <span className="text-[10px] text-stone-600 block">
                        20% Deposit: <strong>{format(estimatedDeposit)}</strong> • Due on arrival: {format(estimatedBalance)}
                    </span>
                </div>

                <button
                    type="submit"
                    disabled={props.loading}
                    className="w-full sm:w-auto bg-[#1C3322] hover:bg-[#2B4D34] text-white font-bold py-3 px-8 rounded-xl text-xs uppercase tracking-wider transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                    {props.loading ? (
                        <Loader2 className="w-4 h-4 animate-spin text-[#C2933D]" />
                    ) : (
                        <CheckCircle2 className="w-4 h-4 text-[#C2933D]" />
                    )}
                    <span>{props.loading ? 'Processing...' : 'Confirm Safari Request'}</span>
                </button>
            </div>
        </form>
    );
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

    const [pickupPoint, setPickupPoint] = useState('Hazyview Lodge / Hotel');
    const [dropoffPoint, setDropoffPoint] = useState('Hazyview Lodge / Hotel');
    const [safariRoute, setSafariRoute] = useState('Phabeni Gate & Central Kruger (Skukuza)');

    const [includeBreakfast, setIncludeBreakfast] = useState(false);
    const [includeLensRental, setIncludeLensRental] = useState(false);

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [notes, setNotes] = useState('');

    const [idType, setIdType] = useState<DocumentType>('sa_id');
    const [idNumber, setIdNumber] = useState('');
    const [nationality, setNationality] = useState('South Africa');

    const [loading, setLoading] = useState(false);
    const [apiResult, setApiResult] = useState<BookingResponse | null>(null);
    const [errorMessage, setErrorMessage] = useState('');

    if (!isOpen) return null;

    const currentPkg = SAFARI_PACKAGES.find((p) => p.id === packageId) || SAFARI_PACKAGES[0];

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage('');

        const combinedNotes = [
            `Route: ${safariRoute}`,
            `Drop-off: ${dropoffPoint}`,
            notes ? `Special Notes: ${notes}` : '',
        ].filter(Boolean).join(' | ');

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
            idType,
            idNumber: idNumber.trim().toUpperCase(),
            nationality: nationality.trim(),
            notes: combinedNotes,
        };

        try {
            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data: BookingResponse = await res.json();
            if (!res.ok) {
                setErrorMessage(data.message || 'Booking submission failed');
                return;
            }

            setApiResult(data);
        } catch {
            setErrorMessage('An unexpected network error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{ colorScheme: 'light' }}
            className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm p-4 sm:p-6 flex items-center justify-center text-stone-900"
        >
            <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#C2933D]/40 text-stone-900 my-8">
                {/* Header */}
                <div className="bg-[#1C3322] text-white p-6 relative border-b border-[#C2933D]/30">
                    <button
                        type="button"
                        aria-label="Close reservation dialog"
                        onClick={onClose}
                        className="absolute top-5 right-5 text-stone-300 hover:text-white bg-[#122216]/50 p-2 rounded-full transition cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    <span className="text-[#C2933D] text-[11px] uppercase tracking-widest font-bold block mb-1">
                        Safaric Kruger Reservation Engine
                    </span>
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">Book Your Safari Experience</h3>
                    <p className="text-xs text-stone-300 font-light mt-0.5">
                        Direct reservations, instant party calculations, and dedicated Kruger guide assignment.
                    </p>
                </div>

                {apiResult ? (
                    <BookingConfirmationScreen
                        apiResult={apiResult}
                        packageTitle={currentPkg.title}
                        date={date}
                        adults={adults}
                        childrenCount={children}
                        pickupPoint={pickupPoint}
                        dropoffPoint={dropoffPoint}
                        safariRoute={safariRoute}
                        idNumber={idNumber}
                        idType={idType}
                        fullName={fullName}
                        totalSafariFormatted={format(apiResult.safariTotalZAR ?? 0)}
                        notes={notes}
                        onClose={onClose}
                    />
                ) : (
                    <BookingFormView
                        packageId={packageId}
                        setPackageId={setPackageId}
                        date={date}
                        setDate={setDate}
                        adults={adults}
                        setAdults={setAdults}
                        childrenCount={children}
                        setChildrenCount={setChildren}
                        pickupPoint={pickupPoint}
                        setPickupPoint={setPickupPoint}
                        dropoffPoint={dropoffPoint}
                        setDropoffPoint={setDropoffPoint}
                        safariRoute={safariRoute}
                        setSafariRoute={setSafariRoute}
                        includeBreakfast={includeBreakfast}
                        setIncludeBreakfast={setIncludeBreakfast}
                        includeLensRental={includeLensRental}
                        setIncludeLensRental={setIncludeLensRental}
                        fullName={fullName}
                        setFullName={setFullName}
                        email={email}
                        setEmail={setEmail}
                        phone={phone}
                        setPhone={setPhone}
                        notes={notes}
                        setNotes={setNotes}
                        idType={idType}
                        setIdType={setIdType}
                        idNumber={idNumber}
                        setIdNumber={setIdNumber}
                        nationality={nationality}
                        setNationality={setNationality}
                        loading={loading}
                        errorMessage={errorMessage}
                        onSubmit={handleSubmit}
                    />
                )}
            </div>
        </div>
    );
}