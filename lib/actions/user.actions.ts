"use server"

import { prisma } from "@/db/prisma"
import {signUpFormSchema, shippingAddressSchema, paymentMethodSchema} from "@/lib/validations/user.validation"
import {isRedirectError} from "next/dist/client/components/redirect-error";
import { formatError } from "@/lib/utils";
import {ShippingAddress} from "@/types";
import { auth } from "@/auth";
import {z} from "zod";



export async function signUp(prevState: unknown, formDate: FormData) {
    try {
        const user = signUpFormSchema.parse({
            name: formDate.get('name'),
            email: formDate.get('email'),
            password: formDate.get('password'),
            confirmPassword: formDate.get('confirmPassword')
        })
        const newUser = await prisma.user.create({
            data: {
                name: user.name,
                email: user.email,
                password: user.password
            },
            select: {

                name: true,
                email: true,

            }
        })
        return { success: true, message: `User ${newUser.name} created successfully`}

    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        }
        return { success: false, message: formatError(error) }
    }
}


const getUserById = async (userId: string) => {
    try {
        return await prisma.user.findUnique({
            where: { id: userId },
        });
    } catch (error) {
        console.log(error)
        return null;
    }
}

export { getUserById }

// Сначала обновляем server action в файле user.actions.ts

export async function updateUserAddress(data: ShippingAddress) {
    try {
        const session = await auth()
        if (!session?.user?.id) {return { success: false, message: "User ID not provided" };}
        const address = shippingAddressSchema.parse(data);
        await prisma.user.update({
            where: { id: session.user.id },
            data: { address }
        });

        return {
            success: true,
            message: "Dirección guardada correctamente"
        }
    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        }
        return { success: false, message: 'Error saving address' };
    }
}

// Update user's payment method
export async function updateUserPaymentMethod(
    data: z.infer<typeof paymentMethodSchema>
) {
    try {
        const session = await auth();
        const currentUser = await prisma.user.findFirst({
            where: { id: session?.user?.id },
        });

        if (!currentUser) throw new Error('User not found');

        const paymentMethod = paymentMethodSchema.parse(data);

        await prisma.user.update({
            where: { id: currentUser.id },
            data: { paymentMethod: paymentMethod.type },
        });

        return {
            success: true,
            message: 'User updated successfully',
        };
    } catch (error) {
        return { success: false, message: formatError(error) };
    }
}


