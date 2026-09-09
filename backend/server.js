import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

import authRoutes from './routes/auth.js';
import clienteRoutes from './routes/clientes.js';
import obraRoutes from './routes/obras.js';
import orcamentoRoutes from './routes/orcamentos.js';
import contratoRoutes from './routes/contratos.js';
import financeiroRoutes from './routes/financeiro.js';
import materialRoutes from './routes/materiais.js';
import dashboardRoutes from './routes/dashboard.js';

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Rotas publicas e protegidas
app.use('/api/auth', authRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/obras', obraRoutes);
app.use('/api/orcamentos', orcamentoRoutes);
app.use('/api/contratos', contratoRoutes);
app.use('/api/financeiro', financeiroRoutes);
app.use('/api/materiais', materialRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/', (req, res) => res.json({ ok: true, api: 'Sienge-MERN essencial', versao: '1.0.0' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
