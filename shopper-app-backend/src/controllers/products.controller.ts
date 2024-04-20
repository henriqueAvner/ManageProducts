import { allProducts } from '../services/products.service';
// import { updateDBService } from '../services/updateProduct.service';
import { Request, Response } from 'express';
import httpMapCode from '../utils/httpCodeMapper';


const getAllProducts = async (_req: Request, res: Response) => {
    const { status, data } = await allProducts();

    return res.status(httpMapCode[status]).json(data);

};

// const updatedProducts = async (req: Request, res: Response) => {
//     if (!req.file) {
//         return res.status(httpMapCode['BAD_REQUEST']).json({ message: 'Arquivo não enviado' });
//     }
//     const { path } = req.file;


//     const { status, data } = await updateDBService()
// };



export default {
    getAllProducts,
}