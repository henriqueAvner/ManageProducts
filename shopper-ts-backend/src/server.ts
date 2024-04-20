import express from 'express'
import products from './routes/products.router'
import csvRouter from './routes/validate.router'
const app = express()

app.use(express.json())

app.use(csvRouter)
app.use(products)

const PORT = 3003

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))