import mongoose, { connect } from 'mongoose';




export const connectDB = async()=>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}`)
        console.log(`MongoDB Connected Successfully !! DB HOST : ${connectionInstance.connection.host}`.blue)
    } catch (error) {
        console.log("Mongodb connection failed!!", error);
        process.exit(1);
    }
}