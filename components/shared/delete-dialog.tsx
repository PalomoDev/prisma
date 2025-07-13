'use client';
import { useState } from 'react';
import { useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '../ui/button';
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '../ui/alert-dialog';
import {Trash2} from "lucide-react";

const DeleteDialog = ({
                          id,
                          action,
                      }: {
    id: string;
    action: (id: string) => Promise<{ success: boolean; message: string }>;
}) => {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    const handleDeleteClick = () => {
        startTransition(async () => {
            const res = await action(id);

            if (!res.success) {
                toast.error('Ошибка!', {
                    description: res.message,
                });
            } else {
                setOpen(false);
                toast.success('Успешно!', {
                    description: res.message,
                });
            }
        });
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button size='sm' variant='ghost' className='ml-2'>
                    <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button
                        variant="destructive"
                        disabled={isPending}
                        onClick={handleDeleteClick}
                        className="text-white"
                    >
                        {isPending ? 'Удаление...' : 'Удалить'}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteDialog;