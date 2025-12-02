
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { useFirebase, setDocumentNonBlocking, initiateEmailSignUp } from "@/firebase";
import { doc } from "firebase/firestore";
import { validateCnpj } from "@/lib/validators";
import { FirebaseError } from "firebase/app";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatCnpj } from "@/lib/utils";


const formSchema = z.object({
  razaoSocial: z.string().min(3, { message: "A razão social deve ter no mínimo 3 caracteres." }),
  cnpj: z.string().refine(validateCnpj, { message: "CNPJ inválido." }),
  email: z.string().email({ message: "Por favor, insira um e-mail válido." }),
  password: z.string().min(6, { message: "A senha deve ter no mínimo 6 caracteres." }),
});

export function SignUpForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { auth, firestore } = useFirebase();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      razaoSocial: "",
      cnpj: "",
      email: "",
      password: "",
    },
  });

  const handleCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    form.setValue('cnpj', formatCnpj(value), { shouldValidate: true });
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    
    try {
        const userCredential = await initiateEmailSignUp(auth, values.email, values.password);

        if (userCredential?.user) {
          const user = userCredential.user;
          const empresaData = {
            id: user.uid,
            razaoSocial: values.razaoSocial,
            cnpj: values.cnpj,
            email: values.email,
            planoId: "plan_starter", 
            dataCadastro: new Date().toISOString(),
          };
          
          const empresaRef = doc(firestore, "empresas", user.uid);
          setDocumentNonBlocking(empresaRef, empresaData, { merge: true });

           toast({
            title: "Cadastro realizado com sucesso!",
            description: "Bem-vindo! Redirecionando para o seu painel.",
           });
           // O redirecionamento é tratado pelo listener de autenticação
        }
    } catch (error) {
        let title = "Erro no cadastro";
        let description = "Não foi possível realizar o cadastro. Tente novamente.";
        
        if (error instanceof FirebaseError) {
            if (error.code === 'auth/email-already-in-use') {
                title = "E-mail já cadastrado";
                description = "Este e-mail já está em uso. Por favor, faça login ou use um e-mail diferente.";
            }
        }
        
         toast({
          variant: "destructive",
          title: title,
          description: description,
        });
        setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <FormField
          control={form.control}
          name="razaoSocial"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Razão Social</FormLabel>
              <FormControl>
                <Input placeholder="Sua Empresa Ltda." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cnpj"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CNPJ</FormLabel>
              <FormControl>
                <Input placeholder="00.000.000/0000-00" {...field} onChange={handleCnpjChange} maxLength={18} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="contato@suaempresa.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Criar conta
        </Button>
      </form>
    </Form>
  );
}
