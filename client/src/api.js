const API_URL = import.meta.env.VITE_API_URL || '/api';
export async function api(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options, credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || 'The request could not be completed.');
  return data;
}
