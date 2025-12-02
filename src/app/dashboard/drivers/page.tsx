
"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { MoreHorizontal, PlusCircle, FileUp, Trash2, Edit } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserNav } from "@/components/dashboard/user-nav";
import { useUser, useFirebase, addDocumentNonBlocking, updateDocumentNonBlocking, deleteDocumentNonBlocking, useMemoFirebase } from "@/firebase";
import { collection, doc } from "firebase/firestore";
import type { Driver } from "@/lib/definitions";
import { useToast } from "@/hooks/use-toast";
import { validateCpf } from "@/lib/validators";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboard } from "../layout";

export default function DriversPage() {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const { user } = useUser();
  const { firestore } = useFirebase();
  const { toast } = useToast();
  
  const { drivers, isLoading } = useDashboard();

  const driversCollectionRef = useMemoFirebase(() => {
      if (!user?.uid) return null;
      return collection(firestore, 'empresas', user.uid, 'motoristas');
  }, [firestore, user?.uid]);

  function handleEdit(driver: Driver) {
    setSelectedDriver(driver);
    setDialogOpen(true);
  }

  function handleAdd() {
    setSelectedDriver(null);
    setDialogOpen(true);
  }

  function handleDelete(driverId: string) {
    if (!user) return;
    const driverRef = doc(firestore, 'empresas', user.uid, 'motoristas', driverId);
    deleteDocumentNonBlocking(driverRef);
    toast({
        title: "Motorista excluído!",
        description: "O motorista foi removido do seu registro.",
    });
  }
  
  function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user) return;

    const formData = new FormData(e.currentTarget);
    const cpf = formData.get('cpf') as string;

    if (!validateCpf(cpf)) {
        toast({
            variant: "destructive",
            title: "CPF Inválido",
            description: "Por favor, insira um CPF válido.",
        });
        return;
    }
    
    const driverData = {
        nome: formData.get('name') as string,
        cpf: cpf,
        telefone: formData.get('telefone') as string,
        empresaId: user.uid,
    };

    if (selectedDriver) {
        // Update
        const driverRef = doc(firestore, 'empresas', user.uid, 'motoristas', selectedDriver.id);
        updateDocumentNonBlocking(driverRef, driverData);
        toast({
            title: "Motorista atualizado!",
            description: "Os dados do motorista foram atualizados com sucesso.",
        });
    } else {
        // Create
        if (driversCollectionRef) {
          addDocumentNonBlocking(driversCollectionRef, driverData);
          toast({
            title: "Motorista adicionado!",
            description: "O novo motorista foi cadastrado com sucesso.",
        });
        }
    }
    setDialogOpen(false);
    setSelectedDriver(null);
  }
  
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="md:hidden" />
          <div className="space-y-1">
            <h2 className="text-3xl font-bold tracking-tight font-headline">Motoristas</h2>
            <p className="text-muted-foreground">Gerencie os motoristas da sua empresa.</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="hidden md:block">
              <UserNav />
          </div>
          <Button onClick={handleAdd}>
            <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Motorista
          </Button>
        </div>
      </header>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">Avatar</span>
                </TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>CPF</TableHead>
                <TableHead className="hidden md:table-cell">Telefone</TableHead>
                <TableHead>
                  <span className="sr-only">Ações</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                  Array.from({length: 5}).map((_, i) => (
                    <TableRow key={i}>
                        <TableCell className="hidden sm:table-cell">
                            <Skeleton className="h-10 w-10 rounded-full" />
                        </TableCell>
                        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                    </TableRow>
                  ))
              )}
              {!isLoading && drivers?.map((driver) => (
                <TableRow key={driver.id}>
                  <TableCell className="hidden sm:table-cell">
                    <Avatar>
                      <AvatarImage src={driver.avatarUrl} alt={driver.nome} />
                      <AvatarFallback>{driver.nome.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">{driver.nome}</TableCell>
                  <TableCell>{driver.cpf}</TableCell>
                  <TableCell className="hidden md:table-cell">{driver.telefone}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Alternar menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEdit(driver)}>
                          <Edit className="mr-2 h-4 w-4" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileUp className="mr-2 h-4 w-4" /> Documentos
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDelete(driver.id)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                          <Trash2 className="mr-2 h-4 w-4" /> Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSave}>
            <DialogHeader>
              <DialogTitle>{selectedDriver ? "Editar Motorista" : "Adicionar Motorista"}</DialogTitle>
              <DialogDescription>
                {selectedDriver ? "Atualize os dados do motorista." : "Preencha os dados do novo motorista."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Nome</Label>
                <Input id="name" name="name" defaultValue={selectedDriver?.nome} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="cpf" className="text-right">CPF</Label>
                <Input id="cpf" name="cpf" defaultValue={selectedDriver?.cpf} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="telefone" className="text-right">Telefone</Label>
                <Input id="telefone" name="telefone" defaultValue={selectedDriver?.telefone} className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button type="submit">{selectedDriver ? "Salvar alterações" : "Criar motorista"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
