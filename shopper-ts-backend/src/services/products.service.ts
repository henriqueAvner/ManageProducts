import productsModel from "../models/products.model";
import serviceResponse from "../utils/serviceResponse";

export async function allProducts() {
    const allProducts = await productsModel.allProducts();
    return { status: serviceResponse.SUCCESS, data: allProducts };
}