import connection from '../../../db';
import { PackType } from '../../../helpers/Types';
import packModel from '../../../models/pack.model';

// Mock the entire 'db' module
jest.mock('../../../db');

const mockExecute = connection.execute as jest.Mock;

describe('MODEL allPacks', () => {
    it('Deve retornar todos os packs', async () => {
        const mockPack: PackType[] = [
            { product_id: 1, pack_id: 1000, qty: 2 },
            { product_id: 1, pack_id: 1010, qty: 6 },
            { product_id: 2, pack_id: 1020, qty: 2 },
        ];

        mockExecute.mockResolvedValueOnce([mockPack, {}]);

        const result = await packModel.allPacks();

        expect(mockExecute).toHaveBeenCalledWith('SELECT * FROM packs');
        expect(result).toEqual(mockPack);
    });
});