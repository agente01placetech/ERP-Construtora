import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Protege rotas: exige token JWT no header Authorization: Bearer <token>
export async function protect(req, res, next) {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('_id nome email role ativo tokenVersion');
      if (!user || !user.ativo || user.tokenVersion !== (decoded.tokenVersion || 0)) {
        return res.status(401).json({ error: 'Token invalido ou usuario inativo' });
      }
      req.user = { id: user._id, nome: user.nome, email: user.email, role: user.role };
      next();
    } catch (err) {
      return res.status(401).json({ error: 'Token invalido ou expirado' });
    }
  }
  if (!token) return res.status(401).json({ error: 'Nao autorizado, sem token' });
}

// Opcional: restringir por papel (admin)
export function adminOnly(req, res, next) {
  if (req.user && req.user.role === 'admin') return next();
  return res.status(403).json({ error: 'Acesso restrito a administradores' });
}
