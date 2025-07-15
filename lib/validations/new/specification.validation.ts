// lib/validations/new/specification.validation.ts
// Схемы валидации для спецификаций

import { z } from "zod";
import { BaseSpecificationSchema } from "./base.validation";

// ========================================
// ПРОИЗВОДНЫЕ СХЕМЫ ОТ БАЗОВОЙ
// ========================================

/**
 * Полная схема спецификации (корень).
 * Является псевдонимом для базовой схемы, так как она уже содержит все необходимые связи.
 */
export const SpecificationFullSchema = BaseSpecificationSchema;

/**
 * Облегченная схема спецификации для списков.
 * Производная от полной схемы, исключает временные метки и тяжелые связи.
 */
export const SpecificationLightSchema = SpecificationFullSchema.omit({
  createdAt: true,
  updatedAt: true,
  categorySpecs: true,
  productSpecifications: true,
  _count: true,
});

/**
 * Схема для создания новой спецификации.
 */
// Сначала определяем базовую объектную схему
const SpecificationObjectSchema = z.object({
  name: z.string().min(1, { message: "Название обязательно" }),
  key: z
    .string()
    .min(1, "Ключ спецификации обязателен")
    .regex(
      /^[a-z0-9_-]+$/,
      "Ключ может содержать только строчные буквы, цифры, подчеркивания и дефисы"
    ),
  description: z.string().nullable().optional(),
  unit: z.string().nullable().optional(),
  type: z.enum(["number", "text", "select", "boolean", "range"], {
    errorMap: () => ({ message: "Неверный тип спецификации" }),
  }),
  options: z.array(z.string()).optional(),
  iconImage: z.string().optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.coerce.number().int().default(0),
  isGlobal: z.boolean().default(false),
  categoryIds: z.array(z.string().uuid()).default([]),
});

// Затем применяем .refine() для схемы создания
export const CreateSpecificationSchema = SpecificationObjectSchema.refine(
  (data) => data.isGlobal || (data.categoryIds && data.categoryIds.length > 0),
  {
    message:
      "Если спецификация не является глобальной, необходимо выбрать хотя бы одну категорию.",
    path: ["categoryIds"],
  }
);

/**
 * Схема для обновления существующей спецификации.
 * Производная от схемы создания, делает все поля опциональными и добавляет ID.
 */
export const UpdateSpecificationSchema =
  SpecificationObjectSchema.partial().extend({
    id: z.string().uuid({ message: "Неверный формат ID" }),
  });

// ========================================
// СХЕМЫ ОТВЕТОВ API
// ========================================

/**
 * Схема ответа для запроса списка спецификаций (облегченная версия).
 */
export const GetSpecificationsLightResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(SpecificationLightSchema).nullable(),
  message: z.string().nullable(),
});

/**
 * Схема ответа для запроса списка спецификаций (полная версия).
 */
export const GetSpecificationsFullResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(SpecificationFullSchema).nullable(),
  message: z.string().nullable(),
});

/**
 * Схема ответа для запроса одной спецификации.
 */
export const GetSpecificationResponseSchema = z.object({
  success: z.boolean(),
  data: SpecificationFullSchema.nullable(),
  message: z.string().nullable(),
});

// ========================================
// ТИПЫ ДЛЯ ЭКСПОРТА
// ========================================

export type SpecificationFull = z.infer<typeof SpecificationFullSchema>;
export type SpecificationLight = z.infer<typeof SpecificationLightSchema>;
export type CreateSpecificationInput = z.infer<
  typeof CreateSpecificationSchema
>;
export type UpdateSpecificationInput = z.infer<
  typeof UpdateSpecificationSchema
>;

export type GetSpecificationsLightResponse = z.infer<
  typeof GetSpecificationsLightResponseSchema
>;
export type GetSpecificationsFullResponse = z.infer<
  typeof GetSpecificationsFullResponseSchema
>;
export type GetSpecificationResponse = z.infer<
  typeof GetSpecificationResponseSchema
>;
