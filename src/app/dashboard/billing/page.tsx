"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";
import { plans, company } from "@/lib/placeholder-data";
import { cn } from "@/lib/utils";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserNav } from "@/components/dashboard/user-nav";


export default function BillingPage() {
    const [isYearly, setIsYearly] = useState(false);
    const currentPlanId = company.plan_id;

    const planFeatures = {
        plan_starter: ['Até 5 motoristas', 'Até 50 cargas/mês', 'Suporte via e-mail'],
        plan_pro: ['Até 20 motoristas', 'Até 200 cargas/mês', 'Relatórios Avançados', 'Suporte prioritário'],
        plan_enterprise: ['Motoristas ilimitados', 'Cargas ilimitadas', 'Suporte Premium 24/7', 'Gerente de conta dedicado']
    }

  return (
     <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <header className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="md:hidden" />
                 <div className="space-y-1">
                    <h2 className="text-3xl font-bold tracking-tight font-headline">Planos e Cobrança</h2>
                    <p className="text-muted-foreground">Gerencie sua assinatura e veja os detalhes do seu plano.</p>
                </div>
            </div>
            <div className="hidden md:block">
                <UserNav />
            </div>
        </header>

        <div className="flex items-center justify-center space-x-2 my-8">
            <Label htmlFor="billing-cycle">Mensal</Label>
            <Switch id="billing-cycle" checked={isYearly} onCheckedChange={setIsYearly} />
            <Label htmlFor="billing-cycle">Anual</Label>
            <span className="ml-2 text-sm font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">Economize 15%</span>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 items-start">
            {plans.map(plan => {
                const isCurrentPlan = plan.id === currentPlanId;
                const price = isYearly ? plan.preco * 12 * 0.85 : plan.preco;

                return (
                    <Card key={plan.id} className={cn("flex flex-col transition-all", isCurrentPlan && "border-primary border-2 shadow-lg")}>
                        <CardHeader>
                            <CardTitle className="font-headline text-2xl">{plan.nome}</CardTitle>
                            <CardDescription>{plan.descricao}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <div className="mb-6">
                                <span className="text-4xl font-bold">R${price.toFixed(0)}</span>
                                <span className="text-muted-foreground">/{isYearly ? 'ano' : 'mês'}</span>
                            </div>
                            <ul className="space-y-3">
                                {planFeatures[plan.id as keyof typeof planFeatures].map(feature => (
                                    <li key={feature} className="flex items-center gap-2">
                                        <Check className="h-5 w-5 text-green-500" />
                                        <span className="text-muted-foreground">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" disabled={isCurrentPlan}>
                                {isCurrentPlan ? "Plano Atual" : "Escolher Plano"}
                            </Button>
                        </CardFooter>
                    </Card>
                )
            })}
        </div>
     </div>
  );
}
