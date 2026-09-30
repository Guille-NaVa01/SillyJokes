import { useState } from 'react';
import { getJokesByType } from '../api';
import { JOKE_TYPES, typeEmoji, typeBadgeClass } from '../utils.jsx';

export default function FilterTab({ onToast }) {
  const [selectedType, setSelectedType] = useState('');
  const [jokes, setJokes]               = useState([]);
  const [loading, setLoading]           = useState(false);
  const [searched, setSearched]         = useState(false);

  async function handleFilter(e) {
    e.preventDefault();
    if (!selectedType) { onToast('Elige un tipo primero 😅', 'info'); return; }
    setLoading(true);
    setSearched(true);
    try {
      const data = await getJokesByType(selectedType);
      setJokes(data);
    } catch (err) {
      onToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section aria-labelledby="filter-title">
      <h2 id="filter-title" className="section-title">
        🔍 Filtrar por tipo
      </h2>

      <form onSubmit={handleFilter} className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="form-row" style={{ alignItems: 'flex-end' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="filter-type">Tipo de broma</label>
            <select
              id="filter-type"
              className="form-select"
              value={selectedType}
              onChange={e => setSelectedType(e.target.value)}
            >
              <option value="">-- Selecciona --</option>
              {JOKE_TYPES.map(t => (
                <option key={t} value={t}>{typeEmoji(t)} {t}</option>
              ))}
            </select>
          </div>
          <button id="btn-filter" type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? '⏳' : '🔍 Buscar'}
          </button>
        </div>
      </form>

      {loading && <div className="loading-wrapper"><div className="spinner" /><span>Buscando…</span></div>}

      {!loading && searched && jokes.length === 0 && (
        <div className="empty-state">
          <span className="empty-icon">🤷</span>
          <p>No hay bromas de tipo <strong>{selectedType}</strong> todavía.</p>
        </div>
      )}

      {!loading && jokes.map(joke => (
        <div className="card joke-card" key={joke.id}>
          <div className="joke-header">
            <span className="joke-emoji">{typeEmoji(joke.joketype)}</span>
            <p className="joke-text">{joke.joketext}</p>
          </div>
          <div className="joke-meta">
            <span className={`badge ${typeBadgeClass(joke.joketype)}`}>{joke.joketype}</span>
            <span className="joke-id">ID: {joke.id}</span>
          </div>
        </div>
      ))}
    </section>
  );
}
