
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { useFirebase, setDocumentNonBlocking, initiateEmailSignUp } from "@/firebase";
import { doc } from "firebase/firestore";
import { validateCnpj } from "@/lib/validators";

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
    
    // Non-blocking sign-up and data persistence
    initiateEmailSignUp(auth, values.email, values.password)
      .then(userCredential => {
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
        }
      })
      .catch(error => {
        // This catch is for immediate errors, e.g. network issues.
        // Auth errors like 'email-already-in-use' are handled by the auth state listener.
        console.error("Sign-up initiation error:", error);
         toast({
          variant: "destructive",
          title: "Erro no cadastro",
          description: "Não foi possível iniciar o processo de cadastro. Verifique sua conexão.",
        });
        setIsLoading(false);
      });

    // Optimistic UI update
    toast({
      title: "Cadastro realizado com sucesso!",
      description: "Bem-vindo! Redirecionando para o seu painel.",
    });

    // O redirecionamento será tratado pelo FirebaseProvider
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
