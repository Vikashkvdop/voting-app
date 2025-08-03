import express from'express'
import cors from 'cors'


import connect from './config/Database.js'; 

import { notFound, errorHandler } from'./middleware/errorMiddleware.js'
import router from './routes/Routes.js'
import upload from 'express-fileupload'

import dotenv from 'dotenv';
import path from 'path';
dotenv.config();


const __dirname=path.resolve();

const app=express()
app.use(express.json({extended:true}))
app.use(express.urlencoded({extended:true}))
app.use(cors({credentials:true,origin:["http://localhost:5173"]}))

app.use(upload())



//routers
app.use('/api',router);

//error handlers
app.use(notFound)
app.use(errorHandler)

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "./client/dist")));
  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, "./client/dist", "index.html"));
  });
}


//connect database
connect();




app.listen(process.env.PORT,()=>console.log(`Server started at ${process.env.PORT}`))