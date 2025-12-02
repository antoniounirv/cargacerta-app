'use client';

import type { ReactNode } from 'react';
import { useUser } from '@/firebase';
import { Loader2 } from 'lucide-react';

export default function HomeLayout({ children }: { children: ReactNode }) {
    const { user, isUserLoading } = useUser();
    
    // O redirecionamento será tratado pelo DashboardLayout,
    // então se o usuário estiver logado, podemos mostrar um loader aqui
    // enquanto o DashboardProvider assume.
    if (isUserLoading || user) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    // Se não estiver carregando e não houver usuário, exibe a página principal
    return <>{children}</>;
}
