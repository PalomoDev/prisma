import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import qs from 'query-string';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function formatError(error: any): string {
    if (error.name === 'ZodError') {
        const fieldErrors = Object.keys(error.errors).map(key => error.errors[key].message);
        return fieldErrors.join('. ');
    } else if (error.name === 'PrismaClientKnownRequestError' && error.code === 'P2002') {
        const field = error.meta?.target ? error.meta.target[0] : 'Field';
        return `${field} already exists`;
    } else {
        return typeof error.message === 'string' ? error.message : JSON.stringify(error.message);
    }
}

// Format number with decimal places
export function formatNumberWithDecimal(num: number): string {
  const [int, decimal] = num.toString().split('.');
  return decimal ? `${int}.${decimal.padEnd(2, '0')}` : `${int}.00`;
}

export function PrismaToJson<T>(data: T): T {
  return JSON.parse(
      JSON.stringify(data, (_, value) => {
        // Обработка BigInt
        if (typeof value === 'bigint') {
          return value.toString();
        }
        // Обработка Date
        if (value instanceof Date) {
          return value.toISOString();
        }
        // Обработка Decimal (из библиотеки decimal.js)
        if (value !== null && typeof value === 'object' && typeof value.toFixed === 'function') {
          return parseFloat(value.toString());
        }
        return value;
      })
  );
}


// Round number to decimal places
const roundTwoDecimals = (num: number | string): number => {
    if (typeof num === 'string') {
        return Math.round((parseFloat(num) + Number.EPSILON) * 100) / 100;
    } else {
        return Math.round((num + Number.EPSILON) * 100) / 100;
    }
};

export { roundTwoDecimals }

const CURRENCY_FORMATTER = new Intl.NumberFormat('es-ES', {
    currency: 'EUR',
    style: 'currency',
    minimumFractionDigits: 2,
});

// Format currency using the formatter above
export function formatCurrency(amount: number | string | null) {
    if (typeof amount === 'number') {
        return CURRENCY_FORMATTER.format(amount);
    } else if (typeof amount === 'string') {
        return CURRENCY_FORMATTER.format(Number(amount));
    } else {
        return 'NaN';
    }
}

// Shorten UUID
export function formatId(id: string) {
    return `..${id.substring(id.length - 6)}`;
}

// Form the pagination links
export function formUrlQuery({
                                 params,
                                 key,
                                 value,
                             }: {
    params: string;
    key: string;
    value: string | null;
}) {
    const query = qs.parse(params);

    query[key] = value;

    return qs.stringifyUrl(
        {
            url: window.location.pathname,
            query,
        },
        {
            skipNull: true,
        }
    );
}


/**
 * Форматирует дату в читаемый формат
 * @param date - Дата для форматирования (string, Date или null/undefined)
 * @param options - Опции форматирования
 * @returns Отформатированная строка даты
 */
export function formatDate(
    date: string | Date | null | undefined,
    options?: {
        locale?: string;
        format?: 'short' | 'long' | 'relative';
    }
): string {
    if (!date) return 'N/A';

    const { locale = 'ru-RU', format = 'short' } = options || {};

    try {
        const dateObj = date instanceof Date ? date : new Date(date);

        // Проверка на валидность даты
        if (isNaN(dateObj.getTime())) {
            return 'Invalid date';
        }

        // Относительное время (например: "2 часа назад")
        if (format === 'relative') {
            const now = new Date();
            const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

            if (diffInSeconds < 60) return 'только что';
            if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} мин. назад`;
            if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} ч. назад`;
            if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} дн. назад`;
        }

        // Длинный формат: "1 января 2024 г., 14:30"
        if (format === 'long') {
            return dateObj.toLocaleString(locale, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }

        // Короткий формат по умолчанию: "01.01.2024"
        return dateObj.toLocaleDateString(locale, {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });

    } catch (error) {
        console.error('Error formatting date:', error);
        return 'Invalid date';
    }
}

// Дополнительные удобные функции

/**
 * Форматирует дату и время
 */
export function formatDateTime(date: string | Date | null | undefined): string {
    if (!date) return 'N/A';

    try {
        const dateObj = date instanceof Date ? date : new Date(date);

        return dateObj.toLocaleString('ru-RU', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        return 'Invalid date';
    }
}

/**
 * Получает только время из даты
 */
export function formatTime(date: string | Date | null | undefined): string {
    if (!date) return 'N/A';

    try {
        const dateObj = date instanceof Date ? date : new Date(date);

        return dateObj.toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        return 'Invalid time';
    }
}