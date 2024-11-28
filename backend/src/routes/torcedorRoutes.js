const express = require('express');
const Torcedor = require('../models/Torcedor');
const Equipe = require('../models/Equipe')
const router = express.Router();
const  Sequelize = require('sequelize'); 
const { Op } = require('sequelize');

// Criar um novo torcedor
router.post('/', async (req, res) => {
  try {
    const { nome, dataNascimento, tempoFiliacao, equipeNome } = req.body;

    
    if (!nome || !dataNascimento || !tempoFiliacao || !equipeNome) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    
    const equipe = await Equipe.findOne({ where: { nome: equipeNome } });
    if (!equipe) {
      return res.status(404).json({ error: 'Equipe não encontrada' });
    }

   
    const torcedor = await Torcedor.create({
      nome,
      dataNascimento,
      tempoFiliacao,
      equipe_Id: equipe.id,
    });

    res.status(201).json(torcedor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Criar múltiplos torcedores
router.post('/grupo', async (req, res) => {
  try {
    const torcedoresData = req.body; // Recebe os torcedores como um array no corpo da requisição
    
    if (!Array.isArray(torcedoresData) || torcedoresData.length === 0) {
      return res.status(400).json({ error: 'O corpo da requisição deve ser um array de torcedores' });
    }

    // Obter as equipes de uma vez usando os nomes fornecidos
    const equipes = await Equipe.findAll({
      where: {
        nome: torcedoresData.map(torcedor => torcedor.equipeNome) // Obtém todos os nomes de equipe
      }
    });

    // Verifica se todas as equipes foram encontradas
    const equipeNomes = equipes.map(equipe => equipe.nome);
    const torcedoresComEquipeInvalida = torcedoresData.filter(torcedor => !equipeNomes.includes(torcedor.equipeNome));
    
    if (torcedoresComEquipeInvalida.length > 0) {
      return res.status(404).json({ error: 'Algumas equipes não foram encontradas', torcedoresComEquipeInvalida });
    }

    // Mapeia os torcedores para adicionar os IDs das equipes
    const torcedores = torcedoresData.map(torcedor => {
      const equipe = equipes.find(e => e.nome === torcedor.equipeNome);
      return {
        nome: torcedor.nome,
        dataNascimento: torcedor.dataNascimento,
        tempoFiliacao: torcedor.tempoFiliacao,
        equipe_Id: equipe.id,
      };
    });

    
    const createdTorcedores = await Torcedor.bulkCreate(torcedores);

    res.status(201).json(createdTorcedores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Rota para listar todos os torcedores
router.get('/', async (req, res) => {
  try {
    const torcedores = await Torcedor.findAll({
      include: { model: Equipe, attributes: ['nome', 'serie'] },
    });
    res.status(200).json(torcedores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para buscar um torcedor pelo ID
router.get('/:id', async (req, res) => {
  try {
    const torcedor = await Torcedor.findByPk(req.params.id, {
      include: { model: Equipe, attributes: ['nome', 'serie'] },
    });

    if (!torcedor) {
      return res.status(404).json({ error: 'Torcedor não encontrado' });
    }

    res.status(200).json(torcedor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para atualizar um torcedor
router.put('/:id', async (req, res) => {
  try {
    const { nome, dataNascimento, tempoFiliacao, equipeId } = req.body;


    if (equipeId) {
      const equipe = await Equipe.findByPk(equipeId);
      if (!equipe) {
        return res.status(404).json({ error: 'Equipe não encontrada' });
      }
    }

    const [updated] = await Torcedor.update(
      { nome, dataNascimento, tempoFiliacao, equipeId },
      { where: { id: req.params.id } }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Torcedor não encontrado' });
    }

    res.status(200).json({ message: 'Torcedor atualizado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para deletar um torcedor
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Torcedor.destroy({ where: { id: req.params.id } });

    if (!deleted) {
      return res.status(404).json({ error: 'Torcedor não encontrado' });
    }

    res.status(200).json({ message: 'Torcedor excluído com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



router.get('/torcedores/series', async (req, res) => {
  try {
    const contagem = await Torcedor.findAll({
      include: {
        model: Equipe,
        attributes: ['serie'],
      },
      attributes: [],
      group: ['Equipe.serie'],
      raw: true,
      nest: true,
      // Calcula a contagem de torcedores por série
      attributes: [
        [Sequelize.fn('COUNT', Sequelize.col('Torcedor.id')), 'total'],
      ],
    });

    // Transformar o resultado para um retorno mais simples
    const resultado = contagem.map(item => ({
      serie: item.Equipe.serie,
      total: item.total,
    }));

    // Ordenar os resultados conforme a ordem desejada (A, B, C)
    const ordem = ['A', 'B', 'C'];
    const resultadoOrdenado = resultado.sort((a, b) => ordem.indexOf(a.serie) - ordem.indexOf(b.serie));

    res.status(200).json(resultadoOrdenado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para contar o total de torcedores na base
router.get('/torcedores/total', async (req, res) => {
  try {
    const totalTorcedores = await Torcedor.count();

    res.status(200).json({ total: totalTorcedores });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para distribuição geográfica de torcedores por estado
router.get('/torcedores/distribuicao_estado', async (req, res) => {
  try {
    const distribuicao = await Torcedor.findAll({
      include: {
        model: Equipe,
        attributes: ['estado'],
      },
      attributes: [
        [Sequelize.fn('COUNT', Sequelize.col('Torcedor.id')), 'total']
      ],
      group: ['Equipe.estado'],
      order: [[Sequelize.literal('total'), 'DESC']],
      raw: true,
      nest: true,
    });

    // Formatar os dados para o formato esperado pelo Treemap
    const resultado = distribuicao.map(item => ({
      x: item.Equipe.estado,
      y: item.total,
    }));

    res.status(200).json({ data: resultado });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



router.get('/torcedores/filiacoes', async (req, res) => {
  try {
    const filiacoes = await Torcedor.findAll({
      attributes: [
        [Sequelize.fn('DATE_TRUNC', 'year', Sequelize.col('Torcedor.tempoFiliacao')), 'ano_filiacao'], // Agrupando por ano
        [Sequelize.fn('COUNT', Sequelize.col('Torcedor.id')), 'total'],
      ],
      group: ['ano_filiacao'],
      order: [[Sequelize.literal('ano_filiacao'), 'ASC']],
      raw: true,
      nest: true,
    });

    // Formatando os dados para o gráfico, extraindo o ano apenas
    const resultado = filiacoes.map(item => ({
      x: new Date(item.ano_filiacao).getFullYear().toString(),  // Extraindo apenas o ano
      y: item.total,
    }));

    res.status(200).json({ data: resultado });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/torcedores/top10', async (req, res) => {
  try {
    const top10Equipes = await Torcedor.findAll({
      include: {
        model: Equipe,
        attributes: ['nome'], // Incluir apenas o nome da equipe
      },
      attributes: [
        [Sequelize.fn('COUNT', Sequelize.col('Torcedor.id')), 'total'], // Contagem de torcedores
      ],
      group: ['Equipe.id'], // Agrupar por equipe
      order: [[Sequelize.literal('total'), 'DESC']], // Ordenar por total de torcedores
      limit: 10, // Limitar para as 10 primeiras
      raw: true,
      nest: true,
    });

    // Formatando os dados para o gráfico
    const resultado = top10Equipes.map(item => ({
      equipe: item.Equipe.nome,
      total: item.total,
    }));

    res.status(200).json({ data: resultado });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para contar o total de times na base
router.get('/times/total', async (req, res) => {
  try {
    const totalTimes = await Equipe.count();

    res.status(200).json({ total: totalTimes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;