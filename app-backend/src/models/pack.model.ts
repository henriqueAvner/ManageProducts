import connection from "../db";
import { PackType } from "../helpers/Types";

async function allPacks() {
    const [allPacks] = await connection.execute('SELECT * FROM packs');
    return allPacks as PackType[];

};

export default {
    allPacks,
};