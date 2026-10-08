'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, ShieldCheck, ArrowRight } from 'lucide-react';

function ConfirmationContent() {
    const searchParams = useSearchParams();
    const reference = searchParams.get('ref') || searchParams.get('reference') || 'SAF-CONFIRMED';

    return (
        <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-[#C2933D]/30 shadow-2xl text-center space-y-6">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle className="w-10 h-10" />
                </div>

                <div>
                    <span className="text-[11px] font-bold tracking-widest uppercase text-[#C2933D]">
                        Payment Authorized
                    </span>
                    <h1 className="font-serif text-3xl font-bold text-[#1C3322] mt-1">
                        Safari Deposit Paid!
                    </h1>
                    <p className="text-xs text-stone-600 mt-2">
                        Your 20% commitment deposit has been received. Your Kruger safari vehicle and private guide are formally scheduled.
                    </p>
                </div>

                <div className="bg-[#F7F4EC] p-4 rounded-xl text-xs border border-[#C2933D]/30 font-mono space-y-1 text-left">
                    <div className="flex justify-between">
                        <span className="text-stone-500">Booking Reference:</span>
                        <span className="font-bold text-[#1C3322]">{reference}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-stone-500">Status:</span>
                        <span className="text-emerald-700 font-bold">Confirmed</span>
                    </div>
                </div>

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-500">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Official VAT receipt and pickup voucher sent to your email.</span>
                </div>

                <Link
                    href="/"
                    className="inline-flex items-center justify-center gap-2 w-full bg-[#1C3322] hover:bg-[#2B4D34] text-white font-bold py-3.5 px-6 rounded-xl text-xs uppercase tracking-wider transition shadow"
                >
                    <span>Return to Safaric Home</span>
                    <ArrowRight className="w-4 h-4 text-[#C2933D]" />
                </Link>
            </div>
        </div>
    );
}

export default function BookingConfirmedPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#FDFBF7]" />}>
            <ConfirmationContent />
        </Suspense>
    );
}