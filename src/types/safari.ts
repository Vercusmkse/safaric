export type CurrencyCode = 'ZAR' | 'USD' | 'EUR' | 'GBP';

export interface SafariPackage {
    id: string;
    title: string;
    category: 'day-drive' | 'multiday' | 'photo' | 'transfer';
    duration: string;
    location: string;
    badge?: string;
    basePriceZAR: number;
    isVehicleRate?: boolean;
    description: string;
    highlights: string[];
    imageUrl: string;
}

export interface WildlifeProfile {
    id: string;
    name: string;
    scientificName: string;
    title: string;
    description: string;
    bestKrugerZones: string;
    photographyTip: string;
    imageUrl: string;
}

export interface BookingFormData {
    packageId: string;
    date: string;
    adults: number;
    children: number;
    pickupPoint: string;
    includeBreakfast: boolean;
    includeLensRental: boolean;
    fullName: string;
    email: string;
    phone: string;
    notes?: string;
}

export interface BookingResponse {
    success: boolean;
    referenceNumber: string;
    totalZAR: number;
    message: string;
    data?: BookingFormData;
}