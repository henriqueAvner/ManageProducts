import { productSchemaArray } from "../../../utils/zodSchema";


describe('#productSchemaArray', () => {

    it('Shoud return error with NaN on new_price', async () => {
        const data = [
            {
                product_code: '123',
                new_price: NaN
            }
        ]
        const result = productSchemaArray.safeParse(data);
        expect(result.success).toBeFalsy();
        if (!result.success) {
            expect(result.error).toBeDefined();

            expect(result.error.errors[1].message).toBe('Preço inválido')
        }
    });

    it('Shoud return error with string on new_price', async () => {
        const data = [
            {
                product_code: '123',
                new_price: '123'
            }
        ]
        const result = productSchemaArray.safeParse(data);
        expect(result.success).toBeFalsy();
        if (!result.success) {
            expect(result.error).toBeDefined();
            expect(result.error.errors[1].message).toBe('Preço inválido')
        }
    });
})

