import connection from "../db";
import { PackType } from "../helpers/Types";

async function allPacks() {
    const [allPacks] = await connection.execute('SELECT * FROM packs');
    return allPacks as PackType[];

};

async function findPack(product_id: number) {
    const [pack] = await connection.execute('SELECT * FROM packs WHERE product_id = ?', [product_id]);
    return pack as PackType[];
}

export default {
    allPacks,
    findPack,
}