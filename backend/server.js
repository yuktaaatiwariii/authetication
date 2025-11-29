
import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './Db/connectDB.js';
import authRoutes from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));//to allow frontend to access backend

app.use(express.json());//to get values for functions from req.body
app.use(cookieParser());

// routes
app.use('/auth', authRoutes);

if (process.env.NODE_ENV === 'production') {
   const frontendPath = path.resolve(__dirname, 'frontend', 'dist');

    // Escape backslashes for Windows so Express doesn't parse them
    const safePath = frontendPath.replace(/\\/g, '/');

    app.use(express.static(safePath));

    app.get('*', (req, res) => {
        res.sendFile(path.join(safePath, 'index.html'));
    });
}


app.listen(PORT, () => {
    connectDB();
    console.log("Server is running on port :", PORT);
});


