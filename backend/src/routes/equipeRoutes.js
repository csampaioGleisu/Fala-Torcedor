const express = require('express');
const Equipe = require('../models/Equipe');
const router = express.Router();

// Rota para criar uma nova equipe
router.post('/', async (req, res) => {
  try {
    const { nome, serie, estado } = req.body;
     
    if (!nome || !serie || !estado) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }
    
    const equipe = await Equipe.create({
      nome,
      serie,
      estado
    });

    res.status(201).json(equipe); 
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para listar todas as equipes
router.get('/', async (req, res) => {
  try {
    const equipes = await Equipe.findAll();
    res.status(200).json(equipes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para atualizar uma equipe
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Equipe.update(req.body, {
      where: { id: id },
    });

    if (updated) {
      const updatedEquipe = await Equipe.findOne({ where: { id: id } });
      return res.status(200).json(updatedEquipe);
    }

    throw new Error('Equipe não encontrada');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para deletar uma equipe pelo nome
router.delete('/:nome', async (req, res) => {
  try {
    const { nome } = req.params;
    const deleted = await Equipe.destroy({
      where: { nome: nome },
    });

    if (deleted) {
      return res.status(200).json({ message: `Equipe ${nome} removida com sucesso!` });
    }

    throw new Error('Equipe não encontrada');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;