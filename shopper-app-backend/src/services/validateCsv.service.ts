import csvReader from "../helpers/csvReader";
import productsModel from '../models/products.model';
import { NewValueType, DbProduct, PackType } from "../helpers/Types";
import packModel from "../models/pack.model";
import { processPackAsProduct } from "./functions/packInRequisition";

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
            result.push({ status: 'error', error: `Produto ${product.product_code}: Preço de custo inválido` });
            continue;
        }
        const productCost = findProduct.sales_price;
        const maxPrice = productCost * 1.1;
        const minPrice = productCost * 0.9;
        if (product.new_price < minPrice || product.new_price > maxPrice) {
            result.push({ status: 'error', error: `O reajuste deve ser de no máximo 10%, e o produto ${product.product_code} não corresponde a esse ajuste` });
            continue;
        }
        const packOfProductReq = allPacks.find((pack: PackType) => pack.product_id === product.product_code);

        if (product.product_code < 999) {
            result.push({
                status: 'success',
                product: {
                    code: findProduct.code,
                    name: findProduct.name,
                    quantity: packOfProductReq?.qty,
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
        if (packOfProductReq) {
            const packAsProduct = allProducts.find((item: DbProduct) => item.code === packOfProductReq.pack_id) as DbProduct;

            const productsInPackage = allPacks.filter((item) => item.pack_id === packOfProductReq.pack_id);
            //novo preço do pacote baseado no produto da requisição
            let newPricePack = 0;
            productsInPackage.forEach((packItem) => {
                const productInPackage = allProducts.find((item) => item.code === packItem.product_id);

                if (productInPackage) {
                    const priceToUse = productInPackage.code === product.product_code ? product.new_price : productInPackage.sales_price;
                    newPricePack += priceToUse * packItem.qty;
                }
            });
            if (packAsProduct && !processedProducts.has(packAsProduct.code)) {
                resultPack.push({
                    status: 'success',
                    pack: {
                        code: packAsProduct.code,
                        name: packAsProduct.name,
                        cost_price: packAsProduct.cost_price,
                        quantity: packOfProductReq.qty * (productsInPackage.length),
                        sales_price: packAsProduct.sales_price,
                        new_price: newPricePack,
                    },
                });
                processedProducts.add(packAsProduct.code);
            }
        }
        await processPackAsProduct(product, allProducts, allPacks, resultPack);
    }
    return [result, resultPack];
}