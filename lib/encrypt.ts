import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

/**
 * Хеширует пароль используя bcrypt
 * @param plainPassword - Исходный пароль в открытом виде
 * @returns Захешированный пароль
 * @throws Error если хеширование не удалось
 */
export const hash = async (plainPassword: string): Promise<string> => {
    try {
        return await bcrypt.hash(plainPassword, SALT_ROUNDS);
    } catch (error) {
        console.log(error)
        throw new Error('Failed to hash password');

    }
};

/**
 * Сравнивает пароль в открытом виде с захешированным паролем
 * @param plainPassword - Пароль в открытом виде для проверки
 * @param hashedPassword - Сохраненный захешированный пароль
 * @returns true если пароли совпадают, false в противном случае
 */
export const compare = async (
    plainPassword: string,
    hashedPassword: string
): Promise<boolean> => {
    try {
        // Используем встроенную функцию bcrypt для сравнения

        return  await bcrypt.compare(plainPassword, hashedPassword);;
    } catch (error) {
        console.error('Password comparison error:', error);
        return false;
    }
};

/**
 * Проверяет силу пароля
 * @param password - Пароль для проверки
 * @returns Объект с результатами проверки
 */
export const validatePasswordStrength = (password: string): {
    isValid: boolean;
    errors: string[];
} => {
    const errors: string[] = [];

    if (password.length < 8) {
        errors.push('Password must be at least 8 characters long');
    }

    if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
    }

    if (!/[0-9]/.test(password)) {
        errors.push('Password must contain at least one number');
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.push('Password must contain at least one special character');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

/**
 * Генерирует случайный безопасный пароль
 * @param length - Длина пароля (по умолчанию 16)
 * @returns Сгенерированный пароль
 */
export const generateSecurePassword = (length: number = 16): string => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    const allChars = uppercase + lowercase + numbers + symbols;
    let password = '';

    // Гарантируем хотя бы по одному символу каждого типа
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];

    // Заполняем оставшуюся длину случайными символами
    for (let i = password.length; i < length; i++) {
        password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    // Перемешиваем символы
    return password.split('').sort(() => Math.random() - 0.5).join('');
};