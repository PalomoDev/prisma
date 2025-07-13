//*/lib/validations/base.validation

import { z } from "zod";

// ========================================
// БАЗОВЫЕ СХЕМЫ БЕЗ СВЯЗЕЙ (для избежания циклических ссылок)
// ========================================

// Базовая схема пользователя
const BaseUserSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    email: z.string(),
    emailVerified: z.date().nullable(),
    image: z.string().nullable(),
    password: z.string().nullable(),
    role: z.string(),
    address: z.any().nullable(),
    paymentMethod: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date()
});

// Базовая схема категории (без связей)
const BaseCategorySchemaCore = z.object({
    id: z.string().uuid(),
    name: z.string(),
    slug: z.string(),
    description: z.string().nullable(),
    image: z.string().nullable(),
    isActive: z.boolean(),
    sortOrder: z.number(),
    createdAt: z.date(),
    updatedAt: z.date()
});

// Базовая схема подкатегории (без связей)
const BaseSubcategorySchemaCore = z.object({
    id: z.string().uuid(),
    name: z.string(),
    slug: z.string(),
    description: z.string().nullable(),
    image: z.string().nullable(),
    isActive: z.boolean(),
    sortOrder: z.number(),
    createdAt: z.date(),
    updatedAt: z.date()
});

// Базовая схема бренда (без связей)
const BaseBrandSchemaCore = z.object({
    id: z.string().uuid(),
    name: z.string(),
    slug: z.string(),
    description: z.string().nullable(),
    logo: z.string().nullable(),
    website: z.string().nullable(),
    isActive: z.boolean(),
    sortOrder: z.number(),
    createdAt: z.date(),
    updatedAt: z.date()
});

// Базовая схема спецификации (без связей)
const BaseSpecificationSchemaCore = z.object({
    id: z.string().uuid(),
    name: z.string(),
    key: z.string(),
    description: z.string().nullable(),
    unit: z.string().nullable(),
    type: z.string(),
    options: z.array(z.string()),
    icon: z.string().nullable(),
    category: z.string().nullable(),
    isActive: z.boolean(),
    sortOrder: z.number(),
    createdAt: z.date(),
    updatedAt: z.date()
});

// Базовая схема особенности (без связей)
const BaseFeatureSchemaCore = z.object({
    id: z.string().uuid(),
    name: z.string(),
    key: z.string(),
    icon: z.string(),
    iconImage: z.string().nullable(),
    description: z.string().nullable(),
    category: z.string().nullable(),
    color: z.string().nullable(),
    isActive: z.boolean(),
    sortOrder: z.number(),
    createdAt: z.date(),
    updatedAt: z.date()
});

// Базовая схема продукта (без связей)
const BaseProductSchemaCore = z.object({
    id: z.string().uuid(),
    name: z.string(),
    slug: z.string(),
    sku: z.string(),
    categoryId: z.string().uuid(),
    brandId: z.string().uuid(),
    images: z.array(z.string()),
    description: z.string(),
    stock: z.number(),
    price: z.number(),
    rating: z.number(),
    numReviews: z.number(),
    isFeatured: z.boolean(),
    banner: z.string().nullable(),
    isActive: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date()
});

// ========================================
// ПРОМЕЖУТОЧНЫЕ СХЕМЫ ДЛЯ СВЯЗЕЙ
// ========================================

// Схема для связи категория-подкатегория
export const CategorySubcategoryRelationSchema = z.object({
    id: z.string().uuid(),
    categoryId: z.string().uuid(),
    subcategoryId: z.string().uuid(),
    sortOrder: z.number(),
    createdAt: z.date(),
    updatedAt: z.date(),
    category: BaseCategorySchemaCore,
    subcategory: BaseSubcategorySchemaCore
});

// Схема для связи продукт-подкатегория
export const ProductSubcategoryRelationSchema = z.object({
    id: z.string().uuid(),
    productId: z.string().uuid(),
    subcategoryId: z.string().uuid(),
    createdAt: z.date(),
    updatedAt: z.date(),
    subcategory: BaseSubcategorySchemaCore
});

// Схема для связи категория-спецификация
export const CategorySpecificationRelationSchema = z.object({
    id: z.string().uuid(),
    categoryId: z.string().uuid(),
    specificationId: z.string().uuid(),
    isRequired: z.boolean(),
    sortOrder: z.number(),
    createdAt: z.date(),
    updatedAt: z.date(),
    specification: BaseSpecificationSchemaCore
});

// Схема для значения спецификации продукта
export const ProductSpecificationValueRelationSchema = z.object({
    id: z.string().uuid(),
    productId: z.string().uuid(),
    specificationId: z.string().uuid(),
    value: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    specification: BaseSpecificationSchemaCore
});

// Схема для связи продукт-особенность
export const ProductFeatureRelationSchema = z.object({
    productId: z.string().uuid(),
    featureId: z.string().uuid(),
    feature: BaseFeatureSchemaCore
});

// Схема для отзыва
export const ReviewSchema = z.object({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    productId: z.string().uuid(),
    rating: z.number(),
    title: z.string(),
    description: z.string(),
    isVerifiedPurchase: z.boolean(),
    isApproved: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
    user: BaseUserSchema,
    product: BaseProductSchemaCore
});

