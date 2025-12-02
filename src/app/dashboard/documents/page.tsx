
'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { UserNav } from '@/components/dashboard/user-nav';
import { BackButton } from '@/components/dashboard/back-button';
import { FileText, Layers } from 'lucide-react';
import { PlusCircle } from 'lucide-react';

export default function DocumentsPage() {
  const documentTypes = [
    {
      title: 'CT-e (Conhecimento de Transporte Eletrônico)',
      description: 'Gerencie e emita seus conhecimentos de transporte.',
      icon: <FileText className="h-8 w-8 text-primary" />,
    },
    {
      title: 'CE (Conhecimento Eletrônico)',
      description: 'Controle outros documentos de transporte estaduais.',
      icon: <FileText className="h-8 w-8 text-primary" />,
    },
    {
      title: 'NF-e (Nota Fiscal Eletrônica)',
      description: 'Acesse e gerencie as notas fiscais de produtos transportados.',
      icon: <FileText className="h-8 w-8 text-primary" />,
    },
    {
      title: 'NFS-e (Nota Fiscal de Serviço Eletrônica)',
      description: 'Gerencie as notas fiscais de serviços de transporte.',
      icon: <FileText className="h-8 w-8 text-primary" />,
    },
    {
      title: 'MDF-e (Manifesto Eletrônico)',
      description: 'Crie e gerencie os manifestos de carga para suas viagens.',
      icon: <Layers className="h-8 w-8 text-primary" />,
    },
  ];

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="md:hidden" />
          <BackButton />
          <div className="space-y-1">
            <h2 className="text-3xl font-bold tracking-tight font-headline">
              Documentos Fiscais
            </h2>
            <p className="text-muted-foreground">
              Centralize a gestão de CT-es, NF-es, MDF-es e mais.
            </p>
          </div>
        </div>
        <div className="hidden md:block">
          <UserNav />
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {documentTypes.map((doc) => (
          <Card
            key={doc.title}
            className="flex flex-col transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl"
          >
            <CardHeader className="flex-row items-center gap-4">
              <div className="bg-primary/10 p-4 rounded-full">{doc.icon}</div>
              <div>
                <CardTitle>{doc.title}</CardTitle>
                <CardDescription>{doc.description}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex-1 justify-end flex flex-col">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Gerenciar
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
