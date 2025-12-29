import mongoose from 'mongoose'
import { Env } from '../utils/Env.ts'

export const connectDB = async() =>{
    try {
        const connection = await mongoose.connect(Env.dbUrl as string)
        console.log("DB Connected !! :",connection.connection.host)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}