import { useEffect, useState } from 'react';

// Shared list of joke types used across the app
export const JOKE_TYPES = [
  'Programming',
  'Math',
  'Science',
  'Pun',
  'Dad Joke',
  'Knock-Knock',
  'Animal',
  'Food',
  'Sports',
  'Other',
];

// Returns a fun emoji per joke type
export function typeEmoji(type = '') {
  const map = {
    programming: '💻',
    math:        '🔢',
    science:     '🔬',
    pun:         '🥁',
    'dad joke':  '👨',
    'knock-knock': '🚪',
    animal:      '🐾',
    food:        '🍕',
    sports:      '⚽',
  };
  return map[type.toLowerCase()] || '😄';
}

// Returns a CSS badge class per type
export function typeBadgeClass(type = '') {
  const map = {
    programming: 'badge-blue',
    math:        'badge-blue',
    science:     'badge-blue',
    pun:         'badge-yellow',
    'dad joke':  'badge-yellow',
    'knock-knock': 'badge-orange',
    animal:      'badge-green',
    food:        'badge-green',
    sports:      'badge-orange',
  };
  return map[type.toLowerCase()] || 'badge-yellow';
}

// ---- Toast hook ----
export function useToast() {
  const [toasts, setToasts] = useState([]);

  function addToast(message, type = 'info') {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  }

  return { toasts, addToast };
}

// ---- Toast component ----
export function ToastContainer({ toasts }) {
  return (
    <div className="toast-container" role="status" aria-live="polite">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          {t.type === 'success' && '✅ '}
          {t.type === 'error'   && '❌ '}
          {t.type === 'info'    && 'ℹ️ '}
          {t.message}
        </div>
      ))}
    </div>
  );
}
