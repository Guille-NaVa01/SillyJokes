// Centralised API calls. BASE_URL is /api in both dev (proxied by Vite)
// and production (proxied by Nginx), so ports are never exposed in the browser.
const BASE_URL = '/api';

// --- AUTH ---
export function getToken() {
  return localStorage.getItem('token');
}

export function setToken(token) {
  if (token) localStorage.setItem('token', token);
  else localStorage.removeItem('token');
}

export async function login(username, password) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Error al iniciar sesión');
  }
  const data = await res.json();
  setToken(data.token);
  return data;
}

export async function register(username, password) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Error al registrarse');
  }
  return res.json();
}

function authHeaders(extraHeaders = {}) {
  const token = getToken();
  const headers = { ...extraHeaders };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

// --- JOKES ---

// GET /random
export async function getRandomJoke() {
  const res = await fetch(`${BASE_URL}/random`, { headers: authHeaders() });
  if (res.status === 401 || res.status === 403) throw new Error('No autorizado');
  if (!res.ok) throw new Error('No se pudo obtener la broma');
  return res.json();
}

// GET /jokes/:id
export async function getJokeById(id) {
  const res = await fetch(`${BASE_URL}/jokes/${id}`, { headers: authHeaders() });
  if (res.status === 401 || res.status === 403) throw new Error('No autorizado');
  if (!res.ok) throw new Error(`Broma ${id} no encontrada`);
  return res.json();
}

// GET /filter?jokeType=TYPE
export async function getJokesByType(type) {
  const res = await fetch(`${BASE_URL}/filter?jokeType=${encodeURIComponent(type)}`, { headers: authHeaders() });
  if (res.status === 401 || res.status === 403) throw new Error('No autorizado');
  if (!res.ok) throw new Error('Error filtrando bromas');
  return res.json();
}

// POST /jokes
export async function createJoke(jokeText, jokeType) {
  const body = new URLSearchParams({ jokeText, jokeType });
  const res = await fetch(`${BASE_URL}/jokes`, {
    method: 'POST',
    headers: authHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }),
    body,
  });
  if (res.status === 401 || res.status === 403) throw new Error('No autorizado');
  if (!res.ok) throw new Error('Error al crear la broma');
  return res.json();
}

// PUT /jokes/:id  (reemplaza toda la broma)
export async function updateJoke(id, text, type) {
  const body = new URLSearchParams({ text, type });
  const res = await fetch(`${BASE_URL}/jokes/${id}`, {
    method: 'PUT',
    headers: authHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }),
    body,
  });
  if (res.status === 401 || res.status === 403) throw new Error('No autorizado');
  if (!res.ok) throw new Error('Error al actualizar la broma');
  return res.json();
}

// PATCH /jokes/:id  (solo el campo que cambie)
export async function patchJoke(id, fields) {
  const body = new URLSearchParams(fields);
  const res = await fetch(`${BASE_URL}/jokes/${id}`, {
    method: 'PATCH',
    headers: authHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }),
    body,
  });
  if (res.status === 401 || res.status === 403) throw new Error('No autorizado');
  if (!res.ok) throw new Error('Error al editar la broma');
  return res.json();
}

// DELETE /jokes/:id
export async function deleteJoke(id) {
  const res = await fetch(`${BASE_URL}/jokes/${id}`, { 
    method: 'DELETE',
    headers: authHeaders()
  });
  if (res.status === 401 || res.status === 403) throw new Error('No autorizado');
  if (!res.ok) throw new Error(`No se pudo eliminar la broma ${id}`);
  return true;
}
