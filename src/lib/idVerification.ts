export interface IdValidationResult {
    isValid: boolean;
    error?: string;
    details?: {
        dateOfBirth?: string;
        gender?: 'Male' | 'Female';
        citizenship?: 'SA Citizen' | 'Permanent Resident';
    };
}

/**
 * Validates a South African 13-digit National ID using the Luhn checksum algorithm
 * and validates the embedded date of birth.
 */
export function validateSouthAfricanId(id: string): IdValidationResult {
    const cleanId = id.replace(/\s+/g, '').trim();

    if (!/^\d{13}$/.test(cleanId)) {
        return { isValid: false, error: 'SA ID must be exactly 13 digits.' };
    }

    // 1. Verify Date of Birth (YYMMDD)
    const yearPart = parseInt(cleanId.substring(0, 2), 10);
    const monthPart = parseInt(cleanId.substring(2, 4), 10);
    const dayPart = parseInt(cleanId.substring(4, 6), 10);

    if (monthPart < 1 || monthPart > 12) {
        return { isValid: false, error: 'Invalid month in South African ID.' };
    }
    if (dayPart < 1 || dayPart > 31) {
        return { isValid: false, error: 'Invalid day in South African ID.' };
    }

    // 2. Luhn Algorithm Checksum
    let sum = 0;
    for (let i = 0; i < 13; i++) {
        let digit = parseInt(cleanId.charAt(i), 10);
        if (i % 2 !== 0) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }
        sum += digit;
    }

    if (sum % 10 !== 0) {
        return { isValid: false, error: 'Invalid South African ID checksum number.' };
    }

    // 3. Extract Metadata
    const genderDigit = parseInt(cleanId.charAt(6), 10);
    const gender = genderDigit >= 5 ? 'Male' : 'Female';
    const citizenDigit = parseInt(cleanId.charAt(10), 10);
    const citizenship = citizenDigit === 0 ? 'SA Citizen' : 'Permanent Resident';

    const currentYear = new Date().getFullYear() % 100;
    const fullYear = yearPart <= currentYear ? 2000 + yearPart : 1900 + yearPart;
    const dobFormatted = `${fullYear}-${String(monthPart).padStart(2, '0')}-${String(dayPart).padStart(2, '0')}`;

    return {
        isValid: true,
        details: {
            dateOfBirth: dobFormatted,
            gender,
            citizenship,
        },
    };
}

/**
 * Validates international passport formats (alphanumeric, 6–12 characters)
 */
export function validatePassportNumber(passportNumber: string): IdValidationResult {
    const clean = passportNumber.replace(/\s+/g, '').trim();
    if (!/^[A-Z0-9]{6,12}$/i.test(clean)) {
        return {
            isValid: false,
            error: 'Passport number must be between 6 and 12 alphanumeric characters.',
        };
    }
    return { isValid: true };
}