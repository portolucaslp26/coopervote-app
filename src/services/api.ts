import axios from 'axios';

function joinUrl(base: string, path: string) {
  let normalizedBase = base;
  while (normalizedBase.endsWith('/')) {
    normalizedBase = normalizedBase.slice(0, -1);
  }
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
}

const apiBase =
  (import.meta.env.VITE_API_URL && String(import.meta.env.VITE_API_URL).trim()) ||
  'http://localhost:8080';

export const api = axios.create({
  baseURL: joinUrl(apiBase, '/api/v1'),
});

