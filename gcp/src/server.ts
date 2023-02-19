import express, { Express, Request, Response } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { addSessionToQueue } from './utils/mq'

dotenv.config();


const app: Express = express();
const port = process.env.PORT || 5000;


// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(cors())

app.get('/', (req: Request, res: Response) => {
    res.send('fylat backend')
})

app.post('/mq/session/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const sessionJob = await addSessionToQueue({ sessionId: id });
        console.log({ sessionJob })
        return res.status(200).json({ done: true })
    } catch (err) {
        console.error(err);
        return res.status(500).json({ done: false })
    }
})


app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})