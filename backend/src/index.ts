import express from 'express';
import dotenv from 'dotenv'
import userRoutes from './routes/user.route'
import authRoutes from './routes/auth.route'
import adminRoutes from './routes/admin.route'
import statsRoutes from './routes/stats.route'
import albumsRoutes from './routes/album.route'
import songRoutes from './routes/song.route'
import { connectDb } from './lib/db';
import { clerkMiddleware } from '@clerk/express';
import fileUpload from 'express-fileupload';
import path from 'path';
import { fileURLToPath } from 'url';
import { Response, NextFunction, Request } from 'express';
import cors from 'cors';

dotenv.config()
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = process.env.PORT
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}))

app.use(express.json()) // Middleware to parse JSON request bodies (req.body)

app.use(clerkMiddleware())
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, 'tmp'),
    createParentPath: true,
    limits: {
        fileSize: 10 * 1024 * 1024 // 100 MB limit
    }
}))

app.use("/api/users", userRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/albums", albumsRoutes)
app.use("/api/stats", statsRoutes)
app.use("/api/songs", songRoutes)

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Unhandled error:', error);
    const message = process.env.NODE_ENV === 'production' ? 'Internal Server Error' : error.message;
    res.status(500).json({ message: message });
})

app.listen(port, () => {
    console.log(`Server is running on port 234 ${port}`)
    connectDb()
}) 
