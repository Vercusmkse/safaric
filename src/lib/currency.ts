import { CurrencyCode } from '@/types/safari';

export const CURRENCIES: Record<CurrencyCode, { symbol: string; label: string; rate: number }> = {
    ZAR: { symbol: 'R', label: 'ZAR (R)', rate: 1.0 },
    USD: { symbol: '$', label: 'USD ($)', rate: 0.055 },
    EUR: { symbol: '€', label: 'EUR (€)', rate: 0.051 },
    GBP: { symbol: '£', label: 'GBP (£)', rate: 0.043 },
};

export function formatPrice(amountInZar: number, currency: CurrencyCode): string {
    const target = CURRENCIES[currency];
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
        subtotal += 650;
    }

    return Math.round(subtotal);
}