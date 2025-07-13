import {z} from "zod";


export const SpecificationSchema = z.object({
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
    sortOrder: z.number()
});

export type SpecificationSchema = z.infer<typeof SpecificationSchema>;