import express from 'express';
import dotenv from 'dotenv'
import cors from 'cors';
import cookieParser from 'cookie-parser';
import colors from 'colors'
import morgan from 'morgan';



const app = express();

dotenv.config({
    path : "./config/.env"
})

app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials : true,
}))



app.use(express.json());
app.use(express.urlencoded({ extended : true }))
app.use(express.static("public"))
app.use(cookieParser()); 
app.use(morgan('dev'));

// routes
import userRouter from './routes/user.routes.js';
import appointmentRouter from './routes/appointment.routes.js';
import messageRouter from './routes/message.routes.js';


app.use('/api/v1/user/', userRouter);
app.use('/api/v1/appointment', appointmentRouter);
app.use('/api/v1/message', messageRouter);

export { app }