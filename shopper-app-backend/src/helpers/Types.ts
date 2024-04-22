
export type ProductsType = {
    products: Product[];

}

export type Product = {
    product_code: number;
    new_price: number;
}


export type NewValueType = {
    code: number;
    new_price: number;
    name: string;
    quantity?: number;
    sales_price: number;
    cost_price: number;
}


export type DbProduct = {
    new_price: number;
    code: number;
    name: string;
    quantity?: number;
    cost_price: number;
    sales_price: number;
}


export type PackType = {
    pack_id: number;
    product_id: number;
    qty: number;
}