import { Router, Request, Response } from 'express';
import multer from 'multer';
import { storage } from '../helpers/multerConfig';
import { validateCsv } from '../controllers/validateCsv.controller';


const csvRouter = Router()

const upload = multer({ storage: storage })

csvRouter.post('/readcsv', upload.single('file'), (req: Request, res: Response) => validateCsv(req, res))



export default csvRouter;