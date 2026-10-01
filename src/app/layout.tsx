import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Plus_Jakarta_Sans } from 'next/font/google';
import { CurrencyProvider } from '@/context/CurrencyContext';
import './globals.css';

const cormorant = Cormorant_Garamond({
    subsets: ['latin'],
    variable: '--font-cormorant',
    weight: ['400', '600', '700'],
    display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
    subsets: ['latin'],
    variable: '--font-jakarta',
    weight: ['300', '400', '500', '600', '700'],
    display: 'swap',
});

export const viewport: Viewport = {
    themeColor: '#1C3322',
    width: 'device-width',
    initialScale: 1,
};

export const metadata: Metadata = {
    metadataBase: new URL('https://www.safaric.co.za'),
    title: {
        default: 'SAFARIC | Authentic Kruger National Park Safaris & Experiences',
        template: '%s | SAFARIC Kruger Safaris',
    },
    description:
        'Official guided Kruger National Park safaris. Shared open 4x4 drives from R600 pp, private charters, Panorama Route, and Mozambique tours led by Tourism Act registered nature guides. Free fleece blankets, rain ponchos, and chilled spring water included.',
    keywords: [
        'Kruger National Park Safaris',
        'Morning Safari Kruger',
        'Afternoon Safari Kruger',
        'Private 4x4 Safari Kruger',
        'Marloth Park Safari Pickups',
        'Ngwenya Lodge Kruger Safari',
        'Crocodile Bridge Game Drive',
        'Lower Sabie Game Drive',
        'Panorama Route Tour Blyde River',
        'Mozambique Tours from South Africa',
        'Tourism Act Nature Guides South Africa',
    ],
    icons: {
        icon: '/logoo.jpg',
        shortcut: '/logoo.jpg',
        apple: '/logoo.jpg',
    },
    openGraph: {
        type: 'website',
        locale: 'en_ZA',
        url: 'https://www.safaric.co.za',
        siteName: 'SAFARIC',
        title: 'SAFARIC | Authentic Kruger National Park Safaris & Experiences',
        description:
            'Book authentic guided Kruger open 4x4 safaris directly. Shared drives from R600 pp, private charters, and scenic tours. Free blankets, ponchos, and water.',
        images: [
            {
                url: '/The-Big-Five-header.jpg',
                width: 1200,
                height: 630,
                alt: 'Kruger National Park Wildlife Safari - SAFARIC',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'SAFARIC | Authentic Kruger National Park Safaris',
        description:
            'Book authentic open 4x4 Kruger safaris directly. Shared drives from R600 pp, private charters, and escarpment tours.',
        images: ['/The-Big-Five-header.jpg'],
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${cormorant.variable} ${jakarta.variable} scroll-smooth`}>
        <body className="font-sans bg-[#FDFBF7] text-[#30261E] antialiased selection:bg-[#C2933D] selection:text-[#122216]">
        <CurrencyProvider>
            {children}
        </CurrencyProvider>
        </body>
        </html>
    );
}