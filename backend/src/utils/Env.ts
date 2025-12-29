import dotenv from 'dotenv'
dotenv.config({quiet: true})


export const Env = {
    port: process.env.PORT,
    dbUrl: process.env.DATABASE_URL,
    jwtSecret: process.env.JWT_SECRET || "something",
    NODE_ENV: "development"
}