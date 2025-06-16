import {z} from "zod";
import {cartItemSchema, insertCartSchema} from "@/lib/validations/product.validation";
import {shippingAddressSchema} from "@/lib/validations/user.validation"
import {Control} from "react-hook-form";


export type Cart = z.infer<typeof insertCartSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;
export type ShippingAddress = z.infer<typeof shippingAddressSchema>;


export interface ShippingAddressFormFieldConfig {
    name: keyof ShippingAddress;
    label: string;
    placeholder?: string;
    type?: string;
    className?: string;
}

export interface ShippingAddressFormFieldProps {
    key: string;
    name: keyof ShippingAddress; // Используем keyof для ограничения имени поля
    label: string; // Заголовок поля
    placeholder?: string; // Необязательный плейсхолдер
    control: Control<ShippingAddress>; // Контрол из react-hook-form
    className?: string; // Необязательные дополнительные классы
    type?: string; // Необязательный тип для input (text, email, password и т.д.)
}