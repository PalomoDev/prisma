//*/lib/validations/category.validation.ts

import { z } from "zod";
import {
  CategorySubcategoryRelationSchema,
  CategorySpecificationRelationSchema,
} from "./base.validation";

// ========================================
// ПРОМЕЖУТОЧНЫЕ СХЕМЫ (для валидации данных от Prisma)
// ========================================

// Схема подкатегории в связи (только нужные поля)
const SubcategoryInRelationSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  image: z.string().nullable(),
  isActivity: z.boolean(), // Является ли подкатегория активностью
  isActive: z.boolean(),
  sortOrder: z.number(),
});

// Промежуточная схема связи категория-подкатегория (что реально возвращает Prisma)
const CategorySubcategoryPrismaSchema = z.object({
  id: z.string().uuid(),
  categoryId: z.string().uuid(),
  subcategoryId: z.string().uuid(),
  sortOrder: z.number(),
  subcategory: SubcategoryInRelationSchema,
});

// Промежуточная схема категории от Prisma
const CategoryPrismaLightSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  image: z.string().nullable(),
  isActive: z.boolean(),
  sortOrder: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  categorySubcategories: z.array(CategorySubcategoryPrismaSchema),
  _count: z.object({
    products: z.number(),
  }),
});

// ========================================
// ПРОИЗВОДНЫЕ СХЕМЫ ДЛЯ КАТЕГОРИЙ (для внешнего API)
// ========================================

// Light версия: убираем createdAt/updatedAt из внешнего API
export const CategoryLightSchema = CategoryPrismaLightSchema.omit({
  createdAt: true,
  updatedAt: true,
});

// Промежуточная схема ответа от Prisma
export const GetCategoriesLightPrismaResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(CategoryPrismaLightSchema).nullable(),
  message: z.string().nullable(),
});

// Full версия: все поля + подкатегории + спецификации + расширенные count
export const CategoryFullSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  image: z.string().nullable(),
  isActive: z.boolean(),
  sortOrder: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  categorySubcategories: z.array(CategorySubcategoryRelationSchema),
  categorySpecifications: z.array(CategorySpecificationRelationSchema),
  _count: z.object({
    products: z.number(),
    categorySubcategories: z.number(),
    categorySpecifications: z.number(),
  }),
});

// ========================================
// СХЕМЫ ОТВЕТОВ
// ========================================

// Ответ для получения категорий Light версии
export const GetCategoriesLightResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(CategoryLightSchema).nullable(),
  message: z.string().nullable(),
});

// Ответ для получения категорий Full версии
export const GetCategoriesFullResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(CategoryFullSchema).nullable(),
  message: z.string().nullable(),
});

// Ответ для получения одной категории Light
export const GetCategoryLightResponseSchema = z.object({
  success: z.boolean(),
  data: CategoryLightSchema.nullable(),
  message: z.string().nullable(),
});

// Ответ для получения одной категории Full
export const GetCategoryFullResponseSchema = z.object({
  success: z.boolean(),
  data: CategoryFullSchema.nullable(),
  message: z.string().nullable(),
});

// ========================================
// ТИПЫ ДЛЯ ЭКСПОРТА
// ========================================

export type CategoryLight = z.infer<typeof CategoryLightSchema>;
export type CategoryFull = z.infer<typeof CategoryFullSchema>;
export type GetCategoriesLightResponse = z.infer<
  typeof GetCategoriesLightResponseSchema
>;
export type GetCategoriesFullResponse = z.infer<
  typeof GetCategoriesFullResponseSchema
>;
export type GetCategoryLightResponse = z.infer<
  typeof GetCategoryLightResponseSchema
>;
export type GetCategoryFullResponse = z.infer<
  typeof GetCategoryFullResponseSchema
>;
