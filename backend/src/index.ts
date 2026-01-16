import express from 'express';
import dotenv from 'dotenv'
import userRoutes from './routes/user.route'
import authRoutes from './routes/auth.route'
import adminRoutes from './routes/admin.route'
import statsRoutes from './routes/stats.route'
import albumsRoutes from './routes/album.route'
import { connectDb } from './lib/db';


dotenv.config()
const app = express();
const port = process.env.PORT
app.use(express.json()) // Middleware to parse JSON request bodies (req.body)

app.use("/api/users", userRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/albums", albumsRoutes)
app.use("/api/stats", statsRoutes)

app.listen(port, () => {
    console.log(`Server is running on port 234 ${port}`)
    connectDb()
})