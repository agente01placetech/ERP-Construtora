import express from 'express';
import Obra from '../models/Obra.js';
import Lancamento from '../models/Lancamento.js';
import Cliente from '../models/Cliente.js';
import Contrato from '../models/Contrato.js';
import Material from '../models/Material.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);

// GET /api/dashboard/resumo -> indicadores para a tela inicial
router.get('/resumo', async (req, res) => {
  try {
    const [totalObras, totalClientes, totalContratos, aPagar, aReceber, materiaisAbaixo] = await Promise.all([
      Obra.countDocuments(),
      Cliente.countDocuments(),
      Contrato.countDocuments(),
      Lancamento.aggregate([
        { $match: { tipo: 'pagar', status: { $ne: 'pago' } } },
        { $group: { _id: null, total: { $sum: '$valor' } } }
      ]),
      Lancamento.aggregate([
        { $match: { tipo: 'receber', status: { $ne: 'pago' } } },
        { $group: { _id: null, total: { $sum: '$valor' } } }
      ]),
      Material.find({ $expr: { $lt: ['$estoqueAtual', '$estoqueMinimo'] } }).countDocuments()
    ]);

    const obrasRecentes = await Obra.find().populate('cliente', 'nome').sort({ createdAt: -1 }).limit(5);

    res.json({
      totalObras,
      totalClientes,
      totalContratos,
      aPagar: aPagar[0]?.total || 0,
      aReceber: aReceber[0]?.total || 0,
      saldoPrevisto: (aReceber[0]?.total || 0) - (aPagar[0]?.total || 0),
      materiaisAbaixo,
      obrasRecentes
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

export default router;
