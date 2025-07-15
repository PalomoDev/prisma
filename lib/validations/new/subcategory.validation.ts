// lib/validations/new/subcategory.validation.ts
// Схемы валидации для субкатегорий (админка и публичный сайт)

import { z } from "zod";
import {
  CategorySubcategoryRelationSchema,
  ProductSubcategoryRelationSchema,
} from "./base.validation";

// ========================================
// СХЕМЫ ДЛЯ СОЗДАНИЯ/ОБНОВЛЕНИЯ СУБКАТЕГОРИЙ
// ========================================

// Схема для создания новой субкатегории
export const CreateSubcategorySchema = z.object({
  name: z.string().min(1, { message: "Название субкатегории обязательно" }),
  slug: z.string().min(3, "Slug должен содержать минимум 3 символа"),
  description: z.string().nullable().optional(),
  image: z.string().nullable().optional(),
  isActivity: z.boolean().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.coerce.number().int().optional(),
  categoryIds: z
    .array(z.string().uuid({ message: "Неверный формат ID категории" }))
    .optional(),
});

// Схема для обновления субкатегории
export const UpdateSubcategorySchema = CreateSubcategorySchema.partial().extend(
  {
    id: z.string().uuid({ message: "Неверный формат ID" }),
  }
);

// Полная схема для админки (со всеми связями и счетчиками)
export const SubcategoryFullSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  image: z.string().nullable(),
  isActivity: z.boolean(),
  isActive: z.boolean(),
  sortOrder: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  categorySubcategories: z.array(CategorySubcategoryRelationSchema),
  productSubcategories: z.array(ProductSubcategoryRelationSchema),
  _count: z.object({
    categorySubcategories: z.number(),
    productSubcategories: z.number(),
  }),
});

// Облегчённая схема для сайта и фильтров (без дат и связей, но с описанием)
export const SubcategoryLightSchema = SubcategoryFullSchema.omit({
  createdAt: true,
  updatedAt: true,
  categorySubcategories: true,
  productSubcategories: true,
  _count: true,
});

// Схемы ответов
export const GetSubcategoriesLightResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(SubcategoryLightSchema).nullable(),
  message: z.string().nullable(),
});

export const GetSubcategoriesFullResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(SubcategoryFullSchema).nullable(),
  message: z.string().nullable(),
});

// Типы для экспорта
export type SubcategoryFull = z.infer<typeof SubcategoryFullSchema>;
export type SubcategoryLight = z.infer<typeof SubcategoryLightSchema>;
export type GetSubcategoriesLightResponse = z.infer<
  typeof GetSubcategoriesLightResponseSchema
>;
export type GetSubcategoriesFullResponse = z.infer<
  typeof GetSubcategoriesFullResponseSchema
>;

// Типы для создания/обновления
export type CreateSubcategoryInput = z.infer<typeof CreateSubcategorySchema>;
export type UpdateSubcategoryInput = z.infer<typeof UpdateSubcategorySchema>;
