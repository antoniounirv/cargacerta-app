import Link from "next/link";
import { SignInForm } from "@/components/auth/sign-in-form";
import { Logo } from "@/components/icons";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl">
          <CardHeader className="text-center">
            <div className="flex justify-center items-center gap-2 mb-4">
              <Logo className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold text-primary">CargaCerta</h1>
            </div>
            <CardTitle className="text-2xl font-headline">Bem-vindo de volta!</CardTitle>
            <CardDescription>
              Faça login com seu e-mail e senha para gerenciar sua logística.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SignInForm />
            <div className="mt-4 text-center text-sm">
              Não tem uma conta?{" "}
              <Link href="/sign-up" className="underline text-primary hover:text-primary/80 transition-colors">
                Cadastre-se
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
