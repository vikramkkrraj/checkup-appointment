import dotenv from 'dotenv'
import { app } from './app.js';
import { connectDB } from './db/index.js';


connectDB()
.then(() => {
    app.listen(process.env.PORT, ()=> {
        console.log(`server is listening at port ${process.env.PORT}`.bgYellow)
    })
}).catch((err) => {
    console.log("mongodb connection error", err);
})
