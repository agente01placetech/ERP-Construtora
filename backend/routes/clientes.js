import express from 'express';
import Cliente from '../models/Cliente.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);

// GET /api/clientes
router.get('/', async (req, res) => {
  try {
    const docs = await Cliente.find().sort({ nome: 1 });
    res.json(docs);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/clientes/:id
router.get('/:id', async (req, res) => {
  try {
    const doc = await Cliente.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Nao encontrado' });
    res.json(doc);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/clientes
router.post('/', async (req, res) => {
  try {
    const doc = await Cliente.create(req.body);
    res.status(201).json(doc);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// PUT /api/clientes/:id
router.put('/:id', async (req, res) => {
  try {
    const doc = await Cliente.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!doc) return res.status(404).json({ error: 'Nao encontrado' });
    res.json(doc);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// DELETE /api/clientes/:id
router.delete('/:id', async (req, res) => {
  try {
    const doc = await Cliente.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Nao encontrado' });
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

export default router;
