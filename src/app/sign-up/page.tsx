import Link from "next/link";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { Logo } from "@/components/icons";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
         <Card className="shadow-2xl">
          <CardHeader className="text-center">
            <div className="flex justify-center items-center gap-2 mb-4">
              <Logo className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold text-primary">CargaCerta</h1>
            </div>
            <CardTitle className="text-2xl font-headline">Crie sua conta</CardTitle>
            <CardDescription>
              Comece a otimizar sua logística hoje mesmo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SignUpForm />
            <div className="mt-4 text-center text-sm">
              Já possui uma conta?{" "}
              <Link href="/sign-in" className="underline text-primary hover:text-primary/80 transition-colors">
                Faça login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
