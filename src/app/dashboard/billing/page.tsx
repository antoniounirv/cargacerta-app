
"use client";

import { useState, useEffect } from "react";
import { initMercadoPago, CardPayment } from '@mercadopago/sdk-react'
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
import { Check, Loader2 } from "lucide-react";
import { plans, company } from "@/lib/placeholder-data";
import { cn } from "@/lib/utils";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserNav } from "@/components/dashboard/user-nav";
import { BackButton } from "@/components/dashboard/back-button";
import { useToast } from "@/hooks/use-toast";

const MERCADO_PAGO_PUBLIC_KEY = "TEST-7c763bbf-5b50-41f8-87f6-09e9e3734c9d";

export default function BillingPage() {
    const [isYearly, setIsYearly] = useState(false);
    const { toast } = useToast();
    const currentPlanId = company.plan_id;
    const [isCheckout, setCheckout] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<any>(null);
    const [isBrickReady, setBrickReady] = useState(false);
    const [isSubmitting, setSubmitting] = useState(false);

    useEffect(() => {
        // A inicialização do Mercado Pago é feita apenas uma vez.
        if (!window.mercadoPagoInstance) {
            initMercadoPago(MERCADO_PAGO_PUBLIC_KEY, { locale: 'pt-BR' });
        }
    }, []);

    const planFeatures = {
        plan_starter: ['Até 5 motoristas', 'Até 50 cargas/mês', 'Suporte via e-mail'],
        plan_pro: ['Até 20 motoristas', 'Até 200 cargas/mês', 'Relatórios Avançados', 'Suporte prioritário'],
        plan_enterprise: ['Motoristas ilimitados', 'Cargas ilimitadas', 'Suporte Premium 24/7', 'Gerente de conta dedicado']
    }

    const handleChoosePlan = (plan: any) => {
        const price = isYearly ? plan.preco * 12 * 0.85 : plan.preco;
        setSelectedPlan({ ...plan, price });
        setCheckout(true);
    }

    const handleBack = () => {
        setCheckout(false);
        setSelectedPlan(null);
        setBrickReady(false); // Garante que o estado seja resetado
        setSubmitting(false); // Reseta o estado de submissão
    }
    
    // Simulação do envio do pagamento para o backend
    const onPaymentSubmit = async (formData: any) => {
        if (isSubmitting) return;
        setSubmitting(true);

        console.log("======================================");
        console.log("INÍCIO DA SIMULAÇÃO DE SUBMISSÃO");
        console.log("O formulário de pagamento foi enviado.");
        console.log("Estes são os dados que seriam enviados para o seu backend:", formData);
        console.log("No seu backend, você usaria o seu Access Token SECRETO para chamar a API do Mercado Pago e processar esta transação.");
        console.log("======================================");
        
        // Simula uma chamada de API para o backend (dura 2 segundos)
        await new Promise(resolve => setTimeout(resolve, 2000));

        toast({
            title: "Pagamento Recebido com Sucesso!",
            description: "Isso é uma simulação. Em um app real, seu backend confirmaria o pagamento com o Mercado Pago e atualizaria a assinatura.",
        });

        // Simula sucesso e volta para a tela de planos após 3 segundos
        setTimeout(() => {
            handleBack();
        }, 3000);
    };
    
    // Função para acionar o submit do Brick programaticamente
    const triggerPaymentSubmit = () => {
       const submitButton = document.getElementById('submit-payment-btn-hidden');
       if (submitButton) {
           submitButton.click();
       }
    }


    if (isCheckout && selectedPlan) {
        const initialization = {
            amount: selectedPlan.price,
            payer: {
                email: 'test_user_123456@testuser.com', // Em um app real, use o email do usuário logado
            },
        };

        const customization = {
            visual: {
                style: {
                    theme: document.body.classList.contains('dark') ? 'dark' : 'default',
                }
            }
        };

        return (
             <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                 <Card>
                    <CardHeader>
                        <BackButton />
                        <CardTitle className="font-headline text-2xl pt-4">Finalizar Pagamento</CardTitle>
                        <CardDescription>Você está assinando o plano <strong>{selectedPlan.nome}</strong> por <strong>R${selectedPlan.price.toFixed(2)}</strong>/{isYearly ? 'ano' : 'mês'}.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* Container para o Brick do Mercado Pago */}
                        <div id="cardPaymentBrick_container" className={cn(!isBrickReady && "flex justify-center items-center min-h-[200px]")}>
                            {!isBrickReady && <Loader2 className="h-8 w-8 animate-spin text-primary" />}
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                         <Button variant="outline" onClick={handleBack} disabled={isSubmitting}>Voltar</Button>
                         <Button 
                            id="submit-payment-btn-visible" 
                            onClick={triggerPaymentSubmit}
                            disabled={!isBrickReady || isSubmitting}
                         >
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isSubmitting ? "Processando..." : "Pagar Agora"}
                         </Button>
                    </CardFooter>
                 </Card>

                 {/* O CardPayment é montado de forma oculta e se anexa ao container. 
                     O botão de submit dele também é oculto para usarmos nosso próprio botão estilizado. */}
                 <div className="opacity-0 absolute -z-50">
                    <CardPayment
                        initialization={initialization}
                        customization={customization}
                        onSubmit={onPaymentSubmit}
                        onReady={() => {
                            console.log("Card Payment Brick está pronto!");
                            setBrickReady(true);
                        }}
                        onError={(error) => {
                            console.error("Erro no Card Payment Brick:", error);
                            toast({ variant: "destructive", title: "Erro no pagamento", description: "Não foi possível carregar o formulário de pagamento. Tente novamente."});
                            setSubmitting(false); // Libera o botão em caso de erro
                        }}
                    />
                    {/* Botão de submit real do Brick que será acionado programaticamente */}
                    <button id="submit-payment-btn-hidden" type="submit"></button>
                 </div>
             </div>
        )
    }

  return (
     <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <header className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <SidebarTrigger className="md:hidden" />
                <BackButton />
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
                            <Button 
                                className="w-full" 
                                disabled={isCurrentPlan}
                                onClick={() => !isCurrentPlan && handleChoosePlan(plan)}
                            >
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
