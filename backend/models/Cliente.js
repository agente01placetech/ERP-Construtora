import mongoose from 'mongoose';

const clienteSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  documento: { type: String, unique: true, sparse: true }, // CPF/CNPJ
  email: String,
  telefone: String,
  endereco: String,
  cidade: String,
  uf: String,
  observacoes: String
}, { timestamps: true });

export default mongoose.model('Cliente', clienteSchema);
