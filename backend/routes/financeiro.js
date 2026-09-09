import express from 'express';
import Lancamento from '../models/Lancamento.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);

// GET /api/financeiro?tipo=pagar&status=pago
router.get('/', async (req, res) => {
  try {
    const filtro = {};
    if (req.query.tipo) filtro.tipo = req.query.tipo;
    if (req.query.status) filtro.status = req.query.status;
    if (req.query.obra) filtro.obra = req.query.obra;
    const docs = await Lancamento.find(filtro)
      .populate('obra', 'nome')
      .populate('cliente', 'nome')
      .sort({ dataVencimento: 1 });
    res.json(docs);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const doc = await Lancamento.findById(req.params.id).populate('obra cliente');
    if (!doc) return res.status(404).json({ error: 'Nao encontrado' });
    res.json(doc);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const doc = await Lancamento.create(req.body);
    res.status(201).json(doc);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// Marcar como pago / baixar titulo
router.post('/:id/baixar', async (req, res) => {
  try {
    const doc = await Lancamento.findByIdAndUpdate(
      req.params.id,
      { status: 'pago', dataPagamento: req.body.dataPagamento || Date.now() },
      { new: true }
    );
    if (!doc) return res.status(404).json({ error: 'Nao encontrado' });
    res.json(doc);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const doc = await Lancamento.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!doc) return res.status(404).json({ error: 'Nao encontrado' });
    res.json(doc);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    const doc = await Lancamento.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Nao encontrado' });
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

export default router;
