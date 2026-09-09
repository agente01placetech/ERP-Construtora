import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  senha: { type: String, required: true, select: false },
  role: { type: String, enum: ['admin', 'usuario'], default: 'usuario' },
  ativo: { type: Boolean, default: true }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('senha')) return next();
  const salt = await bcrypt.genSalt(10);
  this.senha = await bcrypt.hash(this.senha, salt);
  next();
});

userSchema.methods.compararSenha = function (senhaDigitada) {
  return bcrypt.compare(senhaDigitada, this.senha);
};

export default mongoose.model('User', userSchema);
