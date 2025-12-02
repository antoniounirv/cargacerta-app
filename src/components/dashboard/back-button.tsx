"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export function BackButton() {
  return (
    <Button variant="outline" size="icon" className="h-8 w-8" asChild>
      <Link href="/dashboard">
        <ArrowLeft className="h-4 w-4" />
        <span className="sr-only">Voltar para o Dashboard</span>
      </Link>
    </Button>
  );
}
