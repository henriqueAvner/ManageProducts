import csvReader from "../helpers/csvReader";
import productsModel from '../models/products.model';
import { NewValueType, DbProduct, PackType, Product } from "../helpers/Types";
import packModel from "../models/pack.model";

export const validateCsvService = async (csvFile: string) => {
    const csvFormater = csvReader(csvFile);
    const allProducts = await productsModel.allProducts();
    const allPacks = await packModel.allPacks();

    const processedProducts = new Set<number>();

    const result: {
        status: string, error?: string, product?: NewValueType, pack?: NewValueType
    }[] = [];

    const resultPack: {
        status: string, error?: string, product?: NewValueType, pack?: NewValueType
    }[] = [];
    for await (const product of csvFormater) {
        const findProduct = allProducts.find((item: DbProduct) => item.code === product.product_code);

        if (!findProduct) {
            result.push({ status: 'error', error: `O produto ${product.product_code} não foi encontrado!` });
            continue;
        }

        if (product.new_price < findProduct.cost_price) {
            result.push({ status: 'error', error: `Produto ${product.product_code}: price de custo inválido` });
            continue;
        }

        const productCost = findProduct.sales_price;
        const maxPrice = productCost * 1.1;
        const minPrice = productCost * 0.9;
        if (product.new_price < minPrice || product.new_price > maxPrice) {
            result.push({ status: 'error', error: `O reajuste deve ser de no máximo 10%, e o produto ${product.product_code} não corresponde a esse ajuste` });
            continue;
        }

        const ProductInPack = allPacks.find((item: PackType) => item.product_id === product.product_code);
        const findPackInReq = csvFormater.find((item: Product) => item.product_code === ProductInPack?.pack_id);

        if (ProductInPack && !findPackInReq) {
            result.push({ status: 'error', error: `O produto ${product.product_code} pertence a um pacote e o pacote não foi enviado!` });
            continue;
        }

        const findPackDB = allPacks.find((item: PackType) => item.pack_id === product.product_code);
        const productInPack = csvFormater.find((item: Product) => item.product_code === findPackDB?.product_id);

        if (findPackDB && !productInPack) {
            result.push({ status: 'error', error: `O pacote ${product.product_code} foi enviado, mas não há nenhum produto dele na requisição!` });
            continue;
        }

        if (ProductInPack && findPackInReq) {

            const otherProductInPack = allPacks.filter((pack: PackType) => pack.pack_id === findPackInReq?.product_code && pack.product_id !== ProductInPack?.product_id);

            const otherProductPrice = otherProductInPack.map((item: PackType) => {
                return allProducts.find((product: DbProduct) => product.code === item.product_id)?.sales_price;
            })

            const price = Number(otherProductPrice.reduce((acc, item) => (acc ?? 0) + (item ?? 0), 0));
            const packPrice = Number(findPackInReq?.new_price);
            const qtyInPack = Number(ProductInPack?.qty);
            const produtoprice = Number((product.new_price * qtyInPack));
            const secondPPrice = price * qtyInPack;

            if (Number((packPrice - produtoprice).toFixed(2)) !== secondPPrice) {
                result.push({ status: 'error', error: `O price do pacote ${product.product_code} não corresponde ao price dos produtos que o compõem` });
                continue;
            }
        }
        if (product.product_code < 999) {
            processedProducts.add(product.product_code);
            result.push({
                status: 'success',
                product: {
                    code: findProduct.code,
                    name: findProduct.name,
                    cost_price: findProduct.cost_price,
                    sales_price: findProduct.sales_price,
                    new_price: product.new_price,
                },
            });
        } else {
            resultPack.push({
                status: 'success',
                pack: {
                    code: findProduct.code,
                    name: findProduct.name,
                    cost_price: findProduct.cost_price,
                    sales_price: findProduct.sales_price,
                    new_price: product.new_price,
                },
            });
        }
    }
    return resultPack.length === 0 ? [result] : [result, resultPack];
}