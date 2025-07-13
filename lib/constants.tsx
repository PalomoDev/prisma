import {z} from "zod";
import {InsertProductSchema, ShippingAddressFormFieldConfig} from "@/types";

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

export const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 12;

// Исправленные дефолтные значения для формы
export const productDefaultValues: InsertProductSchema = {
    name: '',
    slug: '',
    sku: '',
    categoryId: '',
    brandId: '',
    description: '',
    stock: 0,
    price: '0.00',
    images: [],
    isFeatured: false,        // Указываем явно
    banner: null,
    subcategoryIds: [],       // Указываем явно
    featureIds: [],          // Указываем явно
    specifications: [],       // Указываем явно
};

export const categoryDefaultValues = {
    name: '',
    slug: '',
    description: '',
    isActive: false,
    sortOrder: 0,
    subcategoryIds: [] // добавляем это поле
}

export const subcategoryDefaultValues = {
    name: '',
    slug: '',
    description: '',
    isActive: false,
    sortOrder: 0,
    categoryIds: [] // пустой массив по умолчанию
}

export const brandDefaultValues = {
    name: '',
    slug: '',
    description: null,
    logo: null,
    website: null,
    isActive: true,
    sortOrder: 0,
};

export const featureDefaultValues = {
    name: '',
    key: '',
    icon: '',
    iconImage: null,
    description: null,
    isActive: true,
    sortOrder: 0,
};


export const SPECIFICATION_TYPES = [
    { value: 'number', label: 'Число' },
    { value: 'text', label: 'Текст' },
    { value: 'select', label: 'Выбор' },
    { value: 'boolean', label: 'Да/Нет' },
    { value: 'range', label: 'Диапазон' },
] as const;

// Значения по умолчанию для формы создания спецификации
export const specificationDefaultValues = {
    name: '',
    key: '',
    description: null,
    unit: null,
    type: 'text' as const,
    icon: null,
    category: null,
    isActive: true,
    sortOrder: 0,
    categoryIds: [] as string[],
    isGlobal: false,
};

