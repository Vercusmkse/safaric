import type { Metadata } from 'next';
import { Cormorant_Garamond, Plus_Jakarta_Sans } from 'next/font/google';
import { CurrencyProvider } from '@/context/CurrencyContext';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  weight: ['400', '600', '700'],
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'SAFARIC | Authentic Kruger National Park Safaris & Experiences',
  description: 'Book authentic guided Kruger National Park safaris, wildlife photography charters, and private airport lodge transfers. Nature Connects Us.',
};

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode;
}) {
  return (
      <html lang="en" className={`${cormorant.variable} ${jakarta.variable} scroll-smooth`}>
      <body className="font-sans bg-[#FDFBF7] text-[#30261E] antialiased">
      <CurrencyProvider>
        {children}
      </CurrencyProvider>
      </body>
      </html>
  );
}