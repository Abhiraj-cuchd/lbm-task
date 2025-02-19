import express, { Request, Response } from 'express';
import cors from 'cors';
import _config from './config/secrets';
import { connectDb } from './config/dbConnect';
import routes from './routes/index';


const app = express();

app.use(cors());
app.use(express.json());

connectDb();

app.use('/api/v1/', routes)


app.get('/health-check', (req:Request, res:Response) => {
    res.send('API is Running');
});



const startServer = () => {
    app.listen(_config.port, () => {
        console.log(`API is Running at port: ${_config.port} in ${_config.node_env} Environment`);
    });
}

startServer();