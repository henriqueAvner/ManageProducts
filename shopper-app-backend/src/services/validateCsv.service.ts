import csvReader from "../helpers/csvReader";
import productsModel from '../models/products.model';
import { NewValueType, DbProduct, PackType } from "../helpers/Types";
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
<<<<<<< HEAD

        const findProduct = allProducts.find((item: DbProduct) => item.code === product.product_code);
=======
        if (product.product_code < 999) {
            const findProduct = allProducts.find((item: DbProduct) => item.code === product.product_code);
>>>>>>> main

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

<<<<<<< HEAD
        const findCodePack = allPacks.find((item: PackType) => item.product_id === product.product_code);
        // console.log(findCodePack);

        if (product.product_code < 999) {
            result.push({
                status: 'success',
                product: {
                    code: findProduct.code,
                    name: findProduct.name,
                    quantity: findCodePack?.qty,
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


        if (findCodePack) {
            const findProductPack = allProducts.find((item: DbProduct) => item.code === findCodePack.pack_id) as DbProduct;
            // console.log(findProductPack);

            const productsInPackage = allPacks.filter((item) => item.pack_id === findCodePack.pack_id);
            // console.log(productsInPackage);

            // Lógica para calcular o novo preço do pacote
            let totalNewPrice = 0;
            productsInPackage.forEach((packItem) => {
                const productInPackage = allProducts.find((item) => item.code === packItem.product_id);
                // console.log(productInPackage);

                if (productInPackage) {
                    // Aqui, estamos assumindo que o 'new_price' fornecido no CSV é aplicado ao produto atual
                    // e que queremos usar esse valor para calcular o novo preço do pacote.
                    // Se o produto atual é o que tem o 'new_price' fornecido, usamos esse valor.
                    // Caso contrário, usamos o preço de venda atual do produto.
                    const priceToUse = productInPackage.code === product.product_code ? product.new_price : productInPackage.sales_price;
                    // console.log('priceToUse', priceToUse);

                    totalNewPrice += priceToUse * packItem.qty;
                }
=======
            const findCodePack = allPacks.find((item: PackType) => item.product_id === product.product_code);
            // console.log(findCodePack);


            result.push({
                status: 'success',
                product: {
                    code: findProduct.code,
                    name: findProduct.name,
                    quantity: findCodePack?.qty,
                    cost_price: findProduct.cost_price,
                    sales_price: findProduct.sales_price,
                    new_price: product.new_price,
                },
>>>>>>> main
            });

            if (findCodePack) {
                const findProductPack = allProducts.find((item: DbProduct) => item.code === findCodePack.pack_id) as DbProduct;
                // console.log(findProductPack);

                const productsInPackage = allPacks.filter((item) => item.pack_id === findCodePack.pack_id);
                // console.log(productsInPackage);

                // Lógica para calcular o novo preço do pacote
                let totalNewPrice = 0;
                productsInPackage.forEach((packItem) => {
                    const productInPackage = allProducts.find((item) => item.code === packItem.product_id);
                    // console.log(productInPackage);

                    if (productInPackage) {
                        // Aqui, estamos assumindo que o 'new_price' fornecido no CSV é aplicado ao produto atual
                        // e que queremos usar esse valor para calcular o novo preço do pacote.
                        // Se o produto atual é o que tem o 'new_price' fornecido, usamos esse valor.
                        // Caso contrário, usamos o preço de venda atual do produto.
                        const priceToUse = productInPackage.code === product.product_code ? product.new_price : productInPackage.sales_price;
                        // console.log('priceToUse', priceToUse);

                        totalNewPrice += priceToUse * packItem.qty;
                    }
                });
                // Adiciona o novo preço calculado ao pacote
                if (!processedProducts.has(findProductPack.code)) {
                    resultPack.push({
                        status: 'success',
                        pack: {
                            code: findProductPack.code,
                            name: findProductPack.name,
                            cost_price: findProductPack.cost_price,
                            quantity: findCodePack.qty * (productsInPackage.length),
                            sales_price: findProductPack.sales_price,
                            new_price: totalNewPrice,
                        },
                    });
                    processedProducts.add(findProductPack.code);
                }
            }
        }
<<<<<<< HEAD
        //baseando-se no pacote enviado na requisição (por exemplo 1020), preciso achar os produtos que compõem esse pacote:
        const packOfProducts = allPacks.filter((pack) => pack.pack_id === product.product_code);
        //essa variável retorna os produtos presentes no pack enviado na requisição:
        const productsInPack = packOfProducts.map((packItem) => {
            return allProducts.find((product) => product.code === packItem.product_id);

        });
        const packInProduct = allProducts.find((itemProduct) => itemProduct.code === product.product_code);


        // se a gente achou produtos que compoem o pack enviado na requisição (productsInPack), altera-se o valor do produto, baseado na porcentagem de mudança do valor do pack atual para o novo valor do pack vindo na requisição:
        if (productsInPack.length > 0) {
            productsInPack.forEach((productInPack) => {
                const percentage = ((product.new_price / (packInProduct?.sales_price ?? 1)) - 1) * 100;
                const aument = Number(productInPack?.sales_price ?? 0) * (percentage / 100);
                const newPrice = parseFloat((Number(productInPack?.sales_price ?? 0) + aument).toFixed(2));

                result.push({
                    status: 'success',
                    pack: {
                        code: productInPack?.code ?? 0,
                        name: productInPack?.name ?? '',
                        quantity: packInProduct?.quantity, // deve retornar a quantidade do produto no pack se existir
                        cost_price: productInPack?.cost_price ?? 0,
                        sales_price: productInPack?.sales_price ?? 0,
                        new_price: newPrice //deve retornar o novo preço do produto com a lógica implementada, da maneira correta
                    },
                });
            });
        }



=======
>>>>>>> main

    }
    return [result, resultPack];
}