import {Button} from "@/components/ui/button";
import Link from "next/link";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import DeleteDialog from "@/components/shared/delete-dialog";
import Pagination from "@/components/shared/pagination";
import {deleteUser, getAllUsers} from "@/lib/actions/user.actions";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, ShoppingCart } from "lucide-react";
import {deleteProduct} from "@/lib/actions/product.actions";

export default async function AdminUsersPage() {
    const users = await getAllUsers();
    const userData = users?.data || [];

    // Временные функции для логирования действий
    const handleEdit = (userId: string) => {
        console.log('Edit user:', userId);
    };

    const handleDelete = (userId: string) => {
        console.log('Delete user:', userId);
    };

    const handleViewCart = (userId: string) => {
        console.log('View cart for user:', userId);
    };

    return (
        <div className='space-y-2'>
            <div className='flex-between'>
                <h1 className='h2-bold'>Users</h1>
                <Button asChild variant='default'>
                    <Link href="/admin/users/admin-create">
                        Create Admin Account
                    </Link>
                </Button>
            </div>

            {!users?.success ? (
                <div className="text-center py-10">
                    <p className="text-red-500">{users?.message || 'Failed to load users'}</p>
                </div>
            ) : userData.length === 0 ? (
                <div className="text-center py-10">
                    <p className="text-muted-foreground">No users found</p>
                </div>
            ) : (
                <>
                    <Table className='mt-4'>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>NAME</TableHead>
                                <TableHead>EMAIL</TableHead>
                                <TableHead>ROLE</TableHead>
                                <TableHead>VERIFIED</TableHead>
                                <TableHead>ADDED</TableHead>
                                <TableHead className='text-center'>ACTIONS</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {userData.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-mono text-xs">
                                        {user.id.substring(0, 8)}...
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {user.name || 'No name'}
                                    </TableCell>
                                    <TableCell>
                                        {user.email}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={user.role === 'admin' ? 'destructive' : 'secondary'}
                                        >
                                            {user.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={user.emailVerified ? 'default' : 'outline'}
                                        >
                                            {user.emailVerified ? 'Verified' : 'Not verified'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {formatDate(user.createdAt)}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 justify-center">
                                            <Button
                                                variant="ghost"
                                                size="icon"

                                                title="View cart"
                                            >
                                                <ShoppingCart className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"

                                                title="Edit user"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>

                                            <DeleteDialog id={user.id} action={deleteUser} />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {/* Информация о пагинации */}
                    {users?.total && (
                        <div className="mt-4 text-sm text-muted-foreground text-center">
                            Showing {userData.length} of {users.total} users
                            {users.totalPages && users.totalPages > 1 && (
                                <span> • Page {users.page} of {users.totalPages}</span>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}