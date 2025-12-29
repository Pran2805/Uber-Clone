import express, { urlencoded } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'

const app = express()

app.use(cors())
app.use(express.json())
app.use(urlencoded({ extended: true }))
app.use(helmet())
app.use(morgan(':method :url :status :response-time ms'))


export default app
