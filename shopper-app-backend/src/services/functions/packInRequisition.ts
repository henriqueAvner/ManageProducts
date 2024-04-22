import { DbProduct, NewValueType, PackType, Product } from "../../helpers/Types";

export async function processPackAsProduct(
    product: Product,
    allProducts: DbProduct[],
    allPacks: PackType[],
    resultPack: { status: string; error?: string; product?: NewValueType; pack?: NewValueType }[]
): Promise<void> {
    const packOfProducts = allPacks.filter((pack) => pack.pack_id === product.product_code);
    const productsInPack = packOfProducts.map((packItem) => {
        return allProducts.find((product) => product.code === packItem.product_id);
    });
    const packInProduct = allProducts.find((itemProduct) => itemProduct.code === product.product_code);

    if (productsInPack.length > 0) {
        const totalIncrease = product.new_price - (packInProduct?.sales_price ?? 0);

        productsInPack.forEach((productInPack) => {
            if (productInPack === undefined) return;
            const packItem = allPacks.find(item => item.product_id === productInPack.code);
            if (packItem) {
                const newPrice = parseFloat((Number(productInPack.sales_price) + totalIncrease).toFixed(2));
                resultPack.push({
                    status: 'success',
                    product: {
                        code: productInPack.code,
                        name: productInPack.name,
                        quantity: packItem.qty,
                        cost_price: productInPack.cost_price,
                        sales_price: productInPack.sales_price,
                        new_price: newPrice,
                    },
                });
            }
        });
    }
}