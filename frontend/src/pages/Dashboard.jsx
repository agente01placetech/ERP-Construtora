import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { fmtMoeda, fmtData } from '../api.js';

export default function Dashboard() {
  const [dados, setDados] = useState(null);

  useEffect(() => {
    api.get('/dashboard/resumo').then((r) => setDados(r.data)).catch(() => setDados(null));
  }, []);

  if (!dados) return <div className="vazio">Carregando indicadores...</div>;

  const cards = [
    { rotulo: 'Obras cadastradas', valor: dados.totalObras, cls: '' },
    { rotulo: 'Clientes', valor: dados.totalClientes, cls: '' },
    { rotulo: 'Contratos', valor: dados.totalContratos, cls: '' },
    { rotulo: 'A pagar (em aberto)', valor: fmtMoeda(dados.aPagar), cls: 'negativo' },
    { rotulo: 'A receber (em aberto)', valor: fmtMoeda(dados.aReceber), cls: 'positivo' },
    { rotulo: 'Saldo previsto', valor: fmtMoeda(dados.saldoPrevisto), cls: dados.saldoPrevisto >= 0 ? 'positivo' : 'negativo' },
    { rotulo: 'Materiais abaixo do mínimo', valor: dados.materiaisAbaixo, cls: dados.materiaisAbaixo > 0 ? 'alerta' : '' },
  ];

  return (
    <div>
      <div className="topbar"><h1>Dashboard</h1></div>
      <div className="grid-cards">
        {cards.map((c) => (
          <div key={c.rotulo} className={`kpi ${c.cls}`}>
            <div className="rotulo">{c.rotulo}</div>
            <div className="valor">{c.valor}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <h3 style={{ marginBottom: 12, color: 'var(--primaria-escura)' }}>Obras recentes</h3>
        {dados.obrasRecentes.length === 0 ? (
          <div className="vazio">Nenhuma obra ainda. <Link to="/obras">Criar primeira obra</Link></div>
        ) : (
          <table>
            <thead>
              <tr><th>Obra</th><th>Cliente</th><th>Status</th><th>Conclusão</th><th>Orçamento</th><th>Início</th></tr>
            </thead>
            <tbody>
              {dados.obrasRecentes.map((o) => (
                <tr key={o._id}>
                  <td>{o.nome}</td>
                  <td>{o.cliente?.nome || '-'}</td>
                  <td><span className={`badge ${o.status}`}>{o.status.replace('_', ' ')}</span></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div className="barra-progresso"><div style={{ width: `${o.percentualConclusao}%` }} /></div>
                      <small>{o.percentualConclusao}%</small>
                    </div>
                  </td>
                  <td>{fmtMoeda(o.valorOrcamento)}</td>
                  <td>{fmtData(o.dataInicio)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
