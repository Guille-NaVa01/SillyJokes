import { useState } from 'react';
import { getRandomJoke } from '../api';
import { typeEmoji, typeBadgeClass } from '../utils.jsx';

export default function RandomTab({ onToast }) {
  const [joke, setJoke] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleRandom() {
    setLoading(true);
    try {
      const data = await getRandomJoke();
      setJoke(data);
    } catch (e) {
      onToast(e.message, 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section aria-labelledby="random-title">
      <h2 id="random-title" className="section-title">
        Broma aleatoria
      </h2>

      <div className="random-hero">
        {joke ? (
          <>
            <p className="joke-text" style={{ marginBottom: '0.75rem' }}>
              {typeEmoji(joke.joketype)} {joke.joketext}
            </p>
            <span className={`badge ${typeBadgeClass(joke.joketype)}`}>
              {joke.joketype}
            </span>
            <p className="joke-id" style={{ marginTop: '0.5rem' }}>
              ID: {joke.id}
            </p>
          </>
        ) : (
          <p style={{ color: 'var(--gray-500)', fontWeight: 700, fontSize: '1.05rem' }}>
            Pulsa el botón para recibir una broma
          </p>
        )}
      </div>

      <button
        id="btn-random"
        className="btn btn-primary btn-lg btn-block"
        onClick={handleRandom}
        disabled={loading}
      >
        {loading ? '⏳ Cargando…' : '¡Dame una broma!'}
      </button>
    </section>
  );
}
