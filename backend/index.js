const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();

app.get('/', (req, res) => {
    res.send('Hello World')
})


app.use(express.json());
app.listen(3001, () => {
    console.log('Servidor rodando na porta 3001');
});
