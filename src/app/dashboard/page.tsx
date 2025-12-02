"use client";

import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Truck, Users, CheckCircle, Hourglass } from "lucide-react";
import { UserNav } from "@/components/dashboard/user-nav";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Pie, PieChart, Cell } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import { subMonths, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useDashboard } from "./layout";

export default function DashboardPage() {
  const { company, drivers, loads, isLoading } = useDashboard();

  const totalDrivers = drivers?.length ?? 0;
  const activeLoads = loads?.filter(l => l.status === 'Em Trânsito').length ?? 0;
  const pendingLoads = loads?.filter(l => l.status === 'Pendente').length ?? 0;
  const deliveredLoads = loads?.filter(l => l.status === 'Entregue').length ?? 0;
  
  const monthlyDeliveredData = useMemo(() => {
    const data = Array.from({ length: 6 }).map((_, i) => {
        const month = subMonths(new Date(), i);
        return { name: format(month, 'MMM', { locale: ptBR }), total: 0 };
    }).reverse();

    loads?.forEach(load => {
        if (load.status === 'Entregue' && load.data_entrega_prevista) {
            try {
                // Adding T00:00:00 ensures the date is parsed in the local time zone, not UTC
                const deliveryMonth = format(new Date(`${load.data_entrega_prevista}T00:00:00`), 'MMM', { locale: ptBR });
                const monthData = data.find(d => d.name === deliveryMonth);
                if (monthData) {
                    monthData.total++;
                }
            } catch (e) {
                // Ignore invalid date formats
            }
        }
    });

    return data;
  }, [loads]);

  const loadStatusData = useMemo(() => {
    const statusCounts: Record<string, number> = {
        'Pendente': 0,
        'Em Trânsito': 0,
        'Entregue': 0,
        'Cancelada': 0,
    };
    
    loads?.forEach(load => {
        if (load.status in statusCounts) {
            statusCounts[load.status]++;
        }
    });

    return Object.entries(statusCounts).map(([name, value]) => ({ name, value, fill: `var(--color-${name.replace(' ', '-')})`  }));
  }, [loads]);

  const chartConfig = {
    loads: {
        label: "Cargas",
    },
    Pendente: {
      label: "Pendente",
      color: "hsl(var(--chart-3))",
    },
    "Em-Trânsito": {
      label: "Em Trânsito",
      color: "hsl(var(--chart-1))",
    },
    Entregue: {
      label: "Entregue",
      color: "hsl(var(--chart-2))",
    },
     Cancelada: {
      label: "Cancelada",
      color: "hsl(var(--chart-5))",
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
       <header className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="md:hidden" />
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
               <div className="text-muted-foreground">
                  Bem-vindo(a) de volta, {isLoading ? <Skeleton className="w-24 h-5 inline-block" /> : (company?.razaoSocial || 'Empresa')}!
                </div>
            </div>
          </div>
          <div className="hidden md:block">
            <UserNav />
          </div>
        </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Motoristas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-1/4" /> : <div className="text-2xl font-bold">{totalDrivers}</div>}
            <p className="text-xs text-muted-foreground">Motoristas cadastrados</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cargas em Trânsito</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             {isLoading ? <Skeleton className="h-8 w-1/4" /> : <div className="text-2xl font-bold">{activeLoads}</div>}
             <p className="text-xs text-muted-foreground">Cargas ativas no momento</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cargas Entregues</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-1/4" /> : <div className="text-2xl font-bold">+{deliveredLoads}</div>}
            <p className="text-xs text-muted-foreground">Neste mês</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cargas Pendentes</CardTitle>
            <Hourglass className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-1/4" /> : <div className="text-2xl font-bold">{pendingLoads}</div>}
             <p className="text-xs text-muted-foreground">Aguardando motorista</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Cargas Entregues (Últimos 6 Meses)</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
             {isLoading ? <Skeleton className="h-[250px] w-full" /> : (
                <ChartContainer config={chartConfig} className="h-[250px] w-full">
                  <BarChart data={monthlyDeliveredData} accessibilityLayer>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="name"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      tickFormatter={(value) => value.slice(0, 3)}
                    />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="total" fill="var(--color-Entregue)" radius={4} />
                  </BarChart>
                </ChartContainer>
            )}
          </CardContent>
        </Card>
         <Card className="col-span-4 lg:col-span-3">
          <CardHeader>
            <CardTitle>Status das Cargas</CardTitle>
            <CardDescription>
              Distribuição de todas as cargas por status.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
             {isLoading ? <Skeleton className="h-[200px] w-[200px] rounded-full" /> : (
                <ChartContainer config={chartConfig} className="h-[200px]">
                    <PieChart>
                    <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                    <Pie data={loadStatusData} dataKey="value" nameKey="name" innerRadius={50}>
                        {loadStatusData.map((entry) => (
                        <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                        ))}
                    </Pie>
                    <ChartLegend content={<ChartLegendContent nameKey="name" />} />
                    </PieChart>
                </ChartContainer>
             )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
