import z from 'zod';

export const productSchema = z.object({
    product_code: z.number().min(1, { message: 'Campos necessários não preenchidos' }),

    new_price: z.number().refine(value => value !== undefined && value !== null, {
        message: "Campos necessários não preenchidos",
    })
});

export const productSchemaArray = z.array(productSchema);

export type ProductType = z.infer<typeof productSchema>;
