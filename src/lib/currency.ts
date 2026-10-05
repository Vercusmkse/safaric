import { CurrencyCode, ResidencyType } from '@/types/safari';

export const CURRENCIES: Record<CurrencyCode, { label: string; symbol: string; rateFromZAR: number }> = {
    ZAR: { label: 'ZAR (R)', symbol: 'R', rateFromZAR: 1 },
    USD: { label: 'USD ($)', symbol: '$', rateFromZAR: 0.055 },
    EUR: { label: 'EUR (€)', symbol: '€', rateFromZAR: 0.051 },
    GBP: { label: 'GBP (£)', symbol: '£', rateFromZAR: 0.043 },
};

export const SANPARKS_GATE_FEES: Record<ResidencyType, { label: string; adultZAR: number; childZAR: number }> = {
    international: {
        label: 'International Standard',
        adultZAR: 602,
        childZAR: 300,
    },
    sadc: {
        label: 'SADC Nationals',
        adultZAR: 275,
        childZAR: 137,
    },
    'south-african': {
        label: 'South African Citizens / Residents',
        adultZAR: 134,
        childZAR: 67,
    },
};

export interface SafariTotalParams {
    basePriceZAR: number;
    isVehicleRate?: boolean;
    adults: number;
    children?: number;
    [key: string]: unknown; // Gracefully accept any legacy extra properties
}

/**
 * Calculates the total safari drive price in ZAR based on per-person or vehicle charter rates.
 */
export function computeSafariTotalZAR({
                                          basePriceZAR,
                                          isVehicleRate,
                                          adults,
                                          children = 0,
                                      }: SafariTotalParams): number {
    if (isVehicleRate) {
        return Number(basePriceZAR) || 0;
    }
    const totalGuests = (Number(adults) || 1) + (Number(children) || 0);
    return (Number(basePriceZAR) || 0) * totalGuests;
}

// Backward-compatible alias
export const computeTotalZAR = computeSafariTotalZAR;

/**
 * Calculates official SANParks conservation entrance gate fees in ZAR.
 */
export function computeGateFeesZAR(
    residency: ResidencyType = 'international',
    adults: number = 1,
    children: number = 0
): number {
    const feeConfig = SANPARKS_GATE_FEES[residency] || SANPARKS_GATE_FEES.international;
    const adultTotal = (Number(adults) || 0) * feeConfig.adultZAR;
    const childTotal = (Number(children) || 0) * feeConfig.childZAR;
    return adultTotal + childTotal;
}

/**
 * Formats a ZAR amount into the selected display currency.
 */
export function formatPrice(amountZAR: number, currency: CurrencyCode = 'ZAR'): string {
    const config = CURRENCIES[currency] || CURRENCIES.ZAR;
    const converted = amountZAR * config.rateFromZAR;

    if (currency === 'ZAR') {
        return `R ${Math.round(converted).toLocaleString()}`;
    }
    return `${config.symbol}${Math.round(converted).toLocaleString()}`;
}

/**
 * Computes the 20% commitment deposit breakdown and remaining 80% balance.
 */
export function computeDepositBreakdown(totalZAR: number, currency: CurrencyCode = 'ZAR') {
    const depositZAR = Math.round(totalZAR * 0.20);
    const balanceZAR = totalZAR - depositZAR;

    return {
        totalZAR,
        depositZAR,
        balanceZAR,
        totalFormatted: formatPrice(totalZAR, currency),
        depositFormatted: formatPrice(depositZAR, currency),
        balanceFormatted: formatPrice(balanceZAR, currency),
    };
}