import { useEffect, useState } from 'react';
import api, { fmtMoeda, fmtData } from '../api.js';

const vazio = { codigo: '', nome: '', descricao: '', endereco: '', cidade: '', uf: '', cliente: '', status: 'planejamento', valorOrcamento: 0, percentualConclusao: 0, dataInicio: '', dataPrevisaoFim: '', responsavel: '' };

export default function Obras() {
  const [lista, setLista] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [filtroStatus, setFiltroStatus] = useState('');
  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState(vazio);

  const carregar = () => {
    api.get('/obras').then((r) => setLista(r.data));
    api.get('/clientes').then((r) => setClientes(r.data));
  };
  useEffect(() => { carregar(); }, []);

  const abrirNovo = () => { setEditando(null); setForm(vazio); setModal(true); };
  const abrirEdicao = (o) => {
    setEditando(o._id);
    setForm({ ...vazio, ...o, cliente: o.cliente?._id || '', dataInicio: o.dataInicio ? o.dataInicio.slice(0, 10) : '', dataPrevisaoFim: o.dataPrevisaoFim ? o.dataPrevisaoFim.slice(0, 10) : '' });
    setModal(true);
  };

  const salvar = async (e) => {
    e.preventDefault();
    const payload = { ...form, valorOrcamento: Number(form.valorOrcamento), percentualConclusao: Number(form.percentualConclusao) };
    if (editando) await api.put(`/obras/${editando}`, payload);
    else await api.post('/obras', payload);
    setModal(false); carregar();
  };

  const excluir = async (id) => {
    if (!window.confirm('Excluir esta obra?')) return;
    await api.delete(`/obras/${id}`); carregar();
  };

  const filtradas = filtroStatus ? lista.filter((o) => o.status === filtroStatus) : lista;

  return (
    <div>
      <div className="topbar">
        <h1>Obras</h1>
        <button className="btn btn-destaque" onClick={abrirNovo}>+ Nova obra</button>
      </div>

      <div className="card">
        <div className="filtros">
          <div className="campo">
            <label>Status</label>
            <select value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)}>
              <option value="">Todos</option>
              <option value="planejamento">Planejamento</option>
              <option value="em_andamento">Em andamento</option>
              <option value="pausada">Pausada</option>
              <option value="concluida">Concluída</option>
            </select>
          </div>
        </div>

        {filtradas.length === 0 ? (
          <div className="vazio">Nenhuma obra encontrada.</div>
        ) : (
          <table>
            <thead><tr><th>Código</th><th>Obra</th><th>Cliente</th><th>Status</th><th>Conclusão</th><th>Orçamento</th><th>Início</th><th>Previsão</th><th>Ações</th></tr></thead>
            <tbody>
              {filtradas.map((o) => (
                <tr key={o._id}>
                  <td>{o.codigo || '-'}</td>
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
                  <td>{fmtData(o.dataPrevisaoFim)}</td>
                  <td>
                    <button className="btn btn-linha btn-mini" onClick={() => abrirEdicao(o)}>Editar</button>{' '}
                    <button className="btn btn-perigo btn-mini" onClick={() => excluir(o._id)}>Excluir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <div className="modal-fundo" onClick={() => setModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editando ? 'Editar obra' : 'Nova obra'}</h2>
            <form onSubmit={salvar}>
              <div className="form-grid">
                <div className="campo"><label>Código</label><input value={form.codigo} onChange={(e) => setForm({ ...form, codigo: e.target.value })} /></div>
                <div className="campo"><label>Nome *</label><input required value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} /></div>
                <div className="campo"><label>Cliente</label>
                  <select value={form.cliente} onChange={(e) => setForm({ ...form, cliente: e.target.value })}>
                    <option value="">— Selecione —</option>
                    {clientes.map((c) => <option key={c._id} value={c._id}>{c.nome}</option>)}
                  </select>
                </div>
                <div className="campo"><label>Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                    <option value="planejamento">Planejamento</option>
                    <option value="em_andamento">Em andamento</option>
                    <option value="pausada">Pausada</option>
                    <option value="concluida">Concluída</option>
                  </select>
                </div>
                <div className="campo"><label>Valor do orçamento (R$)</label><input type="number" step="0.01" value={form.valorOrcamento} onChange={(e) => setForm({ ...form, valorOrcamento: e.target.value })} /></div>
                <div className="campo"><label>% de conclusão</label><input type="number" min="0" max="100" value={form.percentualConclusao} onChange={(e) => setForm({ ...form, percentualConclusao: e.target.value })} /></div>
                <div className="campo"><label>Data de início</label><input type="date" value={form.dataInicio} onChange={(e) => setForm({ ...form, dataInicio: e.target.value })} /></div>
                <div className="campo"><label>Previsão de término</label><input type="date" value={form.dataPrevisaoFim} onChange={(e) => setForm({ ...form, dataPrevisaoFim: e.target.value })} /></div>
                <div className="campo"><label>Responsável</label><input value={form.responsavel} onChange={(e) => setForm({ ...form, responsavel: e.target.value })} /></div>
                <div className="campo"><label>Cidade</label><input value={form.cidade} onChange={(e) => setForm({ ...form, cidade: e.target.value })} /></div>
                <div className="campo"><label>UF</label><input maxLength={2} value={form.uf} onChange={(e) => setForm({ ...form, uf: e.target.value.toUpperCase() })} /></div>
                <div className="campo" style={{ gridColumn: '1 / -1' }}><label>Endereço</label><input value={form.endereco} onChange={(e) => setForm({ ...form, endereco: e.target.value })} /></div>
                <div className="campo" style={{ gridColumn: '1 / -1' }}><label>Descrição</label><textarea rows="2" value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} /></div>
              </div>
              <div className="modal-acoes">
                <button type="button" className="btn btn-linha" onClick={() => setModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primario">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
