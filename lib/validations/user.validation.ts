import { z } from 'zod';

/**
 * Перечисление возможных ролей пользователя
 */
export const UserRoleEnum = z.enum(['user', 'admin']);
export type UserRole = z.infer<typeof UserRoleEnum>;

/**
 * Схема валидации адреса пользователя
 */
export const addressSchema = z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    country: z.string().optional(),
});

/**
 * Схема для создания пользователя
 */
export const createUserSchema = z.object({
    name: z.string().min(1, { message: 'Имя обязательно' }).default('NO_NAME'),
    email: z.string().email({ message: 'Неверный формат email' }),
    password: z.string().min(6, { message: 'Пароль должен содержать минимум 6 символов' }),
    role: UserRoleEnum.default('user'),
    address: addressSchema.optional(),
    paymentMethod: z.string().optional(),
    image: z.string().url({ message: 'Неверный формат URL изображения' }).optional(),
});

/**
 * Схема для обновления пользователя
 */
export const updateUserSchema = z.object({
    id: z.string().uuid({ message: 'Неверный формат ID' }),
    name: z.string().min(1, { message: 'Имя обязательно' }).optional(),
    email: z.string().email({ message: 'Неверный формат email' }).optional(),
    password: z.string().min(6, { message: 'Пароль должен содержать минимум 6 символов' }).optional(),
    role: UserRoleEnum.optional(),
    address: addressSchema.optional(),
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
export type Address = z.infer<typeof addressSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type LoginUserInput = z.infer<typeof loginUserSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type GetUserByIdInput = z.infer<typeof getUserByIdSchema>;