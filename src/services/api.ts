import axios from 'axios';

function joinUrl(base: string, path: string) {
  const normalizedBase = base.replace(/\/+$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
}

const apiBase =
  (import.meta.env.VITE_API_URL && String(import.meta.env.VITE_API_URL).trim()) ||
  'http://localhost:8080';

export const api = axios.create({
  baseURL: joinUrl(apiBase, '/api/v1'),
});

