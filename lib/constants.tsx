import {z} from "zod";
import { ShippingAddressFormFieldConfig } from "@/types";

export const SHIPPING_ADDRESS_DEFAULT = {
    country: '',
    firstName: '',
    lastName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    province: '',
    postalCode: '',
    phoneNumber: ''
}

export const ShippingAddressFormFields: ShippingAddressFormFieldConfig[] = [
    { name: 'firstName', label: 'Nombre' },
    { name: 'lastName', label: 'Apellido' },
    { name: 'addressLine1', label: 'Dirección Línea 1' },
    { name: 'addressLine2', label: 'Dirección Línea 2 (Opcional)', placeholder: 'Opcional' },
    { name: 'city', label: 'Ciudad' },
    { name: 'province', label: 'Provincia' },
    { name: 'postalCode', label: 'Código Postal' },
    { name: 'country', label: 'Pais'},
    { name: 'phoneNumber', label: 'Número de Teléfono', type: 'tel' }
];


export const PAYMENT_METHODS = process.env.PAYMENT_METHODS
    ? process.env.PAYMENT_METHODS.split(', ')
    : ['PayPal', 'Stripe', 'CashOnDelivery'];
export const DEFAULT_PAYMENT_METHOD =
    process.env.DEFAULT_PAYMENT_METHOD || 'PayPal';