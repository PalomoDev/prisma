"use server"

import { prisma } from "@/db/prisma"
import { signUpFormSchema } from "@/lib/validations/user.validation"
import {isRedirectError} from "next/dist/client/components/redirect-error";
import { formatError } from "@/lib/utils";


export async function signUp(prevState: unknown, formDate: FormData) {
    try {
        const user = signUpFormSchema.parse({
            name: formDate.get('name'),
            email: formDate.get('email'),
            password: formDate.get('password'),
            confirmPassword: formDate.get('confirmPassword')
        })

        console.log('Send user', user)

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

        console.log(newUser)
        return { success: true, message: `User ${newUser.name} created successfully`}

    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        }

        return { success: false, message: formatError(error) }
    }
}

