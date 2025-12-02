'use client';

import type { ReactNode } from 'react';

// Este layout agora é um componente simples que apenas renderiza seus filhos.
// A lógica de carregamento e autenticação foi centralizada no DashboardProvider
// para evitar loops e conflitos.
export default function HomeLayout({ children }: { children: ReactNode }) {
    return <>{children}</>;
}
