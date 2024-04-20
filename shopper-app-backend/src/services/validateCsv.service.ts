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
        const findCodePack = allPacks.find((pack: PackType) => pack.product_id === product.product_code); //aqui, a gente acha o pack que contém o produto enviado na requisição
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
            const findProductPack = allProducts.find((item: DbProduct) => item.code === findCodePack.pack_id) as DbProduct; //aqui a gente acha o pack que é um produto
            // console.log(findProductPack);

            const productsInPackage = allPacks.filter((item) => item.pack_id === findCodePack.pack_id); // o produto que está no pack
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

        //ENVIO DE PACOTE AO INVÉS DE PRODUTO:
        //baseando-se no pacote enviado na requisição (por exemplo 1020), preciso achar os produtos que compõem esse pacote:

        const packOfProducts = allPacks.filter((pack) => pack.pack_id === product.product_code);//achando o produtoo que é um pack através da requisição
        //essa variável retorna os produtos presentes no pack enviado na requisição:
        const productsInPack = packOfProducts.map((packItem) => {
            return allProducts.find((product) => product.code === packItem.product_id);

        });
        const packInProduct = allProducts.find((itemProduct) => itemProduct.code === product.product_code);//pack como produto

        // se a gente achou produtos que compoem o pack enviado na requisição (productsInPack), altera-se o valor do produto, baseado na porcentagem de mudança do valor do pack atual para o novo valor do pack vindo na requisição:
        if (productsInPack.length > 0) {
            // Calcula a porcentagem de alteração com base no novo preço do pacote e no preço de venda atual do pacote
            const percentage = ((product.new_price / (packInProduct?.sales_price ?? 1)) - 1) * 100;

            // Calcula o aumento total com base na porcentagem de alteração
            const totalIncrease = (packInProduct?.sales_price ?? 0) * (percentage / 100);

            // Calcula o aumento por produto
            const increasePerProduct = totalIncrease / productsInPack.length;

            productsInPack.forEach((productInPack) => {
                // Encontra o item do pacote específico para o produto atual
                if (productInPack === undefined) return;
                const packItem = allPacks.find(item => item.product_id === productInPack.code);
                if (packItem) {
                    // Calcula o novo preço do produto com base no aumento
                    const newPrice = parseFloat((Number(productInPack.sales_price) + Number(increasePerProduct)).toFixed(2));

                    result.push({
                        status: 'success',
                        product: {
                            code: productInPack.code,
                            name: productInPack.name,
                            quantity: packItem.qty, // Atualiza para refletir a quantidade do produto no pacote
                            cost_price: productInPack.cost_price,
                            sales_price: productInPack.sales_price,
                            new_price: newPrice, // Corrige o problema de arredondamento
                        },
                    });
                }
            });
        }




    }

    return [result, resultPack];
}

