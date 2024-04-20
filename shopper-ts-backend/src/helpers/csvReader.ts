import fs from 'fs';
import path from 'path';
import { ProductType } from '../utils/zodSchema';


function csvReader(filePath: string): ProductType[] {

    const errors = [];


    const file = fs.readFileSync(filePath, 'utf8');
    if (!fs.existsSync(filePath)) {
        errors.push({ error: 'Arquivo não encontrado!' });
    }


    const prices = file.split(/\r?\n/).slice(1).map(line => {
        if (line.trim() === '') {
            return null as unknown as ProductType;
        }
        const [product_code, new_price] = line.split(',');
        if (!product_code || !new_price) {
            errors.push({ error: 'Preencha os campos corretamente!' });
        }
        return {
            product_code: parseInt(product_code),
            new_price: parseFloat(new_price)
        };
    }).filter(item => item !== null);

    if (errors.length > 0) {
        return errors as unknown as ProductType[];
    }
    return prices;

}

export default csvReader;

