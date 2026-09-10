import mongoose from 'mongoose';

// Lancamento financeiro: conta a pagar ou a receber
const lancamentoSchema = new mongoose.Schema({
  tipo: { type: String, enum: ['pagar', 'receber'], required: true },
  descricao: { type: String, required: true },
  categoria: String, // ex: materiais, mao de obra, aluguel, receita de obra
  valor: { type: Number, required: true, min: 0.01 },
  dataVencimento: { type: Date, required: true },
  dataPagamento: Date,
  status: { type: String, enum: ['pendente', 'pago', 'atrasado'], default: 'pendente' },
  obra: { type: mongoose.Schema.Types.ObjectId, ref: 'Obra' },
  cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente' },
  fornecedor: String,
  formaPagamento: String,
  observacoes: String
}, { timestamps: true });

export default mongoose.model('Lancamento', lancamentoSchema);
