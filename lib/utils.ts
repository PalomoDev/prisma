import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export async function formatError(error: any) {
  if (error.name === 'ZodError') {
    const fieldErrors = Object.keys(error.errors).map(key => error.errors[key].message)
    return fieldErrors.join('. ')
  } else if (error.name === 'PrismaClientKnownRequestError' && error.code === 'P2002') {
    const field = error.meta?.target ? error.meta.target[0] : 'Field'
    return `${field} already exists`
  } else {
      return typeof error.message === 'string' ? error.message : JSON.stringify(error.message)
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