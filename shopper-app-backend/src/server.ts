import express from 'express'
import products from './routes/products.router'
import csvRouter from './routes/validate.router'
import updateRouter from './routes/update.router'
import cors from 'cors';
const app = express()

app.use(cors())
app.use(express.json())

app.use(csvRouter)
app.use(products)
app.use(updateRouter)

const PORT = 3003

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))