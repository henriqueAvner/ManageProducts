import { allProducts } from '../services/products.service';
import { updateDBService } from '../services/updateProduct.service';
import { Request, Response } from 'express';
import httpMapCode from '../utils/httpCodeMapper';


export const getAllProducts = async (_req: Request, res: Response) => {
    const { status, data } = await allProducts();

    return res.status(httpMapCode[status]).json(data);

};

export const updatedProducts = async (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(httpMapCode['BAD_REQUEST']).json({ message: 'Arquivo não enviado' });
    }

    try {
        const result = await updateDBService(req.file.path);
        return res.status(httpMapCode['SUCCESS']).json(result);
    } catch (error) {
        console.error('Erro ao validar CSV:', error);
        return res.status(httpMapCode['INTERNAL_SERVER_ERROR']).json({ message: 'Erro interno do servidor' });
    }
};

