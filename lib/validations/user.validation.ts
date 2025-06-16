import { z } from 'zod';
import {PAYMENT_METHODS} from "@/lib/constants";

/**
 * Перечисление возможных ролей пользователя
 */
export const UserRoleEnum = z.enum(['user', 'admin']);
export type UserRole = z.infer<typeof UserRoleEnum>;


// Schema for the shipping address in Spain
export const shippingAddressSchema = z.object({
    country: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    lastName: z.string().min(2, 'Los apellidos deben tener al menos 2 caracteres'),
    addressLine1: z.string().min(3, 'La dirección debe tener al menos 3 caracteres'),
    addressLine2: z.string().optional(),
    city: z.string().min(2, 'La ciudad debe tener al menos 2 caracteres'),
    province: z.string().min(2, 'La provincia es obligatoria'),
    postalCode: z.string().length(5, 'El código postal debe tener 5 dígitos').regex(/^\d{5}$/, 'El código postal debe contener 5 dígitos'),
    phoneNumber: z.string().min(9, 'El número de teléfono debe tener al menos 9 dígitos').regex(/^\d+$/, 'El número de teléfono debe contener solo dígitos'),

});


/**
 * Схема для создания пользователя
 */
export const createUserSchema = z.object({
    name: z.string().min(1, { message: 'Имя обязательно' }).default('NO_NAME'),
    email: z.string().email({ message: 'Неверный формат email' }),
    password: z.string().min(6, { message: 'Пароль должен содержать минимум 6 символов' }),
    role: UserRoleEnum.default('user'),
    address: shippingAddressSchema.optional(),
    paymentMethod: z.string().optional(),
    image: z.string().url({ message: 'Неверный формат URL изображения' }).optional(),
});



export const signUpFormSchema = z.object({
    name: z.string().min(1, { message: 'Имя обязательно' }).default('NO_NAME'),
    email: z.string().email({ message: 'Неверный формат email' }).default('<EMAIL>'),
    password: z.string().min(6, { message: 'Пароль должен содержать минимум 6 символов' }).default('<PASSWORD>'),
    confirmPassword: z.string().min(6, { message: 'Пароль должен содержать минимум 6 символов' }).default('<PASSWORD>'),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
})

/**
 * Схема для обновления пользователя
 */
export const updateUserSchema = z.object({
    id: z.string().uuid({ message: 'Неверный формат ID' }),
    name: z.string().min(1, { message: 'Имя обязательно' }).optional(),
    email: z.string().email({ message: 'Неверный формат email' }).optional(),
    password: z.string().min(6, { message: 'Пароль должен содержать минимум 6 символов' }).optional(),
    role: UserRoleEnum.optional(),
    address: shippingAddressSchema.optional(),
    paymentMethod: z.string().optional(),
    image: z.string().url({ message: 'Неверный формат URL изображения' }).optional(),
});

/**
 * Схема для входа пользователя
 */
export const loginUserSchema = z.object({
    email: z.string().email({ message: 'Неверный формат email' }),
    password: z.string().min(6, { message: 'Пароль обязателен' }),
});

/**
 * Схема для смены пароля
 */
export const changePasswordSchema = z.object({
    userId: z.string().uuid({ message: 'Неверный формат ID' }),
    currentPassword: z.string().min(1, { message: 'Текущий пароль обязателен' }),
    newPassword: z.string().min(6, { message: 'Новый пароль должен содержать минимум 6 символов' }),
    confirmPassword: z.string().min(6, { message: 'Подтверждение пароля обязательно' }),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
});

/**
 * Схема для получения пользователя по ID
 */
export const getUserByIdSchema = z.object({
    id: z.string().uuid({ message: 'Неверный формат ID' }),
});

/**
 * Типы на основе схем Zod для использования в TypeScript
 */

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type LoginUserInput = z.infer<typeof loginUserSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type GetUserByIdInput = z.infer<typeof getUserByIdSchema>;


// Schema for payment method
export const paymentMethodSchema = z
    .object({
        type: z.string().min(1, 'Payment method is required'),
    })
    .refine((data) => PAYMENT_METHODS.includes(data.type), {
        path: ['type'],
        message: 'Invalid payment method',
    });