import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors())
const port = 3000;

app.get('/', (req, res) => {
  	console.log(`processing request`);
    res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

