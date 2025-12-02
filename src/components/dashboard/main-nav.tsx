
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/icons";
import {
  LayoutDashboard,
  Truck,
  Users,
  CreditCard,
  LogOut,
  FileText,
} from "lucide-react";
import { UserNav } from "./user-nav";
import { useFirebase } from "@/firebase";
import { signOut } from "firebase/auth";

const menuItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/dashboard/drivers",
    label: "Motoristas",
    icon: Users,
  },
  {
    href: "/dashboard/loads",
    label: "Cargas",
    icon: Truck,
  },
  {
    href: "/dashboard/documents",
    label: "Documentos",
    icon: FileText,
  },
  {
    href: "/dashboard/billing",
    label: "Planos e Cobrança",
    icon: CreditCard,
  },
];

export function MainNav() {
  const pathname = usePathname();
  const { auth } = useFirebase();
  const router = useRouter();

  const handleSignOut = () => {
    signOut(auth);
    router.push('/');
  }

  return (
    <Sidebar collapsible="icon" className="border-sidebar-border">
      <SidebarHeader className="h-16 flex items-center justify-center p-2">
        <Link href="/dashboard" className="flex items-center gap-2">
            <Logo className="w-7 h-7 text-sidebar-primary" />
            <span className="text-xl font-bold text-sidebar-primary group-data-[collapsible=icon]:hidden">
            CargaCerta
            </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={item.label}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2 flex-col gap-2">
        <div className="group-data-[collapsible=icon]:hidden">
          <UserNav />
        </div>
        <SidebarMenuButton tooltip="Sair" onClick={handleSignOut}>
          <LogOut />
          <span>Sair</span>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}
