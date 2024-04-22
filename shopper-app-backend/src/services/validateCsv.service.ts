import csvReader from "../helpers/csvReader";
import productsModel from '../models/products.model';
import { NewValueType, DbProduct, PackType, Product } from "../helpers/Types";
import packModel from "../models/pack.model";
import { processPackAsProduct } from "./functions/packInRequisition";

export const validateCsvService = async (csvFile: string) => {
    const csvFormater = csvReader(csvFile);
    const allProducts = await productsModel.allProducts();
    const allPacks = await packModel.allPacks();

    const processedProducts = new Set<number>();
    const processedPacks = new Set<number>();

    const result: {
        status: string, error?: string, product?: NewValueType, pack?: NewValueType
    }[] = [];

    const resultPack: {
        status: string, error?: string, product?: NewValueType, pack?: NewValueType
    }[] = [];
    for await (const product of csvFormater) {
        // Procurando os produtos dentro do banco de dados
        const findProduct = allProducts.find((item: DbProduct) => item.code === product.product_code);

        // Se não achar, retorna um erro
        if (!findProduct) {
            result.push({ status: 'error', error: `O produto ${product.product_code} não foi encontrado!` });
            continue;
        }
        // Se o novo preço for menor que o preço de custo, retorna um erro
        if (product.new_price < findProduct.cost_price) {
            result.push({ status: 'error', error: `Produto ${product.product_code}: Preço de custo inválido` });
            continue;
        }
        // Se o novo preço for maior que o preço de venda, retorna um erro
        const productCost = findProduct.sales_price;
        const maxPrice = productCost * 1.1;
        const minPrice = productCost * 0.9;
        if (product.new_price < minPrice || product.new_price > maxPrice) {
            result.push({ status: 'error', error: `O reajuste deve ser de no máximo 10%, e o produto ${product.product_code} não corresponde a esse ajuste` });
            continue;
        }

        //se for enviado um produto que pertennce a um pacote na requisição, mas o pacote nao foi enviado, retorna um erro:
        const produtoqueestaemumpacote = allPacks.find((item: PackType) => item.product_id === product.product_code);
        // console.log(produtoqueestaemumpacote);
        const algumpacoteenviado = csvFormater.find((item: Product) => item.product_code === produtoqueestaemumpacote?.pack_id);

        //verificamos se o produto da requisição está em um pacote, e se o pacote que ele está foi enviado na requisição
        if (produtoqueestaemumpacote && !algumpacoteenviado) {
            result.push({ status: 'error', error: `O produto ${product.product_code} pertence a um pacote e o pacote não foi enviado!` });
            continue;
        }

        //se for enviado um pacote na requisição, mas nao foi enviado nenhum produto que pertence a ele, retorna um erro:




        if (product.product_code < 999) {
            processedProducts.add(product.product_code);
            result.push({
                status: 'success',
                product: {
                    code: findProduct.code,
                    name: findProduct.name,
                    // quantity: packOfProductReq?.qty,
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


    return [result, resultPack];
}
