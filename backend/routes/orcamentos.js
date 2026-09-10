import express from 'express';
import Orcamento from '../models/Orcamento.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { pick } from '../utils/fields.js';

const router = express.Router();
router.use(protect);

router.get('/', async (req, res) => {
  try {
    const docs = await Orcamento.find()
      .populate('obra', 'nome')
      .populate('cliente', 'nome')
      .sort({ createdAt: -1 });
    res.json(docs);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const doc = await Orcamento.findById(req.params.id).populate('obra cliente');
    if (!doc) return res.status(404).json({ error: 'Nao encontrado' });
    res.json(doc);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const doc = await Orcamento.create(pick(req.body, ['obra', 'cliente', 'descricao', 'itens', 'desconto', 'acrescimo', 'status', 'dataCriacao', 'validadeDias']));
    res.status(201).json(doc);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const doc = await Orcamento.findByIdAndUpdate(req.params.id, pick(req.body, ['obra', 'cliente', 'descricao', 'itens', 'desconto', 'acrescimo', 'status', 'dataCriacao', 'validadeDias']), { new: true, runValidators: true });
    if (!doc) return res.status(404).json({ error: 'Nao encontrado' });
    res.json(doc);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.delete('/:id', adminOnly, async (req, res) => {
  try {
    const doc = await Orcamento.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Nao encontrado' });
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

export default router;
