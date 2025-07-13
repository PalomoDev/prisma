import {z} from "zod";


export const CategoryFilterSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    slug: z.string(),
    isActive: z.boolean(),
    sortOrder: z.number().int(),
});

export type CategoryFilterSchema = z.infer<typeof CategoryFilterSchema>;

export const GetCategoriesForFiltersResponseSchema = z.object({
    success: z.boolean(),
    data: z.array(CategoryFilterSchema.extend({
        _count: z.object({
            products: z.number().int(),
        }),
    })).optional(),
    message: z.string().optional(),
});

export type CategoryForFiltersResponse = z.infer<typeof GetCategoriesForFiltersResponseSchema>;

