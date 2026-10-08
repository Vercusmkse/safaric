'use client';

import React, { useState } from 'react';
import { BookingFormData, BookingResponse, DocumentType } from '@/types/safari';
import { SAFARI_PACKAGES } from '@/data/packages';
import { useCurrency } from '@/context/CurrencyContext';
import { computeTotalZAR } from '@/lib/currency';
import { X, CheckCircle2, MessageCircle, AlertCircle, Loader2, CreditCard, ShieldCheck, FileText } from 'lucide-react';

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
            `*Date:* ${date}%0A` +
            `*Guests:* ${adults} Adults${childManifest}%0A` +
            `*Pickup:* ${encodeURIComponent(pickupPoint)}%0A` +
            `*Total Estimate:* ${encodeURIComponent(totalSafariFormatted)}%0A` +
            `*Deposit (20%):* ${encodeURIComponent(format(apiResult.depositZAR))}%0A` +
            `*Notes:* ${encodeURIComponent(notes || 'None')}`;

        window.open(`https://wa.me/27711234567?text=${msg}`, '_blank');
        onClose();
    };

    return (
        <div className="p-6 sm:p-8 text-center space-y-5 text-stone-900">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-serif text-2xl font-bold text-[#1C3322]">Reservation Hold Confirmed!</h4>
            <p className="text-xs text-stone-600 max-w-md mx-auto">
                Your reservation reference is{' '}
                <strong className="text-[#1C3322] font-mono text-sm">{apiResult.referenceNumber}</strong>. Secure your safari date with a 20% deposit.
            </p>

            {paymentError && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 max-w-md mx-auto">
                    <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                    <span>{paymentError}</span>
                </div>
            )}

            <div className="bg-[#F7F4EC] p-4 rounded-xl text-xs text-left max-w-md mx-auto border border-[#C2933D]/30 space-y-1.5 font-mono text-stone-900">
                <div className="flex justify-between border-b border-[#C2933D]/20 pb-1">
                    <span className="text-stone-600">Experience:</span>
                    <span className="font-bold text-[#1C3322]">{packageTitle}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-stone-600">Date:</span>
                    <span className="text-stone-900">{date}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-stone-600">Gate Permit ID:</span>
                    <span className="text-stone-900">{idNumber} ({idType === 'sa_id' ? 'SA ID' : 'Passport'})</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-stone-600">Party:</span>
                    <span className="text-stone-900">{adults} Adults {childrenCount > 0 && `, ${childrenCount} Children`}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-stone-600">Pickup Area:</span>
                    <span className="text-stone-900">{pickupPoint}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-[#C2933D]/20">
                    <span className="text-stone-600">Total Safari Cost:</span>
                    <span className="font-bold text-stone-900">{totalSafariFormatted}</span>
                </div>
                <div className="flex justify-between text-emerald-800 font-bold bg-emerald-50/60 p-1.5 rounded">
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
                            <span>Redirecting to Secure Checkout...</span>
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
                        <span>Chat on WhatsApp</span>
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

    const [idType, setIdType] = useState<DocumentType>('sa_id');
    const [idNumber, setIdNumber] = useState('');
    const [nationality, setNationality] = useState('South Africa');

    const [loading, setLoading] = useState(false);
    const [apiResult, setApiResult] = useState<BookingResponse | null>(null);
    const [errorMessage, setErrorMessage] = useState('');

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

    const handleSubmit = async (e: React.SyntheticEvent) => {
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
            idType,
            idNumber: idNumber.trim().toUpperCase(),
            nationality: nationality.trim(),
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
            <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#C2933D]/40 text-stone-900">
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
                        Direct reservations, instant price calculations, and dedicated Kruger guide assignment.
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
                        idNumber={idNumber}
                        idType={idType}
                        fullName={fullName}
                        totalSafariFormatted={format(apiResult.safariTotalZAR || computedZAR)}
                        notes={notes}
                        onClose={onClose}
                    />
                ) : (
                    <form onSubmit={handleSubmit} className="p-6 space-y-5 text-stone-900">
                        {errorMessage && (
                            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                                <span>{errorMessage}</span>
                            </div>
                        )}

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
                                        value={packageId}
                                        onChange={(e) => setPackageId(e.target.value)}
                                        className="w-full px-3 py-2.5 text-xs text-stone-900 bg-white font-medium rounded-lg border border-stone-300 focus:ring-1 focus:ring-[#1C3322] focus:border-[#1C3322] focus:outline-none shadow-sm"
                                    >
                                        {SAFARI_PACKAGES.map((p) => (
                                            <option key={p.id} value={p.id} className="text-stone-900 bg-white py-1">
                                                {p.title} ({format(p.basePriceZAR)})
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
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="w-full px-3 py-2.5 text-xs text-stone-900 bg-white font-medium rounded-lg border border-stone-300 focus:ring-1 focus:ring-[#1C3322] focus:border-[#1C3322] focus:outline-none shadow-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Step 2: Passenger Manifest & Pickup */}
                        <div>
                            <div className="block text-xs font-bold uppercase tracking-wider text-[#1C3322] mb-1.5">
                                2. Party Configuration &amp; Pickup Area
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div>
                                    <label htmlFor="input-adults" className="block text-[11px] font-semibold text-stone-700 mb-1">
                                        Adults (12+ yrs)
                                    </label>
                                    <input
                                        id="input-adults"
                                        type="number"
                                        min={1}
                                        max={20}
                                        value={adults}
                                        onChange={(e) => setAdults(Number(e.target.value))}
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
                                        value={children}
                                        onChange={(e) => setChildren(Number(e.target.value))}
                                        className="w-full px-3 py-2 text-xs text-stone-900 bg-white font-medium rounded-lg border border-stone-300 focus:ring-1 focus:ring-[#1C3322] focus:outline-none shadow-sm"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="select-pickup" className="block text-[11px] font-semibold text-stone-700 mb-1">
                                        Pickup Location
                                    </label>
                                    <select
                                        id="select-pickup"
                                        value={pickupPoint}
                                        onChange={(e) => setPickupPoint(e.target.value)}
                                        className="w-full px-3 py-2 text-xs text-stone-900 bg-white font-medium rounded-lg border border-stone-300 focus:ring-1 focus:ring-[#1C3322] focus:outline-none shadow-sm"
                                    >
                                        <option value="Hazyview Lodge" className="text-stone-900 bg-white">Hazyview Lodge / Hotel</option>
                                        <option value="Phabeni Gate" className="text-stone-900 bg-white">Phabeni Gate (Kruger)</option>
                                        <option value="Paul Kruger Gate" className="text-stone-900 bg-white">Paul Kruger Gate (Skukuza side)</option>
                                        <option value="Numbi Gate" className="text-stone-900 bg-white">Numbi Gate</option>
                                        <option value="Malelane / Southern Zone" className="text-stone-900 bg-white">Malelane / Southern Lodge</option>
                                        <option value="KMIA Nelspruit Airport" className="text-stone-900 bg-white">KMIA Airport (Mbombela)</option>
                                        <option value="Other" className="text-stone-900 bg-white">Other (Mention in notes)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Step 3: Bush Add-ons */}
                        <div>
                            <div className="block text-xs font-bold uppercase tracking-wider text-[#1C3322] mb-1.5">
                                3. Optional Bush Add-ons
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                <label
                                    htmlFor="addon-breakfast"
                                    aria-label="Include Full Bush Breakfast Stop (+180 ZAR per explorer)"
                                    className="flex items-center gap-2.5 p-3 rounded-lg border border-stone-300 bg-stone-50/70 hover:bg-stone-100 hover:border-[#1C3322] cursor-pointer transition shadow-sm"
                                >
                                    <input
                                        id="addon-breakfast"
                                        aria-label="Include Full Bush Breakfast Stop"
                                        type="checkbox"
                                        checked={includeBreakfast}
                                        onChange={(e) => setIncludeBreakfast(e.target.checked)}
                                        className="w-4 h-4 rounded text-[#1C3322] border-stone-300 focus:ring-[#1C3322]"
                                    />
                                    <div>
                                        <span className="font-semibold block text-stone-900">Full Bush Breakfast Stop</span>
                                        <span className="text-[11px] text-stone-600 font-medium">+{format(180)} per explorer</span>
                                    </div>
                                </label>

                                <label
                                    htmlFor="addon-lens"
                                    aria-label="Include Telephoto Safari Lens Hire (+650 ZAR per day rental)"
                                    className="flex items-center gap-2.5 p-3 rounded-lg border border-stone-300 bg-stone-50/70 hover:bg-stone-100 hover:border-[#1C3322] cursor-pointer transition shadow-sm"
                                >
                                    <input
                                        id="addon-lens"
                                        aria-label="Include Telephoto Safari Lens Hire"
                                        type="checkbox"
                                        checked={includeLensRental}
                                        onChange={(e) => setIncludeLensRental(e.target.checked)}
                                        className="w-4 h-4 rounded text-[#1C3322] border-stone-300 focus:ring-[#1C3322]"
                                    />
                                    <div>
                                        <span className="font-semibold block text-stone-900">Telephoto Safari Lens Hire</span>
                                        <span className="text-[11px] text-stone-600 font-medium">+{format(650)} / day rental</span>
                                    </div>
                                </label>
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
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
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
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-3 py-2 text-xs text-stone-900 bg-white placeholder:text-stone-400 font-medium rounded-lg border border-stone-300 focus:ring-1 focus:ring-[#1C3322] focus:border-[#1C3322] focus:outline-none shadow-sm"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="input-phone" className="sr-only">WhatsApp or Phone</label>
                                    <input
                                        id="input-phone"
                                        type="tel"
                                        required
                                        placeholder="WhatsApp / Phone *"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
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
                                        value={idType}
                                        onChange={(e) => {
                                            const val = e.target.value as DocumentType;
                                            setIdType(val);
                                            if (val === 'sa_id') setNationality('South Africa');
                                        }}
                                        className="w-full px-3 py-2 text-xs text-stone-900 bg-white font-medium rounded-lg border border-stone-300 focus:ring-1 focus:ring-[#1C3322] focus:outline-none shadow-sm"
                                    >
                                        <option value="sa_id" className="text-stone-900 bg-white">South African ID</option>
                                        <option value="passport" className="text-stone-900 bg-white">International Passport</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="input-idnumber" className="block text-[11px] font-semibold text-stone-700 mb-1">
                                        {idType === 'sa_id' ? '13-Digit SA ID Number *' : 'Passport Number *'}
                                    </label>
                                    <input
                                        id="input-idnumber"
                                        type="text"
                                        required
                                        maxLength={idType === 'sa_id' ? 13 : 15}
                                        placeholder={idType === 'sa_id' ? 'e.g. 9508125089083' : 'e.g. A12345678'}
                                        value={idNumber}
                                        onChange={(e) => setIdNumber(e.target.value)}
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
                                        value={nationality}
                                        onChange={(e) => setNationality(e.target.value)}
                                        placeholder="e.g. South Africa, Germany, UK"
                                        className="w-full px-3 py-2 text-xs text-stone-900 bg-white placeholder:text-stone-400 font-medium rounded-lg border border-stone-300 focus:ring-1 focus:ring-[#1C3322] focus:outline-none shadow-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Dietary Notes */}
                        <div>
                            <label htmlFor="input-notes" className="sr-only">Special dietary requirements or notes</label>
                            <input
                                id="input-notes"
                                type="text"
                                placeholder="Special dietary requirements or notes (optional)"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="w-full px-3 py-2 text-xs text-stone-900 bg-white placeholder:text-stone-400 font-medium rounded-lg border border-stone-300 focus:ring-1 focus:ring-[#1C3322] focus:outline-none shadow-sm"
                            />
                        </div>

                        {/* Calculation Summary Bar */}
                        <div className="bg-[#F7F4EC] p-4 rounded-xl border border-[#C2933D]/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-stone-900 shadow-sm">
                            <div>
                                <span className="text-[10px] uppercase font-bold tracking-wider text-[#1C3322] block">
                                    Total Estimated Booking Quote
                                </span>
                                <div className="text-2xl font-serif font-bold text-[#1C3322]">
                                    {format(computedZAR)}
                                </div>
                                <span className="text-[10px] text-stone-600 block">
                                    SANParks daily conservation entry fees payable at park gates.
                                </span>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full sm:w-auto bg-[#1C3322] hover:bg-[#2B4D34] text-white font-bold py-3 px-8 rounded-xl text-xs uppercase tracking-wider transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
                            >
                                {loading ? (
                                    <Loader2 className="w-4 h-4 animate-spin text-[#C2933D]" />
                                ) : (
                                    <CheckCircle2 className="w-4 h-4 text-[#C2933D]" />
                                )}
                                <span>{loading ? 'Processing...' : 'Confirm Safari Request'}</span>
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}