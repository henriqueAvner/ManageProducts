import { Router, Request, Response } from 'express';
import productsController from '../controllers/products.controller';

const products = Router()

products.get('/', (req: Request, res: Response) => productsController.getAllProducts(req, res))


export default products;