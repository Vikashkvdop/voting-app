import express from 'express';
import cors from 'cors';
import connect from './config/Database.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import router from './routes/Routes.js';
import upload from 'express-fileupload';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const __dirname = path.resolve();
const app = express();

// Parse request bodies
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));

// Handle CORS for both dev and prod
const allowedOrigins = [
  'http://localhost:5173',
  'https://voting-app-dglk.onrender.com'
];
app.use(cors({ credentials: true, origin: allowedOrigins }));

// File uploads
app.use(upload());

// API routes
app.use('/api', router);

//  Serve frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));

  // Only handle non-API routes
  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, "../client", "dist", "index.html"));
  });
}

// These must come LAST
app.use(notFound);
app.use(errorHandler);

// Connect to DB and start server
connect();
app.listen(process.env.PORT, () =>
  console.log(`Server started at ${process.env.PORT}`)
);
