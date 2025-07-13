import {z} from "zod";


export const SubcategorySchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    slug: z.string(),
    description: z.string().nullable(),
    image: z.string().nullable(),
    isActive: z.boolean(),
    sortOrder: z.number()
});

export type SubcategorySchema = z.infer<typeof SubcategorySchema>;