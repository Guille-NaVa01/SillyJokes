// Centralised API calls. BASE_URL is /api in both dev (proxied by Vite)
// and production (proxied by Nginx), so ports are never exposed in the browser.
const BASE_URL = '/api';

// GET /random
export async function getRandomJoke() {
  const res = await fetch(`${BASE_URL}/random`);
  if (!res.ok) throw new Error('No se pudo obtener la broma');
  return res.json();
}

// GET /jokes/:id
export async function getJokeById(id) {
  const res = await fetch(`${BASE_URL}/jokes/${id}`);
  if (!res.ok) throw new Error(`Broma ${id} no encontrada`);
  return res.json();
}

// GET /filter?jokeType=TYPE
export async function getJokesByType(type) {
  const res = await fetch(`${BASE_URL}/filter?jokeType=${encodeURIComponent(type)}`);
  if (!res.ok) throw new Error('Error filtrando bromas');
  return res.json();
}

// POST /jokes
export async function createJoke(jokeText, jokeType) {
  const body = new URLSearchParams({ jokeText, jokeType });
  const res = await fetch(`${BASE_URL}/jokes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  if (!res.ok) throw new Error('Error al crear la broma');
  return res.json();
}

// PUT /jokes/:id  (reemplaza toda la broma)
export async function updateJoke(id, text, type) {
  const body = new URLSearchParams({ text, type });
  const res = await fetch(`${BASE_URL}/jokes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  if (!res.ok) throw new Error('Error al actualizar la broma');
  return res.json();
}

// PATCH /jokes/:id  (solo el campo que cambie)
export async function patchJoke(id, fields) {
  const body = new URLSearchParams(fields);
  const res = await fetch(`${BASE_URL}/jokes/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  if (!res.ok) throw new Error('Error al editar la broma');
  return res.json();
}

// DELETE /jokes/:id
export async function deleteJoke(id) {
  const res = await fetch(`${BASE_URL}/jokes/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`No se pudo eliminar la broma ${id}`);
  return true;
}
