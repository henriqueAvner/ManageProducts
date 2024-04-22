import productsModel from '../../../models/products.model';
import connection from '../../../db';

// Mock the entire 'db' module
jest.mock('../../../db');

const mockExecute = connection.execute as jest.Mock;

describe('MODEL allProducts', () => {
    it('Deve retornar todos os dados da tabela', async () => {
        mockExecute.mockResolvedValue([
            [
                { id: 1, name: 'Product 1' },
                { id: 2, name: 'Product 2' },
                { id: 3, name: 'Product 3' },
                { id: 4, name: 'Product 4' },
                { id: 5, name: 'Product 5' }
            ],
            {}
        ]);

        const result = await productsModel.allProducts();

        expect(mockExecute).toHaveBeenCalledWith('SELECT * FROM products');
        expect(result).toHaveLength(5);
        expect(result[0]).toEqual({ id: 1, name: 'Product 1' });
        expect(result[1]).toEqual({ id: 2, name: 'Product 2' });
    });
    it('Deve chamar a função update para atualizar um produto', async () => {
        mockExecute.mockResolvedValueOnce(
            [
                [{ id: 1, name: 'Product 1', sales_price: 10 }]
            ]
        );
        const curr_product = await productsModel.updateProduct(1, 20);

        expect(mockExecute).toHaveBeenCalledWith('UPDATE products SET sales_price = ? WHERE code = ?', [20, 1]);
        expect(curr_product).toHaveLength(1);
    });
});