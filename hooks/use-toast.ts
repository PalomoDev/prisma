"use client"

import { toast as sonnerToast } from "sonner"

type ToastProps = {
    title?: string
    description?: string
    action?: {
        label: string
        onClick: () => void
    }
}

const toast = {
    success: (message: string, options?: ToastProps) => {
        return sonnerToast.success(message, {
            description: options?.description,
            action: options?.action,
        })
    },

    error: (message: string, options?: ToastProps) => {
        return sonnerToast.error(message, {
            description: options?.description,
            action: options?.action,
        })
    },

    info: (message: string, options?: ToastProps) => {
        return sonnerToast.info(message, {
            description: options?.description,
            action: options?.action,
        })
    },

    warning: (message: string, options?: ToastProps) => {
        return sonnerToast.warning(message, {
            description: options?.description,
            action: options?.action,
        })
    },

    default: (message: string, options?: ToastProps) => {
        return sonnerToast(message, {
            description: options?.description,
            action: options?.action,
        })
    },

    dismiss: (toastId?: string | number) => {
        if (toastId) {
            sonnerToast.dismiss(toastId)
        } else {
            sonnerToast.dismiss()
        }
    },
}

function useToast() {
    return {
        toast,
        dismiss: toast.dismiss,
    }
}

export { useToast, toast }