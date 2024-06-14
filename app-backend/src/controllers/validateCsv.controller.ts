import { Request, Response } from 'express';
import httpMapCode from '../utils/httpCodeMapper';
import csvReader from '../helpers/csvReader';
import { productSchemaArray } from '../utils/zodSchema';
import { validateCsvService } from '../services/validateCsv.service';
import path from 'path';


export const validateCsv = async (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(httpMapCode['BAD_REQUEST']).json({ message: 'Arquivo não enviado' });
    }

    const file = csvReader(req.file.path);

    if (path.extname(req.file.originalname) !== '.csv') {
        return res.status(httpMapCode['BAD_REQUEST']).json({ message: 'Arquivo inválido, envie um csv' });
    }

    const parse = productSchemaArray.safeParse(file);

    if (!parse.success) {
        let message = '';
        for (const role of file) {
            if (!role.new_price || !role.product_code) {
                message = 'Campos necessários inválidos, preencha corretamente';
            }
            if (role.new_price < 0 || role.product_code < 0) {
                message = 'Preço inválido';
            }
        }
        if (!message) {
            message = parse.error.errors[1].message;
        }

        return res.status(httpMapCode['BAD_REQUEST']).json({ message });
    }

    try {
        const result = await validateCsvService(req.file.path);
        return res.status(httpMapCode['SUCCESS']).json(result);
    } catch (error) {
        console.error('Erro ao validar CSV:', error);
        return res.status(httpMapCode['INTERNAL_SERVER_ERROR']).json({ message: 'Erro interno do servidor' });
    }
};