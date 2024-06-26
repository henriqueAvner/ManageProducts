import { Router, Request, Response } from 'express';
import { getAllProducts } from '../controllers/products.controller';

const products = Router()

products.get('/products', (req: Request, res: Response) => getAllProducts(req, res))


export default products;