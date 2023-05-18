import express from 'express';
import authRoute  from "./routes/auth" 
import connectDB from "./config/dbCon";

import massageRoute  from "./routes/massage" 

var cors = require('cors') 
const app = express();
const port = 3850;
import cookieParser from 'cookie-parser';

import fileupload from "express-fileupload";
import { IUser } from './model/User';
import path from 'path';

const allowedOrigins = ["https://saraha-4070.onrender.com"]

const corsOptions = {
    origin: (origin:any, callback:any) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
}




connectDB()

app.use(cors(corsOptions));
app.use(fileupload());

app.use(express.json())

app.use(cookieParser())

app.use('/', express.static(path.join(__dirname, 'public')))

app.use('/', require('./routes/root'))


app.use('/auth',authRoute)
app.use('/massage',massageRoute)

app.use(express.static('public'))



app.listen(port, () => {
    console.log(`Timezones by location application is  on port ${port}.`);
});



declare global {
    namespace Express {
      interface Request {
        userInfo:IUser | null
      }
    }
}