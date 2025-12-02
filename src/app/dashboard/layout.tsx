'use client';

import type { ReactNode } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { MainNav } from '@/components/dashboard/main-nav';
import { createContext, useContext } from 'react';
import { useUser, useDoc, useCollection, useMemoFirebase } from '@/firebase';
import { doc, collection } from 'firebase/firestore';
import { useFirebase } from '@/firebase/provider';
import type { Company, Driver, Load } from '@/lib/definitions';

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

    const companyRef = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return doc(firestore, "empresas", user.uid);
    }, [firestore, user]);
    const { data: company, isLoading: isCompanyLoading } = useDoc<Company>(companyRef);

    const driversCollectionRef = useMemoFirebase(() => {
        if (!user) return null;
        return collection(firestore, 'empresas', user.uid, 'motoristas');
    }, [firestore, user]);
    const { data: drivers, isLoading: areDriversLoading } = useCollection<Driver>(driversCollectionRef);

    const loadsCollectionRef = useMemoFirebase(() => {
        if (!user) return null;
        return collection(firestore, 'empresas', user.uid, 'cargas');
    }, [firestore, user]);
    const { data: loads, isLoading: areLoadsLoading } = useCollection<Load>(loadsCollectionRef);

    const isLoading = isAuthLoading || isCompanyLoading || areDriversLoading || areLoadsLoading;

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
