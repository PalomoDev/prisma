// lib/validations/new/feature.validation.ts
// Схемы валидации для особенностей (features)

import { z } from "zod";
import { BaseFeatureSchema } from "./base.validation";

// ========================================
// ПРОИЗВОДНЫЕ СХЕМЫ ОТ БАЗОВОЙ
// ========================================

/**
 * Полная схема особенности (корень).
 * Является псевдонимом для базовой схемы.
 */
export const FeatureFullSchema = BaseFeatureSchema;

/**
 * Облегченная схема особенности для списков.
 * Исключает тяжелые связи и временные метки.
 */
export const FeatureLightSchema = FeatureFullSchema.omit({
  createdAt: true,
  updatedAt: true,
  productFeatures: true,
  _count: true,
});

/**
 * Базовая объектная схема для создания и обновления особенностей.
 */
const FeatureObjectSchema = z.object({
  name: z.string().min(1, { message: "Название обязательно" }),
  key: z
    .string()
    .min(3, "Ключ должен содержать минимум 3 символа")
    .regex(
      /^[a-z0-9_]+$/,
      "Ключ может содержать только строчные буквы, цифры и символ '_'"
    ),
  icon: z.string().min(1, "Иконка обязательна"),
  iconImage: z
    .string()
    .url("Неверный формат URL изображения")
    .nullable()
    .optional(),
  description: z.string().nullable().optional(),
  color: z.string().nullable().optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.coerce.number().int().default(0),
});

/**
 * Схема для создания новой особенности.
 */
export const CreateFeatureSchema = FeatureObjectSchema;

/**
 * Схема для обновления существующей особенности.
 */
export const UpdateFeatureSchema = FeatureObjectSchema.partial().extend({
  id: z.string().uuid({ message: "Неверный формат ID" }),
});

// ========================================
// СХЕМЫ ОТВЕТОВ API
// ========================================

/**
 * Схема ответа для запроса списка особенностей (облегченная версия).
 */
export const GetFeaturesLightResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(FeatureLightSchema).nullable(),
  message: z.string().nullable(),
});

/**
 * Схема ответа для запроса списка особенностей (полная версия).
 */
export const GetFeaturesFullResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(FeatureFullSchema).nullable(),
  message: z.string().nullable(),
});

/**
 * Схема ответа для запроса одной особенности.
 */
export const GetFeatureResponseSchema = z.object({
  success: z.boolean(),
  data: FeatureFullSchema.nullable(),
  message: z.string().nullable(),
});

// ========================================
// ТИПЫ ДЛЯ ЭКСПОРТА
// ========================================

export type FeatureFull = z.infer<typeof FeatureFullSchema>;
export type FeatureLight = z.infer<typeof FeatureLightSchema>;
export type CreateFeatureInput = z.infer<typeof CreateFeatureSchema>;
export type UpdateFeatureInput = z.infer<typeof UpdateFeatureSchema>;

export type GetFeaturesLightResponse = z.infer<typeof GetFeaturesLightResponseSchema>;
export type GetFeaturesFullResponse = z.infer<typeof GetFeaturesFullResponseSchema>;
export type GetFeatureResponse = z.infer<typeof GetFeatureResponseSchema>;