// Схема для позиций заказа
export const OrderItemRelationSchema = z.object({
    orderId: z.string().uuid(),
    productId: z.string().uuid(),
    qty: z.number(),
    price: z.number(),
    name: z.string(),
    slug: z.string(),
    image: z.string()
});

// ========================================
// СХЕМЫ ПРОДУКТОВ С РАЗНЫМИ УРОВНЯМИ СВЯЗЕЙ
// ========================================

// Продукт с базовыми связями (для использования в других схемах)
const ProductWithBasicRelationsSchema = BaseProductSchemaCore.extend({
    category: BaseCategorySchemaCore,
    brand: BaseBrandSchemaCore
});

// Продукт с расширенными связями (для использования в списках связей)
const ProductWithExtendedRelationsSchema = BaseProductSchemaCore.extend({
    category: BaseCategorySchemaCore,
    brand: BaseBrandSchemaCore,
    productSubcategories: z.array(ProductSubcategoryRelationSchema),
    specificationValues: z.array(ProductSpecificationValueRelationSchema),
    features: z.array(ProductFeatureRelationSchema),
    reviews: z.array(ReviewSchema),
    _count: z.object({
        productSubcategories: z.number(),
        specificationValues: z.number(),
        features: z.number(),
        reviews: z.number(),
        orderItems: z.number()
    })
});

// ========================================
// МАКСИМАЛЬНЫЕ СХЕМЫ СО ВСЕМИ СВЯЗЯМИ
// ========================================

// Максимальная схема для категории
export const BaseCategorySchema = BaseCategorySchemaCore.extend({
    products: z.array(ProductWithBasicRelationsSchema),
    categorySubcategories: z.array(CategorySubcategoryRelationSchema),
    categorySpecifications: z.array(CategorySpecificationRelationSchema),
    _count: z.object({
        products: z.number(),
        categorySubcategories: z.number(),
        categorySpecifications: z.number()
    })
});

// Максимальная схема для подкатегории
export const BaseSubcategorySchema = BaseSubcategorySchemaCore.extend({
    categorySubcategories: z.array(CategorySubcategoryRelationSchema),
    productSubcategories: z.array(z.object({
        id: z.string().uuid(),
        productId: z.string().uuid(),
        subcategoryId: z.string().uuid(),
        createdAt: z.date(),
        updatedAt: z.date(),
        product: ProductWithBasicRelationsSchema
    })),
    _count: z.object({
        categorySubcategories: z.number(),
        productSubcategories: z.number()
    })
});

// Максимальная схема для бренда
export const BaseBrandSchema = BaseBrandSchemaCore.extend({
    products: z.array(ProductWithExtendedRelationsSchema),
    _count: z.object({
        products: z.number()
    })
});

// Максимальная схема для спецификации
export const BaseSpecificationSchema = BaseSpecificationSchemaCore.extend({
    productSpecifications: z.array(z.object({
        id: z.string().uuid(),
        productId: z.string().uuid(),
        specificationId: z.string().uuid(),
        value: z.string(),
        createdAt: z.date(),
        updatedAt: z.date(),
        product: ProductWithBasicRelationsSchema
    })),
    categorySpecs: z.array(z.object({
        id: z.string().uuid(),
        categoryId: z.string().uuid(),
        specificationId: z.string().uuid(),
        isRequired: z.boolean(),
        sortOrder: z.number(),
        createdAt: z.date(),
        updatedAt: z.date(),
        category: BaseCategorySchemaCore
    })),
    _count: z.object({
        productSpecifications: z.number(),
        categorySpecs: z.number()
    })
});

// Максимальная схема для особенности
export const BaseFeatureSchema = BaseFeatureSchemaCore.extend({
    productFeatures: z.array(z.object({
        productId: z.string().uuid(),
        featureId: z.string().uuid(),
        product: ProductWithBasicRelationsSchema
    })),
    _count: z.object({
        productFeatures: z.number()
    })
});

// Максимальная схема для продукта
export const BaseProductSchema = BaseProductSchemaCore.extend({
    category: BaseCategorySchema,
    brand: BaseBrandSchema,
    productSubcategories: z.array(ProductSubcategoryRelationSchema),
    specificationValues: z.array(ProductSpecificationValueRelationSchema),
    features: z.array(ProductFeatureRelationSchema),
    reviews: z.array(ReviewSchema),
    orderItems: z.array(OrderItemRelationSchema),
    _count: z.object({
        productSubcategories: z.number(),
        specificationValues: z.number(),
        features: z.number(),
        reviews: z.number(),
        orderItems: z.number()
    })
});

// ========================================
// ТИПЫ ДЛЯ ВНЕШНИХ ИНТЕРФЕЙСОВ
// ========================================

export type BaseCategory = z.infer<typeof BaseCategorySchema>;
export type BaseSubcategory = z.infer<typeof BaseSubcategorySchema>;
export type BaseBrand = z.infer<typeof BaseBrandSchema>;
export type BaseSpecification = z.infer<typeof BaseSpecificationSchema>;
export type BaseFeature = z.infer<typeof BaseFeatureSchema>;
export type BaseProduct = z.infer<typeof BaseProductSchema>;
export type Review = z.infer<typeof ReviewSchema>;