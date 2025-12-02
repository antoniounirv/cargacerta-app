
"use client";

import { useState } from "react";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, PlusCircle, Edit, Trash2 } from "lucide-react";
import type { Load, LoadStatus } from "@/lib/definitions";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserNav } from "@/components/dashboard/user-nav";
import { useUser, useFirebase, addDocumentNonBlocking, updateDocumentNonBlocking, deleteDocumentNonBlocking, useMemoFirebase } from "@/firebase";
import { collection, doc } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useDashboard } from "../layout";
import { BackButton } from "@/components/dashboard/back-button";

export default function LoadsPage() {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedLoad, setSelectedLoad] = useState<Load | null>(null);
  const { user } = useUser();
  const { firestore } = useFirebase();
  const { toast } = useToast();

  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");

  const { loads, drivers, isLoading } = useDashboard();
  
  const loadsCollectionRef = useMemoFirebase(() => {
    if (!user?.uid) return null;
    return collection(firestore, 'empresas', user.uid, 'cargas');
  }, [firestore, user?.uid]);

  const statusStyles: Record<LoadStatus, string> = {
    'Pendente': 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-800',
    'Em Trânsito': 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-800',
    'Entregue': 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-800',
    'Cancelada': 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-800',
  };

  const handleEdit = (load: Load) => {
    setSelectedLoad(load);
    setOrigin(load.origem);
    setDestination(load.destino);
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedLoad(null);
    setOrigin("");
    setDestination("");
    setDialogOpen(true);
  };
  
  const handleDelete = (loadId: string) => {
    if (!user) return;
    const loadRef = doc(firestore, 'empresas', user.uid, 'cargas', loadId);
    deleteDocumentNonBlocking(loadRef);
    toast({
        title: "Carga excluída!",
        description: "A carga foi removida do seu registro.",
    });
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    const formData = new FormData(e.currentTarget);
    const loadData: Partial<Load> = {
        origem: formData.get('origin') as string,
        destino: formData.get('destination') as string,
        motoristaId: formData.get('driver') as string,
        status: formData.get('status') as LoadStatus,
        data_saida: formData.get('departure_date') as string,
        data_entrega_prevista: formData.get('arrival_date') as string,
        empresaId: user.uid,
    };
    
    if (selectedLoad) {
        // Update
        const loadRef = doc(firestore, 'empresas', user.uid, 'cargas', selectedLoad.id);
        updateDocumentNonBlocking(loadRef, loadData);
        toast({
            title: "Carga atualizada!",
            description: "Os detalhes da carga foram atualizados com sucesso.",
        });
    } else {
        // Create
        if (loadsCollectionRef) {
          addDocumentNonBlocking(loadsCollectionRef, loadData);
          toast({
            title: "Carga adicionada!",
            description: "A nova carga foi cadastrada com sucesso.",
        });
        }
    }

    setDialogOpen(false);
    setSelectedLoad(null);
  };

  const formatDate = (dateString: string | undefined | null): string => {
    if (!dateString) return "N/A";
    try {
        // Adding T00:00:00 ensures the date is parsed in the local time zone, not UTC
        return new Date(`${dateString}T00:00:00`).toLocaleDateString('pt-BR');
    } catch {
        return "Data inválida";
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="md:hidden" />
          <BackButton />
          <div className="space-y-1">
              <h2 className="text-3xl font-bold tracking-tight font-headline">Cargas</h2>
              <p className="text-muted-foreground">Monitore e gerencie as cargas da sua frota.</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="hidden md:block">
              <UserNav />
          </div>
          <Button onClick={handleAdd}>
            <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Carga
          </Button>
        </div>
      </header>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Origem</TableHead>
                <TableHead>Destino</TableHead>
                <TableHead>Motorista</TableHead>
                <TableHead className="hidden md:table-cell">Saída</TableHead>
                <TableHead className="hidden md:table-cell">Previsão</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <span className="sr-only">Ações</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                  Array.from({length: 5}).map((_, i) => (
                    <TableRow key={i}>
                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                        <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-20" /></TableCell>
                        <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                        <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                    </TableRow>
                  ))
              )}
              {!isLoading && loads?.map((load) => {
                const driver = drivers?.find(d => d.id === load.motoristaId);
                return (
                  <TableRow key={load.id}>
                    <TableCell>{load.origem}</TableCell>
                    <TableCell>{load.destino}</TableCell>
                    <TableCell>{driver ? driver.nome : "N/A"}</TableCell>
                    <TableCell className="hidden md:table-cell">{formatDate(load.data_saida)}</TableCell>
                    <TableCell className="hidden md:table-cell">{formatDate(load.data_entrega_prevista)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusStyles[load.status]}>{load.status}</Badge>
                    </TableCell>
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
                          <DropdownMenuItem onClick={() => handleEdit(load)}>
                             <Edit className="mr-2 h-4 w-4" /> Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(load.id)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                              <Trash2 className="mr-2 h-4 w-4" /> Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <form onSubmit={handleSave}>
            <DialogHeader>
              <DialogTitle>{selectedLoad ? "Editar Carga" : "Adicionar Carga"}</DialogTitle>
              <DialogDescription>
                  {selectedLoad ? "Atualize os detalhes da carga." : "Preencha os detalhes da nova carga."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                      <Label htmlFor="origin">Origem</Label>
                      <Input 
                        id="origin"
                        name="origin"
                        placeholder="Digite a cidade de origem"
                        defaultValue={selectedLoad?.origem}
                      />
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="destination">Destino</Label>
                       <Input
                          id="destination"
                          name="destination"
                          placeholder="Digite a cidade de destino"
                          defaultValue={selectedLoad?.destino}
                      />
                  </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                      <Label htmlFor="driver">Motorista</Label>
                      <Select name="driver" defaultValue={selectedLoad?.motoristaId || undefined}>
                          <SelectTrigger>
                              <SelectValue placeholder="Selecione um motorista" />
                          </SelectTrigger>
                          <SelectContent>
                              {drivers?.map(d => <SelectItem key={d.id} value={d.id}>{d.nome}</SelectItem>)}
                          </SelectContent>
                      </Select>
                  </div>
                   <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select name="status" defaultValue={selectedLoad?.status}>
                          <SelectTrigger>
                              <SelectValue placeholder="Selecione o status" />
                          </SelectTrigger>
                          <SelectContent>
                             {Object.keys(statusStyles).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                          </SelectContent>
                      </Select>
                  </div>
              </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                      <Label htmlFor="departure_date">Data de Saída</Label>
                      <Input id="departure_date" name="departure_date" type="date" defaultValue={selectedLoad?.data_saida} />
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="arrival_date">Previsão de Entrega</Label>
                      <Input id="arrival_date" name="arrival_date" type="date" defaultValue={selectedLoad?.data_entrega_prevista} />
                  </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button type="submit">{selectedLoad ? "Salvar alterações" : "Criar carga"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
