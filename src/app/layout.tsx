import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { FirebaseClientProvider } from '@/firebase';
import { Inter, Poppins } from 'next/font/google';
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: 'CargaCerta',
  description: 'Sistema de gestão de logística multiempresa.',
};

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const poppins = Poppins({ 
  subsets: ['latin'], 
  weight: ['600', '700'], 
  variable: '--font-poppins' 
});

declare global {
    interface Window {
        mercadoPagoInstance: any;
    }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${poppins.variable} font-body antialiased`}>
        <FirebaseClientProvider>
          {children}
        </FirebaseClientProvider>

        <Toaster />

        {/* Speed Insights */}
        <SpeedInsights />
      </body>
    </html>
  );
}
