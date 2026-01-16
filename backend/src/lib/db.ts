import mongoose from "mongoose"

export const connectDb = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI as string)
        console.log(`MongoDB connected: ${conn.connection.host}`)
    }
    catch (error) {
        process.exit(1)
        console.error("Error connecting to database", error)
    }
}