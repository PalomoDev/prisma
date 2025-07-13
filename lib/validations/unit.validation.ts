import {z} from "zod";
import {formatNumberWithDecimal} from "@/lib/utils";

export const currency = z
    .string()
    .refine(
        (value) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(Number(value))),
        'Price must be a number with 2 decimal places'
    )