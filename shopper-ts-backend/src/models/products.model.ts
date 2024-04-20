import connection from "../db";
import { DbProduct, ProductsType } from "../helpers/Types";

async function allProducts(): Promise<DbProduct[]> {
    const [products] = await connection.execute('SELECT * FROM products');
    return products as DbProduct[];
}

async function findProduct(code: number) {
    const [product] = await connection.execute('SELECT * FROM products WHERE code = ?', [code]);
    return product;
}

async function updateProduct(code: number, newPrice: number) {
    const [updated] = await connection.execute('UPDATE products SET sales_price = ? WHERE code = ?', [newPrice, code]);
    return updated;
}


export default {
    allProducts,
    findProduct,
    updateProduct,
}