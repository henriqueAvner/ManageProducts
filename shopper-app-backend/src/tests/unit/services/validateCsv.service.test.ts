// validateCsvService.test.js
import { validateCsvService } from '../../../services/validateCsv.service';
import csvReader from '../../../helpers/csvReader';
import productsModel from '../../../models/products.model';
import packModel from '../../../models/pack.model';
import { processPackAsProduct } from '../../../services/functions/packInRequisition';
import { DbProduct, NewValueType, PackType, Product } from '../../../helpers/Types';

// Mockando os módulos para simular o ambiente de teste
jest.mock('../../../helpers/csvReader');
jest.mock('../../../models/products.model');
jest.mock('../../../models/pack.model');
jest.mock('../../../services/functions/packInRequisition');

describe('validateCsvService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const csvReaderMock = csvReader as jest.MockedFunction<typeof csvReader>;
    const allProductsMock = productsModel.allProducts as jest.MockedFunction<typeof productsModel.allProducts>;

    const allPacksMock = packModel.allPacks as jest.MockedFunction<typeof packModel.allPacks>;

    it('retorna erro quando o produto não é encontrado', async () => {
        // Configurar mocks

        csvReaderMock.mockReturnValue(
            [{
                product_code: 123,
                new_price: 100
            }
            ]);

        allProductsMock.mockResolvedValue([]);

        const [result] = await validateCsvService('test.csv');
        expect(result).toEqual([{ status: 'error', error: 'O produto 123 não foi encontrado!' }]);
    });

    it('retorna erro quando o preço de custo é inválido', async () => {
        // Configurar mocks
        csvReaderMock.mockReturnValue(
            [{ product_code: 123, new_price: 100 }]);

        allProductsMock.mockResolvedValue(
            [
                { code: 123, cost_price: 150, name: 'Produto 123', sales_price: 100, new_price: 100 }
            ]);

        const [result] = await validateCsvService('test.csv');
        expect(result).toEqual([{ status: 'error', error: 'Produto 123: Preço de custo inválido' }]);
    });

    it('retorna erro quando o reajuste de preço está fora do limite permitido', async () => {
        // Configurar mocks
        csvReaderMock.mockReturnValue(
            [{ product_code: 123, new_price: 17 }]);
        allProductsMock.mockResolvedValue(
            [{
                code: 123,
                cost_price: 13,
                name: 'Produto 123',
                sales_price: 15,
                new_price: 17
            }]);

        const [result] = await validateCsvService('test.csv');
        expect(result).toEqual([{ status: 'error', error: 'O reajuste deve ser de no máximo 10%, e o produto 123 não corresponde a esse ajuste' }]);
    });

    it('processa produtos corretamente', async () => {
        // Configurar mocks
        csvReaderMock.mockReturnValue(
            [{ product_code: 34, new_price: 25 }]);

        allProductsMock.mockResolvedValue([
            {
                code: 34,
                cost_price: 22,
                name: 'Produto 340',
                sales_price: 24.90,
                new_price: 25
            }
        ]);

        allPacksMock.mockResolvedValue(
            [{ product_id: 34, pack_id: 43, qty: 1 }]);

        const [result, resultPack] = await validateCsvService('test.csv');
        expect(result).toEqual(
            [{
                status: 'success',
                product: {
                    code: 34,
                    name: 'Produto 340',
                    quantity: 1,
                    cost_price: 22,
                    sales_price: 24.90,
                    new_price: 25
                }
            }]);
        expect(resultPack).toEqual([]);
        expect(result.length).toBe(1);
    });
    // it('Processa um produto que é parte de um pack', async () => {
    //     // Mock data
    //     const csvData = [
    //         { product_code: 1, new_price: 100 }, // Produto principal
    //         { product_code: 2, new_price: 50 }, // Produto no pacote
    //     ];

    //     const allProducts: DbProduct[] = [
    //         { code: 1, name: 'Product 1', cost_price: 50, sales_price: 75, quantity: 1, new_price: 82 }, // 8% de aumento
    //         { code: 2, name: 'Product 2', cost_price: 30, sales_price: 45, quantity: 1, new_price: 47.20 }, // 8% de aumento
    //     ];

    //     const allPacks = [
    //         { pack_id: 1, product_id: 1, qty: 2 },
    //         { pack_id: 1, product_id: 2, qty: 1 },
    //     ];

    //     // Configurar mocks
    //     csvReaderMock.mockReturnValue(csvData);
    //     allProductsMock.mockResolvedValue(allProducts);
    //     allPacksMock.mockResolvedValue(allPacks);

    //     // Chamar a função
    //     const [result, resultPack] = await validateCsvService('test.csv');
    //     console.log(result);


    //     // Verificar se o produto principal foi processado corretamente
    //     expect(result).toContainEqual(
    //         [
    //             {
    //                 status: 'error',
    //                 error: 'O reajuste deve ser de no máximo 10%, e o produto 1 não corresponde a esse ajuste'
    //             },
    //             {
    //                 status: 'error',
    //                 error: 'O reajuste deve ser de no máximo 10%, e o produto 2 não corresponde a esse ajuste'
    //             }
    //         ]
    //     );

    //     // Verificar se o produto no pacote foi processado corretamente
    //     expect(resultPack).toContainEqual({
    //         status: 'success',
    //         product: {
    //             code: 2,
    //             name: 'Product 2',
    //             quantity: 1,
    //             cost_price: 30,
    //             sales_price: 45,
    //             new_price: 47.20, // 8% de aumento
    //         },
    //     });
    // });


});
