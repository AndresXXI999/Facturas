import express from 'express';
const app = express();

app.use(express.json()); //middleware?

//routes
app.get('/', (req, res) => {
    res.send('Facturas project'); //single quotes
});

export default app;
