const express = require('express');
const Torcedor = require('../models/Torcedor');
const Equipe = require('../models/Equipe')
const router = express.Router();

// Criar um novo torcedor
router.post('/', async (req, res) => {
  try {
    const { nome, dataNascimento, tempoFiliacao, equipeNome } = req.body;

    // Verificar se todos os campos obrigatórios estão presentes
    if (!nome || !dataNascimento || !tempoFiliacao || !equipeNome) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    // Verificar se a equipe existe pelo nome
    const equipe = await Equipe.findOne({ where: { nome: equipeNome } });
    if (!equipe) {
      return res.status(404).json({ error: 'Equipe não encontrada' });
    }

    // Criar o torcedor
    const torcedor = await Torcedor.create({
      nome,
      dataNascimento,
      tempoFiliacao,
      equipeId: equipe.id,
    });

    res.status(201).json(torcedor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// Listar todos os torcedores
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

// Buscar um torcedor pelo ID
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

// Atualizar um torcedor
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

// Deletar um torcedor
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

module.exports = router;
