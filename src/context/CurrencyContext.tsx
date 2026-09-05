'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CurrencyCode } from '@/types/safari';
import { formatPrice } from '@/lib/currency';

interface CurrencyContextType {
    currency: CurrencyCode;
    setCurrency: (code: CurrencyCode) => void;
    format: (amountZar: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
    const [currency, setCurrency] = useState<CurrencyCode>('ZAR');

    const format = (amountZar: number) => formatPrice(amountZar, currency);

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency, format }}>
            {children}
        </CurrencyContext.Provider>
    );
}

export function useCurrency() {
    const context = useContext(CurrencyContext);
    if (!context) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
}