
"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { CreditCard, LogOut, User } from "lucide-react";
import { useUser, useFirebase } from "@/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboard } from "@/app/dashboard/layout";


export function UserNav() {
  const { user, isUserLoading } = useUser();
  const { auth } = useFirebase();
  const router = useRouter();

  const { company, isLoading: isCompanyLoading } = useDashboard();
  const isLoading = isUserLoading || isCompanyLoading;

  const userAvatar = PlaceHolderImages.find((p) => p.id === "avatar1");

  const handleSignOut = () => {
    signOut(auth);
    router.push('/');
  }

  if (isLoading) {
    return (
        <div className="flex items-center space-x-4 p-2">
             <Skeleton className="h-8 w-8 rounded-full" />
             <div className="space-y-1">
                <Skeleton className="h-4 w-[150px]" />
                <Skeleton className="h-3 w-[200px]" />
            </div>
        </div>
    )
  }

  const fallback = company?.razaoSocial?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U';


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-full justify-start gap-2 px-2">
          <Avatar className="h-8 w-8">
            {userAvatar && <AvatarImage src={userAvatar.imageUrl} alt={company?.razaoSocial || 'Avatar'} />}
            <AvatarFallback>{fallback}</AvatarFallback>
          </Avatar>
           <div className="text-left">
            <p className="text-sm font-medium leading-none">{company?.razaoSocial}</p>
            <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{company?.razaoSocial}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
             <Link href="/dashboard/billing">
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Plano e Cobrança</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
