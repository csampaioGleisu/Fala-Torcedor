const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { sequelize } = require('./src/models');
const equipeRoutes = require('./src/routes/equipeRoutes');
const torcedorRoutes = require('./src/routes/torcedorRoutes');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World')
}) 

// Definindo as rotas
app.use('/equipes', equipeRoutes);

app.use('/torcedores', torcedorRoutes);

sequelize.authenticate()
  .then(() => {
    console.log('Conexão com o banco de dados bem-sucedida!');
  })
  .catch((error) => {
    console.error('Não foi possível conectar ao banco de dados:', error);
  });



sequelize.sync({ alter: true })
  .then(() => {
    console.log('Banco sincronizado com sucesso');
    app.listen(3001, () => {
      console.log('Servidor rodando na porta 3001');
    });
  })
  .catch((error) => {
    console.error('Erro ao sincronizar banco:', error);
  });