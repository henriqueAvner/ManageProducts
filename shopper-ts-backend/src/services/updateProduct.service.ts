import { NewValueType } from "../helpers/Types";
import csvReader from "../helpers/csvReader";
import productsModel from "../models/products.model";
import serviceResponse from "../utils/serviceResponse";
import { validateCsvService } from "./validateCsv.service";

export async function updateDBService(code: number, csvFile: string) {
    const [result, resultPack] = await validateCsvService(csvFile);

    for (const product of result) {
        const newPrice = product.product?.new_price;
        const productCode = product.product?.code;
        if (newPrice && productCode === code) {
            await productsModel.updateProduct(code, newPrice);
        }
    }
    for (const pack of resultPack) {
        const newPrice = pack.pack?.new_price;
        const codePack = pack.pack?.code;
        if (newPrice && codePack === code) {
            await productsModel.updateProduct(code, newPrice);
        }
    }

    return { status: serviceResponse.SUCCESS, data: { message: 'Preços atualizados com sucesso' } };
}