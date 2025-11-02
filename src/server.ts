import express from 'express';
import mongoose from 'mongoose';
import type { Request, Response } from 'express';
import userRouter from './router/userRouter';
import publicFetchRouter from './router/publicFetchRouter';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();

const PORT = process.env.PORT || 8080;

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use('/api/user', userRouter);
app.use('/api/public', publicFetchRouter);


app.get('/healthCheck',(req: Request,res: Response) => {
    return res.json({
        msg : "server is running successfully"
    });
})

const options: any = {
    useUnifiedTopology: true
  };
  
const url : string | any = process.env.MONGO_URL;
mongoose.connect(url, options);

mongoose.connection.on("connected", function (ref: any) {
    console.log("connected to mongo server.");
});

app.listen(PORT, () => {
    console.log('Server started at ' + PORT);
});
