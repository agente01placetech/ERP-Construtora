import express from 'express';
import Obra from '../models/Obra.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { pick } from '../utils/fields.js';

const router = express.Router();
router.use(protect);

router.get('/', async (req, res) => {
  try {
    const docs = await Obra.find().populate('cliente', 'nome').sort({ createdAt: -1 });
    res.json(docs);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const doc = await Obra.findById(req.params.id).populate('cliente');
    if (!doc) return res.status(404).json({ error: 'Nao encontrado' });
    res.json(doc);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const doc = await Obra.create(pick(req.body, ['codigo', 'nome', 'descricao', 'endereco', 'cidade', 'uf', 'cliente', 'status', 'valorOrcamento', 'percentualConclusao', 'dataInicio', 'dataPrevisaoFim', 'dataConclusao', 'responsavel']));
    res.status(201).json(doc);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const doc = await Obra.findByIdAndUpdate(req.params.id, pick(req.body, ['codigo', 'nome', 'descricao', 'endereco', 'cidade', 'uf', 'cliente', 'status', 'valorOrcamento', 'percentualConclusao', 'dataInicio', 'dataPrevisaoFim', 'dataConclusao', 'responsavel']), { new: true, runValidators: true });
    if (!doc) return res.status(404).json({ error: 'Nao encontrado' });
    res.json(doc);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.delete('/:id', adminOnly, async (req, res) => {
  try {
    const doc = await Obra.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Nao encontrado' });
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

export default router;
