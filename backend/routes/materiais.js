import express from 'express';
import Material from '../models/Material.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);

router.get('/', async (req, res) => {
  try {
    const docs = await Material.find().sort({ nome: 1 });
    res.json(docs);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const doc = await Material.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Nao encontrado' });
    res.json(doc);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const doc = await Material.create(req.body);
    res.status(201).json(doc);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// POST /api/materiais/:id/movimento  -> entrada ou saida de estoque
router.post('/:id/movimento', async (req, res) => {
  try {
    const { tipo, quantidade, obra, observacao } = req.body;
    if (!['entrada', 'saida'].includes(tipo)) return res.status(400).json({ error: 'Tipo invalido' });
    const doc = await Material.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Nao encontrado' });
    const qtd = Number(quantidade) || 0;
    doc.estoqueAtual = tipo === 'entrada' ? doc.estoqueAtual + qtd : doc.estoqueAtual - qtd;
    doc.movimentos.push({ tipo, quantidade: qtd, obra, observacao });
    await doc.save();
    res.json(doc);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const doc = await Material.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!doc) return res.status(404).json({ error: 'Nao encontrado' });
    res.json(doc);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    const doc = await Material.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Nao encontrado' });
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

export default router;
