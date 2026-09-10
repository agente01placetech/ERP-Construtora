import mongoose from 'mongoose';

const movimentoSchema = new mongoose.Schema({
  tipo: { type: String, enum: ['entrada', 'saida'], required: true },
  quantidade: { type: Number, required: true, min: 0.0001 },
  data: { type: Date, default: Date.now },
  obra: { type: mongoose.Schema.Types.ObjectId, ref: 'Obra' },
  observacao: String
}, { _id: true });

const materialSchema = new mongoose.Schema({
  codigo: { type: String, unique: true, sparse: true },
  nome: { type: String, required: true },
  categoria: String, // ex: ferragem, concreto, acabamento
  unidade: { type: String, default: 'und' },
  estoqueAtual: { type: Number, default: 0, min: 0 },
  estoqueMinimo: { type: Number, default: 0, min: 0 },
  custoUnitario: { type: Number, default: 0, min: 0 },
  fornecedor: String,
  movimentos: [movimentoSchema]
}, { timestamps: true });

export default mongoose.model('Material', materialSchema);
