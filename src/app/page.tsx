import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Shield, DollarSign, Package, Users, BarChart3, FileText, FileSignature, Layers, PackagePlus, Library, Send, Share2, Calculator } from "lucide-react";
import { Logo } from "@/components/icons";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import HomeLayout from "./home-layout";

const heroImage = PlaceHolderImages.find(p => p.id === 'hero-image');

export default function Home() {
  const features = [
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Gestão de Motoristas",
      description: "Cadastre, edite e gerencie todos os seus motoristas em um só lugar.",
    },
    {
      icon: <Package className="h-8 w-8 text-primary" />,
      title: "Rastreamento de Cargas",
      description: "Monitore o status de suas cargas em tempo real, da origem ao destino.",
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Multiempresa com Segurança",
      description: "Dados totalmente isolados por empresa, garantindo privacidade e segurança.",
    },
    {
      icon: <DollarSign className="h-8 w-8 text-primary" />,
      title: "Planos Flexíveis",
      description: "Escolha o plano que melhor se adapta ao tamanho e às necessidades da sua operação.",
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-primary" />,
      title: "Relatórios Avançados",
      description: "Obtenha insights valiosos sobre sua operação com relatórios detalhados.",
    },
    {
      icon: <Truck className="h-8 w-8 text-primary" />,
      title: "Documentação Digital",
      description: "Faça upload e gerencie documentos de motoristas e cargas de forma segura.",
    },
  ];

  const fiscalFeatures = [
      {
        icon: <FileText className="h-8 w-8 text-primary" />,
        title: "CT-e (Conhecimento de Transporte Eletrônico)",
        description: "Gestão completa dos dados para emissão e controle de CT-es, incluindo remetentes, destinatários e informações de transporte."
      },
      {
        icon: <FileText className="h-8 w-8 text-primary" />,
        title: "CE (Conhecimento Eletrônico / Outros)",
        description: "Gerenciamento de documentos eletrônicos estaduais, integrando dados fiscais e operacionais conforme a legislação."
      },
      {
        icon: <FileText className="h-8 w-8 text-primary" />,
        title: "NF-e (Nota Fiscal Eletrônica)",
        description: "Módulo para configuração de notas fiscais, parametrização fiscal, séries, CFOPs e informações exigidas pela SEFAZ."
      },
      {
        icon: <FileText className="h-8 w-8 text-primary" />,
        title: "NFS-e (Nota Fiscal de Serviço Eletrônica)",
        description: "Gerenciamento das regras de emissão de notas de serviços, incluindo alíquotas, códigos e integração com prefeituras."
      },
      {
        icon: <Layers className="h-8 w-8 text-primary" />,
        title: "MDF-e (Manifesto Eletrônico)",
        description: "Organização de viagens, vinculando documentos fiscais, motoristas e veículos para emissão de MDF-e."
      },
      {
        icon: <FileSignature className="h-8 w-8 text-primary" />,
        title: "Contrato de Frete",
        description: "Cadastro e gestão dos contratos com embarcadores e transportadores, definindo valores, tabelas e regras comerciais."
      },
      {
        icon: <PackagePlus className="h-8 w-8 text-primary" />,
        title: "Ordem de Carregamento",
        description: "Registro das solicitações de carregamento, vinculando produtos, destinos, veículos e motoristas para o transporte."
      },
       {
        icon: <Library className="h-8 w-8 text-primary" />,
        title: "Lote de Carregamento",
        description: "Organização de múltiplas ordens de carregamento em um lote, facilitando controle operacional e faturamento."
      },
      {
        icon: <Send className="h-8 w-8 text-primary" />,
        title: "Emissão de Documentos",
        description: "Central para gerar CT-e, NF-e, NFS-e e MDF-e, com validação, transmissão à SEFAZ e acompanhamento de status."
      },
      {
        icon: <Share2 className="h-8 w-8 text-primary" />,
        title: "Exportação / Integração",
        description: "Ferramentas para exportar dados e integrar o sistema com ERPs, contabilidade, BI, prefeituras e serviços externos."
      },
      {
        icon: <Calculator className="h-8 w-8 text-primary" />,
        title: "Contabilidade",
        description: "Módulo para envio e estruturação de informações fiscais e contábeis, como XMLs, relatórios e registros obrigatórios."
      }
  ]

  return (
    <HomeLayout>
      <div className="flex flex-col min-h-screen bg-background">
        <header className="px-4 lg:px-6 h-16 flex items-center bg-background/80 backdrop-blur-sm sticky top-0 z-50 border-b">
          <Link href="/" className="flex items-center justify-center gap-2" prefetch={false}>
            <Logo className="h-7 w-7 text-primary" />
            <span className="text-2xl font-bold text-primary font-headline">CargaCerta</span>
          </Link>
          <nav className="ml-auto flex gap-2 sm:gap-4">
            <Button variant="ghost" asChild>
              <Link href="/sign-in" prefetch={false}>
                Login
              </Link>
            </Button>
            <Button asChild>
              <Link href="/sign-up" prefetch={false}>
                Cadastre-se
              </Link>
            </Button>
          </nav>
        </header>
        <main className="flex-1">
          <section className="relative w-full py-20 md:py-32 lg:py-40">
            {heroImage && <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              data-ai-hint={heroImage.imageHint}
              fill
              className="object-cover z-0 opacity-20"
            />}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
            <div className="container px-4 md:px-6 text-center relative z-10">
              <div className="max-w-3xl mx-auto space-y-4">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-foreground">
                  Otimize sua Logística com CargaCerta
                </h1>
                <p className="text-lg text-muted-foreground md:text-xl">
                  A solução completa para gestão de frotas, motoristas e cargas. Multiempresa, seguro e na nuvem.
                </p>
                <div>
                  <Button size="lg" asChild>
                    <Link href="/sign-up" prefetch={false}>
                      Comece Agora Gratuitamente
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>
          <section id="features" className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm text-secondary-foreground">Recursos Principais</div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Tudo que sua transportadora precisa</h2>
                  <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Nossa plataforma oferece as ferramentas essenciais para levar sua gestão logística para o próximo nível.
                  </p>
                </div>
              </div>
              <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:max-w-none lg:grid-cols-3 mt-12">
                {features.map((feature, index) => (
                  <Card key={index} className="transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl border-transparent hover:border-border">
                    <CardHeader className="flex flex-col items-center text-center gap-4 p-6">
                      <div className="bg-primary/10 p-4 rounded-full">
                          {feature.icon}
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 pt-0 text-center">
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
           <section id="fiscal-features" className="w-full py-12 md:py-24 lg:py-32 bg-secondary/50">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm text-secondary-foreground">Módulos Fiscais e Operacionais</div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Gestão Fiscal e Operacional Simplificada</h2>
                  <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Automatize a emissão de documentos fiscais e otimize seus processos operacionais com nossos módulos integrados.
                  </p>
                </div>
              </div>
              <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:max-w-none lg:grid-cols-3 mt-12">
                {fiscalFeatures.map((feature, index) => (
                  <Card key={index} className="transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl bg-card">
                    <CardHeader className="flex flex-col items-start text-left gap-4 p-6">
                       <div className="bg-primary/10 p-3 rounded-full">
                          {feature.icon}
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 pt-0 text-left">
                      <p className="text-muted-foreground text-sm">{feature.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        </main>
        <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
          <p className="text-xs text-muted-foreground">&copy; 2024 CargaCerta. Todos os direitos reservados.</p>
          <nav className="sm:ml-auto flex gap-4 sm:gap-6">
            <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
              Termos de Serviço
            </Link>
            <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
              Política de Privacidade
            </Link>
          </nav>
        </footer>
      </div>
    </HomeLayout>
  );
}
