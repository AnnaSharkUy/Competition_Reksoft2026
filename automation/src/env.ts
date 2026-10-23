export function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing ${name}. Copy automation/.env.example to automation/.env and fill it locally.`);
  }
  return value;
}

export function apiAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = { Accept: 'application/json' };
  const token = process.env.DAM_TOKEN?.trim();
  const apiKey = process.env.DAM_API_KEY?.trim();
  if (token) headers.Authorization = token.toLowerCase().startsWith('bearer ') ? token : `Bearer ${token}`;
  if (apiKey) headers['X-Api-Key'] = apiKey;
  return headers;
}

export function hasApiAuth(): boolean {
  return Boolean(process.env.DAM_TOKEN?.trim() || process.env.DAM_API_KEY?.trim());
}

export function hasUiAuth(): boolean {
  return Boolean(process.env.DAM_USER?.trim() && process.env.DAM_PASSWORD?.trim());
}
