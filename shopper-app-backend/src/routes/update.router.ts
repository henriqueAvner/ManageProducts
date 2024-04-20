import { Router, Request, Response } from 'express';
import multer from 'multer';
import { storage } from '../helpers/multerConfig';
import { updatedProducts } from '../controllers/products.controller';


const updateRouter = Router()

const upload = multer({ storage: storage })

updateRouter.put('/updatecsv', upload.single('file'), (req: Request, res: Response) => updatedProducts(req, res))



export default updateRouter;