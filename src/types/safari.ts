export type CurrencyCode = 'ZAR' | 'USD' | 'EUR' | 'GBP';

export type ResidencyType = 'international' | 'sadc' | 'south-african';

export interface GuideProfile {
    id: string;
    name: string;
    role: string;
    accreditation: string; // Statutory Tourism Act No. 3 of 2014 & CATHSSETA
    registrationNumber: string;
    specialties: string[];
    yearsExperience: number;
    bio: string;
    imageUrl: string;
    audioIntroUrl?: string;
}

export interface SafariPackage {
    id: string;
    title: string;
    category: 'shared' | 'private' | 'custom' | 'day-drive' | 'multiday' | 'photo' | 'transfer';
    timing?: string;
    duration: string;
    location: string;
    badge?: string;
    basePriceZAR: number;
    isVehicleRate?: boolean;
    minGuests?: number;
    maxGuests?: number;
    maxGuestsPerVehicle?: number;
    allInclusiveGateFees?: boolean;
    onRequest?: boolean;
    description: string;
    highlights: string[];
    freeAmenities?: string[];
    imageUrl: string;
    itineraryDays?: {
        day: number;
        title: string;
        description: string;
    }[];
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
    residency?: ResidencyType;
    pickupPoint: string;
    privateVehicleBuyout?: boolean;
    fullName: string;
    email: string;
    phone: string;
    notes?: string;
    includeBreakfast?: boolean;
    includeLensRental?: boolean;
}

export interface BookingResponse {
    success: boolean;
    referenceNumber: string;
    safariTotalZAR?: number;
    totalZAR?: number;
    estimatedGateFeesZAR?: number;
    depositZAR: number;
    balanceZAR: number;
    message: string;
    data?: BookingFormData;
}