'use client';

import DeleteDialog from "@/components/shared/delete-dialog";
import {Button} from "@/components/ui/button";

interface DeleteButtonWrapperProps {
    id: string;
    action: (id: string) => Promise<{ success: boolean; message: string }>;
    disabled?: boolean;
    disabledTitle?: string;
}

export const DeleteButtonWrapper = ({
                                        id,
                                        action,
                                        disabled,
                                        disabledTitle
                                    }: DeleteButtonWrapperProps) => {
    if (disabled) {
        return (
            <Button
                variant="outline"
                size="sm"
                disabled
                title={disabledTitle || 'No se puede eliminar'}
            >
                Eliminar
            </Button>
        );
    }

    return <DeleteDialog id={id} action={action} />;
};