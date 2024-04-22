import { allProducts } from '../../../services/products.service';
import productsModel from '../../../models/products.model';
import serviceResponse from '../../../utils/serviceResponse';

describe('SERVICE allProducts', () => {
    it('Deve retornar todos os produtos', async () => {
        const mockProducts = [{
            new_price: 19.30,
            code: 5,
            name: 'ARROZ',
            cost_price: 15.10,
            sales_price: 19,
        },
        {
            new_price: 5.30,
            code: 5,
            name: 'PAPEL ALUMÍNIO',
            cost_price: 3.50,
            sales_price: 5.00,
        }];
        jest.spyOn(productsModel, 'allProducts').mockResolvedValue(mockProducts);
        const result = await allProducts();
        expect(result).toEqual({ status: serviceResponse.SUCCESS, data: mockProducts });
        expect(productsModel.allProducts).toHaveBeenCalled();
    });
});



