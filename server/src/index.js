import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './utils/db.js';
import authRoutes from "./routes/authRoute.js";
import postRoutes from "./routes/postRoute.js";
 
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));

// Test route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Routes
app.use('/api/v1/users', authRoutes);
app.use('/api/v1/posts',postRoutes)

connectDB(process.env.MONGO_URI)
.then(()=>{
  app.listen(PORT, ()=> console.log(`Server is running on port ${PORT}`));
})
.catch((err)=> {
  console.error('MongoDB error', err);
  process.exit(1);
})
