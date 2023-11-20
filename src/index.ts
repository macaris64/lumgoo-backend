import dotenv from 'dotenv';
import express from 'express';
import {connectDB} from "./db";

import userRouter from './routes/user.routes';
import registerRouter from './routes/registration.routes';

dotenv.config();
const app = express();
const port = process.env.PORT || 3001;
connectDB();

app.use(express.json());
app.use('/api', userRouter);
app.use('/api', registerRouter);

app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

// Health Check Endpoint
app.get('/healthcheck', (req, res) => {
    const healthcheck = {
        uptime: process.uptime(),
        message: 'OK',
        timestamp: Date.now()
        // You can include more details here
    };
    res.status(200).json(healthcheck);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
