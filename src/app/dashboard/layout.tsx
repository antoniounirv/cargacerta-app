'use client';

import type { ReactNode } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { MainNav } from '@/components/dashboard/main-nav';
import { createContext, useContext, useEffect, useState } from 'react';
import { useUser, useDoc, useCollection, useMemoFirebase } from '@/firebase';
import { doc, collection } from 'firebase/firestore';
import { useFirebase } from '@/firebase/provider';
import type { Company, Driver, Load } from '@/lib/definitions';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

// 1. Create a context to hold dashboard data
interface DashboardContextType {
  company: Company | null;
  drivers: Driver[] | null;
  loads: Load[] | null;
  isLoading: boolean;
}

const DashboardContext = createContext<DashboardContextType | null>(null);

// 2. Create a custom hook to access the context
export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};


function DashboardProvider({ children }: { children: ReactNode }) {
    const { user, isUserLoading: isAuthLoading } = useUser();
    const { firestore } = useFirebase();
    const router = useRouter();
    const [isRedirecting, setIsRedirecting] = useState(true);

    useEffect(() => {
        // Apenas toma uma decisão de redirecionamento quando a autenticação não está mais carregando.
        if (!isAuthLoading) {
            if (!user) {
                // Se não há usuário, redireciona para o login.
                router.push('/sign-in');
            } else {
                // Se há um usuário, permite a renderização do dashboard.
                setIsRedirecting(false);
            }
        }
    }, [isAuthLoading, user, router]);

    const companyRef = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return doc(firestore, "empresas", user.uid);
    }, [firestore, user?.uid]);
    const { data: company, isLoading: isCompanyLoading } = useDoc<Company>(companyRef);

    const driversCollectionRef = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return collection(firestore, 'empresas', user.uid, 'motoristas');
    }, [firestore, user?.uid]);
    const { data: drivers, isLoading: areDriversLoading } = useCollection<Driver>(driversCollectionRef);

    const loadsCollectionRef = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return collection(firestore, 'empresas', user.uid, 'cargas');
    }, [firestore, user?.uid]);
    const { data: loads, isLoading: areLoadsLoading } = useCollection<Load>(loadsCollectionRef);

    const isLoading = isAuthLoading || isRedirecting || isCompanyLoading || areDriversLoading || areLoadsLoading;

    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    const value = {
        company,
        drivers,
        loads,
        isLoading
    };

    return (
        <DashboardContext.Provider value={value}>
            {children}
        </DashboardContext.Provider>
    )
}


export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
        <DashboardProvider>
            <MainNav />
            <SidebarInset>
                {children}
            </SidebarInset>
        </DashboardProvider>
    </SidebarProvider>
  );
}
