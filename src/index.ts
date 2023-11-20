import express from 'express';

const app = express();
const port = process.env.PORT || 3001;

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
