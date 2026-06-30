import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useUsers, useDeleteUser } from "../hooks/use-users";
import { useAuthStore } from "@/features/auth/store";
import { UserFormDialog } from "./UserFormDialog";
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from "@/shared/components/ui/table";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { 
    Dialog, 
    DialogContent, 
    DialogDescription, 
    DialogFooter, 
    DialogHeader, 
    DialogTitle 
} from "@/shared/components/ui/dialog";
import { 
    ArrowLeft, 
    Shield, 
    User as UserIcon, 
    Trash2, 
    Edit2, 
    Users, 
    Loader2, 
    Search,
    UserMinus
} from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";

export function UsersListView() {
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(0);
    const limit = 20;

    // Get current logged-in user to prevent self-deletion
    const currentUserEmail = useAuthStore((state) => state.email);

    // Fetch users with query search and pagination
    const { data: usersData, isLoading } = useUsers({
        query: searchQuery || undefined,
        offset: page * limit,
        limit,
    });

    const deleteMutation = useDeleteUser();
    const [userToDelete, setUserToDelete] = useState<{ id: number; name: string } | null>(null);

    const handleDeleteConfirm = () => {
        if (userToDelete) {
            deleteMutation.mutate(userToDelete.id, {
                onSuccess: () => {
                    setUserToDelete(null);
                }
            });
        }
    };

    const users = usersData?.items ?? [];
    const totalUsers = usersData?.total ?? 0;
    const hasNextPage = (page + 1) * limit < totalUsers;
    const hasPrevPage = page > 0;

    return (
        <div className="space-y-6 w-full max-w-5xl mx-auto pb-12 px-4 pt-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Users className="w-6 h-6 text-indigo-400" />
                        Gestión de Usuarios / Operadores
                    </h1>
                </div>
                <UserFormDialog />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4 bg-[#0a0a0f]/30 p-4 rounded-xl border border-white/[0.04]">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <Input
                        placeholder="Buscar por nombre o correo..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setPage(0);
                        }}
                        className="pl-9 bg-white/[0.02] border-white/[0.08] text-zinc-200 placeholder:text-zinc-500"
                    />
                </div>
            </div>

            {/* List Section */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center min-h-[300px] gap-3">
                    <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
                    <p className="text-sm text-zinc-400">Cargando usuarios...</p>
                </div>
            ) : users.length === 0 ? (
                <div className="rounded-xl border border-dashed border-white/[0.08] p-12 text-center text-zinc-500 flex flex-col items-center justify-center min-h-[300px] bg-white/[0.005]">
                    <UserMinus className="h-12 w-12 mb-3.5 opacity-20 text-indigo-400" />
                    <p className="text-sm font-medium">No se encontraron usuarios</p>
                    <p className="text-xs text-zinc-600 mt-1 max-w-sm">
                        {searchQuery 
                            ? "Prueba modificando los términos de búsqueda." 
                            : "Registra tu primer usuario administrador u operador para dar acceso al taller."
                        }
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {/* Desktop Table View */}
                    <div className="hidden md:block rounded-xl border border-white/[0.06] bg-[#0a0a0f]/40 backdrop-blur-sm overflow-hidden">
                        <Table>
                            <TableHeader className="bg-white/[0.01] border-b border-white/[0.06]">
                                <TableRow>
                                    <TableHead className="text-zinc-400 font-bold text-xs h-10">Nombre</TableHead>
                                    <TableHead className="text-zinc-400 font-bold text-xs h-10">Correo Electrónico</TableHead>
                                    <TableHead className="text-zinc-400 font-bold text-xs h-10">Rol</TableHead>
                                    <TableHead className="text-zinc-400 font-bold text-xs h-10 text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((user) => (
                                    <TableRow key={user.id} className="border-b border-white/[0.04] hover:bg-white/[0.01] transition-colors">
                                        <TableCell className="font-medium text-zinc-200 py-3">{user.name}</TableCell>
                                        <TableCell className="text-zinc-400 py-3">{user.email}</TableCell>
                                        <TableCell className="py-3">
                                            {user.role === "admin" ? (
                                                <Badge className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-bold gap-1 px-2 py-0.5">
                                                    <Shield className="w-3 h-3" />
                                                    Administrador
                                                </Badge>
                                            ) : (
                                                <Badge className="bg-zinc-500/10 text-zinc-400 border border-zinc-500/20 text-[10px] font-bold gap-1 px-2 py-0.5">
                                                    <UserIcon className="w-3 h-3" />
                                                    Operador
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right py-3 space-x-1.5">
                                            <UserFormDialog 
                                                user={user} 
                                                trigger={
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/[0.05] text-zinc-400 hover:text-white cursor-pointer">
                                                        <Edit2 className="w-4 h-4" />
                                                    </Button>
                                                }
                                            />
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                disabled={currentUserEmail === user.email}
                                                onClick={() => setUserToDelete({ id: user.id, name: user.name })}
                                                className="h-8 w-8 hover:bg-red-500/10 text-zinc-400 hover:text-red-400 disabled:opacity-30 disabled:hover:bg-transparent disabled:text-zinc-600 cursor-pointer"
                                                title={currentUserEmail === user.email ? "No puedes eliminarte a ti mismo" : "Eliminar usuario"}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Mobile Cards View */}
                    <div className="grid grid-cols-1 gap-4 md:hidden">
                        {users.map((user) => (
                            <Card key={user.id} className="bg-[#0a0a0f]/40 border-white/[0.06] backdrop-blur-sm overflow-hidden">
                                <CardContent className="p-4 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-bold text-zinc-200">{user.name}</h3>
                                        {user.role === "admin" ? (
                                            <Badge className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[9px] font-bold gap-1 px-1.5 py-0.5">
                                                <Shield className="w-2.5 h-2.5" />
                                                Admin
                                            </Badge>
                                        ) : (
                                            <Badge className="bg-zinc-500/10 text-zinc-400 border border-zinc-500/20 text-[9px] font-bold gap-1 px-1.5 py-0.5">
                                                <UserIcon className="w-2.5 h-2.5" />
                                                Operador
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-zinc-400 text-xs">{user.email}</p>
                                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/[0.04]">
                                        <UserFormDialog 
                                            user={user} 
                                            trigger={
                                                <Button size="sm" variant="outline" className="h-8 border-white/[0.08] text-zinc-300 hover:bg-white/[0.05] text-xs cursor-pointer">
                                                    <Edit2 className="w-3.5 h-3.5 mr-1" />
                                                    Editar
                                                </Button>
                                            }
                                        />
                                        <Button 
                                            size="sm" 
                                            variant="outline" 
                                            disabled={currentUserEmail === user.email}
                                            onClick={() => setUserToDelete({ id: user.id, name: user.name })}
                                            className="h-8 border-red-500/20 hover:bg-red-500/10 hover:text-red-400 text-zinc-400 disabled:opacity-30 disabled:hover:bg-transparent disabled:border-white/[0.04] disabled:text-zinc-600 text-xs cursor-pointer"
                                        >
                                            <Trash2 className="w-3.5 h-3.5 mr-1" />
                                            Eliminar
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalUsers > limit && (
                        <div className="flex justify-between items-center bg-[#0a0a0f]/20 p-4 rounded-xl border border-white/[0.04]">
                            <span className="text-xs text-zinc-500">
                                Mostrando {page * limit + 1} - {Math.min((page + 1) * limit, totalUsers)} de {totalUsers} usuarios
                            </span>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={!hasPrevPage}
                                    onClick={() => setPage(p => p - 1)}
                                    className="border-white/[0.08] hover:bg-white/[0.05] text-xs"
                                >
                                    Anterior
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={!hasNextPage}
                                    onClick={() => setPage(p => p + 1)}
                                    className="border-white/[0.08] hover:bg-white/[0.05] text-xs"
                                >
                                    Siguiente
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Confirm Delete Dialog */}
            <Dialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
                <DialogContent className="bg-[#0c0c14] border-white/[0.08] text-white max-w-sm w-full">
                    <DialogHeader>
                        <DialogTitle className="text-white font-bold flex items-center gap-2">
                            <Trash2 className="w-5 h-5 text-red-500" />
                            ¿Eliminar usuario?
                        </DialogTitle>
                        <DialogDescription className="text-zinc-400 text-xs leading-relaxed">
                            ¿Está seguro de que desea eliminar a <strong className="text-zinc-200">{userToDelete?.name}</strong>? Esta acción desactivará su cuenta y no se podrá deshacer.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 pt-2">
                        <Button
                            variant="outline"
                            onClick={() => setUserToDelete(null)}
                            className="border-white/[0.08] hover:bg-white/[0.05] text-zinc-300 h-9 text-xs"
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleDeleteConfirm}
                            disabled={deleteMutation.isPending}
                            className="bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-500/20 h-9 text-xs font-semibold cursor-pointer"
                        >
                            {deleteMutation.isPending ? "Eliminando..." : "Confirmar Eliminación"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
