import { CurrencyCode } from '@/types/safari';

export const CURRENCIES: Record<CurrencyCode, { symbol: string; label: string; rate: number }> = {
    ZAR: { symbol: 'R', label: 'ZAR (R)', rate: 1.0 },
    USD: { symbol: '$', label: 'USD ($)', rate: 0.055 },
    EUR: { symbol: '€', label: 'EUR (€)', rate: 0.051 },
    GBP: { symbol: '£', label: 'GBP (£)', rate: 0.043 },
};

export function formatPrice(amountInZar: number, currency: CurrencyCode): string {
    const target = CURRENCIES[currency] || CURRENCIES.ZAR;
    const converted = Math.round(amountInZar * target.rate);
    return `${target.symbol} ${converted.toLocaleString()}`;
}

export function computeTotalZAR(params: {
    basePriceZAR: number;
    isVehicleRate?: boolean;
    adults: number;
    children: number;
    includeBreakfast: boolean;
    includeLensRental: boolean;
    privateVehicleBuyout?: boolean;
}): number {
    let subtotal = 0;
    if (params.isVehicleRate) {
        subtotal = params.basePriceZAR;
    } else {
        const childCost = params.basePriceZAR * 0.5;
        subtotal = (params.adults * params.basePriceZAR) + (params.children * childCost);
    }

    if (params.includeBreakfast) {
        subtotal += (params.adults + params.children) * 180;
    }
    if (params.includeLensRental) {
        subtotal += 2800; // Professional Sony Alpha + Telephoto rental package
    }
    if (params.privateVehicleBuyout) {
        subtotal += 6500; // Private OSV exclusivity buyout per day
    }

    return Math.round(subtotal);
}

export function computeDepositBreakdown(totalZar: number, currency: CurrencyCode) {
    const target = CURRENCIES[currency] || CURRENCIES.ZAR;
    const totalConverted = Math.round(totalZar * target.rate);
    const depositConverted = Math.round(totalConverted * 0.20);
    const balanceConverted = totalConverted - depositConverted;

    return {
        totalFormatted: `${target.symbol} ${totalConverted.toLocaleString()}`,
        depositFormatted: `${target.symbol} ${depositConverted.toLocaleString()}`,
        balanceFormatted: `${target.symbol} ${balanceConverted.toLocaleString()}`,
        raw: {
            total: totalConverted,
            deposit: depositConverted,
            balance: balanceConverted,
        },
    };
}