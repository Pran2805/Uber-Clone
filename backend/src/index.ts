import app from './app.ts'
import http from 'http'
import { Env } from './utils/Env.ts';
import { connectDB } from './db/index.ts';

import router from './routes/index.ts';
app.use("/api", router)

const server = http.createServer(app)
const port = Env.port || 5000

server.listen(port, ()=>{
    console.log("Server is running on port", port)
    connectDB()
});